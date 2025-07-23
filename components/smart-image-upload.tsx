"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, CheckCircle, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

interface SmartImageUploadProps {
  value: string;
  courseId: string;
  onSuccess?: (url: string) => void;
}

export const SmartImageUpload = ({ value, courseId, onSuccess }: SmartImageUploadProps) => {
  const [currentImage, setCurrentImage] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debug: Log current state
  useEffect(() => {
    console.log(`SmartImageUpload ${courseId} - value:`, value);
    console.log(`SmartImageUpload ${courseId} - currentImage:`, currentImage);
  }, [courseId, value, currentImage]);

  // Sincronizar con el prop value
  useEffect(() => {
    setCurrentImage(value);
  }, [value]);

  const handleUploadComplete = async (url?: string) => {
    console.log(`SmartImageUpload ${courseId} - Upload complete, URL:`, url);
    
    if (!url) {
      toast.error("❌ Error: No se recibió URL de la imagen");
      setIsUploading(false);
      return;
    }

    try {
      setIsSaving(true);
      
      // Actualizar estado local inmediatamente
      setCurrentImage(url);
      
      console.log(`SmartImageUpload ${courseId} - Saving to database:`, url);
      
      // Guardar en base de datos
      const response = await axios.patch(`/api/courses/${courseId}`, { 
        imageUrl: url 
      });
      
      console.log(`SmartImageUpload ${courseId} - Database response:`, response.data);
      
      toast.success("🎉 ¡Imagen guardada exitosamente!");
      
      // Llamar callback si existe
      onSuccess?.(url);
      
    } catch (error) {
      console.error(`SmartImageUpload ${courseId} - Error saving image:`, error);
      toast.error("❌ Error al guardar la imagen");
      
      // Revertir estado local
      setCurrentImage(value);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    console.log(`SmartImageUpload ${courseId} - Removing image`);
    
    try {
      setIsSaving(true);
      
      // Actualizar estado local
      setCurrentImage("");
      
      // Guardar en base de datos
      await axios.patch(`/api/courses/${courseId}`, { 
        imageUrl: null 
      });
      
      toast.success("🗑️ Imagen removida");
      onSuccess?.("");
      
    } catch (error) {
      console.error(`SmartImageUpload ${courseId} - Error removing image:`, error);
      toast.error("❌ Error al remover la imagen");
      
      // Revertir estado local
      setCurrentImage(value);
    } finally {
      setIsSaving(false);
    }
  };

  if (currentImage && !isUploading) {
    return (
      <div className="relative">
        <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-600">
          <Image
            fill
            className="object-cover"
            alt="Imagen del curso"
            src={currentImage}
            onError={(e) => {
              console.error(`SmartImageUpload ${courseId} - Image display error:`, currentImage);
            }}
            onLoad={() => {
              console.log(`SmartImageUpload ${courseId} - Image displayed successfully:`, currentImage);
            }}
          />
          
          {/* Overlay de estado */}
          {isSaving && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className="text-white text-sm font-medium">Guardando...</span>
              </div>
            </div>
          )}
          
          {/* Overlay de éxito */}
          {!isSaving && currentImage !== value && (
            <div className="absolute top-2 right-12 bg-green-500/20 backdrop-blur-sm rounded-lg p-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          )}
        </div>
        
        {/* Botón remover */}
        <Button
          onClick={handleRemove}
          disabled={isSaving}
          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600"
          type="button"
          variant="destructive"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Botón cambiar */}
        <Button
          onClick={() => setIsUploading(true)}
          disabled={isSaving}
          className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          type="button"
          size="sm"
        >
          <Upload className="h-4 w-4 mr-1" />
          Cambiar
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isUploading && (
        <div 
          className="flex items-center justify-center h-48 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl hover:border-green-400 transition-colors cursor-pointer"
          onClick={() => setIsUploading(true)}
        >
          <div className="text-center">
            <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-4" />
            <div className="text-sm text-slate-400 mb-4">
              Sube una imagen para tu curso
            </div>
            <Button 
              type="button" 
              variant="secondary"
              className="bg-green-500 hover:bg-green-600 text-black"
            >
              Seleccionar Imagen
            </Button>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="space-y-4">
          <div className="relative">
            <FileUpload
              endpoint="courseImage"
              onChange={handleUploadComplete}
            />
            
            {isSaving && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span className="text-white text-sm font-medium">Guardando en curso...</span>
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => setIsUploading(false)}
            variant="ghost"
            type="button"
            className="w-full text-slate-400 hover:text-white"
            disabled={isSaving}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}; 