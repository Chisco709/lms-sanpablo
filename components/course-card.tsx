"use client"

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Clock, DollarSign, ArrowRight } from "lucide-react"
import { IconBadge } from "@/components/icon-badge"
import { formatPrice } from "@/lib/format"
import { CourseProgress } from "@/components/course-progress"

interface CourseCardProps {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
  description?: string
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  description
}: CourseCardProps) => {
  return (
    <Link 
      href={`/courses/${id}`}
      className="group relative h-full"
    >
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5 transition-all duration-500 hover:border-yellow-400/20 hover:shadow-2xl hover:shadow-yellow-400/10 hover:-translate-y-1">
        {/* Imagen con overlay de gradiente */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-yellow-400/10 to-green-400/10">
          <Image
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            alt={title}
            src={imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent opacity-60"></div>
          
          {/* Categoría badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium text-black bg-yellow-400 rounded-full">
              {category}
            </span>
          </div>
          
          {/* Progress indicator si existe */}
          {progress !== null && (
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Título */}
          <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">
            {title}
          </h3>
          
          {/* Descripción si existe */}
          {description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {description}
            </p>
          )}

          {/* Información del curso */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-400">
              <BookOpen className="h-4 w-4" />
              <span>{chaptersLength} {chaptersLength === 1 ? "capítulo" : "capítulos"}</span>
            </div>
            
            {progress === null && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>2-3 horas</span>
              </div>
            )}
          </div>

          {/* Precio o progreso */}
          <div className="pt-4 border-t border-white/5">
            {progress !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Progreso del curso</span>
                  <span className="text-green-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <CourseProgress
                  variant="success"
                  size="sm"
                  value={progress}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {price === 0 ? "Gratis" : formatPrice(price)}
                </span>
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors duration-300">
                  <ArrowRight className="h-5 w-5 text-yellow-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Efecto hover decorativo */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-1 -left-1 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-green-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </Link>
  )
} 