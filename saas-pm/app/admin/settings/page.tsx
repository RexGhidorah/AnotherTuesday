"use client";

import { useState, useEffect } from "react";
import { Save, Mail, Server, Shield, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    user: "",
    pass: "",
    from: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.host) setFormData(data);
      });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);
    if (res.ok) {
      alert("Settings saved!");
    } else {
      alert("Failed to save settings");
    }
  };

  const quickConfig = (provider: string) => {
      const presets: Record<string, any> = {
          gmail: { host: 'smtp.gmail.com', port: '587' },
          outlook: { host: 'smtp.office365.com', port: '587' },
          mailgun: { host: 'smtp.mailgun.org', port: '587' },
          sendgrid: { host: 'smtp.sendgrid.net', port: '587' },
      };
      setFormData({ ...formData, ...presets[provider] });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-500">Configure global system settings and integrations.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-gray-50 px-6 py-4 flex items-center gap-2">
                    <Mail className="text-gray-500" size={18} />
                    <h2 className="font-semibold text-gray-900">SMTP Configuration</h2>
                </div>

                <div className="p-6">
                     <div className="mb-6">
                        <label className="mb-2 block text-xs font-medium uppercase text-gray-500">Quick Presets</label>
                        <div className="flex flex-wrap gap-2">
                            {['gmail', 'outlook', 'mailgun', 'sendgrid'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => quickConfig(p)}
                                    className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium capitalize text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Host</label>
                                <div className="relative">
                                    <Server className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        name="host"
                                        value={formData.host}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="smtp.example.com"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Port</label>
                                <input
                                    name="port"
                                    value={formData.port}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="587"
                                />
                            </div>
                        </div>

                         <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">From Email</label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    name="from"
                                    value={formData.from}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="noreply@yourdomain.com"
                                />
                             </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    name="user"
                                    value={formData.user}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        name="pass"
                                        type="password"
                                        value={formData.pass}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors sm:w-auto"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
             <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">Security Note</h3>
                <p className="mt-2 text-sm text-gray-500">
                    SMTP credentials are encrypted at rest using AES-256-GCM. Make sure to use an app-specific password if you are using Gmail.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
