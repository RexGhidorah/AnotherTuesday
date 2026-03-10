"use client";

import { useState, useRef, useEffect } from "react";
import { User, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type UserType = {
  id: string;
  name?: string;
  image?: string;
  [key: string]: any;
};

type UserCellProps = {
  value: UserType | null;
  onChange: (value: UserType | null) => void;
  className?: string;
};

// Mock user list for now - in a real app this would come from props or a query
const MOCK_USERS: UserType[] = [
  { id: "1", name: "Alice Johnson", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: "2", name: "Bob Smith", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
  { id: "3", name: "Charlie Brown", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
];

export default function UserCell({ value, onChange, className }: UserCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full cursor-pointer items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      >
        {value ? (
          <>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 overflow-hidden shrink-0">
               {value.image ? <img src={value.image} alt={value.name} className="h-full w-full object-cover"/> : (value.name?.[0] || "U")}
            </div>
            <span className="truncate text-xs text-gray-700">{value.name || "Unknown"}</span>
          </>
        ) : (
          <>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 shrink-0">
               <User size={12} />
            </div>
            <span className="truncate text-xs text-gray-400 italic">Assign</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border bg-white shadow-lg ring-1 ring-black ring-opacity-5">
           <div className="p-2 border-b">
               <input type="text" placeholder="Search user..." className="w-full text-xs p-1 border rounded" />
           </div>
          <div className="max-h-48 overflow-y-auto py-1">
            <button
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50"
              >
                <X size={14} />
                Unassign
            </button>
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onChange(user);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                         <img src={user.image} alt={user.name} className="h-full w-full object-cover"/>
                    </div>
                    <span className="text-xs">{user.name}</span>
                </div>
                {value?.id === user.id && <Check size={14} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
