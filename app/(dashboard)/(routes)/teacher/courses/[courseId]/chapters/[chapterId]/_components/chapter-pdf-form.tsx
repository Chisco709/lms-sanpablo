"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, File, X, Download, FileText, CheckCircle, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Chapter } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  pdfUrl: z.string().min(1, "Se requiere un archivo PDF")
});

type FormValues = z.infer<typeof formSchema>;

interface ChapterPdfFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

export const ChapterPdfForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterPdfFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      pdfUrl: initialData.pdfUrl || "" 
    }
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      toast.success("Subida cancelada");
    }
    setIsEditing(false);
  };

  const onSubmit = async (url?: string) => {
    try {
      abortControllerRef.current = new AbortController();
      setIsSubmitting(true);

      if (!url) {
        toast.error("URL no válida");
        return;
      }

      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`, 
        { pdfUrl: url },
        { signal: abortControllerRef.current.signal }
      );
      
      toast.success("📄 ¡Guía PDF subida exitosamente! Los estudiantes ya pueden descargarla");
      setIsEditing(false);
      router.refresh();
      
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.error("Subida cancelada");
      } else {
        console.error("Error updating PDF:", error);
        toast.error("❌ Error al subir la guía PDF. Inténtalo de nuevo");
      }
    } finally {
      setIsSubmitting(false);
      abortControllerRef.current = null;
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        pdfUrl: null
      });
      toast.success("🗑️ Guía PDF eliminada");
      router.refresh();
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("❌ Error al eliminar la guía PDF");
    } finally {
      setIsDeleting(false);
    }
  };

  const getPdfFileName = (url: string) => {
    return url.split('/').pop() || "Guía del capítulo";
  };

  return (
    <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-yellow-400" />
          <span>Guía PDF del Capítulo</span>
        </div>
        
        <Button 
          onClick={isEditing ? handleCancel : toggleEdit} 
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
          disabled={isDeleting || isSubmitting}
        >
          {isEditing ? (
            "Cancelar"
          ) : initialData.pdfUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Cambiar PDF
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Guía PDF
            </>
          )}
        </Button>
      </div>

      {/* Estado: Sin PDF y no editando */}
      {!isEditing && !initialData.pdfUrl && (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center bg-slate-700/30 mt-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                No hay guía PDF configurada
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Sube un archivo PDF que los estudiantes puedan descargar como material de apoyo
              </p>
              <Button 
                onClick={toggleEdit}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Subir Guía PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Estado: PDF existente y no editando */}
      {!isEditing && initialData.pdfUrl && (
        <div className="mt-4 space-y-4">
          {/* Vista previa del PDF */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <File className="h-6 w-6 text-red-400"/>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white mb-1">
                  {getPdfFileName(initialData.pdfUrl)}
                </h4>
                <p className="text-xs text-slate-400">
                  Guía PDF disponible para estudiantes
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Activo</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <a
                    href={initialData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Vista Previa
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-emerald-600 text-emerald-400 hover:text-white hover:bg-emerald-700"
                >
                  <a
                    href={initialData.pdfUrl}
                    download
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </a>
                </Button>
                
                <Button
                  onClick={onDelete}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:text-white hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Eye className="h-4 w-4" />
              <span>Los estudiantes pueden descargar esta guía desde la página del capítulo</span>
            </div>
          </div>
        </div>
      )}

      {/* Estado: Editando/Subiendo */}
      {isEditing && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-white">
              {initialData.pdfUrl ? "Cambiar Guía PDF" : "Subir Nueva Guía PDF"}
            </h4>
          </div>

          {/* Área de subida */}
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 bg-slate-700/30">
            <FileUpload
              endpoint="chapterPdf"
              onChange={(url) => url && onSubmit(url)}
            />
            
            <div className="text-xs text-slate-400 mt-2">
              Formatos soportados: PDF (máximo 16MB)
            </div>
            
            {isSubmitting && (
              <div className="flex items-center gap-2 mt-4 text-sm text-emerald-400">
                <Loader2 className="h-4 w-4 animate-spin"/>
                Subiendo PDF...
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-200 font-medium mb-1">Instrucciones para subir PDF:</p>
                <ul className="text-yellow-300/80 space-y-1 text-xs">
                  <li>• Tamaño máximo: 16MB</li>
                  <li>• Solo archivos PDF permitidos</li>
                  <li>• El archivo será visible para todos los estudiantes del capítulo</li>
                  <li>• Recomendado: Nombres descriptivos como "Guía_Capítulo_1.pdf"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 