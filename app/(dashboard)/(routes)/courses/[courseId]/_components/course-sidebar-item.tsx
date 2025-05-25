"use client";

import { CheckCircle, Lock, Play, Clock, Circle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
  chapterNumber: number;
  duration: string;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
  chapterNumber,
  duration,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(id);

  const handleClick = () => {
    if (!isLocked) {
      router.push(`/courses/${courseId}/chapters/${id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
        isActive && "bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 shadow-lg shadow-green-500/10",
        !isActive && !isLocked && "hover:bg-slate-800/50 hover:border-slate-700/50 border border-transparent",
        isLocked && "opacity-60 cursor-not-allowed",
        !isLocked && "cursor-pointer"
      )}
      disabled={isLocked}
    >
      {/* Indicador de estado activo */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full"></div>
      )}

      {/* Número del capítulo / Estado */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0",
        isCompleted && "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/25",
        isActive && !isCompleted && "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/25",
        !isActive && !isCompleted && !isLocked && "bg-slate-800/50 text-slate-300 group-hover:bg-slate-700/50 group-hover:text-white",
        isLocked && "bg-slate-800/30 text-slate-500"
      )}>
        {isLocked ? (
          <Lock className="h-3 w-3" />
        ) : isCompleted ? (
          <CheckCircle className="h-3 w-3" />
        ) : isActive ? (
          <Play className="h-3 w-3" />
        ) : (
          <span>{chapterNumber}</span>
        )}
      </div>

      {/* Contenido del capítulo */}
      <div className="flex-1 text-left min-w-0">
        <h4 className={cn(
          "font-medium text-sm leading-tight mb-1 transition-colors duration-300 truncate",
          isActive && "text-white",
          !isActive && !isLocked && "text-slate-300 group-hover:text-white",
          isLocked && "text-slate-500"
        )}>
          {label}
        </h4>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className={cn(
              "transition-colors duration-300",
              isActive && "text-green-300",
              !isActive && !isLocked && "text-slate-500 group-hover:text-slate-400",
              isLocked && "text-slate-600"
            )}>
              {duration}
            </span>
          </div>
          
          {/* Estado del capítulo */}
          {isCompleted && (
            <span className="px-2 py-0.5 bg-green-400/20 text-green-400 rounded-full text-xs font-medium border border-green-400/30">
              ✓ Completado
            </span>
          )}
          
          {isActive && !isCompleted && (
            <span className="px-2 py-0.5 bg-blue-400/20 text-blue-400 rounded-full text-xs font-medium border border-blue-400/30">
              ▶ Actual
            </span>
          )}
          
          {isLocked && (
            <span className="px-2 py-0.5 bg-slate-700/50 text-slate-500 rounded-full text-xs font-medium border border-slate-600/30">
              🔒 Bloqueado
            </span>
          )}
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="flex items-center">
        {isCompleted ? (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        ) : isActive ? (
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        ) : !isLocked ? (
          <Circle className="h-3 w-3 text-slate-600 group-hover:text-slate-500 transition-colors" />
        ) : (
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
        )}
      </div>

      {/* Efecto de hover */}
      {!isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
    </button>
  );
}; 