"use client";

import SelectCell from "./SelectCell";

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low", colorClass: "text-gray-500 bg-gray-50" },
  { value: "MEDIUM", label: "Medium", colorClass: "text-yellow-700 bg-yellow-50" },
  { value: "HIGH", label: "High", colorClass: "text-orange-700 bg-orange-50" },
  { value: "URGENT", label: "Urgent", colorClass: "text-red-700 bg-red-50" },
];

type PriorityCellProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function PriorityCell({ value, onChange, className }: PriorityCellProps) {
  return (
    <SelectCell
      value={value}
      options={PRIORITY_OPTIONS}
      onChange={onChange}
      className={className}
    />
  );
}
