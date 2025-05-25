"use client";

import { useUser } from "@clerk/nextjs";
import { BookOpen, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentWelcomeBannerProps {
  totalCourses: number;
  activeCourses: number;
  className?: string;
}

export const StudentWelcomeBanner = ({ 
  totalCourses, 
  activeCourses, 
  className 
}: StudentWelcomeBannerProps) => {
  const { user } = useUser();
  const firstName = user?.firstName || "Estudiante";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const getMotivationalMessage = () => {
    if (activeCourses === 0) {
      return "¡Es hora de comenzar tu viaje de aprendizaje!";
    }
    if (activeCourses === 1) {
      return "¡Continúa con tu progreso de aprendizaje!";
    }
    return "¡Excelente progreso en tus estudios!";
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400/10 via-emerald-400/5 to-blue-400/10 border border-yellow-400/20 p-8",
      className
    )}>
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 right-8 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-4 left-8 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-blue-400/5 via-transparent to-transparent"></div>
      </div>

      {/* Partículas decorativas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-12 w-2 h-2 bg-yellow-400/40 rounded-full animate-sparkle"></div>
        <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-sparkle delay-700"></div>
        <div className="absolute bottom-8 left-20 w-1 h-1 bg-blue-400/40 rounded-full animate-sparkle delay-1000"></div>
        <div className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-yellow-300/30 rounded-full animate-sparkle delay-1500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
        {/* Contenido principal */}
        <div className="flex-1 space-y-4">
          {/* Saludo personalizado */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/30">
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {getGreeting()}, <span className="text-yellow-400">{firstName}</span>
              </h2>
              <p className="text-gray-300 text-lg">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-400/20 border border-emerald-400/30">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Cursos Activos</p>
                <p className="text-xl font-bold text-white">{activeCourses}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-400/20 border border-blue-400/30">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Disponibles</p>
                <p className="text-xl font-bold text-white">{totalCourses}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-400/20 border border-purple-400/30">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Hoy</p>
                <p className="text-xl font-bold text-white">
                  {new Date().toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ilustración decorativa */}
        <div className="hidden lg:block relative">
          <div className="w-32 h-32 relative">
            {/* Círculos concéntricos animados */}
            <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border border-emerald-400/40 animate-pulse delay-300"></div>
            <div className="absolute inset-4 rounded-full border border-blue-400/50 animate-pulse delay-500"></div>
            
            {/* Icono central */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-emerald-400/20 border border-yellow-400/40 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-yellow-400" />
            </div>

            {/* Partículas orbitales */}
            <div className="absolute top-2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-float"></div>
            <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-float-slow"></div>
            <div className="absolute left-2 top-1/2 w-1 h-1 bg-blue-400 rounded-full animate-float delay-700"></div>
          </div>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
    </div>
  );
}; 