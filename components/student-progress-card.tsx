"use client";

import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentProgressCardProps {
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  timeSpent: string;
  category?: string;
  isCompleted?: boolean;
  className?: string;
}

export const StudentProgressCard = ({
  title,
  progress,
  totalLessons,
  completedLessons,
  timeSpent,
  category,
  isCompleted = false,
  className
}: StudentProgressCardProps) => {
  const getProgressColor = () => {
    if (isCompleted) return "from-emerald-500 to-green-400";
    if (progress >= 75) return "from-yellow-500 to-orange-400";
    if (progress >= 50) return "from-blue-500 to-cyan-400";
    return "from-purple-500 to-pink-400";
  };

  const getIconColor = () => {
    if (isCompleted) return "text-emerald-400";
    if (progress >= 75) return "text-yellow-400";
    if (progress >= 50) return "text-blue-400";
    return "text-purple-400";
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/40 p-6 transition-all duration-500 hover:scale-[1.02] hover:border-gray-600/60",
      className
    )}>
      {/* Efecto de brillo de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Partículas decorativas */}
      {isCompleted && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute top-6 right-8 w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-300"></div>
        </>
      )}

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-yellow-200 transition-colors duration-300">
              {title}
            </h3>
            {category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/30">
                {category}
              </span>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-2xl bg-gradient-to-br border transition-all duration-300 group-hover:scale-110",
            isCompleted 
              ? "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" 
              : "from-gray-700/50 to-gray-800/50 border-gray-600/30 group-hover:border-gray-500/50"
          )}>
            {isCompleted ? (
              <Trophy className={cn("h-6 w-6", getIconColor())} />
            ) : (
              <BookOpen className={cn("h-6 w-6", getIconColor())} />
            )}
          </div>
        </div>

        {/* Progreso */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">Progreso</span>
            <span className={cn("font-bold", getIconColor())}>
              {progress}%
            </span>
          </div>
          
          <div className="relative">
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
              <div 
                className={cn(
                  "h-full bg-gradient-to-r transition-all duration-1000 ease-out relative overflow-hidden",
                  getProgressColor()
                )}
                style={{ width: `${progress}%` }}
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Target className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Lecciones</p>
              <p className="text-sm font-bold text-white">
                {completedLessons}/{totalLessons}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Clock className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Tiempo</p>
              <p className="text-sm font-bold text-white">{timeSpent}</p>
            </div>
          </div>
        </div>

        {/* Badge de estado */}
        {isCompleted && (
          <div className="flex items-center justify-center mt-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl px-4 py-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-300">¡Completado!</span>
            </div>
          </div>
        )}

        {/* Línea decorativa inferior */}
        <div className={cn(
          "h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30",
          getIconColor()
        )}></div>
      </div>
    </div>
  );
}; 