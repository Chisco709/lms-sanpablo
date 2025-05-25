"use client";

import { useState } from "react";
import Link from "next/link";
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
  ChevronUp
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
  const [showProgress, setShowProgress] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section Simplificado */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Información principal del curso */}
            <div className="lg:col-span-2 space-y-6">
              {/* Categoría */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm font-medium border border-green-400/20">
                  {course.category?.name || 'Programa Técnico'}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                {course.title}
              </h1>

              {/* Descripción */}
              {course.description && (
                <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                  {course.description}
                </p>
              )}

              {/* Stats básicas */}
              <div className="flex flex-wrap gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.chapters.length * 5} minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.chapters.length} clases semanales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Programa de 18 meses</span>
                </div>
              </div>
            </div>

            {/* Panel lateral simplificado */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 space-y-6">
                {/* Botón para mostrar/ocultar progreso */}
                <button
                  onClick={() => setShowProgress(!showProgress)}
                  className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Ver mi progreso</span>
                  </div>
                  {showProgress ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {/* Panel de progreso (condicional) */}
                {showProgress && (
                  <div className="space-y-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Tu Progreso</h3>
                        <p className="text-sm text-slate-400">Programa técnico</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{progressCount}%</div>
                      <p className="text-slate-400 text-sm">Completado</p>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-slate-800/60 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{width: `${progressCount}%`}}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-xl font-bold text-white">{completedChapters}</p>
                        <p className="text-xs text-slate-400">Completadas</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">{course.chapters.length - completedChapters}</p>
                        <p className="text-xs text-slate-400">Restantes</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón de acción principal */}
                <div className="pt-4">
                  {hasAccess ? (
                    <Link 
                      href={`/courses/${courseId}/chapters/${course.chapters[0]?.id}`}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
                    >
                      <Zap className="h-5 w-5" />
                      {progressCount > 0 ? 'Continuar programa' : 'Comenzar programa'}
                    </Link>
                  ) : (
                    <Link 
                      href={`/courses/${courseId}/chapters/${course.chapters[0]?.id}`}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
                    >
                      🚀 {isFreeCoure ? 'Acceder gratis' : `Inscribirse`}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clases simplificada */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Target className="h-6 w-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Clases del programa</h2>
          <div className="flex-1 h-px bg-slate-700/50"></div>
        </div>
        
        <div className="space-y-3">
          {course.chapters.map((chapter: any, index: number) => {
            const isCompleted = !!chapter.userProgress?.[0]?.isCompleted;
            const isLocked = !hasAccess && !chapter.isFree;
            
            return (
              <div
                key={chapter.id}
                className="group bg-slate-800/20 hover:bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 overflow-hidden transition-all duration-300"
              >
                <Link 
                  href={isLocked ? '#' : `/courses/${courseId}/chapters/${chapter.id}`}
                  className={`flex items-center gap-4 p-6 ${
                    isLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-800/20 transition-all duration-300'
                  }`}
                >
                  {/* Indicador de estado */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isLocked 
                      ? 'bg-slate-700/40 text-slate-500' 
                      : isCompleted 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
                        : 'bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/50'
                  }`}>
                    {isLocked ? (
                      <Lock size={18} />
                    ) : isCompleted ? (
                      <CheckCircle size={18} />
                    ) : (
                      <span>S{index + 1}</span>
                    )}
                  </div>

                  {/* Contenido de la clase */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg mb-1 ${
                      isLocked ? 'text-slate-500' : 'text-white'
                    }`}>
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        5 min
                      </span>
                      <span>Semana {index + 1}</span>
                      {isCompleted && (
                        <span className="text-green-400 font-medium">✓ Completada</span>
                      )}
                      {isLocked && (
                        <span className="text-yellow-400 font-medium">🔒 Bloqueada</span>
                      )}
                    </div>
                  </div>

                  {/* Botón de reproducir */}
                  {!isLocked && (
                    <div className="w-10 h-10 bg-slate-700/30 group-hover:bg-green-400/20 rounded-lg flex items-center justify-center transition-all duration-300">
                      <Play className="h-4 w-4 text-slate-400 group-hover:text-green-400 transition-colors" />
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 