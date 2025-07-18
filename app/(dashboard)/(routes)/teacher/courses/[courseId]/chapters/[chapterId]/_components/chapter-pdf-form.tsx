"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { File, Pencil, Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ChapterPdfFormProps {
  initialData: {
    pdfUrl: string | null;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterPdfForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterPdfFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: { pdfUrl: string }) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Capítulo actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Error al actualizar el capítulo");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <File className="h-4 w-4 text-orange-400" />
          Material PDF
        </h3>
        <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          {isEditing ? (
            "Cancelar"
          ) : (
            <>
              {initialData.pdfUrl ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Cambiar PDF
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar PDF
                </>
              )}
            </>
          )}
        </Button>
      </div>
      
      {!isEditing && (
        <>
          {!initialData.pdfUrl && (
            <div className="flex flex-col items-center justify-center h-40 bg-slate-700 rounded-lg">
              <File className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-slate-400 text-sm">No hay material PDF</p>
            </div>
          )}
          {initialData.pdfUrl && (
            <div className="flex items-center p-3 w-full bg-slate-700 border border-slate-600 rounded-lg">
              <File className="h-10 w-10 text-orange-400 mr-3" />
              <div className="flex-1">
                <p className="text-white font-medium">Material de estudio</p>
                <p className="text-slate-400 text-sm">Archivo PDF disponible</p>
              </div>
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(initialData.pdfUrl!, '_blank')
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
      
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterPdf"
            onChange={(url) => {
              if (url) {
                onSubmit({ pdfUrl: url });
              }
            }}
          />
          <div className="text-xs text-slate-400 mt-4">
            Solo se permiten archivos PDF hasta 4MB
          </div>
        </div>
      )}
    </div>
  );
}; 