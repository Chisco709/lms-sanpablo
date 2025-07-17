"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface SimpleImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const SimpleImageUpload = ({
  value,
  onChange,
  disabled = false
}: SimpleImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (4MB máximo)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 4MB");
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir imagen");
      }
      
      const data = await response.json();
      
      if (!data.fileUrl) {
        throw new Error("No se recibió URL de la imagen");
      }
      
      setPreview(data.fileUrl);
      onChange(data.fileUrl);
      toast.success("Imagen subida exitosamente");
      
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error(error instanceof Error ? error.message : "Error al subir imagen");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    toast.success("Imagen eliminada");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      uploadFile(imageFile);
    } else {
      toast.error("Por favor arrastra una imagen válida");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (preview) {
    return (
      <div className="relative">
        <div className="relative h-[300px] w-full rounded-lg overflow-hidden border border-slate-600">
          <Image
            src={preview}
            alt="Vista previa"
            fill
            className="object-cover"
            onError={() => {
              setPreview("");
              toast.error("Error al cargar la imagen");
            }}
          />
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar imagen
          </Button>
          
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative h-[300px] w-full border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
            <p className="text-sm text-slate-400">Subiendo imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ImageIcon className="h-12 w-12" />
            <p className="text-sm font-medium">Haz clic para seleccionar una imagen</p>
            <p className="text-xs">o arrastra y suelta aquí</p>
            <p className="text-xs">PNG, JPG, WEBP (máx. 4MB)</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
      />
    </div>
  );
}; 