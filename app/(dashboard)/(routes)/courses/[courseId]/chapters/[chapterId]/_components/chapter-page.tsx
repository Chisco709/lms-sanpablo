"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Download,
  Home,
  Play
} from "lucide-react";

type VideoUrl = {
  url: string | null;
  originalUrl: string;
};

import { Preview } from "@/components/preview";
import { CourseProgressButton } from "./course-progress-button";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";

// Función para convertir URL de YouTube a formato embed
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  console.log('Processing YouTube URL:', url);
  
  // Extraer el ID del video de diferentes formatos de URL de YouTube
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|watch(?:\?v=|\/))|\?v=|\&v=)([^#\&\?]{11}).*/;
  const match = url.match(regExp);
  
  if (match && match[1]) {
    const videoId = match[1];
    console.log('Extracted video ID:', videoId);
    
    // Verificar si el videoId es válido (solo caracteres alfanuméricos, guiones bajos y guiones)
    if (/^[\w-]{11}$/.test(videoId)) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&autoplay=0&enablejsapi=1`;
      console.log('Generated embed URL:', embedUrl);
      return embedUrl;
    }
  }
  
  // Si la URL ya está en formato embed, verificar y devolver
  const embedMatch = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}?rel=0&modestbranding=1&showinfo=0&autoplay=0&enablejsapi=1`;
  }
  
  console.warn('No se pudo extraer un ID de video válido de la URL:', url);
  return null;
};

interface ChapterPageProps {
  chapter: {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    videoUrls?: string[];
    position?: number;
    pdfUrl?: string;
    pdfUrls?: string[];
    googleFormUrl?: string;
    isFree?: boolean;
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
  const isCompleted = !!userProgress?.isCompleted;
  
  // Handle both single videoUrl and videoUrls array
  const videoUrls: string[] = [];
  
  // Debug: Log the chapter data
  console.log('Chapter data:', {
    videoUrl: chapter.videoUrl,
    videoUrls: chapter.videoUrls,
    hasAccess,
    rawChapter: chapter // Log the entire chapter object for debugging
  });
  
  // Add all video URLs from both sources
  const allVideoSources = [
    ...(chapter.videoUrl ? [chapter.videoUrl] : []),
    ...(Array.isArray(chapter.videoUrls) ? chapter.videoUrls : [])
  ];
  
  // Filter out duplicates and invalid URLs
  allVideoSources.forEach(url => {
    if (url && typeof url === 'string' && url.trim() !== '' && !videoUrls.includes(url.trim())) {
      console.log('Adding video URL:', url.trim());
      videoUrls.push(url.trim());
    }
  });
  
  console.log('Collected video URLs:', videoUrls);
  
  // Get embed URLs for all videos
  const embedUrls: VideoUrl[] = videoUrls
    .filter(url => {
      const embedUrl = getYouTubeEmbedUrl(url);
      if (!embedUrl) {
        console.warn('Could not generate embed URL for:', url);
        return false;
      }
      return true;
    })
    .map(url => ({
      url: getYouTubeEmbedUrl(url)!,
      originalUrl: url
    }));
  
  console.log('Processed video URLs:', {
    videoUrls,
    embedUrls,
    hasVideos: embedUrls.length > 0
  });
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const currentVideo: VideoUrl | null = embedUrls.length > 0 ? embedUrls[Math.min(currentVideoIndex, embedUrls.length - 1)] : null;
  
  const handleNextVideo = (): void => {
    setCurrentVideoIndex((prev) => (prev + 1) % embedUrls.length);
  };
  
  const handlePrevVideo = (): void => {
    setCurrentVideoIndex((prev) => (prev - 1 + embedUrls.length) % embedUrls.length);
  };

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
            ) : embedUrls.length > 0 && currentVideo?.url ? (
              <div className="relative h-full">
                {/* Main Video */}
                <div className="relative w-full h-full bg-black">
                  {currentVideo && currentVideo.url ? (
                    <iframe
                      key={currentVideoIndex}
                      src={currentVideo.url}
                      title={`${chapter.title} - Video ${currentVideoIndex + 1}`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-12">
                      <div className="text-4xl md:text-6xl mb-4 md:mb-8">❌</div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">Error al cargar el video</h3>
                      <p className="text-white text-base md:text-lg">No se pudo cargar el video. Por favor, verifica la URL.</p>
                    </div>
                  )}
                </div>
                
                {/* Video Navigation (only show if multiple videos) */}
                {embedUrls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevVideo}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 z-10 transition-all duration-300 hover:scale-110"
                      aria-label="Video anterior"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNextVideo}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 z-10 transition-all duration-300 hover:scale-110"
                      aria-label="Siguiente video"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Video Pager */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      {embedUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentVideoIndex(index)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === currentVideoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Ir al video ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    {/* Video Counter */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md z-10">
                      {currentVideoIndex + 1} / {embedUrls.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-12">
                <div className="text-4xl md:text-6xl mb-4 md:mb-8">📹</div>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">Video Próximamente</h3>
                <p className="text-white text-base md:text-lg">El video estará disponible muy pronto</p>
              </div>
            )}
          </div>
          
          {/* Video List (for all videos) */}
          {embedUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {embedUrls.length > 1 ? 'Videos de la clase' : 'Video de la clase'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {embedUrls.map((video, index) => {
                  const videoId = video.originalUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                        index === currentVideoIndex 
                          ? 'border-green-400 ring-4 ring-green-400/30' 
                          : 'border-gray-700 hover:border-green-400/50'
                      }`}
                      aria-label={`Ver video ${index + 1}`}
                    >
                      <div className="aspect-video relative">
                        {thumbnailUrl ? (
                          <>
                            <img 
                              src={thumbnailUrl} 
                              alt={`Miniatura del video ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Play className="h-5 w-5 text-white ml-0.5" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                              Video {index + 1}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <div className="text-gray-400">
                              <Play className="h-12 w-12 mx-auto mb-2" />
                              <span>Video {index + 1}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {index === currentVideoIndex && (
                        <div className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* SECCIONES - MOBILE STACK, DESKTOP GRID */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
          
          {/* GUÍA PDF - MOBILE OPTIMIZADO */}
        {(chapter.pdfUrl || (Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 0)) && hasAccess && (
            <div className="bg-black/80 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/20">
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4 md:mb-6">📄</div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                  {Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 1 ? 'Guías de Trabajo' : 'Guía de Trabajo'}
                </h2>
                <p className="text-white text-sm md:text-base mb-6 md:mb-8">
                  {Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 1 
                    ? 'Descarga estas guías para seguir la clase' 
                    : 'Descarga esta guía para seguir la clase'}
                </p>

                <div className="space-y-3 md:space-y-4">
                  {/* Single PDF or first PDF in the array */}
                  {(chapter.pdfUrl || (Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 0)) && (
                    <div className="space-y-3">
                      {[chapter.pdfUrl, ...(Array.isArray(chapter.pdfUrls) ? chapter.pdfUrls : [])]
                        .filter((url): url is string => !!url)
                        .map((pdfUrl, index) => (
                          <div key={index} className="space-y-2">
                            {Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 1 && (
                              <span className="text-white text-sm font-medium">
                                Documento {index + 1}
                              </span>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <a
                                href={`/api/view-pdf?url=${encodeURIComponent(pdfUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-4 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-2xl text-center text-sm md:text-base transition-all duration-300 hover:scale-105"
                              >
                                👀 Ver {Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 1 ? '' : 'Guía'}
                              </a>
                              
                              <a
                                href={`/api/download-pdf?url=${encodeURIComponent(pdfUrl)}&filename=${encodeURIComponent(`${chapter.title.replace(/\s+/g, '_')}_${index + 1}.pdf`)}`}
                                className="flex-1 px-4 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-center text-sm md:text-base transition-all duration-300 hover:scale-105"
                              >
                                📥 Descargar
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-400/20 rounded-xl md:rounded-2xl border border-yellow-400/30">
                  <p className="text-yellow-400 font-bold text-xs md:text-sm">
                    💡 {Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 1 
                      ? 'Revisa las guías antes de ver el video' 
                      : 'Lee la guía antes de ver el video'}
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