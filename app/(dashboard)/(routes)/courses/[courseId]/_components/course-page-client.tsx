"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  Lock, 
  Play, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Trophy, 
  Target, 
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  Home
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
  const router = useRouter();
  
  // Mostrar solo los primeros 5 capítulos inicialmente
  const visibleChapters = showAllChapters ? course.chapters : course.chapters.slice(0, 5);
  const hasMoreChapters = course.chapters.length > 5;

  useEffect(() => {
    // Verificar si hay historial de navegación
    setCanGoBack(window.history.length > 1);
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
    <div className="min-h-screen bg-slate-950">
      {/* Header con navegación inteligente */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>{canGoBack ? 'Volver' : 'Dashboard'}</span>
              </button>
              <div className="h-4 w-px bg-slate-700"></div>
              <span className="text-slate-500 text-sm">Curso</span>
            </div>
            
            {/* Botón directo al dashboard */}
            <Link 
              href="/student"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section Minimalista */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categoría */}
            {course.category?.name && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
                  {course.category.name}
                </span>
              </div>
            )}

            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              {course.title}
            </h1>

            {/* Descripción */}
            {course.description && (
              <div className="prose prose-slate prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-base">
                  {course.description}
                </p>
              </div>
            )}

            {/* Estadísticas reales */}
            <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{course.chapters.length} {course.chapters.length === 1 ? 'capítulo' : 'capítulos'}</span>
              </div>
              {course.price && course.price > 0 ? (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Curso premium</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Acceso gratuito</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Programa técnico</span>
              </div>
            </div>
          </div>

          {/* Panel de progreso y acción */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 space-y-6 sticky top-6">
              {/* Progreso del estudiante */}
              {hasAccess && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Tu progreso</h3>
                    <span className="text-green-400 font-bold">{progressCount}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{width: `${progressCount}%`}}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <p className="text-lg font-bold text-white">{completedChapters}</p>
                      <p className="text-slate-400">Completados</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{course.chapters.length - completedChapters}</p>
                      <p className="text-slate-400">Restantes</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de acción principal */}
              <div className="pt-2">
                {hasAccess ? (
                  <Link 
                    href={`/courses/${courseId}/chapters/${course.chapters[0]?.id}`}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                  >
                    <Play className="h-4 w-4" />
                    {progressCount > 0 ? 'Continuar curso' : 'Comenzar curso'}
                  </Link>
                ) : (
                  <Link 
                    href={`/courses/${courseId}/chapters/${course.chapters[0]?.id}`}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    <Zap className="h-4 w-4" />
                    {isFreeCoure ? 'Acceder gratis' : 'Ver contenido'}
                  </Link>
                )}
              </div>

              {/* Información adicional */}
              {!hasAccess && course.price && course.price > 0 && (
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-2">Precio del curso</p>
                    <p className="text-2xl font-bold text-white">${course.price.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de capítulos */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Contenido del curso</h2>
          <span className="text-slate-400 text-sm">
            {course.chapters.length} {course.chapters.length === 1 ? 'capítulo' : 'capítulos'}
          </span>
        </div>
        
        <div className="space-y-2">
          {visibleChapters.map((chapter: any, index: number) => {
            const isCompleted = !!chapter.userProgress?.[0]?.isCompleted;
            const isLocked = isChapterLocked(chapter);
            const unlockDateFormatted = formatUnlockDate(chapter.unlockDate);
            
            return (
              <div
                key={chapter.id}
                className="group bg-slate-800/20 hover:bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 overflow-hidden transition-all duration-200"
              >
                <Link 
                  href={isLocked ? '#' : `/courses/${courseId}/chapters/${chapter.id}`}
                  className={`flex items-center gap-4 p-4 ${
                    isLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-800/20 transition-all duration-200'
                  }`}
                >
                  {/* Número/Estado */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    isLocked 
                      ? 'bg-slate-700/40 text-slate-500' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/50'
                  }`}>
                    {isLocked ? (
                      <Lock size={14} />
                    ) : isCompleted ? (
                      <CheckCircle size={14} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium mb-1 ${
                      isLocked ? 'text-slate-500' : 'text-white'
                    }`}>
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Capítulo {index + 1}</span>
                      {isCompleted && (
                        <span className="text-green-400 font-medium">Completado</span>
                      )}
                      {isLocked && unlockDateFormatted && (
                        <span className="text-yellow-400 font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Se desbloquea: {unlockDateFormatted}
                        </span>
                      )}
                      {isLocked && !unlockDateFormatted && (
                        <span className="text-yellow-400 font-medium">Bloqueado</span>
                      )}
                      {chapter.isFree && !hasAccess && (
                        <span className="text-blue-400 font-medium">Vista previa</span>
                      )}
                    </div>
                  </div>

                  {/* Icono de acción */}
                  {!isLocked && (
                    <div className="w-8 h-8 bg-slate-700/30 group-hover:bg-green-400/20 rounded-lg flex items-center justify-center transition-all duration-200">
                      <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-green-400 transition-colors" />
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Botón para mostrar más capítulos */}
        {hasMoreChapters && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllChapters(!showAllChapters)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
            >
              {showAllChapters ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Ver todos los capítulos ({course.chapters.length - 5} más)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 