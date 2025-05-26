"use client";

import axios from "axios";
import { Pencil, PlusCircle, X, ExternalLink, FileText, CheckCircle, Loader2, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChapterGoogleFormProps {
  initialData: {
    id: string;
    googleFormUrl?: string | null;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterGoogleForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterGoogleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formUrl, setFormUrl] = useState(initialData.googleFormUrl || "");
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    if (!isEditing) {
      setFormUrl(initialData.googleFormUrl || "");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormUrl(initialData.googleFormUrl || "");
  };

  const validateGoogleFormUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Validar que sea una URL de Google Forms
    const googleFormPatterns = [
      /^https:\/\/docs\.google\.com\/forms\/d\/[a-zA-Z0-9-_]+/,
      /^https:\/\/forms\.gle\/[a-zA-Z0-9-_]+/
    ];
    
    return googleFormPatterns.some(pattern => pattern.test(url));
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!formUrl.trim()) {
        toast.error("Por favor ingresa una URL válida");
        return;
      }

      if (!validateGoogleFormUrl(formUrl)) {
        toast.error("Por favor ingresa una URL válida de Google Forms");
        return;
      }

      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`, 
        { googleFormUrl: formUrl.trim() }
      );
      
      toast.success("📝 ¡Google Form agregado exitosamente!");
      setIsEditing(false);
      router.refresh();
      
    } catch (error) {
      console.error("Error updating Google Form:", error);
      toast.error("❌ Error al agregar el Google Form. Inténtalo de nuevo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        googleFormUrl: null
      });
      toast.success("🗑️ Google Form eliminado");
      router.refresh();
    } catch (error) {
      console.error("Error deleting Google Form:", error);
      toast.error("❌ Error al eliminar el Google Form");
    } finally {
      setIsDeleting(false);
    }
  };

  const getFormTitle = (url: string) => {
    // Extraer ID del formulario para mostrar un título más amigable
    const match = url.match(/\/forms\/d\/([a-zA-Z0-9-_]+)/);
    return match ? `Formulario ${match[1].substring(0, 8)}...` : "Google Form";
  };

  return (
    <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          <span>Google Form del Capítulo</span>
        </div>
        
        <Button 
          onClick={isEditing ? handleCancel : toggleEdit} 
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
          disabled={isDeleting || isSubmitting}
        >
          {isEditing ? (
            "Cancelar"
          ) : initialData.googleFormUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Cambiar Form
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Google Form
            </>
          )}
        </Button>
      </div>

      {/* Estado: Sin Google Form y no editando */}
      {!isEditing && !initialData.googleFormUrl && (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center bg-slate-700/30 mt-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                No hay Google Form configurado
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Agrega un Google Form para que los estudiantes puedan completar tareas o evaluaciones
              </p>
              <Button 
                onClick={toggleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar Google Form
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Estado: Google Form existente y no editando */}
      {!isEditing && initialData.googleFormUrl && (
        <div className="mt-4 space-y-4">
          {/* Vista previa del Google Form */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-400"/>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white mb-1">
                  {getFormTitle(initialData.googleFormUrl)}
                </h4>
                <p className="text-xs text-slate-400">
                  Google Form disponible para estudiantes
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
                    href={initialData.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Form
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
              <Link className="h-4 w-4" />
              <span>Los estudiantes pueden acceder a este formulario desde la página del capítulo</span>
            </div>
          </div>
        </div>
      )}

      {/* Estado: Editando/Agregando */}
      {isEditing && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-white">
              {initialData.googleFormUrl ? "Cambiar Google Form" : "Agregar Google Form"}
            </h4>
          </div>

          {/* Formulario de entrada */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formUrl" className="text-sm font-medium text-slate-300">
                URL del Google Form
              </Label>
              <Input
                id="formUrl"
                type="url"
                placeholder="https://docs.google.com/forms/d/..."
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={onSubmit}
                disabled={isSubmitting || !formUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? "Guardando..." : "Guardar Form"}
              </Button>
              
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-200 font-medium mb-1">Instrucciones para Google Forms:</p>
                <ul className="text-blue-300/80 space-y-1 text-xs">
                  <li>• Copia la URL completa de tu Google Form</li>
                  <li>• Asegúrate de que el formulario esté configurado para recibir respuestas</li>
                  <li>• Los estudiantes podrán acceder directamente desde el capítulo</li>
                  <li>• Formatos válidos: docs.google.com/forms o forms.gle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 