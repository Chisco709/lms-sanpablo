"use client";

import { Chapter, Course, UserProgress, Category } from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarClientProps {
  course: Course & {
    category: Category | null;
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
  hasAccess: boolean;
  isFreeCoure: boolean;
}

export const CourseSidebarClient = ({
  course,
  progressCount,
  hasAccess,
  isFreeCoure,
}: CourseSidebarClientProps) => {
  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Header del sidebar - Más espacioso */}
      <div className="p-6 border-b border-slate-800/30">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-200">Progreso del curso</h2>
            <p className="text-sm text-slate-500 mt-1">{progressCount}% completado</p>
          </div>
        </div>

        {/* Progress Bar - Más prominente */}
        <div className="space-y-3">
          <div className="w-full bg-slate-800/40 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressCount}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              {course.chapters.filter(ch => ch.userProgress?.[0]?.isCompleted).length} de {course.chapters.length} lecciones
            </span>
            <span className="text-green-400 font-semibold">{progressCount}%</span>
          </div>
        </div>
      </div>

      {/* Lista de capítulos - Mejor espaciado */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-300 mb-2">
              {course.category?.name || 'Fundamentos de Programación'}
            </h3>
            <p className="text-sm text-slate-500">
              {course.chapters.length} lecciones • {Math.round(course.chapters.length * 5)} min total
            </p>
          </div>
          
          <div className="space-y-2">
            {course.chapters.map((chapter, index) => (
              <CourseSidebarItem
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !hasAccess}
                chapterNumber={index + 1}
                duration="5 min"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer con información adicional */}
      <div className="p-6 border-t border-slate-800/30 bg-slate-900/30">
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500">
            © 2024 San Pablo Academy
          </p>
          <p className="text-xs text-slate-600">
            Educación de calidad
          </p>
        </div>
      </div>
    </div>
  )
} 