"use client";

import { useState } from "react";
import { Users, HardDrive, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateWorkspaceWidget() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // Auto-generate slug suggestion
    setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleCreate = async () => {
    if (!name || !slug) {
        setError("Name and slug are required.");
        return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create workspace");
      }

      setName("");
      setSlug("");
      router.refresh(); // Refresh the server component to update the list
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-semibold text-slate-900">Crear Nuevo Espacio</h3>
        <p className="text-sm text-slate-500 mt-1">Añade un nuevo espacio de trabajo dedicado a tu organización.</p>
      </div>
      <div className="p-6 space-y-5">
        {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
            </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Nombre del Espacio</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Ej. Equipo de Marketing"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">URL Slug</label>
            <div className="flex rounded-xl shadow-sm border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-500 overflow-hidden transition-all">
              <span className="inline-flex items-center px-4 bg-slate-100 border-r border-slate-200 text-slate-500 text-sm">
                /workspace/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="marketing"
                className="flex-1 px-4 py-2.5 bg-transparent outline-none text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end pt-2 border-t border-slate-100">
          <div className="w-full sm:w-1/3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Asientos (Límite)
            </label>
            <input type="number" defaultValue="10" min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
          </div>
          <div className="w-full sm:w-1/3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Almacenamiento
            </label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer">
              <option value="5">5 GB</option>
              <option value="10">10 GB</option>
              <option value="50">50 GB</option>
              <option value="100">100 GB</option>
              <option value="unlimited">Ilimitado</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full sm:w-1/3 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Crear Espacio
          </button>
        </div>
      </div>
    </div>
  );
}
