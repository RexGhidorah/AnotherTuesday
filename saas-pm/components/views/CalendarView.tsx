"use client";

import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Task = {
  id: string;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4 px-2">
        <button
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ChevronLeft size={20} />
        </button>
        <div aria-live="polite" className="text-lg font-bold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          onClick={onNextMonth}
          aria-label="Next month"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="w-full text-center font-bold text-gray-600" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        // Find tasks for this day
        const dayTasks = tasks.filter(t =>
          t.startDate && isSameDay(new Date(t.startDate), cloneDay)
        );

        days.push(
          <div
            className={`min-h-[100px] border p-2 ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50 text-gray-400"
                : isSameDay(day, selectedDate)
                ? "bg-blue-50"
                : "bg-white"
            }`}
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex justify-end text-sm font-medium">{formattedDate}</div>
            <div className="mt-1 space-y-1">
              {dayTasks.map(task => (
                <div key={task.id} className="truncate rounded bg-blue-100 px-1 text-xs text-blue-700">
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
