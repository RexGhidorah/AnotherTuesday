"use client";

import { useState } from "react";
import KanbanBoard from "@/components/views/KanbanBoard";
import CalendarView from "@/components/views/CalendarView";
import GanttChart from "@/components/views/GanttChart";
import MainTableView from "@/components/views/MainTableView";
import TopBar from "@/components/TopBar";

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
  const [view, setView] = useState("MAIN_TABLE");
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

  const handleNewItem = async () => {
      // Placeholder for new item creation logic
      console.log("Create new item");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <TopBar
        currentView={view}
        onViewChange={setView}
        onNewItem={handleNewItem}
      />

      <div className="flex-1 overflow-hidden">
        {view === "MAIN_TABLE" && <MainTableView tasks={tasks} onUpdateTask={handleUpdateTask} />}
        {view === "KANBAN" && <div className="h-full overflow-auto p-6"><KanbanBoard tasks={tasks} onUpdateTask={handleUpdateTask} /></div>}
        {view === "CALENDAR" && <div className="h-full overflow-auto p-6"><CalendarView tasks={tasks} /></div>}
        {view === "GANTT" && <div className="h-full overflow-auto p-6"><GanttChart tasks={tasks} /></div>}
      </div>
    </div>
  );
}
