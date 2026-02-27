"use client";

import {
  Plus,
  Search,
  Bell,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Table,
  Kanban,
  BarChart3,
  Calendar as CalendarIcon
} from "lucide-react";

type TopBarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
  onNewItem?: () => void;
};

export default function TopBar({ currentView, onViewChange, onNewItem }: TopBarProps) {
  const views = [
    { id: "MAIN_TABLE", label: "Main Table", icon: Table },
    { id: "KANBAN", label: "Kanban", icon: Kanban },
    { id: "GANTT", label: "Gantt", icon: BarChart3 },
    { id: "CALENDAR", label: "Calendar", icon: CalendarIcon },
  ];

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6">
      {/* View Switcher */}
      <div className="flex h-full items-center gap-6">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex h-full items-center gap-2 border-b-2 px-1 text-sm font-medium transition-colors ${
              currentView === view.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <view.icon size={16} />
            {view.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
           {[1, 2, 3].map((i) => (
             <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
             </div>
           ))}
           <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs text-gray-500">+3</div>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <button className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Filter size={16} />
          Filter
        </button>

        <button className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ArrowUpDown size={16} />
          Sort
        </button>

        <button
          onClick={onNewItem}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
        >
          <Plus size={16} />
          New Item
        </button>
      </div>
    </header>
  );
}
