import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;

  // Verify membership in current workspace
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const isMember = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspaceId: workspace.id,
    },
  });

  const isAdmin = session.user.role === "SUPER_ADMIN";

  if (!isMember && !isAdmin) {
    redirect("/"); // Or unauthorized page
  }

  // Fetch all workspaces for the user to populate the sidebar
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: { workspace: true },
  });

  const userWorkspaces = memberships.map((m) => m.workspace);

  // If super admin, maybe fetch all? For now, stick to membership or all if admin logic needed.
  // Keeping it simple: sidebar shows what you are a member of.

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar workspaces={userWorkspaces} currentWorkspaceSlug={slug} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
