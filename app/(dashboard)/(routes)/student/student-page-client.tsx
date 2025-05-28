"use client"

import { useState, useEffect } from "react"
import { CoursesList } from "@/components/courses-list"
import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { BookOpen, Search, HelpCircle } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  imageUrl: string | null
  chapters: { id: string }[]
  category: { name: string } | null
  purchases: any[]
  progress: number | null
  isPurchased: boolean
  price: number | null
  description?: string | null
}

interface StudentPageClientProps {
  purchasedCourses: Course[]
  availableCourses: Course[]
}

export const StudentPageClient = ({ purchasedCourses, availableCourses }: StudentPageClientProps) => {
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // Mostrar tutorial solo si es la primera vez que visita
    const hasSeenTutorial = localStorage.getItem('sanpablo-tutorial-seen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  const handleCloseTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('sanpablo-tutorial-seen', 'true')
  }

  const startTutorial = () => {
    setShowTutorial(true)
  }

  return (
    <>
      <div className="min-h-screen bg-[#0F172A] px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Saludo creativo y bonito */}
          <div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-8 border border-slate-700/50 backdrop-blur-sm"
            data-tutorial="welcome-section"
          >
            {/* Efectos decorativos de fondo */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">👋</span>
                <span className="text-4xl">🎓</span>
              </div>
              
              <h1 className="text-2xl font-bold text-white">
                ¡Hola! Bienvenido a Instituto San Pablo
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <span className="text-lg">📚</span>
                <p className="text-base">Aquí están tus cursos disponibles</p>
                <span className="text-lg">✨</span>
              </div>

              {/* Botón de ayuda/tutorial */}
              <button
                onClick={startTutorial}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 mt-4"
              >
                <HelpCircle className="h-4 w-4" />
                ¿Necesitas ayuda? Ver tutorial
              </button>
            </div>
          </div>

          {/* Mis Cursos - Mejorado */}
          {purchasedCourses.length > 0 && (
            <div className="space-y-6" data-tutorial="progress-section">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-yellow-400/10 p-6 border border-green-500/20 backdrop-blur-sm">
                {/* Efectos decorativos */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-green-400/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">📖</span>
                    <h2 className="text-2xl font-bold text-white">MIS CURSOS</h2>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <p className="text-slate-300">Continúa donde lo dejaste</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-yellow-400/10 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                <CoursesList items={purchasedCourses} />
              </div>
            </div>
          )}

          {/* Cursos Disponibles - Mejorado */}
          <div className="space-y-6" data-tutorial="courses-section">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-purple-500/10 p-6 border border-blue-500/20 backdrop-blur-sm">
              {/* Efectos decorativos */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🚀</span>
                  <h2 className="text-2xl font-bold text-white">CURSOS DISPONIBLES</h2>
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-300">
                  <span>🎯</span>
                  <p>Técnico en Primera Infancia</p>
                  <span>•</span>
                  <p>Técnico en Inglés</p>
                  <span className="text-2xl">🌟</span>
                </div>
              </div>
            </div>

            {availableCourses.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                <CoursesList items={availableCourses} />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-12 border border-slate-700/50 backdrop-blur-sm">
                {/* Efectos decorativos */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-3xl">⏳</span>
                    <span className="text-3xl">📚</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">¡Próximamente!</h3>
                    <p className="text-slate-300 max-w-md mx-auto">
                      Estamos preparando los cursos de Técnico en Primera Infancia y Técnico en Inglés para ti.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Si no tiene cursos - Mejorado */}
          {purchasedCourses.length === 0 && availableCourses.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-yellow-400/10 p-12 border border-green-500/20 backdrop-blur-sm">
              {/* Efectos decorativos */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-3xl">🎯</span>
                  <span className="text-3xl">📈</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">¡Comienza tu aprendizaje!</h3>
                  <p className="text-slate-300 max-w-lg mx-auto">
                    Aún no tienes cursos. Explora nuestros programas técnicos y comienza tu formación profesional.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial interactivo */}
      <InteractiveTutorial 
        isOpen={showTutorial} 
        onClose={handleCloseTutorial} 
      />
    </>
  )
} 