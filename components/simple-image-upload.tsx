"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface SimpleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const SimpleImageUpload = ({ value, onChange }: SimpleImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (url?: string) => {
    setIsUploading(false);
    if (url) {
      onChange(url);
      toast.success("✅ Imagen subida correctamente");
    } else {
      toast.error("❌ Error: No se recibió URL de la imagen");
    }
  };

  const handleRemove = () => {
    onChange("");
    toast.success("🗑️ Imagen removida");
  };

  if (value && !isUploading) {
    return (
      <div className="relative">
        <div className="relative h-60 w-full rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt="Imagen subida"
            src={value}
          />
        </div>
        <Button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600"
          type="button"
          variant="destructive"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isUploading && (
        <div className="flex items-center justify-center h-60 bg-slate-800 border-2 border-dashed border-slate-600 rounded-md hover:border-green-400 transition-colors">
          <div className="text-center">
            <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-4" />
            <div className="text-sm text-slate-400 mb-4">
              Sube una imagen para tu curso
            </div>
            <div 
              onClick={() => setIsUploading(true)}
              className="cursor-pointer"
            >
              <Button 
                type="button" 
                variant="secondary"
                className="bg-green-500 hover:bg-green-600 text-black"
              >
                Seleccionar Imagen
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="space-y-4">
          <FileUpload
            endpoint="courseImage"
            onChange={handleUploadComplete}
          />
          <Button
            onClick={() => setIsUploading(false)}
            variant="ghost"
            type="button"
            className="w-full text-slate-400 hover:text-white"
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}; 