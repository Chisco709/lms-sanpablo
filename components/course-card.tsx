"use client"

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Clock, Play } from "lucide-react"
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
  isPurchased?: boolean
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  isPurchased,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group course-card bg-slate-800 rounded-lg overflow-hidden hover:border-green-400/50 transition-all duration-200" style={{ borderWidth: '1px', borderColor: '#334155' }}>
        <div className="relative w-full aspect-video">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl || "/placeholder.png"}
          />
          {isPurchased && (
            <div className="absolute top-2 right-2 bg-green-400 text-slate-900 px-2 py-1 text-xs rounded font-medium">
              Inscrito
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-2 py-1 text-xs rounded">
            {category}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="p-4 space-y-3 bg-slate-800">
          <h3 className="text-white font-medium text-sm line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
          
          <div className="flex items-center text-xs text-slate-400">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>{chaptersLength} clases</span>
          </div>

          {progress !== null ? (
            <div className="space-y-2">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
              <p className="text-xs text-slate-400">
                {Math.round(progress)}% completado
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                {price === 0 ? (
                  <span className="text-green-400">Gratis</span>
                ) : (
                  <span>{formatPrice(price)}</span>
                )}
              </p>
              <div className="flex items-center text-xs text-slate-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>3h 20m</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
} 