"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  Plus,
  Table,
  Kanban,
  BarChart3,
  Home
} from "lucide-react";
import { useState } from "react";

type Workspace = {
  id: string;
  name: string;
  slug: string;
};

type SidebarProps = {
  workspaces: Workspace[];
  currentWorkspaceSlug: string;
};

export default function Sidebar({ workspaces, currentWorkspaceSlug }: SidebarProps) {
  const pathname = usePathname();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white text-gray-700 shadow-sm">
      {/* Logo Area */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-gray-900">Tuesday</h1>
            <p className="text-xs text-gray-500">Prism Flow OS v2.4</p>
          </div>
        </div>
      </div>

      {/* New Item Button */}
      <div className="p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm hover:shadow">
          <Plus size={18} />
          New Item
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {/* Workspace Section */}
        <div className="mb-6">
          <button
            type="button"
            className="mb-2 flex w-full cursor-pointer items-center justify-between rounded px-3 text-left text-xs font-bold uppercase text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            aria-expanded={isWorkspaceOpen}
          >
            <span>Workspace</span>
            {isWorkspaceOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {isWorkspaceOpen && (
            <div className="space-y-1">
              <Link
                href={`/workspace/${currentWorkspaceSlug}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === `/workspace/${currentWorkspaceSlug}`
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Home size={18} />
                Home
              </Link>
              <Link
                href={`/workspace/${currentWorkspaceSlug}/views/main`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.includes("/views/main")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Table size={18} />
                Main Table
              </Link>
              <Link
                href={`/workspace/${currentWorkspaceSlug}/views/kanban`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.includes("/views/kanban")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Kanban size={18} />
                Kanban
              </Link>
              <Link
                href={`/workspace/${currentWorkspaceSlug}/views/gantt`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.includes("/views/gantt")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <BarChart3 size={18} />
                Gantt
              </Link>
            </div>
          )}
        </div>

        {/* Admin Console */}
        <div className="mb-6">
          <div className="mb-2 px-3 text-xs font-bold uppercase text-gray-500">
            Admin Console
          </div>
          <div className="space-y-1">
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Users size={18} />
              Users
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Settings size={18} />
              Settings
            </Link>
          </div>
        </div>

        {/* Favorites */}
        <div className="mb-6">
          <button
            type="button"
            className="mb-2 flex w-full cursor-pointer items-center justify-between rounded px-3 text-left text-xs font-bold uppercase text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
            aria-expanded={isFavoritesOpen}
          >
            <span>Favorites</span>
            {isFavoritesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {isFavoritesOpen && (
            <div className="space-y-1">
              {workspaces.map((ws) => (
                <Link
                  key={ws.id}
                  href={`/workspace/${ws.slug}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    ws.slug === currentWorkspaceSlug
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${
                    ws.slug === currentWorkspaceSlug ? "bg-indigo-500" : "bg-gray-300"
                  }`} />
                  {ws.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Footer */}
      <div className="border-t p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full bg-indigo-100 border border-indigo-200">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`} alt="User" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-900">Sarah Connor</p>
            <p className="truncate text-xs text-gray-500">Engineering Lead</p>
          </div>
          <Settings size={16} className="text-gray-400" />
        </button>
      </div>
    </aside>
  );
}
