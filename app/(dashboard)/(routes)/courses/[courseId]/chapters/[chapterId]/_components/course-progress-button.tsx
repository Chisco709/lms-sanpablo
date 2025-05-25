"use client";

import axios from "axios";
import { CheckCircle, ArrowRight } from "lucide-react";
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
        toast.success("🎉 ¡Excelente! Has completado el programa técnico");
      } else if (!isCompleted && nextChapterId) {
        toast.success("✅ Clase completada");
      } else {
        toast.success("Estado actualizado");
      }

      router.refresh();
    } catch {
      toast.error("Error al actualizar el progreso");
    } finally {
      setIsLoading(false);
    }
  }

  if (isCompleted) {
    return (
      <div className="flex gap-4">
        <Button
          onClick={onClick}
          disabled={isLoading}
          variant="outline"
          className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border-slate-600/50 hover:border-slate-500/50 rounded-lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
              Actualizando...
            </div>
          ) : (
            "Marcar como pendiente"
          )}
        </Button>
        
        {nextChapterId && (
          <Button
            onClick={() => router.push(`/courses/${courseId}/chapters/${nextChapterId}`)}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-slate-900 font-semibold rounded-lg"
          >
            Ir a la siguiente clase
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-green-400 to-yellow-400 hover:from-green-500 hover:to-yellow-500 text-slate-900 font-semibold rounded-lg py-3"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
          Guardando...
        </div>
      ) : (
        <>
          <CheckCircle className="h-5 w-5 mr-2" />
          Marcar clase como completada
        </>
      )}
    </Button>
  );
} 