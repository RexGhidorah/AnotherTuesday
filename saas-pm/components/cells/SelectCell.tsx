"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  colorClass: string;
};

type SelectCellProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
};

export default function SelectCell({ value, options, onChange, className }: SelectCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative h-full w-full", className)} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
      >
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            selectedOption?.colorClass || "bg-gray-100 text-gray-800"
          )}
        >
          {selectedOption?.label || value}
        </span>
        <ChevronDown size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    option.colorClass
                  )}
                >
                  {option.label}
                </span>
                {value === option.value && <Check size={14} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
