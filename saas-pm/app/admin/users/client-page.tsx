"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search, Filter, MoreHorizontal, ShieldCheck, ShieldAlert,
  Key, Clock, LogOut, Save, UserCheck, Lock, Trash2,
  Mail, ArrowLeft, Plus
} from "lucide-react";
import { inviteUser, deleteUser, updateUserRole } from "@/app/actions/admin";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  createdAt: string;
  _count: { workspaces: number };
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [openUserMenu, setOpenUserMenu] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{ type: 'role' | 'password' | 'suspend'; user: AdminUser } | null>(null);

  const handleInvite = async (data: { email: string; role: string; name?: string }) => {
    const result = await inviteUser(data);
    if (result.success && result.user) {
      setUsers([result.user as any, ...users]);
    } else {
      alert(result.error || "Failed to invite user");
    }
  };

  const handleDelete = async (userId: string) => {
      const result = await deleteUser(userId);
      if (result.success) {
        setUsers(users.filter((u) => u.id !== userId));
        setModalConfig(null);
        if (selectedUser?.id === userId) setSelectedUser(null);
      } else {
        alert("Failed to delete user");
      }
  };

   const handleUpdateRole = async (userId: string, newRole: string) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
      }
      setModalConfig(null);
    } else {
      alert("Failed to update role");
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">

      {!selectedUser ? (
        /* --- USERS: VISTA PRINCIPAL (TABLA) --- */
        <>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-slate-500">Gestiona todos los usuarios de la organización, roles del sistema y políticas de acceso.</p>
            </div>
            <button
                onClick={() => alert("Invite modal implementation would go here")}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Invitar Usuarios
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Buscar por nombre o correo..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-sm">
                      <Filter className="w-4 h-4" /> Filtros
                    </button>
                    <select className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer">
                      <option>Estado: Todos</option>
                      <option>Activos</option>
                      <option>Pendientes</option>
                      <option>Suspendidos</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Rol Global</th>
                        <th className="px-6 py-4">Seguridad / Estado</th>
                        <th className="px-6 py-4">Workspaces</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className="hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                                {user.image ? <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" /> : (user.name?.[0] || "U")}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name || "Unknown"}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.role === "SUPER_ADMIN" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200 tracking-wide">
                                <ShieldCheck className="w-3 h-3" /> SUPER ADMIN
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {user.role}
                                </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Activo
                              </span>
                              {user.role === "SUPER_ADMIN" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                    <Key className="w-3 h-3 text-emerald-500" /> 2FA Activado
                                  </span>
                              ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600">
                                    <ShieldAlert className="w-3 h-3" /> 2FA Desactivado
                                  </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">{user._count.workspaces}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (openUserMenu === user.id) setOpenUserMenu(null);
                                else {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  // Adjust position relative to the scrollable container if needed, but fixed usually works for dropdowns
                                  setMenuPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
                                  setOpenUserMenu(user.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                  <p className="text-xs text-slate-500">Mostrando <span className="font-semibold text-slate-900">{users.length}</span> usuarios</p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-slate-200 text-slate-400 rounded-md text-sm disabled:opacity-50 cursor-not-allowed">Anterior</button>
                    <button className="px-3 py-1 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-sm transition-colors">Siguiente</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 xl:col-span-1">
              {/* Stats Widgets */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Roles del Sistema</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Super Admin</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Acceso total al panel de sistema, usuarios y facturación.</p>
                    </div>
                  </div>
                  {/* More roles... */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* --- USERS: VISTA DETALLE DEL USUARIO --- */
        <div className="animate-in slide-in-from-right-8 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold shadow-sm overflow-hidden">
                   {selectedUser.image ? <img src={selectedUser.image} alt={selectedUser.name || "User"} className="w-full h-full object-cover" /> : (selectedUser.name?.[0] || "U")}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    {selectedUser.name}
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold rounded-md tracking-wider">
                      Activo
                    </span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl text-sm shadow-sm flex items-center gap-2 transition-colors">
                <LogOut className="w-4 h-4" /> Forzar Cierre
              </button>
              <button className="px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-medium rounded-xl text-sm shadow-sm flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" /> Guardar Cambios
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-500" /> Información y Rol
                  </h3>
                </div>
                <div className="p-6 space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Nombre Completo</label>
                      <input type="text" defaultValue={selectedUser.name || ""} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Correo Electrónico</label>
                      <input type="email" defaultValue={selectedUser.email || ""} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Nivel de Acceso Global (Rol del Sistema)</label>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="radio" name="globalRole" defaultChecked={selectedUser.role === 'MEMBER'} className="mt-1 text-indigo-600 focus:ring-indigo-600" />
                        <div>
                          <span className="block text-sm font-semibold text-slate-900">Usuario Regular (MEMBER)</span>
                          <span className="block text-xs text-slate-500 mt-0.5">Nivel estándar. Solo puede ver y participar en los workspaces a los que se le invite.</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 p-3 border border-purple-200 bg-purple-50/50 rounded-xl cursor-pointer transition-colors">
                        <input type="radio" name="globalRole" defaultChecked={selectedUser.role === 'SUPER_ADMIN'} className="mt-1 text-purple-600 focus:ring-purple-600" />
                        <div>
                          <span className="block text-sm font-semibold text-purple-900">Super Admin</span>
                          <span className="block text-xs text-purple-700 mt-0.5">Acceso completo a todos los workspaces, configuración del servidor, facturación y seguridad.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-red-100 bg-red-50/50">
                    <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                      <Lock className="w-5 h-5" /> Zona de Peligro
                    </h3>
                  </div>
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Suspender Cuenta</h4>
                      <p className="text-sm text-slate-500 mt-1 max-w-md">El usuario perderá el acceso a la plataforma inmediatamente.</p>
                    </div>
                    <button className="px-4 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-medium rounded-xl text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                      <Lock className="w-4 h-4" /> Suspender Usuario
                    </button>
                  </div>
              </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Seguridad
                    </h3>
                    <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                        <p className="text-sm font-medium text-slate-900">Autenticación 2FA</p>
                        <p className="text-xs text-slate-500 mt-0.5">{selectedUser.role === 'SUPER_ADMIN' ? 'Configurado' : 'No configurado'}</p>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${selectedUser.role === 'SUPER_ADMIN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {selectedUser.role === 'SUPER_ADMIN' ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Último Acceso</span>
                        <span className="text-sm font-medium text-slate-900">Hoy, 10:45 AM (IP: 192.168.1.1)</span>
                    </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING MENU --- */}
      {openUserMenu && (
        <>
          <div className="fixed inset-0 z-[90] cursor-default" onClick={() => setOpenUserMenu(null)}></div>
          <div
            className="fixed w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-[100] animate-in fade-in zoom-in-95 duration-100 text-left"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <button
              onClick={() => {
                  const u = users.find(x => x.id === openUserMenu);
                  if (u) setModalConfig({ type: 'role', user: u });
                  setOpenUserMenu(null);
              }}
              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Cambiar rol global
            </button>
            <button
              onClick={() => {
                  const u = users.find(x => x.id === openUserMenu);
                  if (u) setModalConfig({ type: 'password', user: u });
                  setOpenUserMenu(null);
              }}
              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
              <Key className="w-4 h-4" /> Restablecer contraseña
            </button>
            <div className="h-px bg-slate-100 my-1"></div>
            <button
              onClick={() => {
                  const u = users.find(x => x.id === openUserMenu);
                  if (u) setModalConfig({ type: 'suspend', user: u });
                  setOpenUserMenu(null);
              }}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Eliminar usuario
            </button>
          </div>
        </>
      )}

      {/* --- MODALS --- */}
      {modalConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalConfig(null)}></div>

          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">
                {modalConfig.type === 'role' && 'Cambiar Rol Global'}
                {modalConfig.type === 'password' && 'Restablecer Contraseña'}
                {modalConfig.type === 'suspend' && 'Eliminar Usuario'}
              </h3>
              <button onClick={() => setModalConfig(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 rounded-lg p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
                {modalConfig.type === 'role' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">Selecciona el nuevo nivel de acceso para <strong>{modalConfig.user.name}</strong>.</p>
                        <select
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            defaultValue={modalConfig.user.role}
                            onChange={(e) => handleUpdateRole(modalConfig.user.id, e.target.value)}
                        >
                             <option value="SUPER_ADMIN">Super Admin</option>
                             <option value="ADMIN">Admin</option>
                             <option value="MEMBER">Member</option>
                        </select>
                    </div>
                )}

                {modalConfig.type === 'suspend' && (
                    <div className="space-y-4">
                         <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 ring-4 ring-red-50/50">
                            <ShieldAlert className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 text-center">
                            ¿Estás seguro de que deseas eliminar a <strong>{modalConfig.user.name}</strong>? Esta acción es irreversible.
                        </p>
                         <button
                            onClick={() => handleDelete(modalConfig.user.id)}
                            className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-xl text-sm hover:bg-red-700"
                        >
                            Confirmar Eliminación
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
