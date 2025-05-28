"use client";

import axios from "axios";
import { CheckCircle, ArrowRight, Play, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
};

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

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

  if (isCompleted) {
    return (
      <div className="space-y-4">
        {/* Estado completado - SÚPER SIMPLE */}
        <div className="bg-green-50 border-4 border-green-200 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">¡Clase Completada!</h3>
          <p className="text-green-600 text-lg mb-6">Excelente trabajo. Has terminado esta lección.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onClick}
          disabled={isLoading}
          variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-2xl px-6 py-3 font-bold text-lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
              Actualizando...
            </div>
          ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Marcar como pendiente
                </>
          )}
        </Button>
        
        {nextChapterId && (
          <Button
            onClick={() => router.push(`/courses/${courseId}/chapters/${nextChapterId}`)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-2xl px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
                <div className="flex items-center gap-3">
                  <span>Siguiente Clase</span>
                  <ArrowRight className="h-5 w-5" />
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
      {/* Botón principal - MUY SIMPLE Y CLARO */}
      <div className="bg-blue-50 border-4 border-blue-200 rounded-3xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Ya terminaste de ver la clase?</h3>
        <p className="text-gray-600 text-lg mb-6">Haz clic aquí cuando hayas terminado de ver el video</p>
        
    <Button
      onClick={onClick}
      disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-2xl py-4 px-8 text-xl transition-all duration-300 hover:scale-105 shadow-lg"
    >
      {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Guardando...</span>
        </div>
      ) : (
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6" />
              <span>✅ ¡Sí! He terminado la clase</span>
            </div>
      )}
    </Button>
      </div>
      
      {/* Tip simple */}
      <div className="text-center">
        <p className="text-gray-500 text-lg">
          💡 Al completar las clases puedes avanzar al siguiente nivel
        </p>
      </div>
    </div>
  );
} 