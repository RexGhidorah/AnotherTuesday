"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    user: "",
    pass: "",
    from: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.host) setFormData(data);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Settings saved!");
    } else {
      alert("Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Admin Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">SMTP Configuration</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Host</label>
            <input
              name="host"
              value={formData.host}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Port</label>
              <input
                name="port"
                value={formData.port}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700">From Email</label>
               <input
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="pass"
              type="password"
              value={formData.pass}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
