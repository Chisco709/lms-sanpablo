"use client";

import axios from "axios";
import { CheckCircle, ArrowRight, Play, Trophy, AlertTriangle, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
  chapter?: any; // Agregamos info del capítulo para validaciones
};

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
  chapter
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasViewedPdf, setHasViewedPdf] = useState(false);
  const [hasViewedForm, setHasViewedForm] = useState(false);

  // Rastrear clics en PDF y formulario
  useEffect(() => {
    const handlePdfClick = () => setHasViewedPdf(true);
    const handleFormClick = () => setHasViewedForm(true);

    // Escuchar clics en enlaces de PDF y formularios
    const pdfLinks = document.querySelectorAll('a[href*=".pdf"], a[href*="pdf"]');
    const formLinks = document.querySelectorAll('a[href*="forms.google"], a[href*="googleform"]');

    pdfLinks.forEach(link => link.addEventListener('click', handlePdfClick));
    formLinks.forEach(link => link.addEventListener('click', handleFormClick));

    // También detectar si se abre en nueva pestaña/ventana
    const handleWindowFocus = () => {
      // Simular que vio los recursos si regresa al tab
      setTimeout(() => {
        if (chapter?.pdfUrl) setHasViewedPdf(true);
        if (chapter?.googleFormUrl) setHasViewedForm(true);
      }, 3000); // Dar 3 segundos para "ver" el contenido
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      pdfLinks.forEach(link => link.removeEventListener('click', handlePdfClick));
      formLinks.forEach(link => link.removeEventListener('click', handleFormClick));
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [chapter]);

  const validateCompletion = () => {
    const requirements = [];
    
    if (chapter?.pdfUrl && !hasViewedPdf) {
      requirements.push("📄 Ver la guía PDF");
    }
    
    if (chapter?.googleFormUrl && !hasViewedForm) {
      requirements.push("📝 Abrir el formulario de Google");
    }

    return requirements;
  };

  const onClick = async () => {
    try {
      setIsLoading(true);

      // ✅ VALIDAR QUE HAYA VISTO RECURSOS ANTES DE COMPLETAR
      if (!isCompleted) {
        const missingRequirements = validateCompletion();
        
        if (missingRequirements.length > 0) {
          toast.error(
            `⚠️ Antes de completar, debes:\n${missingRequirements.join('\n')}`,
            {
              duration: 6000,
              style: {
                background: '#EF4444',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '20px',
                whiteSpace: 'pre-line'
              }
            }
          );
          return;
        }
      }

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
        toast.success("🎉 ¡FELICIDADES! Has completado todo el curso. ¡Eres increíble!", {
          duration: 5000,
          style: {
            background: '#10B981',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '16px'
          }
        });
      } else if (!isCompleted && nextChapterId) {
        toast.success("✅ ¡Muy bien! Clase completada.", {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '16px'
          }
        });
      } else {
        toast.success("📝 Actualizado correctamente", {
          duration: 2000,
          style: {
            background: '#6B7280',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '16px'
          }
        });
      }

      router.refresh();
    } catch {
      toast.error("❌ Error. Inténtalo de nuevo.", {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '16px'
        }
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Verificar qué recursos están disponibles
  const hasPdf = !!chapter?.pdfUrl;
  const hasForm = !!chapter?.googleFormUrl;
  const missingRequirements = validateCompletion();
  const canComplete = missingRequirements.length === 0;

  if (isCompleted) {
    return (
      <div className="space-y-4">
        {/* Estado completado - MOBILE OPTIMIZADO */}
        <div className="bg-green-50 border-4 border-green-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">¡Clase Completada!</h3>
          <p className="text-green-600 text-base sm:text-lg mb-6">Excelente trabajo. Has terminado esta lección.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={onClick}
              disabled={isLoading}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 font-bold text-base sm:text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                  Actualizando...
                </div>
              ) : (
                <>
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Marcar como pendiente
                </>
              )}
            </Button>
            
            {nextChapterId && (
              <Button
                onClick={() => router.push(`/courses/${courseId}/chapters/${nextChapterId}`)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span>Siguiente Clase</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* VALIDACIÓN DE RECURSOS */}
      {(hasPdf || hasForm) && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h4 className="text-lg sm:text-xl font-bold text-blue-800 mb-3">📋 Lista de Verificación</h4>
          <div className="space-y-2 sm:space-y-3">
            {hasPdf && (
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                hasViewedPdf 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-yellow-100 border border-yellow-300'
              }`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  hasViewedPdf ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {hasViewedPdf ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  )}
                </div>
                <span className={`font-medium text-sm sm:text-base ${
                  hasViewedPdf ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {hasViewedPdf ? '✅ Guía PDF vista' : '📄 Ver la guía PDF'}
                </span>
              </div>
            )}

            {hasForm && (
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                hasViewedForm 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-yellow-100 border border-yellow-300'
              }`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  hasViewedForm ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  {hasViewedForm ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  ) : (
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  )}
                </div>
                <span className={`font-medium text-sm sm:text-base ${
                  hasViewedForm ? 'text-green-800' : 'text-purple-800'
                }`}>
                  {hasViewedForm ? '✅ Formulario abierto' : '📝 Abrir formulario de Google'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón principal - MOBILE OPTIMIZADO */}
      <div className="bg-blue-50 border-4 border-blue-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">¿Ya terminaste de ver la clase?</h3>
        <p className="text-gray-600 text-base sm:text-lg mb-6">
          {missingRequirements.length > 0 
            ? "Primero completa todos los requisitos de arriba" 
            : "Haz clic aquí cuando hayas terminado de ver el video"
          }
        </p>
        
        <Button
          onClick={onClick}
          disabled={isLoading || !canComplete}
          className={`w-full sm:w-auto font-bold rounded-xl sm:rounded-2xl py-3 sm:py-4 px-6 sm:px-8 text-lg sm:text-xl transition-all duration-300 shadow-lg ${
            canComplete 
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105' 
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Guardando...</span>
            </div>
          ) : !canComplete ? (
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>⚠️ Completa todos los pasos</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>✅ ¡Sí! He terminado la clase</span>
            </div>
          )}
        </Button>
      </div>
      
      {/* Tip mobile-friendly */}
      <div className="text-center">
        <p className="text-gray-500 text-base sm:text-lg">
          💡 Al completar las clases puedes avanzar al siguiente nivel
        </p>
      </div>
    </div>
  );
}; 