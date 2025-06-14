"use client"

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Play, CheckCircle, Star, Clock } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { CourseProgress } from "@/components/course-progress"
import { useState, memo, useMemo } from "react"

interface CourseCardProps {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
  description?: string
  isPurchased?: boolean
}

export const CourseCard = memo(({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  description,
  isPurchased
}: CourseCardProps) => {
  const [imageError, setImageError] = useState(false)
  
  // Memoizar cálculos costosos
  const courseState = useMemo(() => ({
    isCompleted: progress === 100,
    isInProgress: progress !== null && progress > 0 && progress < 100,
    formattedProgress: progress !== null ? Math.round(progress) : 0,
    formattedPrice: price > 0 ? formatPrice(price) : null,
  }), [progress, price])

  const { isCompleted, isInProgress, formattedProgress, formattedPrice } = courseState

  // Determinar la imagen a usar con fallbacks mejorados
  const getImageSrc = useMemo(() => {
    if (imageError) {
      return "/logo-sanpablo.jpg" // Fallback principal
    }
    if (!imageUrl || imageUrl.trim() === '' || imageUrl === '/placeholder-course.jpg') {
      return "/logo-sanpablo.jpg" // URL limpia para casos vacíos y placeholder
    }
    return imageUrl
  }, [imageError, imageUrl])

  const courseUrl = `/courses/${id}`

  return (
    <article className="group">
      <Link href={courseUrl} prefetch={false} aria-label={`Ver curso: ${title}`}>
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/40 hover:from-slate-700/50 hover:via-slate-700/30 hover:to-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-500 backdrop-blur-sm hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-900/50">
          
          {/* Efectos decorativos */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-all duration-700" aria-hidden="true"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-400/5 rounded-full blur-3xl group-hover:bg-green-400/10 transition-all duration-700" aria-hidden="true"></div>
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
          
          <div className="relative z-10">
            {/* Imagen del curso - OPTIMIZADA */}
            <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-slate-800">
              <Image
                src={getImageSrc}
                alt={`Imagen del curso ${title}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
                loading="lazy"
                quality={75}
              />
              
              {/* Overlay con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
            
              {/* Badge de categoría */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold rounded-full shadow-lg">
                  <Star className="h-3 w-3 inline mr-1" aria-hidden="true" />
                  {category}
                </span>
              </div>
              
              {/* Badge de estado */}
              {isCompleted && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <CheckCircle className="h-3 w-3" aria-hidden="true" />
                    <span>COMPLETADO</span>
                  </div>
                </div>
              )}

              {isInProgress && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Play className="h-3 w-3" aria-hidden="true" />
                    <span>EN PROGRESO</span>
                  </div>
                </div>
              )}

              {/* Botón de play centrado */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  <Play className="h-6 w-6 text-white ml-1" />
                </div>
              </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Título */}
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2 leading-tight">
                {title}
              </h3>
            
              {/* Descripción */}
              {description && (
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Información del curso */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                    <span className="font-medium text-xs sm:text-sm">{chaptersLength} clases</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-400" aria-hidden="true" />
                    <span className="font-medium text-xs sm:text-sm">A tu ritmo</span>
                  </div>
                </div>
              </div>

              {/* Progreso */}
              {progress !== null && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium text-xs sm:text-sm">Tu progreso</span>
                    <span className="text-white font-bold text-sm">{formattedProgress}%</span>
                  </div>
                  <CourseProgress
                    variant={isCompleted ? "success" : "default"}
                    size="sm"
                    value={progress}
                  />
                </div>
              )}

              {/* Precio y botón */}
              <div className="flex items-center justify-between pt-2 gap-3">
                {isPurchased ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full" aria-hidden="true"></div>
                    <span className="text-green-400 font-medium text-xs sm:text-sm">ADQUIRIDO</span>
                  </div>
                ) : (
                  <div className="text-white flex-shrink-0">
                    {formattedPrice ? (
                      <span className="text-base sm:text-lg font-bold">{formattedPrice}</span>
                    ) : (
                      <span className="text-green-400 font-bold text-sm sm:text-base">GRATIS</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 hover:from-yellow-400/30 hover:to-yellow-500/30 text-yellow-400 font-medium text-xs sm:text-sm rounded-lg border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                  <Play className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{isPurchased ? 'CONTINUAR' : 'VER CURSO'}</span>
                  <span className="sm:hidden">{isPurchased ? 'IR' : 'VER'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
})

CourseCard.displayName = 'CourseCard'