"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Flag,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: Date | null;
  assignee?: any;
  [key: string]: any;
};

type MainTableViewProps = {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
};

const statusColors: Record<string, string> = {
  "TODO": "bg-gray-100 text-gray-700",
  "IN_PROGRESS": "bg-blue-100 text-blue-700",
  "REVIEW": "bg-purple-100 text-purple-700",
  "DONE": "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  "LOW": "text-gray-500",
  "MEDIUM": "text-yellow-600",
  "HIGH": "text-orange-600",
  "URGENT": "text-red-600",
};

export default function MainTableView({ tasks, onUpdateTask }: MainTableViewProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[30px_minmax(200px,1fr)_150px_150px_150px_150px_40px] gap-2 border-b bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-500">
        <div className="flex items-center justify-center">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        </div>
        <div>Item</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Due Date</div>
        <div>Person</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group grid grid-cols-[30px_minmax(200px,1fr)_150px_150px_150px_150px_40px] items-center gap-2 border-b px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="font-medium text-gray-900 truncate">
              {task.title}
            </div>

            <div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[task.status] || "bg-gray-100 text-gray-800"}`}>
                {task.status.replace("_", " ")}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 ${priorityColors[task.priority] || "text-gray-500"}`}>
              <Flag size={14} />
              <span className="capitalize">{task.priority.toLowerCase()}</span>
            </div>

            <div className="text-gray-500 flex items-center gap-1.5">
              <Calendar size={14} />
              {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                 {task.assignee ? task.assignee.name?.[0] : <User size={12} />}
              </div>
              <span className="text-gray-600 truncate text-xs">{task.assignee?.name || "Unassigned"}</span>
            </div>

            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Row */}
        <div className="flex cursor-pointer items-center gap-2 border-b border-dashed px-4 py-3 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
            <div className="w-[30px] flex justify-center"><ArrowRight size={14} /></div>
            <span>+ Add Task</span>
        </div>
      </div>
    </div>
  );
}
