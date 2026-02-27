"use client";

import { useState } from "react";
import { MoreHorizontal, Shield, Trash2, Edit } from "lucide-react";

interface UserActionsProps {
  userId: string;
  currentRole: string;
  onUpdateRole: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
}

export default function UserActions({ userId, currentRole, onUpdateRole, onDelete }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        onDelete(userId);
    }
    setIsOpen(false);
  };

  const handleRoleUpdate = () => {
    onUpdateRole(userId, selectedRole);
    setRoleModalOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border bg-white shadow-lg py-1 text-sm text-gray-700">
            <button
              onClick={() => { setRoleModalOpen(true); setIsOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
            >
              <Edit size={14} />
              Change Role
            </button>
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
            >
              <Trash2 size={14} />
              Delete User
            </button>
          </div>
        </>
      )}

      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Update Role</h3>

            <div className="space-y-3">
              {["SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"].map((role) => (
                <label
                  key={role}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${
                    selectedRole === role ? "border-indigo-600 bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium text-gray-900">
                      {role.replace("_", " ")}
                    </span>
                  </div>
                  {role === "SUPER_ADMIN" && <Shield size={14} className="text-indigo-600" />}
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
