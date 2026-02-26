"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InviteUserForm({ workspaceId }: { workspaceId: string }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/workspaces/${workspaceId}/invite`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.refresh();
      setEmail("");
      alert("Invitation sent (simulated)!");
    } else {
      alert("Failed to invite user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded border px-4 py-2"
        required
      />
      <button
        type="submit"
        className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
      >
        Invite
      </button>
    </form>
  );
}
