"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultipleFileUpload } from "@/components/multiple-file-upload";

export const MultipleVideoUpload = ({
  courseId,
  chapterId,
  initialVideoUrls = [],
}: {
  courseId: string;
  chapterId: string;
  initialVideoUrls?: string[];
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>(initialVideoUrls || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialVideoUrls) {
      setVideoUrls(initialVideoUrls);
    }
  }, [initialVideoUrls]);

  const handleUploadComplete = (urls: string[]) => {
    setIsUploading(false);
    setVideoUrls(urls);
    saveVideoUrls(urls);
  };

  const saveVideoUrls = async (urls: string[]) => {
    try {
      setIsSaving(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        videoUrls: urls 
      });
    } catch (error) {
      console.error("Error saving videos:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveVideo = async (urlToRemove: string) => {
    try {
      setIsSaving(true);
      const updatedUrls = videoUrls.filter(url => url !== urlToRemove);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        videoUrls: updatedUrls 
      });
      setVideoUrls(updatedUrls);
    } catch (error) {
      console.error("Error removing video:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Videos ({videoUrls.length})</h3>
        <MultipleFileUpload
          endpoint="chapterVideo"
          onChange={handleUploadComplete}
          onUploadBegin={() => setIsUploading(true)}
          multiple={true}
          maxFiles={10}
        />
      </div>

      {(isUploading || isSaving) && (
        <div className="text-sm text-muted-foreground">
          {isUploading ? "Subiendo videos..." : "Guardando cambios..."}
        </div>
      )}

      {videoUrls.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Videos subidos:</div>
          <ul className="space-y-2">
            {videoUrls.map((url, index) => (
              <li key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-red-500" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Video {index + 1}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVideo(url)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
