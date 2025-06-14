'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  Music, 
  X,
  Headphones
} from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  duration: string
  mood: 'study' | 'focus' | 'relax'
  icon: string
}

const tracks: Track[] = [
  {
    id: "1",
    title: "Café de Estudios",
    artist: "Instituto San Pablo",
    url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    duration: "3:24",
    mood: "study", 
    icon: "☕"
  },
  {
    id: "2",
    title: "Concentración Profunda", 
    artist: "Academia Lofi",
    url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
    duration: "4:15",
    mood: "focus",
    icon: "🧠"
  },
  {
    id: "3",
    title: "Biblioteca Tranquila",
    artist: "Estudio Ambiente", 
    url: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3",
    duration: "5:02",
    mood: "relax",
    icon: "📚"
  },
  {
    id: "4",
    title: "Lluvia de Ideas",
    artist: "Pensamiento Creativo",
    url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3", 
    duration: "3:45",
    mood: "study",
    icon: "🌧️"
  },
  {
    id: "5",
    title: "Campus Nocturno",
    artist: "San Pablo Nights",
    url: "https://www.bensound.com/bensound-music/bensound-acoustic.mp3",
    duration: "4:32",
    mood: "relax",
    icon: "🌙"
  },
  {
    id: "6",
    title: "Mañana Productiva",
    artist: "Energía Positiva",
    url: "https://www.bensound.com/bensound-music/bensound-happiness.mp3",
    duration: "4:20",
    mood: "focus",
    icon: "🌅"
  }
]

export default function AmbientMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.3)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const current = audio.currentTime
      const total = audio.duration
      setProgress(total ? (current / total) * 100 : 0)
    }

    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % tracks.length)
      setIsPlaying(true)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    audio.volume = volume

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack, volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
    setIsPlaying(true)
  }

  const selectTrack = (index: number) => {
    setCurrentTrack(index)
    setIsPlaying(true)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    
    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'study': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
      case 'focus': return 'bg-blue-400/20 text-blue-400 border-blue-400/30'
      case 'relax': return 'bg-green-400/20 text-green-400 border-green-400/30'
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
    }
  }

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Botón flotante principal */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full shadow-2xl flex items-center justify-center text-black hover:scale-110 transition-transform duration-300 relative overflow-hidden"
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Music className="w-6 h-6" />
              </motion.div>
            ) : (
              <Headphones className="w-6 h-6" />
            )}
            
            {/* Ondas de sonido animadas */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-16 h-16 border-2 border-green-400/30 rounded-full animate-ping"></div>
                <div className="absolute w-20 h-20 border-2 border-yellow-400/20 rounded-full animate-ping delay-300"></div>
              </div>
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Panel del reproductor */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-black/95 backdrop-blur-xl border-2 border-green-400/30 rounded-2xl p-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-yellow-400 rounded-lg flex items-center justify-center">
                  <Music className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Música de Estudio</h3>
                  <p className="text-green-400 text-xs">Instituto San Pablo</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Track actual */}
            <div className="mb-4 p-3 bg-gradient-to-r from-green-400/10 to-yellow-400/10 rounded-xl border border-green-400/20">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{tracks[currentTrack]?.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm truncate">
                    {tracks[currentTrack]?.title}
                  </h4>
                  <p className="text-green-400 text-xs">
                    {tracks[currentTrack]?.artist} • {tracks[currentTrack]?.duration}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMoodColor(tracks[currentTrack]?.mood || 'study')}`}>
                  {tracks[currentTrack]?.mood.toUpperCase()}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="mt-3">
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-yellow-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controles principales */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={nextTrack}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <SkipForward className="w-5 h-5 text-white/80" />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white/80" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white/80" />
                )}
              </button>
            </div>

            {/* Control de volumen */}
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-4 h-4 text-white/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none slider"
              />
            </div>

            {/* Lista de tracks */}
            <div className="space-y-2 max-h-40 overflow-y-auto playlist-scroll">
              <h5 className="text-white/60 text-xs font-medium mb-2">PLAYLIST</h5>
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                    index === currentTrack
                      ? 'bg-green-400/20 border border-green-400/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{track.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        index === currentTrack ? 'text-green-400' : 'text-white'
                      }`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-white/60">{track.artist}</p>
                    </div>
                    <span className="text-xs text-white/40">{track.duration}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <p className="text-white/40 text-xs">
                🎵 Música para concentrarte y estudiar mejor
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS personalizados */}
      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #fbbf24);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
        }
        
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #fbbf24);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        
        .slider::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          height: 4px;
        }
        
        /* Animación de pulso para el botón cuando está reproduciendo */
        @keyframes pulse-music {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .music-pulse {
          animation: pulse-music 2s ease-in-out infinite;
        }
        
        /* Scrollbar personalizado para la playlist */
        .playlist-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .playlist-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        
        .playlist-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #10b981, #fbbf24);
          border-radius: 2px;
        }
        
        .playlist-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #059669, #d97706);
        }
      `}</style>
    </>
  )
} 