"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Play, Volume2, Maximize, Settings } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        toast.success("Capítulo completado");
        
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Algo salió mal");
    }
  }

  const handlePlay = () => {
    setIsReady(true);
    setIsPlaying(true);
  }

  if (isLocked) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-10 w-10 text-yellow-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Contenido Premium</h3>
              <p className="text-gray-400 max-w-md">
                Este capítulo está disponible solo para estudiantes inscritos. 
                Únete ahora para acceder a todo el contenido.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>✨ Video HD</span>
              <span>📱 Acceso móvil</span>
              <span>📄 Recursos</span>
            </div>
          </div>
        </div>
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      {!isReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Play className="h-12 w-12 text-black ml-1" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-emerald-500 rounded-full animate-ping opacity-20" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="text-gray-400">
                Haz clic para comenzar el video
              </p>
            </div>
            <button
              onClick={handlePlay}
              className="bg-gradient-to-r from-yellow-400 to-emerald-500 hover:from-yellow-500 hover:to-emerald-600 text-black font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Reproducir Video
            </button>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                HD Quality
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                15 min
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                Subtítulos
              </span>
            </div>
          </div>
        </div>
      )}

      {isReady && (
        <div className="relative w-full h-full bg-black">
          {/* Video placeholder - aquí iría el reproductor real */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-gray-400">Reproduciendo video...</p>
              <p className="text-xs text-gray-500">
                (Aquí se integraría el reproductor de video real)
              </p>
            </div>
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                 <button 
                   aria-label="Reproducir/Pausar video"
                   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                 >
                   <Play className="h-5 w-5 text-white ml-0.5" />
                 </button>
                 <button 
                   aria-label="Control de volumen"
                   className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                 >
                   <Volume2 className="h-4 w-4 text-white" />
                 </button>
                 <span className="text-white text-sm">0:00 / 15:30</span>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                   aria-label="Configuración de video"
                   className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                 >
                   <Settings className="h-4 w-4 text-white" />
                 </button>
                 <button 
                   aria-label="Pantalla completa"
                   className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                 >
                   <Maximize className="h-4 w-4 text-white" />
                 </button>
               </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-1 mt-3">
              <div className="bg-gradient-to-r from-yellow-400 to-emerald-500 h-1 rounded-full w-1/4 transition-all" />
            </div>
          </div>
        </div>
      )}

      {!isReady && !isLocked && (
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm font-medium">15:30</span>
          </div>
        </div>
      )}
    </div>
  )
} 