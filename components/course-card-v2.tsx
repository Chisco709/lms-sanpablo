"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Play, CheckCircle, Clock } from "lucide-react"
import { CourseProgress } from "@/components/course-progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

interface CourseCardProps {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  progress: number | null
  description?: string
  isPurchased?: boolean
}

export const CourseCardV2 = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  description,
  isPurchased = false
}: CourseCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  // Document validation state
  const [documentNumber, setDocumentNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  
  // Handle modal open/close with cleanup
  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      // Reset form when modal closes
      setError(null)
      setDocumentNumber("")
    }
  }, [])


  const courseState = useMemo(() => ({
    isCompleted: progress === 100,
    isInProgress: progress !== null && progress > 0 && progress < 100,
    formattedProgress: progress !== null ? Math.round(progress) : 0,
  }), [progress])

  const { isCompleted, isInProgress, formattedProgress } = courseState

  const getImageSrc = useMemo(() => {
    if (imageError || !imageUrl || imageUrl.trim() === '' || imageUrl === '/placeholder-course.jpg') {
      return "/logo-sanpablo.jpg"
    }
    try {
      new URL(imageUrl)
      return imageUrl
    } catch (error) {
      return "/logo-sanpablo.jpg"
    }
  }, [imageError, imageUrl, id])

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and limit to 15 digits
    if (/^\d{0,15}$/.test(value)) {
      setDocumentNumber(value)
      // Clear error when user types a valid character
      if (error && value.length > 0) {
        setError(null)
      }
    }
  }

  const validateDocument = useCallback((): boolean => {
    // Reset previous errors
    setError(null)
    
    // Check if empty
    if (!documentNumber.trim()) {
      setError('Por favor ingresa un número de documento')
      return false
    }
    
    // Check minimum length
    if (documentNumber.length < 5) {
      setError('El documento debe tener al menos 5 dígitos')
      return false
    }
    
    // Check maximum length (should be handled by input but just in case)
    if (documentNumber.length > 15) {
      setError('El documento no puede tener más de 15 dígitos')
      return false
    }
    
    return true
  }, [documentNumber])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent multiple rapid submissions (throttle to 2 seconds)
    const now = Date.now()
    if (now - lastSubmitTime < 2000) {
      return
    }
    setLastSubmitTime(now)
    
    // Local validation
    if (!validateDocument()) {
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ 
          documentNumber: documentNumber.trim(),
          documentType: 'CC' // Default to Cédula de Ciudadanía
        }),
        credentials: 'same-origin'
      })
      
      // Handle different types of responses
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión.')
        } else if (response.status === 429) {
          throw new Error('Demasiados intentos. Por favor espera un momento.')
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Por favor inténtalo más tarde.')
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      }
      
      const result = await response.json()
      
      if (result.authorized) {
        // Show success message before redirect
        toast.success('¡Validación exitosa! Redirigiendo...', {
          duration: 2000,
          position: 'top-center'
        })
        
        // Small delay for user to see the success message
        setTimeout(() => {
          window.location.href = `/courses/${id}`
        }, 1000)
      } else {
        setError(result.message || 'Documento no autorizado para este curso')
      }
    } catch (error) {
      console.error('Error al validar documento:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Ocurrió un error inesperado. Por favor inténtalo de nuevo.'
      
      setError(errorMessage)
      toast.error('Error al validar el documento', {
        duration: 4000,
        position: 'top-center'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [documentNumber, id, lastSubmitTime, validateDocument])

  const CourseAccessButton = () => {
    if (isPurchased) {
      return (
        <Link 
          href={`/courses/${id}`} 
          className="w-full block" 
          aria-label={`${isCompleted ? 'Ver' : isInProgress ? 'Continuar' : 'Comenzar'} curso ${title}`}
        >
          <Button 
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium transition-colors duration-200 text-sm sm:text-base h-9 sm:h-10"
            size="sm"
          >
            {isCompleted ? "Ver curso" : isInProgress ? "Continuar" : "Comenzar"}
          </Button>
        </Link>
      )
    }

    return (
      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium transition-colors duration-200 text-sm sm:text-base h-9 sm:h-10"
            size="sm"
            aria-label={`Solicitar acceso a ${title}`}
          >
            Acceder al curso
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Validación de acceso</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="document" className="block text-sm font-medium text-slate-300">
                Documento de identidad (TI o C.C)
              </label>
              <Input
                id="document"
                type="text"
                inputMode="numeric"
                placeholder="Ingresa tu número de documento (C.C o T.I)"
                value={documentNumber}
                onChange={handleDocumentChange}
                className={`bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-yellow-400 transition-colors ${
                  error ? 'border-red-500 focus:border-red-500' : 'hover:border-slate-600 focus:border-blue-500'
                }`}
                disabled={isSubmitting}
                aria-invalid={!!error}
                aria-describedby={error ? 'document-error' : undefined}
                minLength={5}
                maxLength={15}
                pattern="\d+"
                title="Por favor ingresa solo números"
              />
              {error && (
                <p 
                  id="document-error" 
                  className="text-red-400 text-sm text-center"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors"
                disabled={isSubmitting || !documentNumber.trim()}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Validando..." : "Validar acceso"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/30 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-900">
      {/* Course Image */}
      <div className="relative aspect-video bg-slate-900 flex-shrink-0">
        <Image
          src={getImageSrc}
          alt={`"${title}"`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="animate-pulse h-full w-full bg-slate-700"></div>
          </div>
        )}

        {/* Image Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {isCompleted && (
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>COMPLETADO</span>
            </div>
          )}

          {isInProgress && !isCompleted && (
            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Play className="h-3 w-3 flex-shrink-0" />
              <span>EN PROGRESO</span>
            </div>
          )}

          {!isPurchased && (
            <div className="bg-slate-900/80 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
              <Lock className="h-3 w-3 flex-shrink-0" />
              <span className="hidden sm:inline">REQUIERE ACCESO</span>
              <span className="sm:hidden">ACCESO</span>
            </div>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="flex flex-col flex-grow p-4 sm:p-5 space-y-3 md:space-y-4">
        {/* Title & Description */}
        <div className="space-y-2 flex-grow">
          <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2">
            {title}
          </h3>
          
          {description && (
            <p className="text-slate-400 text-sm line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Course Metadata */}
        <div className="flex items-center gap-3 md:gap-4 text-slate-400 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <span>{chaptersLength} {chaptersLength === 1 ? 'clase' : 'clases'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span className="hidden sm:inline">A tu ritmo</span>
            <span className="sm:hidden">Flexible</span>
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== null && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Progreso</span>
              <span className="font-medium text-white">{formattedProgress}%</span>
            </div>
            <div className="h-1.5 sm:h-2">
              <CourseProgress
                variant={isCompleted ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1 sm:pt-2">
          <CourseAccessButton />
        </div>
      </div>
    </article>
  )
}

CourseCardV2.displayName = 'CourseCardV2'
