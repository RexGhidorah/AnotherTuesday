"use client";

import { useState } from "react";
import {
  Server, ShieldCheck, MailOpen, Bold, Italic,
  Link as LinkIcon, List
} from "lucide-react";

export default function AdminEmailClient() {
  const [smtpPreset, setSmtpPreset] = useState('Sendgrid');
  const [activeTemplate, setActiveTemplate] = useState('invite');

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
                  {['Gmail', 'Mailgun', 'Sendgrid'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSmtpPreset(preset)}
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
                  <input type="text" defaultValue="smtp.sendgrid.net" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Port</label>
                  <input type="text" defaultValue="587" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">From Email Address</label>
                <input type="email" defaultValue="notifications@tuesday.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Connected
                </span>
                <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-colors">
                  Update
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
                  defaultValue={activeTemplate === 'invite' ? "You've been invited to join {{workspace.name}} on Tuesday" : "Action Required: Tuesday"}
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
                  defaultValue={`Hi {{user.name}},\n\nYou have been invited to collaborate in the workspace "{{workspace.name}}".\n\nClick the link below to set up your account and get started:\n{{link}}\n\nWelcome aboard,\nThe Tuesday Team`}
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-200 transition-colors">
                  Send Test
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
