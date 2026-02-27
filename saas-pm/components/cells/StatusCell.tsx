"use client";

import SelectCell from "./SelectCell";

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do", colorClass: "bg-gray-100 text-gray-700" },
  { value: "IN_PROGRESS", label: "In Progress", colorClass: "bg-blue-100 text-blue-700" },
  { value: "REVIEW", label: "Review", colorClass: "bg-purple-100 text-purple-700" },
  { value: "DONE", label: "Done", colorClass: "bg-green-100 text-green-700" },
];

type StatusCellProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function StatusCell({ value, onChange, className }: StatusCellProps) {
  return (
    <SelectCell
      value={value}
      options={STATUS_OPTIONS}
      onChange={onChange}
      className={className}
    />
  );
}
