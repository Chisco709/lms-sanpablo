"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface LocalFileUploadProps {
  onChange: (url?: string) => void;
  accept: string;
  endpoint: string;
}

export const LocalFileUpload = ({ onChange, accept, endpoint }: LocalFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        toast.success("Archivo subido correctamente");
      } else {
        toast.error(data.error || "Error al subir archivo");
      }
    } catch (err) {
      toast.error("Error al subir archivo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept={accept} onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <div className="mt-2 text-sm text-gray-500">Subiendo...</div>}
    </div>
  );
};
