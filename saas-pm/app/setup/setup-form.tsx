"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/setup/initial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Setup failed");
        return;
      }

      // Redirect to login (or auto-login if implemented)
      router.push("/login?setup=success");
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Initial Setup</h1>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">1. Admin Account</h2>
              <input
                name="name"
                placeholder="Full Name"
                className="w-full rounded border px-3 py-2"
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full rounded border px-3 py-2"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full rounded border px-3 py-2"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">2. SMTP Settings (Optional)</h2>

              <div className="flex gap-2 text-sm">
                <button type="button" onClick={() => setFormData({...formData, smtpHost: 'smtp.gmail.com', smtpPort: '587'})} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">Gmail</button>
                <button type="button" onClick={() => setFormData({...formData, smtpHost: 'smtp.office365.com', smtpPort: '587'})} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">Outlook</button>
                <button type="button" onClick={() => setFormData({...formData, smtpHost: 'smtp.mailgun.org', smtpPort: '587'})} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">Mailgun</button>
                <button type="button" onClick={() => setFormData({...formData, smtpHost: 'smtp.sendgrid.net', smtpPort: '587'})} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">SendGrid</button>
              </div>

              <input
                name="smtpHost"
                placeholder="SMTP Host (e.g. smtp.gmail.com)"
                className="w-full rounded border px-3 py-2"
                value={formData.smtpHost}
                onChange={handleChange}
              />
              <input
                name="smtpPort"
                placeholder="Port (e.g. 587)"
                className="w-full rounded border px-3 py-2"
                value={formData.smtpPort}
                onChange={handleChange}
              />
              <input
                name="smtpUser"
                placeholder="Username / Email"
                className="w-full rounded border px-3 py-2"
                onChange={handleChange}
              />
              <input
                name="smtpPass"
                type="password"
                placeholder="Password"
                className="w-full rounded border px-3 py-2"
                onChange={handleChange}
              />
               <input
                name="smtpFrom"
                placeholder="From Email (e.g. noreply@saas.com)"
                className="w-full rounded border px-3 py-2"
                onChange={handleChange}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
