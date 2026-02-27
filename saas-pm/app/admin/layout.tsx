"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Settings,
  Users,
  ShieldCheck,
  ChevronLeft,
  Briefcase
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <aside className="flex h-full w-64 flex-col border-r bg-white text-gray-700 shadow-sm">
        {/* Logo Area */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">System Console</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutGrid size={18} />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin/users")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users size={18} />
              Users
            </Link>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin/settings")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Settings size={18} />
              Settings
            </Link>
          </div>
        </div>

        {/* Back to App */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to App
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
