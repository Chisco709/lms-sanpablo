'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // URLs de música lofi gratuita y sin derechos de autor
  const musicTracks = [
    "https://www.bensound.com/bensound-music/bensound-relaxing.mp3",
    "https://www.bensound.com/bensound-music/bensound-creative.mp3",
  ]
  
  const [currentTrack] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Configuración profesional del audio
    audio.volume = 0.08 // Volumen muy bajo para música de fondo
    audio.loop = true
    audio.preload = 'auto'

    const handleCanPlayThrough = () => {
      setIsLoaded(true)
    }

    const handleError = () => {
      console.log('Error cargando música de fondo')
    }

    // Eventos del audio
    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('error', handleError)

    // Cleanup
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  // Función para iniciar música después de interacción del usuario
  const initializeMusic = async () => {
    const audio = audioRef.current
    if (!audio || hasInteracted) return

    try {
      await audio.play()
      setHasInteracted(true)
    } catch (error) {
      console.log('Autoplay bloqueado - esperando interacción del usuario')
    }
  }

  // Detectar primera interacción del usuario para iniciar música
  useEffect(() => {
    if (!isLoaded || hasInteracted) return

    const handleFirstInteraction = () => {
      initializeMusic()
      // Remover listeners después de la primera interacción
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    // Intentar reproducir después de 3 segundos
    const timer = setTimeout(() => {
      initializeMusic()
    }, 3000)

    // Listeners para detectar interacción del usuario
    document.addEventListener('click', handleFirstInteraction, { passive: true })
    document.addEventListener('scroll', handleFirstInteraction, { passive: true })
    document.addEventListener('keydown', handleFirstInteraction, { passive: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [isLoaded, hasInteracted])

  const toggleMute = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!hasInteracted) {
      // Primera interacción - iniciar música
      await initializeMusic()
    }

    if (isMuted) {
      // Desmutear
      audio.muted = false
      if (audio.paused) {
        try {
          await audio.play()
        } catch (error) {
          console.log('Error reproduciendo audio:', error)
        }
      }
      setIsMuted(false)
    } else {
      // Mutear
      audio.muted = true
      setIsMuted(true)
    }
  }

  // No mostrar nada si no está cargado
  if (!isLoaded) return null

  return (
    <>
      {/* Elemento de audio oculto */}
      <audio
        ref={audioRef}
        src={musicTracks[currentTrack]}
        loop
        preload="auto"
        style={{ display: 'none' }}
        playsInline
        muted={isMuted}
      />

      {/* Botón flotante profesional */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleMute}
          className={`
            w-12 h-12 rounded-full shadow-2xl flex items-center justify-center 
            transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95
            ${isMuted 
              ? 'bg-red-500/90 hover:bg-red-400/90 text-white border-2 border-red-400/50 shadow-red-500/25' 
              : 'bg-green-400/90 hover:bg-green-300/90 text-black border-2 border-green-400/50 shadow-green-400/25'
            }
          `}
          title={isMuted ? 'Activar música de fondo' : 'Silenciar música de fondo'}
          aria-label={isMuted ? 'Activar música de fondo' : 'Silenciar música de fondo'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        {/* Indicador visual discreto cuando está activo */}
        {!isMuted && hasInteracted && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
        )}

        {/* Tooltip de ayuda para primera vez */}
        {!hasInteracted && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Música ambiente del Instituto San Pablo
          </div>
        )}
      </div>
    </>
  )
}

export default BackgroundMusic
