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
import { CourseContentDropdown } from "@/components/course-content-dropdown";

interface PensumTopic {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  userProgress: Array<{ isCompleted: boolean }>;
}

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
  
  // Use the course.pensumTopics with proper typing
  const [pensumTopics, setPensumTopics] = useState<PensumTopic[]>(course.pensumTopics || []);
  
  // Variables globales para el render
  const totalTopics = pensumTopics.length;
  const allChapters = pensumTopics.flatMap((topic: PensumTopic) => topic.chapters || []) || [];
  
  // Log for debugging
  console.log('Course in client component:', course);
  console.log('Pensum Topics in client component:', pensumTopics);
  
  // Analytics hooks
  const { trackLMSEvent } = useAnalytics();
  usePageTracking();
  useTimeTracking(`Curso: ${course.title}`);
  
  // Track course view when component mounts
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      trackLMSEvent.courseView(courseId, course.title);
    }
  }, [courseId, course.title, mounted, trackLMSEvent]);
  
  // Initialize component state
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
    
    // Fetch all topics and chapters (teacher mode)
    const fetchPensumTopics = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/pensum-topics?all=true`);
        const data = await res.json();
        console.log('DEBUG pensumTopics:', data);
        
        if (Array.isArray(data)) {
          setPensumTopics(data);
          if (data.length > 0) {
            setExpandedTopics(prev => ({
              ...prev,
              [data[0].id]: true
            }));
          }
        } else {
          setPensumTopics([]);
        }
      } catch (err) {
        console.error('Error al cargar pensumTopics:', err);
        setPensumTopics([]);
      }
    };
    
    fetchPensumTopics();
  }, [courseId]);

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
            {/* Course Stats Section - Moved to top right */}
            <div className="hidden lg:flex items-center gap-6 bg-black/50 p-4 rounded-xl">
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
      {/* Main Content - Centered and Simplified */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full">
        {/* Main Content Dropdown - Centered and Prominent */}
        <div className="w-full">
          <CourseContentDropdown 
            topics={pensumTopics.map((topic: PensumTopic) => ({
              ...topic,
              chapters: topic.chapters || []
            }))} 
            courseId={courseId}
            hasAccess={hasAccess}
          />
        </div>
      </div>
    </div>
  );
};