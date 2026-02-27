"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type DateCellProps = {
  value: Date | string | null;
  onChange: (value: Date) => void;
  className?: string;
};

export default function DateCell({ value, onChange, className }: DateCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedValue = value ? format(new Date(value), "yyyy-MM-dd") : "";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(new Date(e.target.value));
    }
  };

  if (isEditing) {
    return (
      <div className={cn("h-full w-full px-2 py-1", className)}>
        <input
          type="date"
          ref={inputRef}
          value={formattedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-full w-full bg-transparent text-sm outline-none"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "flex h-full w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50",
        !value && "text-gray-400 italic",
        className
      )}
    >
      <Calendar size={14} className="text-gray-400" />
      {value ? format(new Date(value), "MMM d, yyyy") : "Set Date"}
    </div>
  );
}
