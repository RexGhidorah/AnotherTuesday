"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, ChevronRight, LayoutTemplate, Briefcase, Mail } from 'lucide-react';

const BrandLogo = () => (
    <div className="flex items-center gap-2">
      <div className="grid grid-cols-2 grid-rows-2 gap-[2px] w-7 h-7">
        <div className="bg-rose-500 rounded-tl-sm w-full h-full"></div>
        <div className="bg-amber-400 rounded-tr-sm w-full h-full"></div>
        <div className="bg-emerald-500 rounded-bl-sm w-full h-full"></div>
        <div className="bg-indigo-600 rounded-br-sm w-full h-full"></div>
      </div>
      <span className="text-3xl font-black tracking-tighter text-slate-900">
        tuesday<span className="text-indigo-600">.</span>
      </span>
    </div>
  );

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
             router.push("/");
        }, 1000);
    } else {
      setIsLoading(false);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Mitad Izquierda: Formulario de Login */}
      <div className="flex flex-col justify-center flex-1 px-8 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-5/12 border-r border-slate-100 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Cabecera */}
          <div className="mb-10">
            <BrandLogo />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ingresa tus datos para acceder a tu espacio de trabajo.
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl bg-green-50 p-6 border border-green-100 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-green-900">¡Acceso concedido!</h3>
              <p className="text-sm text-green-700 mt-2">
                Redirigiendo a tu tablero principal de Tuesday...
              </p>
            </div>
          ) : (
            <>
              {/* Botones Sociales */}
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-3 px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Continuar con Google
                </button>
              </div>

              {/* Separador */}
              <div className="mt-8 flex items-center">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-4 text-sm text-slate-500 bg-white">
                  O iniciar sesión con email
                </span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Formulario Tradicional */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Correo de trabajo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="ejemplo@tuempresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm transition-shadow placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Contraseña
                    </label>
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm transition-shadow placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Iniciar sesión
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Development Mode Reset */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 border-t pt-4 text-center">
                <p className="mb-2 text-xs text-red-400 uppercase tracking-wider">Developer Options</p>
                <button
                onClick={async () => {
                    if (confirm("This will DELETE ALL DATA. Are you sure?")) {
                    await fetch("/api/setup/reset", { method: "POST" });
                    window.location.href = "/setup";
                    }
                }}
                className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                Reset Database
                </button>
            </div>
            )}

          {/* Footer del Formulario */}
          <div className="mt-10 text-center text-sm text-slate-600">
            ¿Aún no tienes una cuenta?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Prueba Tuesday gratis
            </a>
          </div>
        </div>
      </div>

      {/* Mitad Derecha: Gráfico Decorativo (Tablero tipo Kanban) */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-slate-50 items-center justify-center overflow-hidden">
        {/* Patrón de fondo abstracto */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        {/* Círculo decorativo */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-rose-100 blur-3xl opacity-50"></div>

        <div className="relative z-10 w-full max-w-2xl px-12">
          {/* Mockup de la UI de Tuesday */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">

            {/* Cabecera del mockup */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <LayoutTemplate className="w-6 h-6 text-indigo-500" />
                  Roadmap Q3
                </h3>
                <p className="text-xs text-slate-500 mt-1">Sincronizado hace 2 min</p>
              </div>
              <div className="flex -space-x-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=c0aede" alt="Avatar" />
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-xs font-medium text-slate-600">+3</div>
              </div>
            </div>

            {/* Columnas tipo Kanban */}
            <div className="grid grid-cols-3 gap-4">
              {/* Columna 1 */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-sm font-semibold text-slate-700">Por hacer</span>
                  <span className="ml-auto text-xs text-slate-400">2</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                    <h4 className="text-sm font-medium text-slate-800">Diseñar Landing</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2 py-1 text-[10px] font-medium bg-rose-100 text-rose-700 rounded-md">Alta</span>
                      <Briefcase className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                    <h4 className="text-sm font-medium text-slate-800">Revisión de copy</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2 py-1 text-[10px] font-medium bg-amber-100 text-amber-700 rounded-md">Media</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="h-4 w-4 rounded-full" src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna 2 */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-sm font-semibold text-slate-700">En progreso</span>
                  <span className="ml-auto text-xs text-slate-400">1</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-200 ring-1 ring-indigo-50">
                    <h4 className="text-sm font-medium text-slate-800">Desarrollo Frontend</h4>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 mb-2">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="px-2 py-1 text-[10px] font-medium bg-indigo-100 text-indigo-700 rounded-md">Dev</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="h-4 w-4 rounded-full" src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=c0aede" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna 3 */}
              <div className="bg-slate-50 rounded-xl p-3 opacity-75">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-semibold text-slate-700">Completado</span>
                  <span className="ml-auto text-xs text-slate-400">3</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                    <h4 className="text-sm font-medium text-slate-500 line-through decoration-slate-300">Wireframes UX</h4>
                    <div className="flex items-center justify-between mt-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Gestiona todo tu trabajo <br/> en un solo lugar.
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Haz que cada día se sienta productivo y organizado. Empieza a usar Tuesday con tu equipo hoy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
