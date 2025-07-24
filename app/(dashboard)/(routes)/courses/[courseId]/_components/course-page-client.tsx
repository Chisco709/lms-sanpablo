"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Menu,
  X,
  Clock
} from "lucide-react";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";

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
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [canGoBack, setCanGoBack] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  
  // Use the course.pensumTopics directly from props
  const pensumTopics = course.pensumTopics || [];
  
  // Variables globales para el render
  const totalTopics = pensumTopics.length;
  const allChapters = pensumTopics.flatMap((topic: any) => topic.chapters || []) || [];
  
  // Log for debugging
  console.log('Course in client component:', course);
  console.log('Pensum Topics in client component:', pensumTopics);
  
  // Analytics hooks
  const { trackLMSEvent, trackCourseInteraction } = useAnalytics();
  usePageTracking();
  useTimeTracking(`Curso: ${course.title}`);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
    // Fetch todos los temas y capítulos (modo profesor)
    (async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/pensum-topics?all=true`);
        const data = await res.json();
        console.log('DEBUG pensumTopics:', data); // Debug: Verifica los datos que llegan
        setPensumTopics(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setExpandedTopics({ [data[0].id]: true });
        }
      } catch (err) {
        console.error('Error al cargar pensumTopics:', err);
      }
    })();
    // Track course view solo en el cliente
    if (mounted && typeof window !== 'undefined') {
      trackLMSEvent.courseView(courseId, course.title);
    }
  }, [courseId, trackLMSEvent, mounted]);

  const handleBackNavigation = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/student');
    }
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const formatUnlockDate = (unlockDate: string | Date | null) => {
    if (!unlockDate) return null;
    
    const date = new Date(unlockDate);
    const now = new Date();
    
    if (date <= now) return null;
    
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isChapterLocked = (chapter: any) => {
    if (hasAccess) return false;
    if (chapter.isFree) return false;
    
    if (chapter.unlockDate) {
      const unlockDate = new Date(chapter.unlockDate);
      const now = new Date();
      return unlockDate > now;
    }
    
    return !hasAccess;
  };

  const getTopicProgress = (topic: any) => {
    const topicChapters = topic.chapters || [];
    const completed = topicChapters.filter((ch: any) => ch.userProgress?.[0]?.isCompleted).length;
    return { completed, total: topicChapters.length };
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Luces de fondo globales mejoradas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-15%] top-[-15%] w-[500px] h-[500px] bg-green-500/30 rounded-full blur-[120px] opacity-70" />
        <div className="absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-green-400/20 rounded-full blur-[100px] opacity-60" />
        <div className="absolute right-[10%] top-[10%] w-[250px] h-[250px] bg-yellow-300/10 rounded-full blur-[80px] opacity-50" />
        <div className="absolute left-[30%] bottom-[5%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px] opacity-30" />
      </div>
      {/* Header del curso - MÓVIL OPTIMIZADO */}
      <div className="relative overflow-hidden bg-black/90 border-b-2 sm:border-b-4 border-green-400/20 p-3 sm:p-8 lg:p-12">
        {/* Imagen de fondo de graduación */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('/logo-sanpablo.jpg')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-black/0 to-black/0"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 lg:gap-8">
            {/* Información del curso */}
            <div className="flex-1 space-y-2 lg:space-y-4 min-w-0">
              <Link
                href="/student"
                className="inline-flex items-center gap-2 text-green-400 hover:text-yellow-400 text-sm lg:text-base transition-colors active:scale-95 touch-manipulation"
              >
                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                <span>Volver al Dashboard</span>
              </Link>
              <div className="space-y-1 lg:space-y-2">
                <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-white line-clamp-2 leading-tight">
                  {course.title}
                </h1>
                {course.category && (
                  <p className="text-green-400 text-xs sm:text-sm lg:text-base">
                    {course.category.name} • Instituto San Pablo
                  </p>
                )}
                {/* Stats móviles compactas */}
                <div className="lg:hidden flex items-center gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{totalTopics}</div>
                    <div className="text-green-400 text-xs">Temas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{allChapters.length}</div>
                    <div className="text-green-400 text-xs">Clases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{completedChapters}</div>
                    <div className="text-yellow-400 text-xs">Hechas</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Botón móvil del menú - MEJORADO */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2.5 bg-black/60 hover:bg-green-400/10 rounded-xl border border-green-400/30 transition-all duration-300 active:scale-95 touch-manipulation flex-shrink-0"
              aria-label="Abrir menú del curso"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
            {/* Estadísticas del curso - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalTopics}</div>
                <div className="text-green-400 text-sm">Temas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{allChapters.length}</div>
                <div className="text-green-400 text-sm">Clases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{completedChapters}</div>
                <div className="text-yellow-400 text-sm">Completadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MENÚ MÓVIL DESLIZABLE - OPTIMIZADO */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-black/95 backdrop-blur-xl border-l-2 border-green-400/20 p-4">
            <div className="space-y-4">
              {/* Botón cerrar */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">Menú</h3>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <Link 
                href="/student"
                className="flex items-center gap-3 px-3 py-2.5 text-green-400 hover:text-yellow-400 bg-black/60 hover:bg-green-400/10 rounded-lg transition-all duration-300 border border-green-400/30 active:scale-95 touch-manipulation"
                onClick={() => setShowMobileMenu(false)}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Ir al Inicio</span>
              </Link>
              
              <div className="pt-3 border-t border-green-400/20">
                <h4 className="text-white font-bold text-base mb-3">Progreso del Curso</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm bg-slate-800/30 rounded-lg p-2">
                    <span className="text-green-400">Temas:</span>
                    <span className="text-white font-semibold">{totalTopics}</span>
                  </div>
                  <div className="flex justify-between text-sm bg-slate-800/30 rounded-lg p-2">
                    <span className="text-green-400">Clases:</span>
                    <span className="text-white font-semibold">{allChapters.length}</span>
                  </div>
                  <div className="flex justify-between text-sm bg-slate-800/30 rounded-lg p-2">
                    <span className="text-yellow-400">Completadas:</span>
                    <span className="text-yellow-400 font-semibold">{completedChapters}</span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progreso total</span>
                      <span>{Math.round((completedChapters / allChapters.length) * 100) || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(completedChapters / allChapters.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Contenido principal - OPTIMIZADO PARA MÓVIL */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* CONTENIDO ORGANIZADO POR TEMAS DEL PENSUM - MÓVIL FIRST */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-6">
            {/* Título responsive */}
            <div className="text-center px-2 sm:px-0">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-yellow-400 to-white bg-clip-text text-transparent mb-2 sm:mb-4 leading-tight">
                CONTENIDO DEL CURSO
              </h2>
              <p className="text-green-400 text-sm sm:text-lg">
                {totalTopics} {totalTopics === 1 ? 'tema' : 'temas'} • {allChapters.length} {allChapters.length === 1 ? 'clase' : 'clases'}
              </p>
            </div>
            {/* TEMAS DEL PENSUM ORGANIZADOS - MÓVIL OPTIMIZADO */}
            <div className="space-y-3 sm:space-y-6">
              {/* DEBUG: Mostrar datos en consola para verificar */}
              {process.env.NODE_ENV !== 'production' && (
                <pre className="bg-black/80 text-green-400 text-xs p-2 rounded mb-2 overflow-x-auto">
                  {JSON.stringify(pensumTopics, null, 2)}
                </pre>
              )}
              {/* CORREGIDO: Solo muestra mensaje si realmente está vacío o no es array */}
              {(Array.isArray(pensumTopics) && pensumTopics.length === 0) && (
                <div className="text-center text-slate-400 py-8">
                  No hay temas ni capítulos creados en el pensum.
                </div>
              )}
              {(Array.isArray(pensumTopics) && pensumTopics.length > 0) && pensumTopics.map((topic: any, topicIndex: number) => {
                const isExpanded = expandedTopics[topic.id];
                const topicProgress = getTopicProgress(topic);
                const isTopicCompleted = topicProgress.completed === topicProgress.total && topicProgress.total > 0;

                return (
                  <div key={topic.id} className="space-y-2 sm:space-y-4">
                    {/* HEADER DEL TEMA - MODO PROFESOR */}
                    <button
                      type="button"
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full group cursor-pointer bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 hover:from-yellow-500/20 hover:via-yellow-400/10 hover:to-yellow-500/20 border border-yellow-500/30 hover:border-yellow-400/50 rounded-lg sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 active:scale-[0.98] touch-manipulation text-left"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0 ${
                            isTopicCompleted
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                              : 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black'
                          }`}>
                            {isTopicCompleted ? <CheckCircle size={16} className="sm:w-6 sm:h-6" /> : (topicIndex + 1)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                              📚 {topic.title}
                            </h3>
                            <p className="text-slate-400 mt-0.5 sm:mt-1 text-xs sm:text-base">
                              {topicProgress.completed}/{topicProgress.total} clases
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                          {isTopicCompleted && (
                            <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-green-500/20 text-green-400 font-bold rounded-full text-xs">
                              ✅
                            </span>
                          )}
                          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} p-1`}>
                            <ChevronDown className="h-4 w-4 sm:h-6 sm:w-6 text-slate-400 group-hover:text-yellow-400" />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* CAPÍTULOS DEL TEMA - SOLO SI HAY */}
                    {isExpanded && (
                      <div className="space-y-2 ml-1 sm:ml-4 pl-3 sm:pl-8 border-l-2 border-yellow-400/30">
                        {(Array.isArray(topic.chapters) && topic.chapters.length === 0) && (
                          <div className="text-slate-400 py-2">No hay capítulos en este tema.</div>
                        )}
                        {(Array.isArray(topic.chapters) && topic.chapters.length > 0) && topic.chapters.map((chapter: any, chapterIndex: number) => {
                          const isLocked = isChapterLocked(chapter);
                          const isCompleted = chapter.userProgress?.[0]?.isCompleted;
                          
                          return (
                            <div key={chapter.id}>
                              <Link 
                                href={isLocked ? '#' : `/courses/${courseId}/chapters/${chapter.id}`}
                                onClick={(e) => {
                                  if (isLocked) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <div className={`p-3 sm:p-4 ${isLocked ? 'bg-slate-800/20' : 'bg-slate-800/40 hover:bg-slate-700/60 cursor-pointer'} border ${isCompleted ? 'border-green-500/30' : 'border-slate-700/50'} rounded-lg sm:rounded-xl transition-colors`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                                      {isCompleted ? (
                                        <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-green-400" />
                                      ) : (
                                        <BookOpen className="h-3 w-3 sm:h-5 sm:w-5 text-green-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h4 className={`font-medium text-sm sm:text-base line-clamp-2 leading-tight ${isLocked ? 'text-slate-500' : 'text-slate-300'}`}>
                                          {chapter.title}
                                        </h4>
                                        {isLocked && (
                                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                                        )}
                                      </div>
                                      {!isLocked && chapter.description && (
                                        <p className="text-slate-400 text-xs mt-1 line-clamp-1">
                                          {chapter.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR - OCULTO EN MÓVIL, MOSTRADO EN DESKTOP */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {/* Información del curso */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                <h3 className="text-white font-bold text-xl mb-4">Información del Curso</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Progreso:</span>
                    <span className="text-white font-semibold">{Math.round((completedChapters / allChapters.length) * 100) || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completadas:</span>
                    <span className="text-green-400 font-semibold">{completedChapters}/{allChapters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Acceso:</span>
                    <span className={hasAccess ? "text-green-400" : "text-yellow-400"}>
                      {hasAccess ? "✅ Total" : "⭐ Limitado"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progreso visual */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                <h3 className="text-white font-bold text-lg mb-4">Tu Progreso</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(completedChapters / allChapters.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-slate-400 text-sm mt-2">
                      {Math.round((completedChapters / allChapters.length) * 100) || 0}% completado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};