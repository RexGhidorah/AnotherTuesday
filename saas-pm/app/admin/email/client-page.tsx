"use client";

import { useState, useEffect } from "react";
import {
  Server, ShieldCheck, MailOpen, Bold, Italic,
  Link as LinkIcon, List, Save, ShieldAlert
} from "lucide-react";

export default function AdminEmailClient() {
  const [smtpPreset, setSmtpPreset] = useState('Custom');
  const [activeTemplate, setActiveTemplate] = useState('invite');

  const [smtpForm, setSmtpForm] = useState({
      host: "",
      port: "587",
      user: "",
      pass: "",
      from: "",
      secure: false
  });
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Email Templates State
  const defaultTemplates = {
    invite: { subject: "You've been invited to join {{workspace.name}} on Tuesday", body: "Hi {{user.name}},\n\nYou have been invited to collaborate in the workspace \"{{workspace.name}}\".\n\nClick the link below to set up your account and get started:\n{{link}}\n\nWelcome aboard,\nThe Tuesday Team" },
    reset: { subject: "Password Reset Request", body: "Hi {{user.name}},\n\nWe received a request to reset your password. Click the link below to create a new one:\n\n{{link}}\n\nIf you did not request this, please ignore this email." },
    digest: { subject: "Your Daily Digest from Tuesday", body: "Hi {{user.name}},\n\nHere is your daily summary of tasks and notifications:\n\n{{link}}\n\nHave a great day!" }
  };

  const [templates, setTemplates] = useState<Record<string, {subject: string, body: string}>>(defaultTemplates);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
      // Fetch initial SMTP settings
      const fetchSettings = async () => {
          try {
              const res = await Promise.all([
                  fetch("/api/admin/settings"),
                  fetch("/api/admin/templates") // Assuming we create this endpoint or use settings
              ]);

              if (res[0].ok) {
                  const data = await res[0].json();
                  if (data.host) {
                      setSmtpForm({
                          host: data.host || "",
                          port: data.port?.toString() || "587",
                          user: data.user || "",
                          pass: data.pass || "",
                          from: data.from || "",
                          secure: data.secure || false
                      });
                  }
              }

              // Since we don't have a /api/admin/templates route yet, we might store templates in SystemConfig under a different key via the settings endpoint.
              // Let's modify the fetch logic to just fetch settings. Actually, the settings endpoint returns the SMTP settings directly.
              // I will create a new endpoint or update the existing one. For simplicity, let's fetch from a new general config endpoint if needed, or just simulate it for now if I don't touch the backend.
              // Wait, I can update the backend in the next step. Let's assume we fetch `EMAIL_TEMPLATES` from a new generic config endpoint.
              try {
                 const tplRes = await fetch("/api/admin/config?key=EMAIL_TEMPLATES");
                 if (tplRes.ok) {
                     const tplData = await tplRes.json();
                     if (tplData && Object.keys(tplData).length > 0) {
                         setTemplates(tplData);
                     }
                 }
              } catch (e) {
                 // Ignore if endpoint doesn't exist yet, fallback to defaults
              }
          } catch (e) {
              console.error("Failed to fetch SMTP settings", e);
          }
      };
      fetchSettings();
  }, []);

  const handleSaveSmtp = async () => {
      setIsSavingSmtp(true);
      setSmtpStatus('idle');
      try {
          const res = await fetch("/api/admin/settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(smtpForm)
          });
          if (res.ok) {
              setSmtpStatus('success');
              setTimeout(() => setSmtpStatus('idle'), 3000);
          } else {
              setSmtpStatus('error');
          }
      } catch (e) {
          console.error("Failed to save", e);
          setSmtpStatus('error');
      } finally {
          setIsSavingSmtp(false);
      }
  };

  const handleSaveTemplate = async () => {
      setIsSavingTemplate(true);
      setTemplateStatus('idle');
      try {
          const res = await fetch("/api/admin/config", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: "EMAIL_TEMPLATES", value: templates })
          });
          if (res.ok) {
              setTemplateStatus('success');
              setTimeout(() => setTemplateStatus('idle'), 3000);
          } else {
              setTemplateStatus('error');
          }
      } catch (e) {
          console.error("Failed to save template", e);
          setTemplateStatus('error');
      } finally {
          setIsSavingTemplate(false);
      }
  };

  const handleTemplateChange = (field: 'subject' | 'body', value: string) => {
      setTemplates(prev => ({
          ...prev,
          [activeTemplate]: {
              ...prev[activeTemplate],
              [field]: value
          }
      }));
  };

  const handlePresetChange = (preset: string) => {
      setSmtpPreset(preset);
      if (preset === 'Gmail') {
          setSmtpForm(prev => ({ ...prev, host: 'smtp.gmail.com', port: '587', secure: false }));
      } else if (preset === 'Mailgun') {
          setSmtpForm(prev => ({ ...prev, host: 'smtp.mailgun.org', port: '587', secure: false }));
      } else if (preset === 'Sendgrid') {
          setSmtpForm(prev => ({ ...prev, host: 'smtp.sendgrid.net', port: '587', secure: false }));
      } else {
          setSmtpForm(prev => ({ ...prev, host: '', port: '587', secure: false }));
      }
  };

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setSmtpForm(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="text-slate-500">Manage SMTP settings and customize outgoing email templates.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Server className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">SMTP Settings</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Provider</label>
                <div className="flex flex-wrap gap-2">
                  {['Gmail', 'Mailgun', 'Sendgrid', 'Custom'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetChange(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        smtpPreset === preset
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-600/20'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Host</label>
                  <input type="text" name="host" value={smtpForm.host} onChange={handleSmtpChange} placeholder="smtp.example.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Port</label>
                  <input type="text" name="port" value={smtpForm.port} onChange={handleSmtpChange} placeholder="587" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Username</label>
                  <input type="text" name="user" value={smtpForm.user} onChange={handleSmtpChange} placeholder="apikey" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Password</label>
                  <input type="password" name="pass" value={smtpForm.pass} onChange={handleSmtpChange} placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">From Email Address</label>
                <input type="email" name="from" value={smtpForm.from} onChange={handleSmtpChange} placeholder="notifications@tuesday.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" id="secure" name="secure" checked={smtpForm.secure} onChange={handleSmtpChange} className="rounded text-indigo-600 focus:ring-indigo-500" />
                 <label htmlFor="secure" className="text-xs text-slate-700">Use Secure Connection (TLS/SSL)</label>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {smtpStatus === 'success' && (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Saved Successfully
                        </span>
                    )}
                    {smtpStatus === 'error' && (
                        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> Failed to Save
                        </span>
                    )}
                </div>
                <button
                  onClick={handleSaveSmtp}
                  disabled={isSavingSmtp}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSavingSmtp ? 'Saving...' : <><Save className="w-4 h-4" /> Update</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MailOpen className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-slate-900">Email Templates</h3>
              </div>
              <div className="flex bg-slate-200/50 p-1 rounded-lg">
                {[
                  { id: 'invite', label: 'Invitations' },
                  { id: 'reset', label: 'Password Reset' },
                  { id: 'digest', label: 'Daily Digest' }
                ].map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setActiveTemplate(tpl.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTemplate === tpl.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Subject Line</label>
                <input
                  type="text"
                  value={templates[activeTemplate]?.subject || ""}
                  onChange={(e) => handleTemplateChange('subject', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
              <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-500 transition-all">
                <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2">
                  <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Bold className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Italic className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><LinkIcon className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><List className="w-4 h-4" /></button>
                  <div className="ml-auto flex items-center gap-2 hidden sm:flex">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Variables:</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-mono cursor-pointer hover:bg-indigo-200">{"{{user.name}}"}</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-mono cursor-pointer hover:bg-indigo-200">{"{{link}}"}</span>
                  </div>
                </div>
                <textarea
                  className="flex-1 w-full p-4 resize-none outline-none text-sm text-slate-700 bg-white font-mono leading-relaxed min-h-[200px]"
                  value={templates[activeTemplate]?.body || ""}
                  onChange={(e) => handleTemplateChange('body', e.target.value)}
                ></textarea>
              </div>

              <div className="mt-4 flex justify-between items-center gap-3">
                 <div className="flex items-center gap-2">
                    {templateStatus === 'success' && (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Saved
                        </span>
                    )}
                    {templateStatus === 'error' && (
                        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> Error
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-200 transition-colors">
                    Send Test
                    </button>
                    <button
                        onClick={handleSaveTemplate}
                        disabled={isSavingTemplate}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                    >
                    {isSavingTemplate ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
