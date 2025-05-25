"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        // Aquí iría la lógica para marcar el capítulo como completado
        toast.success("Capítulo completado");
        
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Algo salió mal");
    }
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            Este capítulo está bloqueado
          </p>
        </div>
      )}
      {!isLocked && (
        <div className={cn(
          !isReady && "hidden"
        )}>
          {/* Aquí iría el reproductor de video real */}
          <div 
            className="w-full h-full bg-slate-800 flex items-center justify-center text-white"
            onClick={() => setIsReady(true)}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-slate-400">Haz clic para reproducir el video</p>
              <p className="text-xs text-slate-500 mt-2">
                (Integración con reproductor de video pendiente)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 