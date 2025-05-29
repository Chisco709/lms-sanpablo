"use client";

import { useState, useRef } from "react";
import { Upload, File, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface SimplePdfUploadProps {
  onChange: (url?: string) => void;
}

export const SimplePdfUpload = ({ onChange }: SimplePdfUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validar que sea PDF
    if (file.type !== 'application/pdf') {
      toast.error("❌ Solo se permiten archivos PDF");
      return;
    }
    
    // Validar tamaño (16MB máximo)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("❌ El archivo es demasiado grande (máximo 16MB)");
      return;
    }
    
    setFileName(file.name);
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivo');
      }
      
      toast.success("✅ PDF subido exitosamente");
      onChange(data.url);
      
    } catch (error) {
      console.error('Error subiendo PDF:', error);
      toast.error(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor="pdf-file-input" className="sr-only">
        Seleccionar archivo PDF
      </label>
      <input
        id="pdf-file-input"
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
        aria-label="Seleccionar archivo PDF"
      />
      
      <div 
        onClick={triggerFileSelect}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isUploading 
            ? 'border-yellow-400 bg-yellow-50 cursor-not-allowed' 
            : 'border-slate-600 bg-slate-700/30 hover:border-yellow-400 hover:bg-slate-600/30'
          }
        `}
      >
        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-slate-400" />
          )}
          
          <div>
            <p className="text-white font-medium">
              {isUploading ? 'Subiendo archivo...' : 'Haz clic para seleccionar PDF'}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {fileName || 'Máximo 16MB, solo archivos PDF'}
            </p>
          </div>
          
          {fileName && !isUploading && (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded px-3 py-1">
              <File className="h-4 w-4 text-green-400" />
              <span className="text-green-200 text-sm">{fileName}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-slate-400 mt-2">
        Los archivos se suben automáticamente cuando los seleccionas
      </div>
    </div>
  );
}; 