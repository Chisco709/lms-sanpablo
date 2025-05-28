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
    <div className="min-h-screen bg-[#0F172A]">
      
      {/* HEADER SÚPER SIMPLE */}
      <div className="bg-white/5 border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link 
              href={`/courses/${course.id}`}
            className="flex items-center gap-4 text-white hover:text-yellow-400 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-white/10 group-hover:bg-yellow-400/20 rounded-3xl flex items-center justify-center transition-all duration-300">
              <ChevronLeft className="h-8 w-8" />
            </div>
            <div>
              <span className="text-white/60 text-lg block">← Volver</span>
              <span className="font-bold text-2xl text-white">{course.title}</span>
            </div>
            </Link>
            
          {isCompleted && (
            <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 rounded-3xl border border-green-500/30">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <span className="text-green-400 font-bold text-xl">¡Completada!</span>
            </div>
            )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* TÍTULO SÚPER GRANDE Y CLARO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-blue-500/20 rounded-3xl mb-8 border border-blue-500/30">
            <div className="text-6xl">📚</div>
            <div>
              <span className="text-blue-400 font-bold text-2xl block">Clase {chapter.position || '1'}</span>
              {isCompleted && <span className="text-green-400 font-bold text-xl">✅ Ya la terminé</span>}
              </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            {chapter.title}
          </h1>
        </div>

        {/* VIDEO - LO MÁS IMPORTANTE Y GRANDE */}
        <div className="mb-16">
          <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
            {isLocked ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-yellow-500/10">
                <div className="text-8xl mb-8">🔒</div>
                <h3 className="text-4xl font-bold text-white mb-6">Clase Bloqueada</h3>
                <p className="text-white text-2xl max-w-2xl">
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
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="text-8xl mb-8">📹</div>
                <h3 className="text-4xl font-bold text-white mb-6">Video Próximamente</h3>
                <p className="text-white text-2xl">El video estará disponible muy pronto</p>
              </div>
            )}
          </div>

          {/* BOTÓN DE COMPLETAR - MUY GRANDE Y VISIBLE */}
          {hasAccess && (
            <div className="mt-8 text-center">
              <CourseProgressButton
                chapterId={chapter.id}
                courseId={course.id}
                nextChapterId={nextChapter?.id}
                isCompleted={isCompleted}
              />
            </div>
          )}
        </div>

        {/* SECCIONES SÚPER SIMPLES EN TARJETAS GRANDES */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* GUÍA PDF - SÚPER SIMPLE */}
        {chapter.pdfUrl && hasAccess && (
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-center">
                <div className="text-8xl mb-6">📄</div>
                <h2 className="text-3xl font-bold text-white mb-4">Guía de Trabajo</h2>
                <p className="text-white text-xl mb-8">
                  Descarga esta guía para seguir la clase
                  </p>

                <div className="space-y-4">
                  <a
                    href={chapter.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-8 py-6 bg-red-500 hover:bg-red-400 text-white font-bold rounded-3xl text-2xl transition-all duration-300 hover:scale-105"
                  >
                    👀 Ver Guía
                  </a>
                  
                  <a
                    href={chapter.pdfUrl}
                    download
                    className="block w-full px-8 py-6 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-3xl text-2xl transition-all duration-300 hover:scale-105"
                  >
                    📥 Descargar
                  </a>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-500/20 rounded-2xl border border-yellow-500/30">
                  <p className="text-yellow-400 font-bold text-lg">
                    💡 Lee la guía antes de ver el video
                  </p>
              </div>
            </div>
          </div>
        )}

          {/* FORMULARIO DE GOOGLE - SÚPER SIMPLE */}
        {chapter.googleFormUrl && hasAccess && (
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-center">
                <div className="text-8xl mb-6">📝</div>
                <h2 className="text-3xl font-bold text-white mb-4">Entrega tu Trabajo</h2>
                <p className="text-white text-xl mb-8">
                  Completa este formulario cuando termines
                  </p>
                
                <a
                  href={chapter.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-8 py-6 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-3xl text-2xl transition-all duration-300 hover:scale-105"
                >
                  📋 Abrir Formulario
                </a>
                
                <div className="mt-6 p-4 bg-green-500/20 rounded-2xl border border-green-500/30">
                  <p className="text-green-400 font-bold text-lg">
                    ✅ Complétalo después del video
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DESCRIPCIÓN - SOLO SI EXISTE */}
        {chapter.description && (
          <div className="mt-12">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-3xl font-bold text-white">¿Qué aprenderás?</h2>
              </div>
              <div className="prose prose-xl max-w-none text-white prose-headings:text-white prose-strong:text-white prose-em:text-white">
                <Preview value={chapter.description} />
              </div>
            </div>
          </div>
        )}

        {/* MATERIAL DE APOYO - SÚPER SIMPLE */}
        {!!attachments.length && (
          <div className="mt-12">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📎</div>
                <h2 className="text-3xl font-bold text-white">Material Extra</h2>
              </div>
              <div className="space-y-6">
              {attachments.map((attachment) => {
                const fileExtension = attachment.name.split('.').pop()?.toLowerCase();
                const isPDF = fileExtension === 'pdf';
                
                return (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={attachment.id}
                      className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-3xl transition-all duration-300 group border border-white/10"
                  >
                      <div className="text-6xl">
                        {isPDF ? '📄' : '📁'}
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-2xl mb-2">
                        {attachment.name}
                      </p>
                        <p className="text-white/60 text-lg">
                          Haz clic para descargar
                      </p>
                    </div>
                      <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center">
                        <Download className="h-8 w-8 text-blue-400" />
                      </div>
                  </a>
                );
              })}
              </div>
            </div>
          </div>
        )}

        {/* SIGUIENTE CLASE - SÚPER SIMPLE */}
        {nextChapter && hasAccess && (
          <div className="mt-12 text-center">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                ¿Ya terminaste?
              </h3>
              <p className="text-white text-xl mb-8">
                Continúa con la siguiente clase
              </p>
              
              <div className="mb-6">
                <p className="text-white/60 text-lg mb-2">Siguiente:</p>
                <p className="text-white font-bold text-2xl">{nextChapter.title}</p>
              </div>
              
              <Link
                href={`/courses/${course.id}/chapters/${nextChapter.id}`}
                className="inline-flex items-center gap-4 px-8 py-6 bg-green-500 hover:bg-green-400 text-white font-bold rounded-3xl text-2xl transition-all duration-300 hover:scale-105"
              >
                <span>Siguiente Clase</span>
                <ChevronRight className="h-8 w-8" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterPage; 