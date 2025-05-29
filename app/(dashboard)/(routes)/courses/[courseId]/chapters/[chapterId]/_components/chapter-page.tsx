"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight,
  Lock,
  Play,
  CheckCircle,
  Download,
  BookOpen,
  Home,
  FileText,
  ExternalLink,
  ClipboardList,
  Star
} from "lucide-react";

import { Preview } from "@/components/preview";
import { CourseProgressButton } from "./course-progress-button";

// Función para convertir URL de YouTube a formato embed
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0&autoplay=0`;
    }
  }
  
  return url;
};

interface ChapterPageProps {
  chapter: any;
  course: any;
  attachments: any[];
  nextChapter: any;
  userProgress: any;
  purchase: any;
  userId: string;
}

const ChapterPage = ({
  chapter,
  course,
  attachments,
  nextChapter,
  userProgress,
  purchase,
  userId
}: ChapterPageProps) => {
  
  if (!chapter || !course) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto bg-white/10 rounded-3xl p-12 border border-white/20">
          <div className="text-8xl mb-6">😕</div>
          <h1 className="text-4xl font-bold text-white mb-6">¡Ups!</h1>
          <p className="text-white text-2xl mb-8">Esta clase no está disponible</p>
          <Link 
            href="/student"
            className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-3xl text-2xl transition-all duration-300 hover:scale-105"
          >
            <Home className="h-8 w-8" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess = purchase || chapter.isFree;
  const isLocked = !hasAccess;
  const embedUrl = chapter.videoUrl ? getYouTubeEmbedUrl(chapter.videoUrl) : null;
  const isCompleted = !!userProgress?.isCompleted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* CONTENEDOR PRINCIPAL - MOBILE OPTIMIZADO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* VIDEO PRINCIPAL - RESPONSIVE */}
        <div className="relative">
          <div className="aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {isLocked ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-12">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-8">🔒</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-6">Clase Bloqueada</h3>
                <p className="text-white text-base sm:text-lg">
                  Primero debes completar las clases anteriores para desbloquear esta
                </p>
              </div>
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                title={chapter.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-12">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-8">📹</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-6">Video Próximamente</h3>
                <p className="text-white text-base sm:text-lg">El video estará disponible muy pronto</p>
              </div>
            )}
          </div>
        </div>

        {/* SECCIONES DE RECURSOS - MOBILE FIRST GRID */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
          
          {/* GUÍA PDF - MOBILE OPTIMIZADO */}
        {chapter.pdfUrl && hasAccess && (
            <div className="bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6">📄</div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">Guía de Trabajo</h2>
                <p className="text-white text-sm sm:text-base mb-4 sm:mb-6 lg:mb-8">
                  Descarga esta guía para seguir la clase
                  </p>

                <div className="space-y-3 sm:space-y-4">
                  <a
                    href={chapter.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 sm:px-6 py-3 sm:py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105"
                  >
                    👀 Ver Guía
                  </a>
                  
                  <a
                    href={chapter.pdfUrl}
                    download
                    className="block w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105"
                  >
                    📥 Descargar
                  </a>
                </div>
                
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-500/20 rounded-xl sm:rounded-2xl border border-yellow-500/30">
                  <p className="text-yellow-400 font-bold text-xs sm:text-sm">
                    💡 Lee la guía antes de ver el video
                  </p>
              </div>
            </div>
          </div>
        )}

          {/* FORMULARIO DE GOOGLE - MOBILE OPTIMIZADO */}
        {chapter.googleFormUrl && hasAccess && (
            <div className="bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6">📝</div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">Entrega tu Trabajo</h2>
                <p className="text-white text-sm sm:text-base mb-4 sm:mb-6 lg:mb-8">
                  Completa este formulario cuando termines
                  </p>
                
                <a
                  href={chapter.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 sm:px-6 py-3 sm:py-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105"
                >
                  📋 Abrir Formulario
                </a>
                
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/20 rounded-xl sm:rounded-2xl border border-green-500/30">
                  <p className="text-green-400 font-bold text-xs sm:text-sm">
                    ✅ Complétalo después del video
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN DE COMPLETAR - MOBILE FIRST */}
        {hasAccess && (
          <div className="text-center">
            <div className="bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-4">
                ¿Ya terminaste de ver la clase?
              </h3>
              <p className="text-white text-sm sm:text-base mb-4 sm:mb-6">
                Marca como completada para continuar con el siguiente tema
              </p>
              <CourseProgressButton
                chapterId={chapter.id}
                courseId={course.id}
                nextChapterId={nextChapter?.id}
                isCompleted={isCompleted}
                chapter={chapter}
              />
            </div>
          </div>
        )}

        {/* DESCRIPCIÓN - MOBILE OPTIMIZADO */}
        {chapter.description && (
          <div>
            <div className="bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">📖</div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">¿Qué aprenderás?</h2>
              </div>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-white prose-headings:text-white prose-strong:text-white prose-em:text-white">
                <Preview value={chapter.description} />
              </div>
            </div>
          </div>
        )}

        {/* MATERIAL DE APOYO - MOBILE OPTIMIZADO */}
        {!!attachments.length && (
          <div>
            <div className="bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">📎</div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Material Extra</h2>
              </div>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {attachments.map((attachment) => {
                const fileExtension = attachment.name.split('.').pop()?.toLowerCase();
                const isPDF = fileExtension === 'pdf';
                
                return (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={attachment.id}
                      className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-300 group border border-white/10"
                  >
                      <div className="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0">
                        {isPDF ? '📄' : '📁'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 truncate">
                        {attachment.name}
                      </p>
                        <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                          Haz clic para descargar
                      </p>
                    </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center flex-shrink-0">
                        <Download className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-400" />
                      </div>
                  </a>
                );
              })}
              </div>
            </div>
          </div>
        )}

        {/* SIGUIENTE CLASE - MOBILE OPTIMIZADO */}
        {nextChapter && hasAccess && (
          <div className="text-center">
            <div className="bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 lg:mb-6">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-4">
                ¿Ya terminaste?
              </h3>
              <p className="text-white text-sm sm:text-base mb-4 sm:mb-6 lg:mb-8">
                Continúa con la siguiente clase
              </p>
              
              <div className="mb-4 sm:mb-6">
                <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Siguiente:</p>
                <p className="text-white font-bold text-sm sm:text-base lg:text-lg line-clamp-2">{nextChapter.title}</p>
              </div>
              
              <Link
                href={`/courses/${course.id}/chapters/${nextChapter.id}`}
                className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105"
              >
                <span>Siguiente Clase</span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterPage; 