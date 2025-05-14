"use client"

import { ChangeEvent, useState, useEffect } from "react"
import toast from "react-hot-toast"
import Image from "next/image"

interface ImageUploadProps {
  onChange: (url?: string) => void
  value: string
}

export const ImageUpload = ({
  onChange,
  value
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Limpiar recursos y evitar memory leaks
  useEffect(() => {
    return () => {
      // Limpiar las URLs creadas con createObjectURL al desmontar
      if (preview && preview !== value && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview, value])

  // Actualizar vista previa cuando cambia value desde props
  useEffect(() => {
    if (value && !isPreviewing) {
      setPreview(value)
    }
  }, [value, isPreviewing])

  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    // Limpiar error previo
    setError(null)
    
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar que es una imagen válida
    if (!file.type.startsWith('image/')) {
      setError("Por favor selecciona un archivo de imagen válido")
      toast.error("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño del archivo (4MB máximo)
    if (file.size > 4 * 1024 * 1024) {
      setError("La imagen es demasiado grande. Máximo 4MB permitido.")
      toast.error("La imagen es demasiado grande. Máximo 4MB permitido.")
      return
    }

    // Limpiar URL previa si existe
    if (preview && preview !== value && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    // Crear vista previa temporal
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setSelectedFile(file)
    setIsPreviewing(true)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setError(null)
      
      const formData = new FormData()
      formData.append("file", selectedFile)
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al subir la imagen")
      }
      
      const data = await response.json()
      
      // Asegurarse de que la URL es válida
      if (!data.fileUrl) {
        throw new Error("No se recibió URL de la imagen subida")
      }
      
      // Guardar la URL y notificar el cambio
      onChange(data.fileUrl)
      setIsPreviewing(false)
      toast.success("Imagen subida correctamente")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al subir la imagen"
      
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error al subir imagen:", errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const cancelSelection = () => {
    // Limpiar URL de vista previa si es temporal
    if (preview && preview !== value && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(value || "")
    setSelectedFile(null)
    setIsPreviewing(false)
    setError(null)
  }

  return (
    <div className="relative h-[500px] w-full border rounded-md overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {preview ? (
          <div className="relative h-full w-full">
            <Image
              src={preview}
              alt="Vista previa de imagen"
              fill
              className="object-cover"
              onError={() => {
                console.error("Error al cargar la imagen:", preview)
                setError("No se pudo cargar la vista previa de la imagen")
                toast.error("No se pudo cargar la vista previa de la imagen")
              }}
            />
            {/* Botones cuando hay vista previa */}
            {isPreviewing && (
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <button
                  onClick={cancelSelection}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
                  type="button"
                  disabled={isUploading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2"
                  type="button"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Subiendo...</span>
                    </>
                  ) : "Confirmar subida"}
                </button>
              </div>
            )}
            {/* Botón para eliminar imagen ya subida */}
            {!isPreviewing && preview && (
              <button
                onClick={() => {
                  setPreview("")
                  onChange("")
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full z-10 hover:bg-red-600 transition"
                type="button"
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
                <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
              </div>
            ) : (
              <>
                <div className="text-3xl">⬆️</div>
                <p className="text-sm text-muted-foreground">
                  Elige una imagen o arrastra y suelta
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <label htmlFor="image-upload" className="sr-only">
        Subir imagen
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        title="Selecciona una imagen para subir"
        aria-label="Selecciona una imagen para subir"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileSelection}
        disabled={isUploading || isPreviewing}
        onClick={(e) => {
          // Resetear el valor para permitir seleccionar el mismo archivo de nuevo
          (e.target as HTMLInputElement).value = '';
        }}
      />
    </div>
  )
} 