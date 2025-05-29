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
  Clock,
  Menu,
  X
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
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [canGoBack, setCanGoBack] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  
  // Obtener todos los capítulos de todos los temas
  const allChapters = course.pensumTopics?.flatMap((topic: any) => topic.chapters) || [];
  const totalTopics = course.pensumTopics?.length || 0;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
    // Expandir el primer tema por defecto
    if (course.pensumTopics?.length > 0) {
      setExpandedTopics({ [course.pensumTopics[0].id]: true });
    }
  }, [course.pensumTopics]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header MÓVIL MEJORADO */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Lado izquierdo - MÓVIL OPTIMIZADO */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group border border-slate-700/30"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm sm:text-base hidden xs:inline">{canGoBack ? 'Volver' : 'Mis Cursos'}</span>
              </button>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent hidden sm:block"></div>
              <span className="text-slate-400 text-xs sm:text-sm font-medium hidden sm:inline">Curso</span>
            </div>
            
            {/* Lado derecho - MÓVIL OPTIMIZADO */}
            <div className="flex items-center gap-2">
              {/* Botón móvil de menú */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-700/30"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              {/* Botón inicio - Desktop */}
              <Link 
                href="/student"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-700/30"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Inicio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESLIZABLE */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 p-6">
            <div className="space-y-4">
              <Link 
                href="/student"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-700/30 text-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                <Home className="h-6 w-6" />
                <span className="font-medium">Ir al Inicio</span>
              </Link>
              
              <div className="pt-4 border-t border-slate-700/50">
                <h3 className="text-white font-bold text-lg mb-4">Progreso del Curso</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Temas:</span>
                    <span className="text-white font-semibold">{totalTopics}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Clases:</span>
                    <span className="text-white font-semibold">{allChapters.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Completadas:</span>
                    <span className="text-green-400 font-semibold">{completedChapters}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal - OPTIMIZADO PARA MÓVIL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* CONTENIDO ORGANIZADO POR TEMAS DEL PENSUM - MÓVIL FIRST */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Título responsive */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2 sm:mb-4">
                CONTENIDO DEL CURSO
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                {totalTopics} {totalTopics === 1 ? 'tema' : 'temas'} • {allChapters.length} {allChapters.length === 1 ? 'clase' : 'clases'}
              </p>
            </div>

            {/* TEMAS DEL PENSUM ORGANIZADOS - MÓVIL OPTIMIZADO */}
            <div className="space-y-4 sm:space-y-6">
              {course.pensumTopics?.map((topic: any, topicIndex: number) => {
                const isExpanded = expandedTopics[topic.id];
                const topicProgress = getTopicProgress(topic);
                const isTopicCompleted = topicProgress.completed === topicProgress.total && topicProgress.total > 0;

                return (
                  <div key={topic.id} className="space-y-3 sm:space-y-4">
                    {/* HEADER DEL TEMA - MÓVIL OPTIMIZADO */}
                    <div 
                      onClick={() => toggleTopic(topic.id)}
                      className="group cursor-pointer bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 hover:from-yellow-500/20 hover:via-yellow-400/10 hover:to-yellow-500/20 border border-yellow-500/30 hover:border-yellow-400/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 ${
                            isTopicCompleted
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                              : 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black'
                          }`}>
                            {isTopicCompleted ? <CheckCircle size={20} className="sm:w-6 sm:h-6" /> : (topicIndex + 1)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors truncate pr-2">
                              📚 {topic.title}
                            </h3>
                            <p className="text-slate-400 mt-1 text-sm sm:text-base">
                              {topicProgress.completed}/{topicProgress.total} clases completadas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {isTopicCompleted && (
                            <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 font-bold rounded-full text-xs sm:text-sm">
                              ✅ <span className="hidden sm:inline">TEMA COMPLETADO</span>
                            </span>
                          )}
                          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-yellow-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CAPÍTULOS DEL TEMA - MÓVIL OPTIMIZADO */}
                    {isExpanded && (
                      <div className="space-y-2 sm:space-y-3 ml-2 sm:ml-4 pl-4 sm:pl-8 border-l-2 border-yellow-400/30">
                        {topic.chapters.map((chapter: any, chapterIndex: number) => {
                          const isCompleted = !!chapter.userProgress?.[0]?.isCompleted;
                          const isLocked = isChapterLocked(chapter);
                          const unlockDate = formatUnlockDate(chapter.unlockDate);

                          return (
                            <div key={chapter.id}>
                              {isLocked ? (
                                <div className="p-3 sm:p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-slate-300 font-medium text-sm sm:text-base line-clamp-2">
                                        {chapter.title}
                                      </h4>
                                      {unlockDate && (
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                                          Disponible: {unlockDate}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={`/courses/${courseId}/chapters/${chapter.id}`}
                                  className={`block p-3 sm:p-4 rounded-xl transition-all duration-200 border hover:scale-[1.02] ${
                                    isCompleted
                                      ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-400/50'
                                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                      isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                    }`}>
                                      {isCompleted ? (
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                      ) : (
                                        <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h4 className={`font-semibold text-sm sm:text-base line-clamp-2 ${
                                        isCompleted ? 'text-green-400' : 'text-white'
                                      }`}>
                                        Clase {chapterIndex + 1}: {chapter.title}
                                      </h4>
                                      
                                      <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                                        {chapter.isFree && (
                                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                            GRATIS
                                          </span>
                                        )}
                                        {isCompleted && (
                                          <span className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">Completada</span>
                                          </span>
                                        )}
                                        <div className="text-slate-400 text-xs sm:text-sm flex items-center gap-1">
                                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="hidden sm:inline">~10 min</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                                  </div>
                                </Link>
                              )}
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