"use client";

import { differenceInDays, format } from "date-fns";

type Task = {
  id: string;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

export default function GanttChart({ tasks }: { tasks: Task[] }) {
  // Simple Gantt implementation: Just a list of bars relative to a timeline
  // A real production Gantt would be much more complex, but this serves the MVP requirement.

  if (tasks.length === 0) return <div>No tasks scheduled.</div>;

  // Determine timeline range
  const sortedTasks = [...tasks].sort((a, b) =>
    (a.startDate ? new Date(a.startDate).getTime() : 0) - (b.startDate ? new Date(b.startDate).getTime() : 0)
  );

  const minDate = sortedTasks[0]?.startDate ? new Date(sortedTasks[0].startDate) : new Date();
  const maxDate = new Date(); // Ideally calculate max from tasks

  // For visualization, we'll just show bars with relative widths for now to demonstrate the "View" concept
  // In a real app, we'd use a library like 'frappe-gantt' or 'dhtmlx-gantt' wrapped in React.

  return (
    <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">Gantt Timeline</h2>
      <div className="min-w-[600px]">
        {tasks.map(task => {
           if (!task.startDate || !task.endDate) return null;
           const start = new Date(task.startDate);
           const end = new Date(task.endDate);
           const duration = differenceInDays(end, start) + 1;

           // Simplified visualization
           return (
             <div key={task.id} className="mb-4 flex items-center border-b pb-2">
               <div className="w-40 shrink-0 truncate font-medium">{task.title}</div>
               <div className="flex-1 bg-gray-100 h-8 relative rounded">
                 <div className="pl-2 pt-1 text-xs text-gray-500">
                    {format(start, 'MMM d')} - {format(end, 'MMM d')} ({duration} days)
                 </div>
                 {/* This would be positioned absolutely based on date math in a full implementation */}
                 <div className="absolute top-4 h-2 w-1/4 rounded bg-blue-500 opacity-50"></div>
               </div>
             </div>
           )
        })}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        * Simplified Gantt visualization. Integrates start/end dates.
      </p>
    </div>
  );
}
