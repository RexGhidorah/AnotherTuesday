import { prisma } from "@/lib/prisma";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function RecentActivityWidget() {
  const logs = await prisma.activityLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const getActionColor = (action: string) => {
    if (action.includes("CREATE")) return "bg-emerald-500";
    if (action.includes("DELETE") || action.includes("REMOVE")) return "bg-rose-500";
    return "bg-indigo-500";
  };

  const formatDetails = (log: any) => {
    // If the system generated it, bold the system name
    if (log.user.name === "System") {
       return (
         <>
           <strong>Sistema</strong> {log.details}
         </>
       );
    }

    // Default formatting: User name bolded, then details
    return (
      <>
        <strong>{log.user.name || log.user.email}</strong> {log.details?.toLowerCase()}
      </>
    );
  };

  return (
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
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No hay actividad reciente.</p>
        ) : (
          logs.map((log, index) => (
            <div key={log.id} className="flex gap-3 relative">
              {index !== logs.length - 1 && (
                <div className="absolute top-2.5 left-[3px] bottom-[-16px] w-[2px] bg-slate-100"></div>
              )}
              <div className={`w-2 h-2 mt-1.5 rounded-full ${getActionColor(log.action)} shrink-0 relative z-10 shadow-[0_0_0_3px_white]`}></div>
              <div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {formatDetails(log)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium capitalize">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
