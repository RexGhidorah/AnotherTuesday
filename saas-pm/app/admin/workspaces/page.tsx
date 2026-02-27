"use client";

import { useState } from "react";
import { Save, Image as ImageIcon } from "lucide-react";

export default function WorkspacesPage() {
  const [toggles, setToggles] = useState({
    kanban: true,
    timeTracking: true,
    publicLinks: false,
    guestAccess: true,
  });

  const handleToggle = (key: keyof typeof toggles) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-slate-500">Configure default settings, permissions, and branding for all new workspaces.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-sm flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" /> Save Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Default Features</h3>
              <p className="text-sm text-slate-500 mt-1">Select which modules are enabled by default when a workspace is created.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Kanban Board View</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Set Kanban as the default view instead of List view.</p>
                </div>
                <button onClick={() => handleToggle('kanban')} className={`w-11 h-6 rounded-full transition-colors relative ${toggles.kanban ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${toggles.kanban ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Time Tracking Module</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Allow users to log hours on tasks by default.</p>
                </div>
                <button onClick={() => handleToggle('timeTracking')} className={`w-11 h-6 rounded-full transition-colors relative ${toggles.timeTracking ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${toggles.timeTracking ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Public Sharing Links</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Allow generating read-only public links for boards.</p>
                </div>
                <button onClick={() => handleToggle('publicLinks')} className={`w-11 h-6 rounded-full transition-colors relative ${toggles.publicLinks ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${toggles.publicLinks ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Creation Permissions</h3>
              <p className="text-sm text-slate-500 mt-1">Who is allowed to create new workspaces in this organization?</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="radio" name="creation" className="mt-1 text-indigo-600 focus:ring-indigo-600" />
                  <div>
                    <span className="block text-sm font-semibold text-slate-900">Any authenticated user</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Anyone in the organization can create and manage their own workspaces.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border border-indigo-200 bg-indigo-50/50 rounded-xl cursor-pointer transition-colors">
                  <input type="radio" name="creation" defaultChecked className="mt-1 text-indigo-600 focus:ring-indigo-600" />
                  <div>
                    <span className="block text-sm font-semibold text-indigo-900">Only System Admins</span>
                    <span className="block text-xs text-indigo-700 mt-0.5">Strict control. Users must request a workspace from an administrator.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">Default Branding</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Accent Color</label>
                <div className="flex gap-3">
                  {['bg-indigo-600 ring-indigo-200', 'bg-rose-500 ring-rose-200', 'bg-emerald-500 ring-emerald-200', 'bg-amber-500 ring-amber-200', 'bg-slate-900 ring-slate-200'].map((color, i) => (
                    <button key={i} className={`w-8 h-8 rounded-full ${color} ${i === 0 ? 'ring-4' : 'hover:scale-110'} transition-all`}></button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Workspace Logo</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-indigo-600">Click to upload</span>
                  <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG (max. 2MB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
