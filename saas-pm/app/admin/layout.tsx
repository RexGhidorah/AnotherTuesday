"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowLeft,
  Layout,
  MailOpen,
  ShieldCheck,
  Search,
  Bell
} from "lucide-react";

const AdminLogo = () => (
    <div className="flex items-center gap-3 px-2">
      <div className="relative flex items-center justify-center w-8 h-8 bg-slate-900 rounded-lg shadow-sm">
        <ShieldCheck className="w-5 h-5 text-white absolute z-10" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-tr-lg opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-indigo-500 rounded-bl-lg opacity-80"></div>
      </div>
      <div>
        <h1 className="text-base font-bold text-slate-900 leading-tight">Admin</h1>
        <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">System Console</p>
      </div>
    </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Helper to determine active state
  const isActive = (path: string) => {
      if (path === "/admin" && pathname === "/admin") return true;
      if (path !== "/admin" && pathname.startsWith(path)) return true;
      return false;
  }

  // Determine header title based on current path
  const getHeaderTitle = () => {
      if (pathname === "/admin") return "Overview";
      if (pathname.startsWith("/admin/workspaces")) return "Workspaces";
      if (pathname.startsWith("/admin/users")) return "Users & Roles";
      if (pathname.startsWith("/admin/email")) return "Emails & SMTP";
      return "Admin Console";
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-20">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <AdminLogo />
          </div>

          <nav className="p-4 space-y-1">
            {[
              { path: '/admin', label: 'Overview', icon: LayoutDashboard },
              { path: '/admin/workspaces', label: 'Workspaces', icon: Layout },
              { path: '/admin/users', label: 'Users & Roles', icon: Users },
              { path: '/admin/email', label: 'Emails & SMTP', icon: MailOpen },
            ].map((item) => {
              const active = isActive(item.path);
              return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1 h-4 bg-indigo-600 rounded-full"></div>
                )}
              </Link>
            )})}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            Back to App
          </Link>

          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              N
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">Noah Admin</p>
              <p className="text-xs text-slate-500 truncate">noah@tuesday.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">
            {getHeaderTitle()}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search settings..."
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 w-64 transition-all outline-none"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
