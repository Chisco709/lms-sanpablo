"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  Lock, 
  Play, 
  BookOpen, 
  ArrowRight, 
  ChevronDown,
  ChevronUp,
  Calendar,
  ArrowLeft,
  Home,
  Star,
  Clock
} from "lucide-react";

interface CoursePageClientProps {
  course: any;
  progressCount: number;
  completedChapters: number;
  hasAccess: boolean;
  isFreeCoure: boolean;
  courseId: string;
}

export const CoursePageClient = ({
  course,
  progressCount,
  completedChapters,
  hasAccess,
  isFreeCoure,
  courseId
}: CoursePageClientProps) => {
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Mostrar solo los primeros 5 capítulos inicialmente
  const visibleChapters = showAllChapters ? course.chapters : course.chapters.slice(0, 5);
  const hasMoreChapters = course.chapters.length > 5;

  useEffect(() => {
    // Marcar como montado para evitar errores de hidratación
    setMounted(true);
    // Verificar si hay historial de navegación solo en el cliente
    if (typeof window !== 'undefined') {
    setCanGoBack(window.history.length > 1);
    }
  }, []);

  const handleBackNavigation = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/student');
    }
  };

  const formatUnlockDate = (unlockDate: string | Date | null) => {
    if (!unlockDate) return null;
    
    const date = new Date(unlockDate);
    const now = new Date();
    
    if (date <= now) return null; // Ya está desbloqueado
    
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isChapterLocked = (chapter: any) => {
    if (hasAccess) return false; // Si tiene acceso al curso, no hay bloqueos
    if (chapter.isFree) return false; // Capítulos gratuitos nunca están bloqueados
    
    // Si hay fecha de desbloqueo, verificar
    if (chapter.unlockDate) {
      const unlockDate = new Date(chapter.unlockDate);
      const now = new Date();
      return unlockDate > now;
    }
    
    return !hasAccess; // Por defecto, bloqueado si no tiene acceso
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header con navegación inteligente - MÁS HERMOSO */}
      <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group border border-slate-700/30"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{canGoBack ? 'Volver' : 'Mis Cursos'}</span>
              </button>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              <span className="text-slate-400 text-sm font-medium">Curso</span>
            </div>
            
            {/* Botón directo al inicio */}
            <Link 
              href="/student"
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-700/30"
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Inicio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal - Solo clases y progreso */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* CONTENIDO DEL CURSO - INMEDIATAMENTE VISIBLE */}
          <div className="lg:col-span-3 space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
                CONTENIDO DEL CURSO
              </h2>
              <p className="text-slate-400 text-lg">
                {course.chapters.length} {course.chapters.length === 1 ? 'clase disponible' : 'clases disponibles'}
              </p>
          </div>

                <div className="space-y-4">
          {visibleChapters.map((chapter: any, index: number) => {
            const isCompleted = !!chapter.userProgress?.[0]?.isCompleted;
            const isLocked = isChapterLocked(chapter);
            const unlockDateFormatted = formatUnlockDate(chapter.unlockDate);
            
            return (
              <div
                key={chapter.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/30 via-slate-800/20 to-slate-800/30 hover:from-slate-700/40 hover:via-slate-700/30 hover:to-slate-700/40 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm"
              >
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                <Link 
                  href={isLocked ? '#' : `/courses/${courseId}/chapters/${chapter.id}`}
                      className={`relative z-10 flex items-center gap-6 p-6 ${
                        isLocked ? 'cursor-not-allowed opacity-60' : 'transition-all duration-300'
                  }`}
                >
                      {/* Número/Estado - MÁS HERMOSO */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                    isLocked 
                      ? 'bg-slate-700/40 text-slate-500' 
                      : isCompleted 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25' 
                            : 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-yellow-400/25 group-hover:shadow-yellow-400/40'
                  }`}>
                    {isLocked ? (
                          <Lock size={20} />
                    ) : isCompleted ? (
                          <CheckCircle size={20} />
                    ) : (
                          <span className="text-lg">{index + 1}</span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                        <h3 className={`text-xl font-bold mb-3 ${
                          isLocked ? 'text-slate-500' : 'text-white group-hover:text-yellow-400'
                        } transition-colors duration-300`}>
                      {chapter.title}
                    </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-400 font-medium">Clase {index + 1}</span>
                      {isCompleted && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 font-bold rounded-full border border-green-500/30">
                              ✓ COMPLETADO
                            </span>
                      )}
                      {isLocked && unlockDateFormatted && (
                            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 font-bold rounded-full border border-yellow-400/30 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                          Se desbloquea: {unlockDateFormatted}
                        </span>
                      )}
                      {isLocked && !unlockDateFormatted && (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 font-bold rounded-full border border-red-500/30">
                              🔒 BLOQUEADO
                            </span>
                      )}
                      {chapter.isFree && !hasAccess && (
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-bold rounded-full border border-blue-500/30">
                              👁️ VISTA PREVIA
                            </span>
                      )}
                    </div>
                  </div>

                      {/* Icono de acción - MÁS HERMOSO */}
                  {!isLocked && (
                        <div className="w-12 h-12 bg-slate-700/30 group-hover:bg-gradient-to-br group-hover:from-green-400/20 group-hover:to-green-500/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-slate-600/30 group-hover:border-green-400/50">
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

            {/* Botón para mostrar más capítulos - MÁS HERMOSO */}
        {hasMoreChapters && (
              <div className="mt-8 text-center">
            <button
              onClick={() => setShowAllChapters(!showAllChapters)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/60 hover:to-slate-600/60 text-white hover:text-yellow-400 rounded-2xl border border-slate-600/50 hover:border-yellow-400/50 transition-all duration-300 font-bold shadow-lg backdrop-blur-sm"
            >
              {showAllChapters ? (
                <>
                      <ChevronUp className="h-5 w-5" />
                      MOSTRAR MENOS
                </>
              ) : (
                <>
                      <ChevronDown className="h-5 w-5" />
                      VER TODAS LAS CLASES ({course.chapters.length - 5} más)
                </>
              )}
            </button>
          </div>
        )}
          </div>

          {/* Panel lateral - MÁS HERMOSO */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Panel de progreso */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/40 p-8 border border-slate-700/30 backdrop-blur-sm">
                {/* Efectos decorativos */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-green-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Progreso del estudiante - MÁS DESTACADO */}
                  {hasAccess && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">TU PROGRESO</h3>
                        <div className="relative">
                          <span className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            {progressCount}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-800/60 rounded-full h-4 overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{width: `${progressCount}%`}}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-4 text-center border border-slate-700/30">
                          <p className="text-3xl font-bold text-white">{completedChapters}</p>
                          <p className="text-slate-400 text-sm font-medium">Completados</p>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-4 text-center border border-slate-700/30">
                          <p className="text-3xl font-bold text-white">{course.chapters.length - completedChapters}</p>
                          <p className="text-slate-400 text-sm font-medium">Restantes</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botón de acción principal - MÁS HERMOSO */}
                  <div>
                    {hasAccess ? (
                      <Link 
                        href={`/courses/${courseId}/chapters/${course.chapters[0]?.id}`}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
                      >
                        <Play className="h-6 w-6" />
                        {progressCount > 0 ? 'CONTINUAR CURSO' : 'COMENZAR CURSO'}
                      </Link>
                    ) : (
                      <Link 
                        href={`/courses/${courseId}/chapters/${course.chapters[0]?.id}`}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold text-lg rounded-2xl shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 transition-all duration-300 hover:scale-105"
                      >
                        <Play className="h-6 w-6" />
                        {isFreeCoure ? 'ACCEDER GRATIS' : 'VER CONTENIDO'}
                      </Link>
                    )}
                  </div>

                  {/* Información adicional */}
                  {!hasAccess && course.price && course.price > 0 && (
                    <div className="pt-6 border-t border-slate-700/50">
                      <div className="text-center">
                        <p className="text-slate-400 text-sm mb-2 font-medium">Precio del curso</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          ${course.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 