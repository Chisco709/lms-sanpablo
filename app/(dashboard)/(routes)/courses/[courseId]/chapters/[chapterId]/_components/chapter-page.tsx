"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PlayCircle } from "lucide-react";
import { 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Download,
  Home
} from "lucide-react";

import { Preview } from "@/components/preview";
import { CourseProgressButton } from "./course-progress-button";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";

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

interface ChapterVideo {
  id: string;
  title: string;
  url: string;
  position: number;
  isPrimary: boolean;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
}

interface ChapterPageProps {
  chapter: {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string; // Mantener por compatibilidad
    position?: number;
    pdfUrl?: string;
    googleFormUrl?: string;
    isFree?: boolean;
    videos?: ChapterVideo[]; // Lista de videos del capítulo
  };
  course: {
    id: string;
    title: string;
  };
  attachments: {
    id: string;
    name: string;
    url: string;
  }[];
  nextChapter?: {
    id: string;
    title: string;
  };
  userProgress?: {
    isCompleted: boolean;
  };
  purchase?: {
    id: string;
    userId: string;
    courseId: string;
  } | null;
  userId: string;
}

const ChapterPage = ({
  chapter,
  course,
  attachments,
  nextChapter,
  userProgress,
  purchase
}: ChapterPageProps) => {
  
  // Analytics hooks
  const { trackLMSEvent } = useAnalytics();
  usePageTracking();
  useTimeTracking(`Capítulo: ${chapter?.title || 'Desconocido'}`);
  
  // Track chapter view
  useEffect(() => {
    if (chapter && course) {
      trackLMSEvent.chapterStart(chapter.id, chapter.title, course.id);
    }
  }, [chapter?.id, chapter?.title, course?.id, trackLMSEvent]);
  
  // Track chapter completion
  useEffect(() => {
    if (userProgress?.isCompleted && chapter && course) {
      trackLMSEvent.chapterComplete(chapter.id, chapter.title, course.id);
    }
  }, [userProgress?.isCompleted, chapter?.id, chapter?.title, course?.id, trackLMSEvent]);
  
  if (!chapter || !course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto bg-black/80 rounded-3xl p-8 md:p-12 border-4 border-green-400/20 shadow-2xl">
          <div className="text-6xl md:text-8xl mb-4 md:mb-6">😕</div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">¡Ups!</h1>
          <p className="text-white text-lg md:text-2xl mb-6 md:mb-8">Esta clase no está disponible</p>
          <Link 
            href="/student"
            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-2xl md:rounded-3xl text-lg md:text-2xl transition-all duration-300 hover:scale-105"
          >
            <Home className="h-6 w-6 md:h-8 md:w-8" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess = purchase || chapter.isFree;
  const isLocked = !hasAccess;
  const videos = chapter.videos || [];
  const hasVideos = videos.length > 0;
  const primaryVideo = hasVideos ? videos.find(v => v.isPrimary) || videos[0] : null;
  const embedUrl = primaryVideo ? getYouTubeEmbedUrl(primaryVideo.url) : 
                  (chapter.videoUrl ? getYouTubeEmbedUrl(chapter.videoUrl) : null);
  const isCompleted = !!userProgress?.isCompleted;

  return (
    <div className="min-h-screen bg-black relative">
      {/* Luces de fondo globales */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-15%] top-[-15%] w-[400px] h-[400px] bg-green-500/30 rounded-full blur-[120px] opacity-70" />
        <div className="absolute right-[-10%] bottom-[-10%] w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-[100px] opacity-60" />
        <div className="absolute right-[10%] top-[10%] w-[180px] h-[180px] bg-white/10 rounded-full blur-[60px] opacity-20" />
      </div>
      {/* HEADER - MOBILE OPTIMIZADO */}
      <div className="bg-black/80 border-b-4 border-green-400/20 p-3 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <Link 
              href="/student"
              className="flex items-center gap-2 md:gap-4 text-green-400 hover:text-yellow-400 transition-all duration-300 group w-full sm:w-auto"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black/60 group-hover:bg-green-400/10 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-300 flex-shrink-0 border border-green-400/30">
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-green-400 text-sm md:text-lg block">← Volver</span>
                <span className="font-bold text-lg md:text-2xl text-white line-clamp-1">Mis Cursos</span>
              </div>
            </Link>
            {isCompleted && (
              <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-green-500/20 rounded-2xl md:rounded-3xl border border-green-500/30 w-full sm:w-auto justify-center sm:justify-start">
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-400 flex-shrink-0" />
                <span className="text-green-400 font-bold text-lg md:text-xl">¡Completada!</span>
              </div>
            )}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* TÍTULO - MOBILE OPTIMIZADO */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-400/10 via-yellow-400/10 to-white/5 rounded-2xl md:rounded-3xl mb-6 md:mb-8 border border-green-400/20">
            <div className="text-3xl md:text-4xl">📚</div>
            <div>
              <span className="text-green-400 font-bold text-base md:text-lg block">Clase {chapter.position || '1'}</span>
              {isCompleted && <span className="text-green-400 font-bold text-xs md:text-sm">✅ Ya la terminé</span>}
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 leading-tight px-2">
            {chapter.title}
          </h1>
        </div>
        {/* VIDEO - MOBILE OPTIMIZADO */}
        <div className="mb-10 md:mb-16">
          <div className="bg-black/80 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-green-400/20" style={{ aspectRatio: '16/9' }}>
            {isLocked ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-12 bg-yellow-400/10">
                <div className="text-4xl md:text-6xl mb-4 md:mb-8">🔒</div>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">Clase Bloqueada</h3>
                <p className="text-white text-base md:text-lg max-w-2xl px-4">
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
              <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-12">
                <div className="text-4xl md:text-6xl mb-4 md:mb-8">📹</div>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">Video Próximamente</h3>
                <p className="text-white text-base md:text-lg">El video estará disponible muy pronto</p>
              </div>
            )}
          </div>
        </div>
        
        {/* LISTA DE VIDEOS - MOBILE OPTIMIZADO */}
        {hasVideos && hasAccess && (
          <div className="mb-10 md:mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Videos de la Clase</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chapter.videos?.map((video) => {
                const isCurrentVideo = primaryVideo?.id === video.id;
                return (
                  <div 
                    key={video.id} 
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isCurrentVideo 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'border-gray-700 hover:border-green-400/50 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isCurrentVideo) {
                        window.location.href = `?videoId=${video.id}#video`;
                      }
                    }}
                  >
                    <div className="aspect-video bg-black rounded-lg mb-3 overflow-hidden relative">
                      <img 
                        src={`https://img.youtube.com/vi/${(() => {
                          try {
                            const embedUrl = getYouTubeEmbedUrl(video.url);
                            if (!embedUrl) return '';
                            const videoIdMatch = embedUrl.match(/embed\/([^?]+)/) || video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
                            return videoIdMatch ? videoIdMatch[1] : '';
                          } catch (e) {
                            return '';
                          }
                        })()}/hqdefault.jpg`} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white opacity-80" />
                      </div>
                      {isCurrentVideo && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Reproduciendo
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-white line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {video.position === 1 ? 'Video principal' : `Video ${video.position}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* SECCIONES - MOBILE STACK, DESKTOP GRID */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
          
          {/* GUÍA PDF - MOBILE OPTIMIZADO */}
        {chapter.pdfUrl && hasAccess && (
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4 md:mb-6">📄</div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Guía de Trabajo</h2>
                <p className="text-white text-sm md:text-base mb-6 md:mb-8">
                  Descarga esta guía para seguir la clase
                  </p>

                <div className="space-y-3 md:space-y-4">
                  <a
                    href={`/api/view-pdf?url=${encodeURIComponent(chapter.pdfUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-5 md:px-6 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-2xl md:rounded-3xl text-base md:text-lg transition-all duration-300 hover:scale-105"
                  >
                    👀 Ver Guía
                  </a>
                  
                  <a
                    href={`/api/download-pdf?url=${encodeURIComponent(chapter.pdfUrl)}&filename=${encodeURIComponent(`${chapter.title.replace(/\s+/g, '_')}.pdf`)}`}
                    className="block w-full px-5 md:px-6 py-3 md:py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl md:rounded-3xl text-base md:text-lg transition-all duration-300 hover:scale-105"
                  >
                    📥 Descargar
                  </a>
                </div>
                
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-400/20 rounded-xl md:rounded-2xl border border-yellow-400/30">
                  <p className="text-yellow-400 font-bold text-xs md:text-sm">
                    💡 Lee la guía antes de ver el video
                  </p>
              </div>
            </div>
          </div>
        )}

          {/* FORMULARIO DE GOOGLE - MOBILE OPTIMIZADO */}
        {chapter.googleFormUrl && hasAccess && (
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4 md:mb-6">📝</div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Entrega tu Trabajo</h2>
                <p className="text-white text-sm md:text-base mb-6 md:mb-8">
                  Completa este formulario cuando termines
                  </p>
                
                <a
                  href={chapter.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-5 md:px-6 py-3 md:py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl md:rounded-3xl text-base md:text-lg transition-all duration-300 hover:scale-105"
                >
                  📋 Abrir Formulario
                </a>
                
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-400/20 rounded-xl md:rounded-2xl border border-green-400/30">
                  <p className="text-green-400 font-bold text-xs md:text-sm">
                    ✅ Complétalo después del video
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN DE COMPLETAR - MOBILE OPTIMIZADO */}
        {hasAccess && (
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">🎯</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                ¿Ya terminaste de ver la clase?
              </h3>
              <p className="text-white text-sm md:text-base mb-5 md:mb-6">
                Marca como completada para continuar con el siguiente tema
              </p>
              <CourseProgressButton
                chapterId={chapter.id}
                courseId={course.id}
                nextChapterId={nextChapter?.id}
                isCompleted={isCompleted}
              />
            </div>
          </div>
        )}

        {/* DESCRIPCIÓN - MOBILE OPTIMIZADO */}
        {chapter.description && (
          <div className="mt-8 md:mt-12">
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-center mb-6 md:mb-8">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">📖</div>
                <h2 className="text-xl md:text-2xl font-bold text-white">¿Qué aprenderás?</h2>
              </div>
              <div className="prose prose-base md:prose-lg max-w-none text-white prose-headings:text-white prose-strong:text-white prose-em:text-white">
                <Preview value={chapter.description} />
              </div>
            </div>
          </div>
        )}

        {/* MATERIAL DE APOYO - MOBILE OPTIMIZADO */}
        {!!attachments.length && (
          <div className="mt-8 md:mt-12">
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-center mb-6 md:mb-8">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">📎</div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Material Extra</h2>
              </div>
              <div className="space-y-4 md:space-y-6">
              {attachments.map((attachment) => {
                const fileExtension = attachment.name.split('.').pop()?.toLowerCase();
                const isPDF = fileExtension === 'pdf';
                
                return (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={attachment.id}
                      className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-white/5 hover:bg-white/10 rounded-2xl md:rounded-3xl transition-all duration-300 group border border-white/10"
                  >
                      <div className="text-3xl md:text-4xl flex-shrink-0">
                        {isPDF ? '📄' : '📁'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-base md:text-lg mb-1 md:mb-2 truncate">
                        {attachment.name}
                      </p>
                        <p className="text-white/60 text-sm md:text-base">
                          Haz clic para descargar
                      </p>
                    </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-400/20 rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0">
                        <Download className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
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
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-3xl md:text-4xl mb-4 md:mb-6">🎯</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                ¿Ya terminaste?
              </h3>
              <p className="text-white text-sm md:text-base mb-6 md:mb-8">
                Continúa con la siguiente clase
              </p>
              
              <div className="mb-5 md:mb-6">
                <p className="text-white/60 text-xs md:text-sm mb-1 md:mb-2">Siguiente:</p>
                <p className="text-white font-bold text-base md:text-lg line-clamp-2">{nextChapter.title}</p>
              </div>
              
              <Link
                href={`/courses/${course.id}/chapters/${nextChapter.id}`}
                className="inline-flex items-center gap-3 md:gap-4 px-5 md:px-6 py-3 md:py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl md:rounded-3xl text-base md:text-lg transition-all duration-300 hover:scale-105"
              >
                <span>Siguiente Clase</span>
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterPage; 