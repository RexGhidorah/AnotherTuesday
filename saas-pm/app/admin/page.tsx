import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminClientPage from "./client-page";
import Link from "next/link";
import { ArrowRight, Building2, ExternalLink } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const workspaces = await prisma.workspace.findMany();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-500">Manage your organization's workspaces and settings.</p>
        </div>
        <div className="flex gap-3">
          {/* Add actions here if needed */}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <AdminClientPage />

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
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
                {workspaces.map((ws) => (
                    <div key={ws.id} className="group flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold">
                            {ws.name[0]}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{ws.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>Slug:</span>
                                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-600">{ws.slug}</code>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/workspace/${ws.slug}`}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
                            target="_blank"
                        >
                            <ExternalLink size={14} />
                            View
                        </Link>
                        <Link
                            href={`/admin/workspace/${ws.id}`}
                            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Manage
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </div>

        {/* Quick Stats / Sidebar Widgets */}
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-500">Total Users</span>
                        <span className="font-mono font-medium text-gray-900">--</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-500">Active Tasks</span>
                        <span className="font-mono font-medium text-gray-900">--</span>
                    </div>
                     <div className="flex justify-between pb-2">
                        <span className="text-sm text-gray-500">Storage Used</span>
                        <span className="font-mono font-medium text-gray-900">--</span>
                    </div>
                </div>
            </div>

             <div className="rounded-xl border bg-indigo-50 p-6">
                <h3 className="font-semibold text-indigo-900">Need Help?</h3>
                <p className="mt-2 text-sm text-indigo-700">Check out our documentation for guides on managing your workspaces.</p>
                <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    View Docs
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
