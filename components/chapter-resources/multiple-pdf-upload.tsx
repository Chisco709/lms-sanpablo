"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultipleFileUpload } from "@/components/multiple-file-upload";

export const MultiplePdfUpload = ({
  courseId,
  chapterId,
  initialPdfUrls = [],
}: {
  courseId: string;
  chapterId: string;
  initialPdfUrls?: string[];
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>(initialPdfUrls || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialPdfUrls) {
      setPdfUrls(initialPdfUrls);
    }
  }, [initialPdfUrls]);

  const handleUploadComplete = (urls: string[]) => {
    setIsUploading(false);
    setPdfUrls(urls);
    savePdfUrls(urls);
  };

  const savePdfUrls = async (urls: string[]) => {
    try {
      setIsSaving(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        pdfUrls: urls 
      });
    } catch (error) {
      console.error("Error saving PDFs:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePdf = async (urlToRemove: string) => {
    try {
      setIsSaving(true);
      const updatedUrls = pdfUrls.filter(url => url !== urlToRemove);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        pdfUrls: updatedUrls 
      });
      setPdfUrls(updatedUrls);
    } catch (error) {
      console.error("Error removing PDF:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Archivos PDF ({pdfUrls.length})</h3>
        <MultipleFileUpload
          endpoint="chapterPdf"
          onChange={handleUploadComplete}
          onUploadBegin={() => setIsUploading(true)}
          multiple={true}
          maxFiles={10}
        />
      </div>

      {(isUploading || isSaving) && (
        <div className="text-sm text-muted-foreground">
          {isUploading ? "Subiendo archivos..." : "Guardando cambios..."}
        </div>
      )}

      {pdfUrls.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Archivos subidos:</div>
          <ul className="space-y-2">
            {pdfUrls.map((url, index) => (
              <li key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-blue-500" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    PDF {index + 1}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePdf(url)}
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
