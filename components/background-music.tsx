'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // URLs de música lofi gratuita y sin derechos de autor
  const musicTracks = [
    "https://www.bensound.com/bensound-music/bensound-relaxing.mp3",
    "https://www.bensound.com/bensound-music/bensound-creative.mp3",
  ]
  
  const [currentTrack] = useState(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
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
      // Silenciar errores de audio
    }

    // Eventos del audio
    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('error', handleError)

    // Cleanup
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('error', handleError)
    }
  }, [isClient])

  // Función para iniciar música después de interacción del usuario
  const initializeMusic = async () => {
    if (!isClient) return
    
    const audio = audioRef.current
    if (!audio || hasInteracted) return

    try {
      await audio.play()
      setHasInteracted(true)
    } catch (error) {
      // Silenciar errores de reproducción
    }
  }

  // Detectar primera interacción del usuario para iniciar música
  useEffect(() => {
    if (!isClient || !isLoaded || hasInteracted || typeof document === 'undefined') return

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
  }, [isClient, isLoaded, hasInteracted])

  const toggleMute = async () => {
    if (!isClient) return
    
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
          // Silenciar errores de reproducción
        }
      }
      setIsMuted(false)
    } else {
      // Mutear
      audio.muted = true
      setIsMuted(true)
    }
  }

  // No mostrar nada si no está cargado o no está en el cliente
  if (!isLoaded || !isClient) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMute}
        className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        title={isMuted ? "Activar música de fondo" : "Silenciar música de fondo"}
        type="button"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
      
      {/* Audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        muted={isMuted}
        style={{ display: 'none' }}
      >
        <source src={musicTracks[currentTrack]} type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  )
}

export default BackgroundMusic
