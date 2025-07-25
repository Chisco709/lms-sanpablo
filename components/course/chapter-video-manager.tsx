"use client";

import { useState, useEffect } from "react";
import { Video, Plus, Trash2, ArrowUp, ArrowDown, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

interface ChapterVideoManagerProps {
  chapterId: string;
  courseId: string;
}

export function ChapterVideoManager({ 
  chapterId, 
  courseId 
}: ChapterVideoManagerProps) {
  const [videos, setVideos] = useState<ChapterVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    isPrimary: false
  });

  // Extrae el ID de un video de YouTube desde una URL
  const extractVideoId = (url: string): string | null => {
    // Patrón para URLs de YouTube (soporta varios formatos)
    const patterns = [
      // Formato estándar: https://www.youtube.com/watch?v=ID
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/,
      // Formato con parámetros adicionales: https://www.youtube.com/watch?feature=player_embedded&v=ID
      /[?&]v=([^"&?\/\s]{11})/,
      // Formato corto: https://youtu.be/ID
      /youtu\.be\/([^"&?\/\s]{11})/,
      // Formato embed: https://www.youtube.com/embed/ID
      /youtube\.com\/embed\/([^"&?\/\s]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Cargar videos existentes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/videos`);
        if (!response.ok) throw new Error("Error al cargar los videos");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("No se pudieron cargar los videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [chapterId, courseId]);

  const addVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.url.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newVideo,
          position: videos.length
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al agregar el video");
      }

      const createdVideo = await response.json();
      setVideos([...videos, createdVideo]);
      
      // Mantener el formulario abierto pero limpiar los campos
      setNewVideo({ 
        title: "", 
        url: "", 
        isPrimary: false 
      });
      
      // Enfocar el campo de título después de agregar
      setTimeout(() => {
        document.getElementById('video-title')?.focus();
      }, 100);
      
      toast.success("Video agregado correctamente");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al agregar el video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeVideo = async (videoId: string) => {
    if (!confirm("¿Estás seguro de eliminar este video?")) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}/videos/${videoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar el video");
      }

      setVideos(videos.filter((video) => video.id !== videoId));
      toast.success("Video eliminado correctamente");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al eliminar el video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setAsPrimary = async (videoId: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}/videos/${videoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPrimary: true }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar el video");
      }

      const updatedVideo = await response.json();
      setVideos(
        videos.map((video) => ({
          ...video,
          isPrimary: video.id === videoId ? true : false,
        }))
      );
      toast.success("Video principal actualizado");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar el video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveVideo = async (videoId: string, direction: "up" | "down") => {
    const index = videos.findIndex((v) => v.id === videoId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === videos.length - 1)
    ) {
      return;
    }

    const newPosition = direction === "up" ? index - 1 : index + 1;
    const newVideos = [...videos];
    const [movedVideo] = newVideos.splice(index, 1);
    newVideos.splice(newPosition, 0, movedVideo);

    // Actualizar posiciones
    const updatedVideos = newVideos.map((video, idx) => ({
      ...video,
      position: idx,
    }));

    try {
      setIsSubmitting(true);
      // Actualizar posiciones en el servidor
      await Promise.all(
        updatedVideos.map((video) =>
          fetch(`/api/courses/${courseId}/chapters/${chapterId}/videos/${video.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position: video.position }),
          })
        )
      );

      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error al actualizar posiciones:", error);
      toast.error("Error al reordenar los videos");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Videos del Capítulo
        </h3>

        {/* Lista de videos existentes */}
        <div className="space-y-3">
          {videos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay videos en este capítulo aún.
            </div>
          ) : (
            videos
              .sort((a, b) => a.position - b.position)
              .map((video) => (
                <div
                  key={video.id}
                  className={cn(
                    "p-4 rounded-lg border flex items-center justify-between",
                    video.isPrimary
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-red-500" />
                    <div className="max-w-[400px]">
                      <h4 className="font-medium truncate">{video.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {video.url}
                      </p>
                    </div>
                    {video.isPrimary && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Principal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveVideo(video.id, "up")}
                      disabled={video.position === 0 || isSubmitting}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveVideo(video.id, "down")}
                      disabled={video.position === videos.length - 1 || isSubmitting}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    {!video.isPrimary && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAsPrimary(video.id)}
                        disabled={isSubmitting}
                        className="h-8 w-8"
                        title="Marcar como principal"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVideo(video.id)}
                      disabled={isSubmitting}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Eliminar video"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Sección de agregar video */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">Agregar Videos</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                // Desplazarse al formulario
                document.getElementById('add-video-form')?.scrollIntoView({ behavior: 'smooth' });
                // Enfocar el primer campo
                setTimeout(() => {
                  document.getElementById('video-title')?.focus();
                }, 300);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Otro Video
            </Button>
          </div>

          {/* Formulario para agregar nuevo video */}
          <div id="add-video-form" className="border border-dashed rounded-lg p-6 bg-card/50">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Nuevo Video
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título del Video <span className="text-destructive">*</span>
                </label>
                <Input
                  id="video-title"
                  placeholder="Ej: Introducción al módulo"
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newVideo.title.trim() && newVideo.url.trim()) {
                      addVideo();
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  URL de YouTube <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newVideo.title.trim() && newVideo.url.trim()) {
                        addVideo();
                      }
                    }}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo se admiten enlaces de YouTube (ejemplo: https://www.youtube.com/watch?v=...)
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={newVideo.isPrimary}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, isPrimary: e.target.checked })
                    }
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isPrimary" className="text-sm">
                    Marcar como video principal
                  </label>
                </div>

                <Button
                  onClick={addVideo}
                  disabled={!newVideo.title.trim() || !newVideo.url.trim() || isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Video
                    </>
                  )}
                </Button>
              </div>

              {videos.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{videos.length}</span> {videos.length === 1 ? 'video agregado' : 'videos agregados'} a este capítulo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
