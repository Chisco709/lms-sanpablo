"use client";

import { useState, useCallback, useMemo } from "react";
import { 
  Menu, 
  X, 
  BookOpen, 
  CheckCircle,
  Lock,
  Play,
  FileText,
  ExternalLink,
  Download
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CourseResources, useCourseResources } from "./course-resources";
import { User } from "@clerk/nextjs/server";
import { Progress } from "@/components/ui/progress";
import { CourseSidebar } from "./course-sidebar";
import { CourseNavbar } from "./course-navbar";

// Types
interface Chapter {
  id: string;
  title: string;
  userProgress?: Array<{ isCompleted: boolean }>;
  isFree: boolean;
}

interface Course {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface CourseLayoutClientProps {
  course: Course;
  progressCount: number;
  completedChapters: number;
  hasAccess: boolean;
  courseId: string;
  children: React.ReactNode;
}

// Base Components siguiendo el patrón ReactBits
const BaseButton = ({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "minimal";
  size?: "default" | "sm" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50",
    ghost: "hover:bg-slate-800/30 text-slate-400 hover:text-slate-300",
    minimal: "hover:bg-slate-800/20 text-slate-400 hover:text-slate-300"
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-8"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

const ProgressBar = ({ 
  value, 
  className,
  size = "default" 
}: { 
  value: number; 
  className?: string;
  size?: "sm" | "default";
}) => {
  const heights = {
    sm: "h-1.5",
    default: "h-2"
  };

  return (
    <div className={cn("w-full bg-slate-800/40 rounded-full overflow-hidden", heights[size], className)}>
      <div 
        className="bg-green-400 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

const ChapterItem = ({ 
  chapter, 
  index, 
  courseId, 
  isActive, 
  isLocked, 
  onNavigate 
}: {
  chapter: Chapter;
  index: number;
  courseId: string;
  isActive: boolean;
  isLocked: boolean;
  onNavigate: () => void;
}) => {
  const isCompleted = !!chapter.userProgress?.[0]?.isCompleted;
  
  const getStatusIcon = () => {
    if (isLocked) return <Lock size={12} />;
    if (isCompleted) return <CheckCircle size={12} />;
    if (isActive) return <Play size={12} />;
    return <span className="text-xs font-medium">{index + 1}</span>;
  };

  const getStatusStyles = () => {
    if (isLocked) return "bg-slate-700/30 text-slate-500";
    if (isCompleted) return "bg-green-400/20 text-green-400";
    if (isActive) return "bg-green-400/20 text-green-400";
    return "bg-slate-700/30 text-slate-400";
  };

  const getItemStyles = () => {
    if (isActive) return "bg-green-400/10 text-green-400";
    if (isLocked) return "opacity-50 cursor-not-allowed text-slate-500";
    return "hover:bg-slate-800/30 text-slate-300";
  };

  return (
    <Link
      href={isLocked ? '#' : `/courses/${courseId}/chapters/${chapter.id}`}
      onClick={!isLocked ? onNavigate : undefined}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-md transition-colors",
        getItemStyles()
      )}
    >
      <div className={cn(
        "w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium",
        getStatusStyles()
      )}>
        {getStatusIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">
          {chapter.title}
        </h4>
        <div className="text-xs text-slate-500">
          Semana {index + 1} • 5 min
        </div>
      </div>

      {/* Indicadores de recursos adicionales */}
      <div className="flex items-center gap-1">
        {/* Indicador de PDF disponible */}
        <div className="w-4 h-4 rounded-sm bg-red-400/20 flex items-center justify-center">
          <FileText className="w-2.5 h-2.5 text-red-400" />
        </div>
        {/* Indicador de formulario Google disponible */}
        <div className="w-4 h-4 rounded-sm bg-blue-400/20 flex items-center justify-center">
          <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
        </div>
      </div>
    </Link>
  );
};

export const CourseLayoutClient = ({
  children,
  course,
  progressCount,
  completedChapters,
  hasAccess,
  courseId
}: CourseLayoutClientProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Obtener recursos del curso
  const courseResources = useCourseResources(course.id);

  // Callbacks
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleChapterNavigation = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="h-screen bg-slate-950 overflow-hidden">
      {/* Navbar minimalista profesional */}
      <header className="h-14 w-full border-b border-slate-800/20 bg-slate-950 relative z-40">
        <div className="flex items-center justify-between h-full px-4">
          <BaseButton
            variant="minimal"
            size="sm"
            onClick={handleSidebarToggle}
            className="gap-2"
          >
            <Menu className="h-4 w-4" />
            <span className="text-sm">Contenido</span>
          </BaseButton>

          {/* Progreso compacto */}
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="hidden sm:inline text-xs">
              {completedChapters}/{course.chapters.length}
            </span>
            <ProgressBar 
              value={progressCount} 
              size="sm"
              className="w-16"
            />
            <span className="text-green-400 text-xs font-medium">
              {progressCount}%
            </span>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleSidebarClose}
        />
      )}

      {/* Sidebar profesional */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-slate-900/98 backdrop-blur-xl border-r border-slate-800/30 transform transition-transform duration-300 ease-in-out z-50",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-400 rounded-md flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-slate-900" />
            </div>
            <h3 className="text-white font-medium text-sm">Clases</h3>
          </div>
          
          <BaseButton
            variant="ghost"
            size="sm"
            onClick={handleSidebarClose}
            className="p-1.5 h-auto"
            title="Cerrar sidebar"
          >
            <X className="h-4 w-4" />
          </BaseButton>
        </div>

        {/* Progreso */}
        <div className="p-4 border-b border-slate-800/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">Progreso del programa</span>
            <span className="text-green-400 font-medium text-xs">{progressCount}%</span>
          </div>
          <ProgressBar value={progressCount} size="sm" />
        </div>

        {/* Lista de clases */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {course.chapters.map((chapter, index) => {
              const isActive = pathname?.includes(chapter.id);
              const isLocked = !hasAccess && !chapter.isFree;
              
              return (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  index={index}
                  courseId={course.id}
                  isActive={isActive}
                  isLocked={isLocked}
                  onNavigate={handleChapterNavigation}
                />
              );
            })}
          </div>
        </div>

        {/* Footer condicional */}
        {progressCount === 100 && (
          <div className="p-3 border-t border-slate-800/20">
            <div className="bg-green-400/10 rounded-md p-2 text-center">
              <span className="text-green-400 text-xs font-medium">
                ✓ Programa completado
              </span>
            </div>
          </div>
        )}

        {/* Sección de recursos profesional */}
        <div className="p-3 border-t border-slate-800/20">
          <CourseResources resources={courseResources} />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}; 