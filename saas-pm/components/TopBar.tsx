"use client";

import {
  Plus,
  Filter,
  ArrowUpDown,
  Table,
  Kanban,
  BarChart3,
  Calendar as CalendarIcon,
  Columns
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
    <header className="flex h-14 w-full items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* View Switcher */}
      <div className="flex h-full items-center gap-1">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
              currentView === view.id
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <view.icon size={16} className={currentView === view.id ? "text-indigo-600" : "text-gray-500"} />
            {view.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
         {/* Team Avatars - Reduced size for cleaner look */}
        <div className="flex -space-x-1.5 mr-2">
           {[1, 2, 3].map((i) => (
             <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-gray-200">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
             </div>
           ))}
           <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-500">+3</div>
        </div>

        <div className="h-5 w-px bg-gray-200 mx-1"></div>

        {/* View Controls - More compact */}
        <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
          <Columns size={14} className="text-gray-500" />
          Columns
        </button>

        <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
          <Filter size={14} className="text-gray-500" />
          Filter
        </button>

        <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
          <ArrowUpDown size={14} className="text-gray-500" />
          Sort
        </button>

        <button
          onClick={onNewItem}
          className="ml-2 flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
        >
          <Plus size={14} />
          New Item
        </button>
      </div>
    </header>
  );
}
