"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  Bell, 
  Trophy, 
  Target, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  Flame,
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentExperienceEnhancementsProps {
  totalCourses: number;
  completedChapters: number;
  totalChapters: number;
  currentStreak: number;
  upcomingUnlocks: Array<{
    chapterTitle: string;
    courseTitle: string;
    unlockDate: Date;
  }>;
}

export const StudentExperienceEnhancements = ({
  totalCourses,
  completedChapters,
  totalChapters,
  currentStreak,
  upcomingUnlocks
}: StudentExperienceEnhancementsProps) => {
  const { user } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Mostrar motivación si el usuario ha completado algo recientemente
    if (completedChapters > 0 && completedChapters % 5 === 0) {
      setShowMotivation(true);
    }
  }, [completedChapters]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "¡Excelente progreso! Sigue así 🚀",
      "¡Cada capítulo completado te acerca más a tu meta! 🎯",
      "¡Tu dedicación está dando frutos! 🌟",
      "¡Eres imparable! Continúa con esa energía 💪",
      "¡Tu futuro profesional se está construyendo paso a paso! 🏗️"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const formatTimeUntilUnlock = (unlockDate: Date) => {
    const now = new Date();
    const diff = unlockDate.getTime() - now.getTime();
    
    if (diff <= 0) return "¡Ya disponible!";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return "Menos de 1 hora";
  };

  const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Saludo personalizado */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {getGreeting()}, {user?.firstName || 'Estudiante'}! 👋
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {currentTime.toLocaleDateString('es-CO', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          
          {/* Botón de notificaciones */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-400" />
            {upcomingUnlocks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Próximos desbloqueos
            </h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {upcomingUnlocks.length === 0 ? (
            <p className="text-slate-400 text-sm">No hay capítulos próximos a desbloquearse</p>
          ) : (
            <div className="space-y-2">
              {upcomingUnlocks.slice(0, 3).map((unlock, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {unlock.chapterTitle}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {unlock.courseTitle} • {formatTimeUntilUnlock(unlock.unlockDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estadísticas de progreso */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white">{totalCourses}</p>
          <p className="text-slate-400 text-xs">Cursos activos</p>
        </div>
        
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-xl font-bold text-white">{completedChapters}</p>
          <p className="text-slate-400 text-xs">Completados</p>
        </div>
        
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <p className="text-xl font-bold text-white">{currentStreak}</p>
          <p className="text-slate-400 text-xs">Días seguidos</p>
        </div>
        
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white">{Math.round(progressPercentage)}%</p>
          <p className="text-slate-400 text-xs">Progreso total</p>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Target className="h-4 w-4" />
            Tu progreso general
          </h3>
          <span className="text-green-400 font-bold">{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="w-full bg-slate-800/60 rounded-full h-3 overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{width: `${progressPercentage}%`}}
          />
        </div>
        
        <div className="flex justify-between text-xs text-slate-400">
          <span>{completedChapters} completados</span>
          <span>{totalChapters - completedChapters} restantes</span>
        </div>
      </div>

      {/* Mensaje motivacional */}
      {showMotivation && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-200">¡Felicitaciones!</h3>
                <p className="text-green-300/80 text-sm">{getMotivationalMessage()}</p>
              </div>
            </div>
            <button
              onClick={() => setShowMotivation(false)}
              className="text-green-400 hover:text-green-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Logros y metas */}
      {completedChapters > 0 && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-medium text-white flex items-center gap-2 mb-3">
            <Award className="h-4 w-4" />
            Logros recientes
          </h3>
          
          <div className="space-y-2">
            {completedChapters >= 1 && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-3 w-3 text-yellow-400" />
                <span className="text-slate-300">Primer capítulo completado</span>
              </div>
            )}
            {completedChapters >= 5 && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-3 w-3 text-blue-400" />
                <span className="text-slate-300">5 capítulos completados</span>
              </div>
            )}
            {currentStreak >= 3 && (
              <div className="flex items-center gap-2 text-sm">
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-slate-300">Racha de 3 días</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 