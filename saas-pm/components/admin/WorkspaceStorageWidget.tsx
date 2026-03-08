"use client";

import { useState, useEffect } from "react";
import { HardDrive, Edit2, Check, X } from "lucide-react";

export default function WorkspaceStorageWidget({ workspaceId }: { workspaceId: string }) {
  // Try to load specific workspace limit from config, fallback to global
  const configKey = `WORKSPACE_STORAGE_LIMIT_${workspaceId}`;
  const [limit, setLimit] = useState<number | null>(null);
  const [globalLimit, setGlobalLimit] = useState(50);
  const [used] = useState(0.5); // Mock used storage for demo
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        // Fetch global first
        const globalRes = await fetch("/api/admin/config?key=GLOBAL_STORAGE_LIMIT");
        let gLimit = 50;
        if (globalRes.ok) {
            const data = await globalRes.json();
            if (typeof data === 'number') {
                gLimit = data;
                setGlobalLimit(data);
            }
        }

        // Fetch specific workspace limit
        const wsRes = await fetch(`/api/admin/config?key=${configKey}`);
        if (wsRes.ok) {
            const data = await wsRes.json();
            if (typeof data === 'number') {
                setLimit(data);
                setTempLimit(data);
            } else {
                setTempLimit(gLimit); // default edit to global limit
            }
        }
      } catch (e) {
        console.error("Failed to fetch limits", e);
      }
    };
    fetchLimits();
  }, [configKey]);

  const activeLimit = limit !== null ? limit : globalLimit;
  const percentage = Math.min((used / activeLimit) * 100, 100);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: configKey, value: tempLimit }),
      });
      if (res.ok) {
        setLimit(tempLimit);
        setIsEditing(false);
      }
    } catch (e) {
      console.error("Failed to save workspace limit", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <div className="flex justify-between text-sm mb-3 items-center">
        <span className="font-semibold text-slate-700 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-400"/> Almacenamiento SSD
        </span>
        <div className="flex items-center gap-3">
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={tempLimit}
                        onChange={(e) => setTempLimit(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="text-sm text-slate-500">GB</span>
                    <button onClick={handleSave} disabled={isLoading} aria-label="Save workspace storage limit" className="text-emerald-600 hover:bg-emerald-50 p-1 rounded">
                        <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setIsEditing(false); setTempLimit(activeLimit); }} aria-label="Cancel editing workspace storage limit" className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 group">
                    <span className="text-slate-600 font-medium">
                        {used} GB <span className="text-slate-400 font-normal">/ {activeLimit} GB {limit === null ? '(Global)' : '(Custom)'}</span>
                    </span>
                    <button
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit workspace storage limit"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-all rounded hover:bg-indigo-50"
                        title="Modificar límite específico"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
             <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-xs text-slate-500">El espacio incluye archivos subidos, adjuntos en tareas y documentos de pizarra.</p>
    </div>
  );
}
