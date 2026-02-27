"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type TextCellProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function TextCell({ value, onChange, placeholder, className }: TextCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (internalValue !== value) {
      onChange(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setInternalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={cn("h-full w-full px-2 py-1", className)}>
        <input
          ref={inputRef}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-full w-full bg-transparent outline-none border-b-2 border-indigo-500 text-sm"
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "flex h-full w-full cursor-text items-center px-3 py-2 text-sm text-gray-900 hover:bg-gray-50",
        !value && "text-gray-400 italic",
        className
      )}
    >
      {value || placeholder || "Empty"}
    </div>
  );
}
