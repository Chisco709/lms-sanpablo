"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Play, Plus, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractYoutubeId, isValidYoutubeUrl, getYoutubeThumbnail } from "@/lib/youtube-utils";
import { toast } from "react-hot-toast";

export const MultipleVideoUpload = ({
  courseId,
  chapterId,
  initialVideoUrls = [],
}: {
  courseId: string;
  chapterId: string;
  initialVideoUrls?: string[];
}) => {
  const [videoUrls, setVideoUrls] = useState<string[]>(initialVideoUrls || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialVideoUrls) {
      setVideoUrls(initialVideoUrls);
    }
  }, [initialVideoUrls]);

  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const saveVideoUrls = async (urls: string[]) => {
    try {
      setIsSaving(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        videoUrls: urls 
      });
    } catch (error) {
      console.error("Error saving videos:", error);
      toast.error("Error al guardar los videos");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveVideo = async (urlToRemove: string) => {
    try {
      setIsSaving(true);
      const updatedUrls = videoUrls.filter(url => url !== urlToRemove);
      await saveVideoUrls(updatedUrls);
      setVideoUrls(updatedUrls);
    } catch (error) {
      console.error("Error removing video:", error);
      toast.error("Error al eliminar el video");
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) return;
    
    if (!isValidYoutubeUrl(newVideoUrl)) {
      toast.error("Por favor ingresa una URL de YouTube válida");
      return;
    }

    if (videoUrls.includes(newVideoUrl)) {
      toast.error("Este video ya ha sido agregado");
      return;
    }

    try {
      const newUrls = [...videoUrls, newVideoUrl];
      await saveVideoUrls(newUrls);
      setVideoUrls(newUrls);
      setNewVideoUrl("");
      setIsAdding(false);
      toast.success("Video agregado correctamente");
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error("Error al agregar el video");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Videos de YouTube ({videoUrls.length})</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAdding(true)}
          disabled={isSaving || videoUrls.length >= 10}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar video
        </Button>
      </div>

      {isSaving && (
        <div className="text-sm text-muted-foreground">
          Guardando cambios...
        </div>
      )}

      {isAdding && (
        <div className="space-y-2 p-4 border rounded-lg">
          <div className="flex items-center space-x-2">
            <Youtube className="h-5 w-5 text-red-600" />
            <Input
              type="text"
              placeholder="Pega la URL del video de YouTube"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              className="flex-1"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setNewVideoUrl("");
                setIsAdding(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddVideo}
              disabled={!newVideoUrl.trim()}
            >
              Agregar
            </Button>
          </div>
        </div>
      )}

      {videoUrls.length > 0 && (
        <div className="space-y-3">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {videoUrls.map((url, index) => {
              const videoId = extractYoutubeId(url);
              const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId) : '';
              const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
              
              return (
                <div key={index} className="border rounded-lg overflow-hidden group relative">
                  <div className="aspect-video bg-black relative">
                    {thumbnailUrl && (
                      <img 
                        src={thumbnailUrl} 
                        alt={`Miniatura del video ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </a>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline line-clamp-2 flex-1 pr-2"
                        title={url}
                      >
                        Video {index + 1}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveVideo(url);
                        }}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
