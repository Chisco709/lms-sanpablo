"use client"

import { UploadDropzone } from "@/lib/uploadthing"  
import { ourFileRouter } from "@/app/api/uploadthing/core"
import toast from "react-hot-toast"


interface FileUploadProps {
    onChange: (url?: string) => void
    endpoint: keyof typeof ourFileRouter
}

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            console.log("📂 FileUpload Response:", res);
            
            // Intentar diferentes propiedades que podría devolver UploadThing
            const fileUrl = res?.[0]?.url || res?.[0]?.ufsUrl;
            
            console.log("📎 URL extraída:", fileUrl);
            
            if (fileUrl) {
                toast.success("✅ Archivo subido exitosamente");
                onChange(fileUrl);
            } else {
                console.error("❌ No se encontró URL en la respuesta:", res);
                toast.error("Error: No se pudo obtener la URL del archivo");
            }
        }}
        onUploadError={(error: Error) => {
            console.error("❌ Error de subida:", error);
            toast.error(`Error de subida: ${error?.message}`);
        }}
        />
    )
}