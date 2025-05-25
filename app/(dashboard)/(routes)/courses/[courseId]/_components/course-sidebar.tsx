import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { BookOpen, Trophy, Target, Clock } from "lucide-react";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  });

  const completedChapters = course.chapters.filter(chapter => 
    chapter.userProgress && chapter.userProgress.length > 0 && 
    chapter.userProgress[0]?.isCompleted
  ).length;

  const totalDuration = course.chapters.length * 5; // 5 min por capítulo

  return (
    <div className="h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/50 flex flex-col shadow-2xl">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        {/* Logo y Progreso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm leading-tight">
              Progreso del curso
            </h3>
            <p className="text-slate-400 text-xs">
              {completedChapters} de {course.chapters.length} completadas
            </p>
          </div>
        </div>

        {/* Barra de Progreso Mejorada */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Completado</span>
            <span className="text-green-400 font-bold">{progressCount}%</span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-slate-800/60 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-green-500/25 relative"
                style={{ width: `${progressCount}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats del Curso */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <BookOpen className="h-4 w-4 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Lecciones</p>
              <p className="text-sm font-bold text-white">{course.chapters.length}</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <Clock className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Duración</p>
              <p className="text-sm font-bold text-white">{totalDuration}m</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <Trophy className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Progreso</p>
              <p className="text-sm font-bold text-white">{progressCount}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Capítulos */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-semibold text-white">Contenido del curso</h4>
          </div>
          
          <div className="space-y-2">
            {course.chapters.map((chapter, index) => (
              <CourseSidebarItem
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase}
                chapterNumber={index + 1}
                duration="5 min"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="bg-gradient-to-r from-green-400/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div>
              <h5 className="text-green-400 font-semibold text-sm">¡Sigue así!</h5>
              <p className="text-green-300/80 text-xs">
                {progressCount === 100 
                  ? '¡Curso completado!' 
                  : `Te faltan ${course.chapters.length - completedChapters} lecciones`
                }
              </p>
            </div>
          </div>
          
          {progressCount === 100 && (
            <div className="mt-3 p-2 bg-green-400/20 rounded-lg border border-green-400/30">
              <p className="text-green-300 text-xs text-center font-medium">
                🎉 ¡Felicitaciones! Has completado el curso
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 