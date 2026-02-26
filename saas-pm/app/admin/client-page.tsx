"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminClientPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Create Workspace</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Slug (e.g., marketing)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="flex-1 rounded border px-4 py-2"
          required
        />
        <button
          type="submit"
          className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
        >
          Create
        </button>
      </form>
    </div>
  );
}
