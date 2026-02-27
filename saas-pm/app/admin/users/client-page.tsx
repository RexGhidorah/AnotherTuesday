"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Shield, User, Calendar, MoreHorizontal } from "lucide-react";
import InviteUserModal from "@/components/admin/InviteUserModal";
import UserActions from "@/components/admin/UserActions";
import { inviteUser, deleteUser, updateUserRole } from "@/app/actions/admin";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  createdAt: string;
  _count: { workspaces: number };
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInvite = async (data: { email: string; role: string; name?: string }) => {
    const result = await inviteUser(data);
    if (result.success && result.user) {
      setUsers([result.user as any, ...users]); // Simple optimistic update or refetch
      setIsInviteModalOpen(false);
    } else {
      alert(result.error || "Failed to invite user");
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers(users.filter((u) => u.id !== userId));
    } else {
      alert("Failed to delete user");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } else {
      alert("Failed to update role");
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-500">Manage all registered users and their roles.</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold border border-indigo-200 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt="" className="h-full w-full object-cover" />
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
                          : user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "SUPER_ADMIN" && <Shield size={12} />}
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {user._count?.workspaces || 0} Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActions
                      userId={user.id}
                      currentRole={user.role}
                      onUpdateRole={handleUpdateRole}
                      onDelete={handleDelete}
                    />
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

      {isInviteModalOpen && (
        <InviteUserModal
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInvite}
        />
      )}
    </>
  );
}
