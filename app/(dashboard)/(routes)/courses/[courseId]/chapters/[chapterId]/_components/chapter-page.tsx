"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight,
  Lock,
  Play,
  ArrowRight,
  Calendar,
  FileText
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Clase no disponible</h1>
          <p className="text-slate-400">Esta clase aún no está disponible o no existe.</p>
        </div>
      </div>
    );
  }

  const hasAccess = purchase || chapter.isFree;
  const isLocked = !hasAccess;
  const embedUrl = chapter.videoUrl ? getYouTubeEmbedUrl(chapter.videoUrl) : null;
  const isCompleted = !!userProgress?.isCompleted;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header limpio */}
      <div className="border-b border-slate-800/20 sticky top-0 z-50 bg-slate-950/98 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/courses/${course.id}`}
              className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">{course.title}</span>
            </Link>
            
            {nextChapter && (
              <Link
                href={`/courses/${course.id}/chapters/${nextChapter.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-slate-900 font-medium rounded-lg transition-all duration-300"
              >
                <span>Siguiente clase</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Título de la clase */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            {chapter.position && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                <Calendar className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm font-medium">Semana {chapter.position}</span>
              </div>
            )}
            {isCompleted && (
              <div className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm font-medium">
                ✓ Completada
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            {chapter.title}
          </h1>
        </div>

        {/* Video principal */}
        <div className="mb-8">
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
            {isLocked ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mb-6">
                  <Lock className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Clase bloqueada
                </h3>
                <p className="text-slate-400">
                  Esta clase se desbloqueará según el cronograma del programa técnico
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
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                  <Play className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Clase próximamente
                </h3>
                <p className="text-slate-400">
                  El contenido de esta clase estará disponible pronto
                </p>
              </div>
            )}
          </div>

          {/* Botón de completar clase */}
          {hasAccess && (
            <div className="mt-6">
              <CourseProgressButton
                chapterId={chapter.id}
                courseId={course.id}
                nextChapterId={nextChapter?.id}
                isCompleted={isCompleted}
              />
            </div>
          )}
        </div>

        {/* Descripción de la clase */}
        {chapter.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow-400" />
              Contenido de la clase
            </h2>
            <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800/30">
              <div className="prose prose-slate prose-invert max-w-none">
                <Preview value={chapter.description} />
              </div>
            </div>
          </div>
        )}

        {/* Guía PDF del capítulo */}
        {chapter.pdfUrl && hasAccess && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-400" />
              Guía de Estudio (PDF)
            </h2>
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-400"/>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-white mb-1">
                    Guía del Capítulo
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Material de estudio complementario para esta clase
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={chapter.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Ver PDF
                  </Link>
                  
                  <Link
                    href={chapter.pdfUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Descargar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Form del capítulo */}
        {chapter.googleFormUrl && hasAccess && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Formulario de Evaluación
            </h2>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-400"/>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-white mb-1">
                    Evaluación del Capítulo
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Completa este formulario para evaluar tu comprensión del tema
                  </p>
                </div>

                <Link
                  href={chapter.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  Completar Formulario
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recursos de la clase */}
        {!!attachments.length && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-400" />
              Material de apoyo
            </h2>
            <div className="grid gap-3">
              {attachments.map((attachment) => {
                const fileExtension = attachment.name.split('.').pop()?.toLowerCase();
                const isPDF = fileExtension === 'pdf';
                const isDoc = ['doc', 'docx'].includes(fileExtension || '');
                const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '');
                
                return (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={attachment.id}
                    className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all duration-300 group border border-slate-800/30 hover:border-slate-700/50"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isPDF ? 'bg-red-400/20 text-red-400' :
                      isDoc ? 'bg-blue-400/20 text-blue-400' :
                      isImage ? 'bg-purple-400/20 text-purple-400' :
                      'bg-gray-400/20 text-gray-400'
                    }`}>
                      {isPDF ? 'PDF' : 
                       isDoc ? 'DOC' :
                       isImage ? 'IMG' : 'FILE'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white group-hover:text-yellow-400 transition-colors font-medium">
                        {attachment.name}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {fileExtension?.toUpperCase() || 'Archivo'}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterPage; 