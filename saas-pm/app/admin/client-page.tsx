"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

export default function AdminClientPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch("/api/admin/workspaces", {
          method: "POST",
          body: JSON.stringify({ name, slug }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          router.refresh();
          setName("");
          setSlug("");
        } else {
          alert("Failed to create workspace");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Create New Workspace</h2>
        <p className="text-sm text-gray-500">Add a new workspace to your organization.</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">Workspace Name</label>
            <input
              type="text"
              placeholder="e.g. Marketing Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">URL Slug</label>
            <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
               <span className="text-gray-500 mr-1">/workspace/</span>
               <input
                type="text"
                placeholder="marketing"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
               />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
