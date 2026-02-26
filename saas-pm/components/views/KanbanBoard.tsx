"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

// Updated type definition to allow extra properties
type Task = {
  id: string;
  title: string;
  status: string;
  priority?: string; // Explicitly optional or handled
  [key: string]: any;
};

const columns = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

export default function KanbanBoard({ tasks, onUpdateTask }: { tasks: Task[], onUpdateTask: (task: any) => void }) {
  const [boardTasks, setBoardTasks] = useState(tasks);

  // Sync internal state if props change (optimistic update handling from parent)
  useEffect(() => {
      setBoardTasks(tasks);
  }, [tasks]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Find the task
      const taskToMove = boardTasks.find(t => t.id === draggableId);
      if (!taskToMove) return;

      const updatedTask = { ...taskToMove, status: destination.droppableId };

      const updatedTasks = boardTasks.map(t =>
        t.id === draggableId ? updatedTask : t
      );

      setBoardTasks(updatedTasks);
      onUpdateTask(updatedTask);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto p-4">
        {Object.entries(columns).map(([columnId, title]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex h-full min-w-[250px] flex-col rounded-lg bg-gray-100 p-4"
              >
                <h2 className="mb-4 font-bold text-gray-700">{title}</h2>
                <div className="flex-1 space-y-3">
                  {boardTasks
                    .filter((task) => task.status === columnId)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded bg-white p-3 shadow-sm hover:shadow-md"
                          >
                            <p className="font-medium">{task.title}</p>
                            {task.priority && (
                                <span className="mt-1 text-xs text-gray-500">
                                    {task.priority}
                                </span>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
