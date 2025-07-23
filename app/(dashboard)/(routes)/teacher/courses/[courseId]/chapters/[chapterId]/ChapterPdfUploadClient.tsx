"use client";
import { useState } from "react";
import axios from "axios";
import { SimplePdfUpload } from "@/components/simple-pdf-upload";

interface ChapterPdfUploadClientProps {
  courseId: string;
  chapterId: string;
  initialPdfUrl?: string;
}

export const ChapterPdfUploadClient = ({ courseId, chapterId, initialPdfUrl }: ChapterPdfUploadClientProps) => {
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(initialPdfUrl || "");

  const handlePdfUploadComplete = async (url?: string) => {
    if (!url) return;
    setIsSavingPdf(true);
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { pdfUrl: url });
      setPdfUrl(url);
    } catch (error) {
      // Puedes mostrar un toast de error aquí
    } finally {
      setIsSavingPdf(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      <SimplePdfUpload onChange={handlePdfUploadComplete} />
      {isSavingPdf && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
            <span className="text-white text-sm font-medium">Guardando PDF...</span>
          </div>
        </div>
      )}
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-400 underline">Ver PDF subido</a>
      )}
    </div>
  );
}
