"use client";

import { useState } from "react";
import KanbanBoard from "@/components/views/KanbanBoard";
import CalendarView from "@/components/views/CalendarView";
import GanttChart from "@/components/views/GanttChart";

// Define strict types
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  startDate?: Date | null;
  endDate?: Date | null;
  dueDate?: Date | null;
  [key: string]: any;
};

export default function ProjectClientPage({ tasks: initialTasks, projectId }: { tasks: any[], projectId: string }) {
  const [view, setView] = useState("KANBAN");
  // Normalize dates from JSON (strings) to Date objects
  const [tasks, setTasks] = useState<Task[]>(initialTasks.map(t => ({
      ...t,
      startDate: t.startDate ? new Date(t.startDate) : null,
      endDate: t.endDate ? new Date(t.endDate) : null,
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
  })));

  const handleUpdateTask = async (updatedTask: Task) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

    try {
      await fetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify(updatedTask),
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      console.error("Failed to update task", e);
      // Revert if needed
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold">Project Tasks</h1>
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          {["KANBAN", "CALENDAR", "GANTT"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                view === v ? "bg-white shadow" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {v.charAt(0) + v.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {view === "KANBAN" && <KanbanBoard tasks={tasks} onUpdateTask={handleUpdateTask} />}
        {view === "CALENDAR" && <CalendarView tasks={tasks} />}
        {view === "GANTT" && <GanttChart tasks={tasks} />}
      </div>
    </div>
  );
}
