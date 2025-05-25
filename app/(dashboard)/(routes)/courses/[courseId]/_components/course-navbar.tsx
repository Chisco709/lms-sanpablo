"use client";

import { Chapter, Course, UserProgress, Category } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Clock, Users, Star, Play, ChevronLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface CourseNavbarProps {
  course: Course & {
    category: Category | null;
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  currentChapterNumber?: number;
  hasAccess: boolean;
  isFreeCoure: boolean;
}

export const CourseNavbar = ({
  course,
  progressCount,
  currentChapterNumber = 1,
  hasAccess,
  isFreeCoure,
}: CourseNavbarProps) => {
  // Calcular capítulos completados
  const completedChapters = course.chapters.filter(chapter => 
    chapter.userProgress && chapter.userProgress.length > 0 && 
    chapter.userProgress[0]?.isCompleted
  ).length;

  return (
    <div className="h-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50 backdrop-blur-xl">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/30">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <CourseMobileSidebar
              course={course}
              progressCount={progressCount}
              hasAccess={hasAccess}
              isFreeCoure={isFreeCoure}
            />
          </div>

          {/* Dashboard Menu */}
          <DashboardSidebar />

          {/* Back Button */}
          <Link 
            href="/student"
            className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-700/50 group"
          >
            <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-sm text-slate-400 group-hover:text-white transition-colors hidden md:block">
              Volver
            </span>
          </Link>

          {/* Course Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="hidden md:block">
              <h2 className="text-green-400 font-bold text-sm leading-tight">
                {course.category?.name || 'Carreras Técnicas'}
              </h2>
              <p className="text-slate-400 text-xs">
                Fundamentos y Creación de Proyectos
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Badge */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Progreso</span>
            </div>
            <span className="text-green-400 font-bold text-sm">{progressCount}%</span>
          </div>

          {/* User Menu */}
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-slate-600 hover:border-green-400 transition-all duration-300 shadow-lg",
                userButtonPopoverCard: "bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-2xl",
                userButtonPopoverActionButton: "text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
              }
            }}
          />
        </div>
      </div>

      {/* Course Information Bar */}
      <div className="px-6 py-4">
        {/* Course Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-400/10 rounded-full border border-green-400/20">
              <Play className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">
                Clase {currentChapterNumber} de {course.chapters.length}
              </span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Curso {isFreeCoure ? 'Gratuito' : 'Premium'}
            </span>
          </div>
          
          {/* Course Stats */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{course.chapters.length * 5} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.chapters.length} clases</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span>4.8</span>
            </div>
            <span className="text-green-400">
              {completedChapters}/{course.chapters.length} completadas
            </span>
          </div>
        </div>

        {/* Course Title */}
        <h1 className="text-xl font-bold text-white mb-4 leading-tight">
          {course.title}
        </h1>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-slate-800/40 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-green-500/25 relative"
                style={{ width: `${progressCount}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="absolute -top-1 right-0 text-xs text-slate-400">
              {progressCount}%
            </div>
          </div>

          {/* Course Path */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">
              Fundamentos de {course.category?.name || 'Carreras Técnicas'}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-medium">{course.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 