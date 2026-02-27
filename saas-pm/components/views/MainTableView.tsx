"use client";

import {
  ArrowRight,
  MoreHorizontal,
  Plus
} from "lucide-react";
import TextCell from "@/components/cells/TextCell";
import StatusCell from "@/components/cells/StatusCell";
import PriorityCell from "@/components/cells/PriorityCell";
import DateCell from "@/components/cells/DateCell";
import UserCell from "@/components/cells/UserCell";

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
  onNewItem?: () => void;
};

export default function MainTableView({ tasks, onUpdateTask, onNewItem }: MainTableViewProps) {

  const handleCellUpdate = (task: Task, field: string, value: any) => {
    onUpdateTask({ ...task, [field]: value });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[40px_minmax(250px,2fr)_140px_140px_160px_180px_50px] divide-x divide-gray-200 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500">
        <div className="flex items-center justify-center py-2">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        </div>
        <div className="flex items-center px-3 py-2">Item</div>
        <div className="flex items-center px-3 py-2">Status</div>
        <div className="flex items-center px-3 py-2">Priority</div>
        <div className="flex items-center px-3 py-2">Due Date</div>
        <div className="flex items-center px-3 py-2">Person</div>
        <div className="flex items-center justify-center py-2 hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-gray-600">
            <Plus size={16} />
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p>No tasks found. Create one to get started.</p>
            </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group grid grid-cols-[40px_minmax(250px,2fr)_140px_140px_160px_180px_50px] items-stretch divide-x divide-gray-100 border-b border-gray-100 text-sm hover:bg-blue-50/30 transition-colors"
          >
            {/* Checkbox */}
            <div className="flex items-center justify-center">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Title Cell */}
            <div className="border-r-0">
               <TextCell
                 value={task.title}
                 onChange={(val) => handleCellUpdate(task, "title", val)}
                 className="font-medium text-gray-900"
               />
            </div>

            {/* Status Cell */}
            <div className="border-r-0">
               <StatusCell
                 value={task.status}
                 onChange={(val) => handleCellUpdate(task, "status", val)}
               />
            </div>

             {/* Priority Cell */}
             <div className="border-r-0">
               <PriorityCell
                 value={task.priority}
                 onChange={(val) => handleCellUpdate(task, "priority", val)}
               />
            </div>

            {/* Date Cell */}
            <div className="border-r-0">
               <DateCell
                 value={task.dueDate || null}
                 onChange={(val) => handleCellUpdate(task, "dueDate", val)}
               />
            </div>

             {/* User Cell */}
             <div className="border-r-0">
               <UserCell
                 value={task.assignee}
                 onChange={(val) => handleCellUpdate(task, "assignee", val)}
               />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Row */}
        <div
            onClick={onNewItem}
            className="flex cursor-pointer items-center gap-2 border-b border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
            <div className="w-[40px] flex justify-center"><Plus size={14} /></div>
            <span>Add Task</span>
        </div>
      </div>
    </div>
  );
}
