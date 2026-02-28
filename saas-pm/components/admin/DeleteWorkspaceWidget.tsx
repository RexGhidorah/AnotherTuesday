"use client";

import { useState } from "react";
import { Lock, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteWorkspace } from "@/app/actions/admin";

export default function DeleteWorkspaceWidget({ workspaceId, workspaceName }: { workspaceId: string, workspaceName: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el workspace "${workspaceName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteWorkspace(workspaceId);
      if (result.success) {
        router.push("/admin");
      } else {
        alert(result.error || "Failed to delete workspace.");
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100 bg-red-50/50">
            <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <Lock className="w-5 h-5" /> Zona de Peligro
            </h3>
        </div>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <h4 className="text-sm font-semibold text-slate-900">Eliminar Workspace Permanentemente</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-md">Esta acción es irreversible. Se eliminarán todos los proyectos, tareas y archivos.</p>
            </div>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-medium rounded-xl text-sm transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isLoading ? "Eliminando..." : "Eliminar Espacio"}
            </button>
        </div>
    </div>
  );
}
