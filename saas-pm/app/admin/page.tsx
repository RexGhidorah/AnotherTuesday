import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminClientPage from "./client-page";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const workspaces = await prisma.workspace.findMany();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Global Admin Dashboard</h1>
        <AdminClientPage />

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Existing Workspaces</h2>
          <ul className="space-y-4">
            {workspaces.map((ws) => (
              <li key={ws.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-bold">{ws.name}</p>
                  <p className="text-sm text-gray-500">/{ws.slug}</p>
                </div>
                 <div className="flex gap-2">
                   <a href={`/admin/workspace/${ws.id}`} className="text-blue-500 hover:underline">Manage</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
