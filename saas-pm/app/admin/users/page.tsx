import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Mail, Shield, User, Calendar, MoreHorizontal } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
        _count: {
            select: { workspaces: true }
        }
    }
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-500">Manage all registered users and their roles.</p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          Invite User
        </button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">User</th>
                <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                <th scope="col" className="px-6 py-4 font-semibold">Workspaces</th>
                <th scope="col" className="px-6 py-4 font-semibold">Joined</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold border border-indigo-200">
                        {user.image ? (
                          <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                             <Mail size={12} />
                             {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "SUPER_ADMIN" && <Shield size={12} />}
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {user._count.workspaces} Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                <p>No users found.</p>
            </div>
        )}
      </div>
    </div>
  );
}
