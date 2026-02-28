"use client";

import { useState, useEffect } from "react";
import { HardDrive, Edit2, Check, X } from "lucide-react";

export default function GlobalStorageWidget() {
  const [limit, setLimit] = useState(50); // Default 50GB
  const [used] = useState(0); // Mock used storage for now
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const res = await fetch("/api/admin/config?key=GLOBAL_STORAGE_LIMIT");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'number') {
            setLimit(data);
            setTempLimit(data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch global limit", e);
      }
    };
    fetchLimit();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "GLOBAL_STORAGE_LIMIT", value: tempLimit }),
      });
      if (res.ok) {
        setLimit(tempLimit);
        setIsEditing(false);
      }
    } catch (e) {
      console.error("Failed to save global limit", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
          <HardDrive className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-slate-600">Espacio Utilizado</span>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
             <input
               type="number"
               value={tempLimit}
               onChange={(e) => setTempLimit(Number(e.target.value))}
               className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
             />
             <span className="text-sm text-slate-500">GB</span>
             <button onClick={handleSave} disabled={isLoading} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded">
                <Check className="w-4 h-4" />
             </button>
             <button onClick={() => { setIsEditing(false); setTempLimit(limit); }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <X className="w-4 h-4" />
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-slate-900">
                {used} <span className="text-sm text-slate-500 font-medium">/ {limit}GB</span>
            </span>
            <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-all rounded hover:bg-indigo-50"
                title="Modificar límite global"
            >
                <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
