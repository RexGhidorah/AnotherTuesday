import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Check if system is initialized
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      redirect("/setup");
    }
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  // Find first workspace for regular user
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true }
  });

  if (membership) {
    redirect(`/workspace/${membership.workspace.slug}`);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name || session.user.email}</h1>
        <p className="mt-2 text-gray-600">You do not belong to any workspaces yet.</p>
        <p className="text-sm text-gray-500">Contact an administrator to get an invite.</p>
      </div>
    </div>
  );
}
