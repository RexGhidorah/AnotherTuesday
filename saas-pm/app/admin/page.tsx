import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users, ChevronRight, Folder, Database, HardDrive,
  Clock, Globe
} from "lucide-react";
import CreateWorkspaceWidget from "@/components/admin/CreateWorkspaceWidget";
import GlobalStorageWidget from "@/components/admin/GlobalStorageWidget";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  // Fetch real data
  const workspaces = await prisma.workspace.findMany({
    include: {
        _count: {
            select: { members: true, projects: true }
        },
        projects: {
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        }
    }
  });

  const totalUsers = await prisma.user.count();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="text-slate-500">Gestiona los espacios de trabajo activos y el resumen del sistema.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          <CreateWorkspaceWidget />

          {/* Tarjeta: Workspaces Activos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Espacios Activos</h3>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full ring-1 ring-indigo-600/10">{workspaces.length} Total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {workspaces.map(ws => (
                <div
                  key={ws.id}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {ws.name[0]}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{ws.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Folder className="w-3.5 h-3.5" /> {ws._count.projects} Proyectos
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Users className="w-3.5 h-3.5" /> {ws._count.members} Miembros
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Database className="w-3.5 h-3.5" /> Local
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/admin/workspace/${ws.id}`}
                    className="p-2 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                  >
                    Ver Detalles <ChevronRight className="w-5 h-5 inline" />
                  </Link>
                </div>
              ))}
              {workspaces.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-sm">No hay espacios activos.</div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha (Widgets) */}
        <div className="space-y-6">

          {/* Resumen del Sistema + Audit Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Resumen del Sistema</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Usuarios Totales</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">{totalUsers}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Espacios Activos</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">{workspaces.length}</span>
                </div>
                <GlobalStorageWidget />
              </div>

              {/* Audit Logs (Mock) */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" /> Actividad Reciente
                  </h4>
                  <button className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded transition-colors">
                    Ver Logs
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 relative">
                    <div className="absolute top-2.5 left-[3px] bottom-[-16px] w-[2px] bg-slate-100"></div>
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0 relative z-10 shadow-[0_0_0_3px_white]"></div>
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Noah Admin</strong> modificó el rol de <span className="font-medium text-indigo-600">Emma Watson</span>.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Hace 10 min</p>
                    </div>
                  </div>
                  <div className="flex gap-3 relative">
                    <div className="absolute top-2.5 left-[3px] bottom-[-16px] w-[2px] bg-slate-100"></div>
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0 relative z-10 shadow-[0_0_0_3px_white]"></div>
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Se creó un nuevo workspace: <span className="font-medium text-emerald-600">Test Workspace</span>.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Ayer a las 14:30</p>
                    </div>
                  </div>
                  <div className="flex gap-3 relative">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-rose-500 shrink-0 relative z-10 shadow-[0_0_0_3px_white]"></div>
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Sistema</strong> bloqueó un inicio de sesión desde IP no reconocida.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">12 Oct 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
