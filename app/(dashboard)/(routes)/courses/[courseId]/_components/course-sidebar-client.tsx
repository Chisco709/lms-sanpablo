"use client";

import { Chapter, Course, UserProgress, Category, Purchase } from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item";
import { Target, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CourseSidebarClientProps {
  course: any;
  progressCount: number;
  purchase: Purchase | null;
  completedChapters: number;
  totalDuration: number;
}

export const CourseSidebarClient: React.FC<CourseSidebarClientProps> = ({
  course,
  progressCount,
  purchase,
  completedChapters,
  totalDuration,
}) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const hasAccess = !!purchase;

  const handleToggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

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
              {completedChapters} de {course.chapters.length} lecciones
            </span>
            <span className="text-green-400 font-semibold">{progressCount}%</span>
          </div>
        </div>
      </div>

      {/* Contenido del curso y temas de pensum */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-semibold text-white">Contenido del curso</h4>
          </div>
          
          {/* Mostrar temas de pensum si existen */}
          {course.pensumTopics && course.pensumTopics.length > 0 ? (
            <div className="space-y-4">
              {course.pensumTopics.map((topic: any) => {
                // Filtrar solo capítulos publicados
                const publishedChapters = topic.chapters?.filter((ch: any) => ch.isPublished) || [];
                
                return publishedChapters.length > 0 ? (
                  <div key={topic.id} className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50">
                    <button
                      className="flex items-center justify-between w-full text-left p-3 hover:bg-slate-800/30 transition-colors"
                      onClick={() => handleToggleTopic(topic.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Target className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {topic.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {publishedChapters.length} {publishedChapters.length === 1 ? 'clase' : 'clases'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-slate-400 transition-transform ${expandedTopic === topic.id ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    
                    {expandedTopic === topic.id && (
                      <div className="border-t border-slate-800/50 bg-slate-900/30">
                        <div className="space-y-1 p-2">
                          {publishedChapters.map((chapter: any, index: number) => (
                            <CourseSidebarItem
                              key={chapter.id}
                              id={chapter.id}
                              label={chapter.title}
                              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                              courseId={course.id}
                              isLocked={!chapter.isFree && !hasAccess}
                              chapterNumber={index + 1}
                              duration={chapter.duration || '5 min'}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            // Fallback a la lista de capítulos si no hay temas de pensum
            <div className="space-y-2">
              {course.chapters?.map((chapter: any, index: number) => (
                <CourseSidebarItem
                  key={chapter.id}
                  id={chapter.id}
                  label={chapter.title}
                  isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                  courseId={course.id}
                  isLocked={!chapter.isFree && !hasAccess}
                  chapterNumber={index + 1}
                  duration={chapter.duration || '5 min'}
                />
              ))}
            </div>
          )}
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