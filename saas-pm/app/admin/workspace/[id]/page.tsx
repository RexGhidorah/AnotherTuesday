import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InviteUserForm from "./invite-user-form";

export default async function WorkspaceAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id },
    include: { members: { include: { user: true } } },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Manage Workspace: {workspace.name}</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Invite User</h2>
          <InviteUserForm workspaceId={workspace.id} />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Members</h2>
          <ul className="space-y-4">
            {workspace.members.map((member) => (
              <li key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-bold">{member.user.name || member.user.email}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
