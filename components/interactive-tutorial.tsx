"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft, Play, BookOpen, User, Trophy, Home, CheckCircle, GraduationCap, Clock, Star, Target, Zap, ChevronDown, ChevronUp } from "lucide-react"

interface TutorialStep {
  id: number
  title: string
  description: string
  detailedExplanation: string
  target: string
  preferredPosition: 'top' | 'bottom' | 'left' | 'right' | 'center'
  icon: React.ReactNode
  actionText?: string
  tips?: string[]
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenido al Instituto San Pablo! 🎓",
    description: "¡Hola! Soy tu guía virtual y te voy a enseñar cómo usar esta plataforma educativa paso a paso.",
    detailedExplanation: "Esta es tu plataforma de aprendizaje donde podrás estudiar los programas técnicos de Primera Infancia e Inglés. Todo está diseñado para ser súper fácil de usar, ¡incluso si nunca has usado una computadora antes!",
    target: "welcome-section",
    preferredPosition: "left",
    icon: <GraduationCap className="h-5 w-5" />,
    actionText: "Haz clic en 'Siguiente' para comenzar el recorrido",
    tips: [
      "💡 Puedes saltar este tutorial en cualquier momento",
      "🔄 Si te pierdes, siempre puedes volver a ver este tutorial"
    ]
  },
  {
    id: 2,
    title: "Aquí están todos tus cursos 📚",
    description: "Esta es la sección más importante: aquí verás todos los cursos disponibles para ti.",
    detailedExplanation: "En estas tarjetas verás los programas técnicos disponibles. Cada tarjeta muestra el nombre del curso, una imagen y un botón para entrar. Es como tener todos tus libros organizados en un estante virtual.",
    target: "courses-section",
    preferredPosition: "left",
    icon: <BookOpen className="h-5 w-5" />,
    actionText: "Observa las tarjetas de cursos aquí",
    tips: [
      "🎯 Haz clic en cualquier curso para entrar",
      "📊 Verás tu progreso en cada curso"
    ]
  },
  {
    id: 3,
    title: "Tu progreso personal 📈",
    description: "Aquí puedes ver qué tan bien vas en tus estudios. ¡Es como un reporte de calificaciones!",
    detailedExplanation: "Esta sección te muestra estadísticas importantes: cuántos cursos has completado, tu progreso actual y tus logros. Es como tener un entrenador personal que te dice cómo vas.",
    target: "progress-section",
    preferredPosition: "left",
    icon: <Target className="h-5 w-5" />,
    actionText: "Revisa tus estadísticas de progreso",
    tips: [
      "📈 Tu progreso se actualiza en tiempo real",
      "🏆 Ganarás insignias por completar cursos"
    ]
  },
  {
    id: 4,
    title: "Menú de navegación principal 🧭",
    description: "Este es tu menú principal para moverte por toda la plataforma.",
    detailedExplanation: "Desde aquí puedes ir a diferentes secciones: tus cursos, tu progreso, certificados y configuración. Es como el mapa de un centro comercial que te dice dónde está cada tienda.",
    target: "sidebar",
    preferredPosition: "right",
    icon: <Home className="h-5 w-5" />,
    actionText: "Explora las opciones del menú",
    tips: [
      "🏠 'Inicio' te trae de vuelta a esta página",
      "📜 'Certificados' muestra tus diplomas"
    ]
  },
  {
    id: 5,
    title: "Cómo entrar a un curso 🚪",
    description: "Te voy a explicar exactamente cómo empezar a estudiar.",
    detailedExplanation: "Para entrar a un curso, simplemente haz clic en la tarjeta del curso que quieres estudiar. Es como abrir un libro: haces clic y se abre automáticamente en la primera página.",
    target: "courses-section",
    preferredPosition: "left",
    icon: <Zap className="h-5 w-5" />,
    actionText: "Haz clic en cualquier curso para entrar",
    tips: [
      "👆 Un solo clic es suficiente",
      "📖 Empezarás desde donde lo dejaste"
    ]
  },
  {
    id: 6,
    title: "Tiempo de estudio recomendado ⏰",
    description: "Te doy algunos consejos sobre cuánto tiempo estudiar cada día.",
    detailedExplanation: "Recomendamos estudiar entre 30 minutos y 1 hora por día. Es mejor estudiar un poquito todos los días que muchas horas de vez en cuando. ¡La constancia es la clave del éxito!",
    target: "progress-section",
    preferredPosition: "left",
    icon: <Clock className="h-5 w-5" />,
    actionText: "Planifica tu tiempo de estudio",
    tips: [
      "⏰ 30-60 minutos diarios es perfecto",
      "📅 Estudia a la misma hora cada día"
    ]
  },
  {
    id: 7,
    title: "¡Felicitaciones! Ya sabes usar la plataforma 🎉",
    description: "Has completado el tutorial. ¡Ahora estás listo para comenzar tu aprendizaje!",
    detailedExplanation: "Ya conoces todo lo básico para usar la plataforma. Recuerda: si tienes dudas, siempre puedes volver a ver este tutorial. ¡Mucho éxito en tus estudios y que disfrutes aprendiendo!",
    target: "courses-section",
    preferredPosition: "center",
    icon: <Star className="h-5 w-5" />,
    actionText: "¡Comienza a estudiar ahora!",
    tips: [
      "🎓 ¡Estás listo para ser un estudiante exitoso!",
      "🌟 ¡Creemos en ti!"
    ]
  }
]

interface InteractiveTutorialProps {
  isOpen: boolean
  onClose: () => void
}

interface ElementBounds {
  top: number
  left: number
  width: number
  height: number
  right: number
  bottom: number
}

interface TutorialPosition {
  top: number
  left: number
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

export const InteractiveTutorial = ({ isOpen, onClose }: InteractiveTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [elementBounds, setElementBounds] = useState<ElementBounds | null>(null)
  const [tutorialPosition, setTutorialPosition] = useState<TutorialPosition>({ top: 50, left: 50, position: 'center' })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const calculateOptimalPosition = (element: HTMLElement, preferredPosition: string): TutorialPosition => {
    const bounds = element.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const tutorialWidth = 380 // Más compacto
    const tutorialHeight = showDetails ? 420 : 280 // Altura dinámica
    const margin = 30

    // Actualizar bounds del elemento
    setElementBounds({
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
      right: bounds.right,
      bottom: bounds.bottom
    })

    let position: TutorialPosition = { top: 50, left: 50, position: 'center' }

    switch (preferredPosition) {
      case 'left':
        if (bounds.left > tutorialWidth + margin) {
          position = {
            top: Math.max(margin, Math.min(bounds.top + bounds.height / 2 - tutorialHeight / 2, windowHeight - tutorialHeight - margin)),
            left: bounds.left - tutorialWidth - margin,
            position: 'left'
          }
        } else {
          position = {
            top: Math.min(bounds.bottom + margin, windowHeight - tutorialHeight - margin),
            left: Math.max(margin, Math.min(bounds.left, windowWidth - tutorialWidth - margin)),
            position: 'bottom'
          }
        }
        break

      case 'top':
        if (bounds.top > tutorialHeight + margin) {
          position = {
            top: bounds.top - tutorialHeight - margin,
            left: Math.max(margin, Math.min(bounds.left + bounds.width / 2 - tutorialWidth / 2, windowWidth - tutorialWidth - margin)),
            position: 'top'
          }
        } else {
          position = {
            top: bounds.bottom + margin,
            left: Math.max(margin, Math.min(bounds.left + bounds.width / 2 - tutorialWidth / 2, windowWidth - tutorialWidth - margin)),
            position: 'bottom'
          }
        }
        break

      case 'bottom':
        if (windowHeight - bounds.bottom > tutorialHeight + margin) {
          position = {
            top: bounds.bottom + margin,
            left: Math.max(margin, Math.min(bounds.left + bounds.width / 2 - tutorialWidth / 2, windowWidth - tutorialWidth - margin)),
            position: 'bottom'
          }
        } else {
          position = {
            top: Math.max(margin, bounds.top - tutorialHeight - margin),
            left: Math.max(margin, Math.min(bounds.left + bounds.width / 2 - tutorialWidth / 2, windowWidth - tutorialWidth - margin)),
            position: 'top'
          }
        }
        break

      case 'right':
        if (windowWidth - bounds.right > tutorialWidth + margin) {
          position = {
            top: Math.max(margin, Math.min(bounds.top + bounds.height / 2 - tutorialHeight / 2, windowHeight - tutorialHeight - margin)),
            left: bounds.right + margin,
            position: 'right'
          }
        } else {
          position = {
            top: Math.max(margin, Math.min(bounds.top + bounds.height / 2 - tutorialHeight / 2, windowHeight - tutorialHeight - margin)),
            left: Math.max(margin, bounds.left - tutorialWidth - margin),
            position: 'left'
          }
        }
        break

      case 'center':
      default:
        position = {
          top: windowHeight / 2 - tutorialHeight / 2,
          left: windowWidth / 2 - tutorialWidth / 2,
          position: 'center'
        }
        break
    }

    return position
  }

  useEffect(() => {
    if (!isOpen) return

    const step = tutorialSteps[currentStep]
    if (step) {
      setIsAnimating(true)
      setShowDetails(false) // Reset details when changing step
      
      const timer = setTimeout(() => {
        const element = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement
        setHighlightedElement(element)
        
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })
          
          setTimeout(() => {
            const optimalPosition = calculateOptimalPosition(element, step.preferredPosition)
            setTutorialPosition(optimalPosition)
            setIsAnimating(false)
          }, 700)
        } else {
          setIsAnimating(false)
        }
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [currentStep, isOpen])

  // Recalcular cuando cambia showDetails
  useEffect(() => {
    if (highlightedElement && isOpen) {
      const step = tutorialSteps[currentStep]
      const optimalPosition = calculateOptimalPosition(highlightedElement, step.preferredPosition)
      setTutorialPosition(optimalPosition)
    }
  }, [showDetails])

  useEffect(() => {
    const handleResize = () => {
      if (highlightedElement && isOpen) {
        const step = tutorialSteps[currentStep]
        const optimalPosition = calculateOptimalPosition(highlightedElement, step.preferredPosition)
        setTutorialPosition(optimalPosition)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [highlightedElement, currentStep, isOpen, showDetails])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    localStorage.setItem('sanpablo-tutorial-seen', 'true')
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem('sanpablo-tutorial-seen', 'true')
    onClose()
  }

  if (!isOpen) return null

  const step = tutorialSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === tutorialSteps.length - 1
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  return (
    <>
      {/* Overlay oscuro con gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 z-[9998] transition-all duration-500" />
      
      {/* Spotlight effect súper mejorado */}
      {highlightedElement && elementBounds && (
        <>
          {/* Spotlight principal con efecto de respiración */}
          <div 
            className="fixed z-[9999] pointer-events-none transition-all duration-1000 ease-out"
            style={{
              top: elementBounds.top - 20,
              left: elementBounds.left - 20,
              width: elementBounds.width + 40,
              height: elementBounds.height + 40,
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: `
                0 0 0 4px rgba(34, 197, 94, 1),
                0 0 0 12px rgba(34, 197, 94, 0.8),
                0 0 0 24px rgba(34, 197, 94, 0.6),
                0 0 0 36px rgba(34, 197, 94, 0.4),
                0 0 0 48px rgba(34, 197, 94, 0.2),
                0 0 0 9999px rgba(0, 0, 0, 0.75)
              `,
              borderRadius: '24px',
              border: '4px solid rgba(34, 197, 94, 0.9)',
            }}
          />
          
          {/* Efecto de brillo pulsante */}
          <div 
            className="fixed z-[9999] pointer-events-none transition-all duration-1000 ease-out animate-pulse"
            style={{
              top: elementBounds.top - 12,
              left: elementBounds.left - 12,
              width: elementBounds.width + 24,
              height: elementBounds.height + 24,
              background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3))',
              borderRadius: '20px',
              border: '3px solid rgba(34, 197, 94, 0.7)',
            }}
          />

          {/* Partículas flotantes alrededor del elemento */}
          <div 
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: elementBounds.top - 30,
              left: elementBounds.left - 30,
              width: elementBounds.width + 60,
              height: elementBounds.height + 60,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Tutorial card compacto y optimizado */}
      <div 
        className={`fixed z-[10000] w-[380px] transition-all duration-700 ease-out ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
        style={{
          top: `${tutorialPosition.top}px`,
          left: `${tutorialPosition.left}px`,
        }}
      >
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl border-2 border-green-400/50 shadow-2xl shadow-green-400/40 backdrop-blur-xl overflow-hidden">
          {/* Flecha indicadora */}
          {tutorialPosition.position !== 'center' && (
            <div 
              className={`absolute w-5 h-5 bg-slate-800 border-2 border-green-400/50 transform rotate-45 ${
                tutorialPosition.position === 'top' ? 'bottom-[-10px] left-1/2 -translate-x-1/2 border-b border-r' :
                tutorialPosition.position === 'bottom' ? 'top-[-10px] left-1/2 -translate-x-1/2 border-t border-l' :
                tutorialPosition.position === 'left' ? 'right-[-10px] top-1/2 -translate-y-1/2 border-t border-r' :
                'left-[-10px] top-1/2 -translate-y-1/2 border-b border-l'
              }`}
            />
          )}

          {/* Header compacto */}
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{step.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-400 text-xs font-medium">Paso {currentStep + 1} de {tutorialSteps.length}</span>
                    <div className="flex gap-1">
                      {[...Array(tutorialSteps.length)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i <= currentStep ? 'bg-green-400' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Cerrar tutorial"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content compacto */}
          <div className="p-4 space-y-3">
            {/* Descripción principal */}
            <p className="text-slate-200 leading-relaxed text-sm font-medium">
              {step.description}
            </p>

            {/* Botón para mostrar/ocultar detalles */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 text-xs font-medium transition-colors duration-200"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showDetails ? 'Ocultar detalles' : 'Ver más detalles'}
            </button>

            {/* Contenido expandible */}
            {showDetails && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <p className="text-slate-300 leading-relaxed text-xs">
                  {step.detailedExplanation}
                </p>

                {/* Acción recomendada */}
                {step.actionText && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                        <Target className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-green-300 font-medium text-xs">{step.actionText}</p>
                    </div>
                  </div>
                )}

                {/* Tips útiles */}
                {step.tips && step.tips.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold flex items-center gap-2 text-xs">
                      <Star className="h-3 w-3 text-yellow-400" />
                      Tips útiles:
                    </h4>
                    <div className="space-y-1">
                      {step.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 text-slate-300 text-xs">
                          <span className="text-yellow-400 mt-0.5 text-xs">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress bar compacta */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Progreso</span>
                <span className="text-green-400 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons fijos en la parte inferior */}
          <div className="bg-slate-800/50 p-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg hover:bg-slate-700/50 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkip}
                  className="px-3 py-2 text-slate-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-700/50 text-sm"
                >
                  Saltar
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/30 text-sm"
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      ¡Finalizar!
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 