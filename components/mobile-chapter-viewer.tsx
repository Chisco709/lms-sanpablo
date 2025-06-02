'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  User, 
  Star,
  Download,
  Share2,
  MoreVertical,
  ArrowLeft,
  RotateCcw
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

interface Chapter {
  id: string
  title: string
  description: string
  duration: number
  videoUrl?: string
  isCompleted: boolean
  isLocked: boolean
  position: number
  resources?: {
    name: string
    url: string
    type: 'pdf' | 'doc' | 'video' | 'link'
  }[]
}

interface Course {
  id: string
  title: string
  instructor: string
  image: string
  progress: number
  chapters: Chapter[]
}

interface MobileChapterViewerProps {
  course: Course
  currentChapterId?: string
  onChapterComplete?: (chapterId: string) => void
  onBack?: () => void
}

export default function MobileChapterViewer({ 
  course, 
  currentChapterId, 
  onChapterComplete,
  onBack 
}: MobileChapterViewerProps) {
  const [activeChapterId, setActiveChapterId] = useState(currentChapterId || course.chapters[0]?.id)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showChapterList, setShowChapterList] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentChapter = course.chapters.find(c => c.id === activeChapterId)
  const currentIndex = course.chapters.findIndex(c => c.id === activeChapterId)
  const completedChapters = course.chapters.filter(c => c.isCompleted).length

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNextChapter = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < course.chapters.length) {
      const nextChapter = course.chapters[nextIndex]
      if (!nextChapter.isLocked) {
        setActiveChapterId(nextChapter.id)
        setVideoProgress(0)
      }
    }
  }

  const handlePrevChapter = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setActiveChapterId(course.chapters[prevIndex].id)
      setVideoProgress(0)
    }
  }

  const markAsCompleted = () => {
    if (currentChapter && onChapterComplete) {
      onChapterComplete(currentChapter.id)
    }
  }

  if (!currentChapter) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header mobile */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-green-400/20">
        <div className="flex items-center justify-between p-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 rounded-xl bg-black/60 border border-green-400/30"
          >
            <ArrowLeft className="w-5 h-5 text-green-400" />
          </motion.button>
          
          <div className="flex-1 mx-4">
            <h1 className="text-sm font-semibold text-white truncate">{course.title}</h1>
            <p className="text-xs text-green-400">{currentChapter.title}</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChapterList(true)}
            className="p-2 rounded-xl bg-black/60 border border-green-400/30"
          >
            <BookOpen className="w-5 h-5 text-yellow-400" />
          </motion.button>
        </div>

        {/* Progreso del curso */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span>Progreso del curso</span>
            <span>{Math.round(course.progress)}%</span>
          </div>
          <Progress value={course.progress} className="h-1" />
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {currentChapter.videoUrl ? (
          <video
            ref={videoRef}
            src={currentChapter.videoUrl}
            className="w-full h-full object-cover"
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement
              const progress = (video.currentTime / video.duration) * 100
              setVideoProgress(progress)
            }}
            onEnded={() => {
              setIsPlaying(false)
              markAsCompleted()
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-yellow-400/20 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-white/70">Contenido de lectura</p>
            </div>
          </div>
        )}

        {/* Controles de video overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </motion.button>
        </div>

        {/* Progreso del video */}
        {videoProgress > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              className="h-full bg-green-400 transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Información del capítulo */}
      <div className="p-4 space-y-4">
        {/* Header del capítulo */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full border border-green-400/30">
              Capítulo {currentChapter.position}
            </span>
            <span className="text-white/60 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(currentChapter.duration)}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">{currentChapter.title}</h2>
          <p className="text-white/70 text-sm leading-relaxed">{currentChapter.description}</p>
        </div>

        {/* Estado del capítulo */}
        <div className="flex items-center justify-between p-4 bg-green-400/10 rounded-xl border border-green-400/20">
          <div className="flex items-center gap-3">
            {currentChapter.isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-white/30" />
            )}
            <div>
              <p className="text-white font-semibold text-sm">
                {currentChapter.isCompleted ? 'Completado' : 'En progreso'}
              </p>
              <p className="text-white/60 text-xs">
                {currentChapter.isCompleted ? '¡Buen trabajo!' : 'Sigue aprendiendo'}
              </p>
            </div>
          </div>
          
          {!currentChapter.isCompleted && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={markAsCompleted}
              className="px-4 py-2 bg-green-400 text-black rounded-lg font-semibold text-sm"
            >
              Marcar completo
            </motion.button>
          )}
        </div>

        {/* Navegación entre capítulos */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevChapter}
            disabled={currentIndex === 0}
            className="flex-1 p-4 bg-black/60 border border-green-400/30 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <ChevronLeft className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Anterior</span>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNextChapter}
            disabled={currentIndex === course.chapters.length - 1 || course.chapters[currentIndex + 1]?.isLocked}
            className="flex-1 p-4 bg-gradient-to-r from-green-400 to-yellow-400 text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>

        {/* Recursos del capítulo */}
        {currentChapter.resources && currentChapter.resources.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-semibold">📚 Recursos adicionales</h3>
            <div className="space-y-2">
              {currentChapter.resources.map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="block p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{resource.name}</p>
                      <p className="text-white/60 text-xs capitalize">{resource.type}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de capítulos Modal */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowChapterList(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-h-[80vh] bg-gradient-to-b from-black via-zinc-900 to-black rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-green-400/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Capítulos</h3>
                  <span className="text-green-400 text-sm">
                    {completedChapters}/{course.chapters.length} completados
                  </span>
                </div>
              </div>

              {/* Lista de capítulos */}
              <div className="overflow-y-auto max-h-[60vh] p-6 space-y-3">
                {course.chapters.map((chapter, index) => (
                  <motion.button
                    key={chapter.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!chapter.isLocked) {
                        setActiveChapterId(chapter.id)
                        setShowChapterList(false)
                      }
                    }}
                    disabled={chapter.isLocked}
                    className={`
                      w-full p-4 rounded-xl border text-left transition-all duration-300
                      ${activeChapterId === chapter.id 
                        ? 'bg-green-400/20 border-green-400/30' 
                        : chapter.isLocked 
                          ? 'bg-white/5 border-white/10 opacity-50' 
                          : 'bg-black/60 border-green-400/20 hover:border-green-400/40'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {chapter.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : chapter.isLocked ? (
                          <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-green-400/50" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">
                            {chapter.position}. {chapter.title}
                          </span>
                          {activeChapterId === chapter.id && (
                            <span className="px-2 py-1 bg-green-400 text-black text-xs rounded-full font-medium">
                              Actual
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(chapter.duration)}
                          </span>
                          {chapter.isCompleted && (
                            <span className="text-green-400">✓ Completado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 