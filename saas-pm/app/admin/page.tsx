import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminClientPage from "./client-page";
import Link from "next/link";
import { ArrowRight, Building2, ExternalLink, FolderKanban, Users, CheckSquare } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const workspaces = await prisma.workspace.findMany({
    include: {
        _count: {
            select: { members: true, projects: true }
        },
        projects: {
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        }
    }
  });

  const totalUsers = await prisma.user.count();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-500">Manage your organization's workspaces and settings.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <AdminClientPage />

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden mt-8">
            <div className="border-b bg-gray-50 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Active Workspaces</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{workspaces.length} Total</span>
            </div>

            {workspaces.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <Building2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p>No workspaces found. Create your first one above.</p>
                </div>
            ) : (
                <div className="divide-y">
                {workspaces.map((ws) => {
                    const taskCount = ws.projects.reduce((acc, project) => acc + project._count.tasks, 0);

                    return (
                        <div key={ws.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50 transition-colors gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold text-lg">
                                {ws.name[0]}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 text-lg">{ws.name}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-500" title="Projects">
                                        <FolderKanban size={14} />
                                        <span>{ws._count.projects} Projects</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500" title="Members">
                                        <Users size={14} />
                                        <span>{ws._count.members} Members</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500" title="Tasks">
                                        <CheckSquare size={14} />
                                        <span>{taskCount} Tasks</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-center">
                            <Link
                                href={`/workspace/${ws.slug}`}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors"
                                target="_blank"
                            >
                                <ExternalLink size={14} />
                                Open
                            </Link>
                            <Link
                                href={`/admin/workspace/${ws.id}`}
                                className="flex items-center gap-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                Manage
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        </div>
                    );
                })}
                </div>
            )}
          </div>
        </div>

        {/* Quick Stats / Sidebar Widgets */}
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">System Overview</h3>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-500">Total Users</span>
                        <span className="font-mono font-medium text-gray-900">
                             {totalUsers}
                        </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-500">Total Workspaces</span>
                        <span className="font-mono font-medium text-gray-900">{workspaces.length}</span>
                    </div>
                </div>
            </div>

             <div className="rounded-xl border bg-indigo-50 p-6">
                <h3 className="font-semibold text-indigo-900">Need Help?</h3>
                <p className="mt-2 text-sm text-indigo-700">Check out our documentation for guides on managing your workspaces.</p>
                <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                    View Docs
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
