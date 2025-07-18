'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target,
  Play,
  ChevronRight,
  Star,
  Calendar,
  Bell,
  Search,
  Filter,
  Grid3X3,
  List,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import MobileNavigation from './mobile-navigation'

interface Course {
  id: string
  title: string
  progress: number
  totalChapters: number
  completedChapters: number
  instructor: string
  image: string
  category: string
  nextChapter?: string
  lastAccessed?: Date
  estimatedTime?: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress?: number
}

interface Activity {
  id: string
  type: 'completed_chapter' | 'started_course' | 'achievement' | 'streak'
  title: string
  subtitle: string
  timestamp: Date
  courseTitle?: string
}

// Datos mock comentados - usar datos reales en producción
const mockCourses: Course[] = [];

const mockAchievements: Achievement[] = [];

const mockActivities: Activity[] = [];

interface MobileStudentDashboardProps {
  courses?: Course[]
  achievements?: Achievement[]
  activities?: Activity[]
}

export default function MobileStudentDashboard({
  courses = mockCourses,
  achievements = mockAchievements,
  activities = mockActivities
}: MobileStudentDashboardProps) {
  const { user } = useUser()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const totalProgress = courses.reduce((acc, course) => acc + course.progress, 0) / courses.length
  const totalCompletedChapters = courses.reduce((acc, course) => acc + course.completedChapters, 0)
  const studyStreak = 7 // Días consecutivos estudiando

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return '¡Buenos días'
    if (hour < 18) return '¡Buenas tardes'
    return '¡Buenas noches'
  }

  const formatLastAccessed = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    return `Hace ${Math.floor(diffInHours / 24)} día${Math.floor(diffInHours / 24) > 1 ? 's' : ''}`
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-400/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header Mobile */}
      <div className="relative z-10 sticky top-0 bg-black/90 backdrop-blur-xl border-b border-green-400/20">
        <div className="flex items-center justify-between p-4">
          {/* Saludo y navegación */}
          <div className="flex items-center gap-3">
            <MobileNavigation />
            <div>
              <h1 className="text-lg font-bold text-white">
                {getGreeting()}, {user?.firstName || 'Estudiante'}! 👋
              </h1>
              <p className="text-green-400 text-sm">Continuemos aprendiendo</p>
            </div>
          </div>

          {/* Notificaciones */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-black/60 border border-green-400/30 relative"
          >
            <Bell className="w-5 h-5 text-green-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>
        </div>

        {/* Stats rápidas */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-400/10 rounded-xl p-3 border border-green-400/20 text-center">
              <div className="text-green-400 font-bold text-lg">{Math.round(totalProgress)}%</div>
              <div className="text-white/70 text-xs">Progreso total</div>
            </div>
            <div className="bg-yellow-400/10 rounded-xl p-3 border border-yellow-400/20 text-center">
              <div className="text-yellow-400 font-bold text-lg">{totalCompletedChapters}</div>
              <div className="text-white/70 text-xs">Capítulos</div>
            </div>
            <div className="bg-orange-400/10 rounded-xl p-3 border border-orange-400/20 text-center">
              <div className="text-orange-400 font-bold text-lg flex items-center justify-center gap-1">
                <span>{studyStreak}</span>
                <span className="text-sm">🔥</span>
              </div>
              <div className="text-white/70 text-xs">Días seguidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-4 space-y-6">
        
        {/* Sección de cursos activos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-400" />
              Mis Cursos
            </h2>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg bg-black/60 border border-green-400/30"
              >
                {viewMode === 'grid' ? 
                  <List className="w-4 h-4 text-green-400" /> : 
                  <Grid3X3 className="w-4 h-4 text-green-400" />
                }
              </motion.button>
            </div>
          </div>

          <div className={`${viewMode === 'grid' ? 'space-y-4' : 'space-y-3'}`}>
            {courses.map((course) => (
              <motion.div
                key={course.id}
                whileTap={{ scale: 0.98 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl border border-green-400/20 overflow-hidden"
              >
                <Link href={`/student/courses/${course.id}`}>
                  {viewMode === 'grid' ? (
                    // Vista de tarjeta
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-green-400/20 to-yellow-400/20">
                          <Image
                            src={course.image}
                            alt={course.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white text-sm">{course.title}</h3>
                              <p className="text-green-400 text-xs">{course.instructor}</p>
                              <span className="inline-block px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full mt-1">
                                {course.category}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/40" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-white/70">
                              <span>{course.completedChapters}/{course.totalChapters} capítulos</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          
                          {course.nextChapter && (
                            <div className="mt-3 p-2 bg-green-400/10 rounded-lg border border-green-400/20">
                              <p className="text-green-400 text-xs font-medium">Siguiente:</p>
                              <p className="text-white text-xs">{course.nextChapter}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-white/60" />
                                <span className="text-white/60 text-xs">{course.estimatedTime} min</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <span className="text-white/60 text-xs">
                          {formatLastAccessed(course.lastAccessed!)}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-400 to-yellow-400 text-black rounded-lg font-semibold text-xs"
                        >
                          <Play className="w-3 h-3" />
                          Continuar
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    // Vista de lista
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-green-400/20 to-yellow-400/20">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{course.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <span>{course.progress}%</span>
                          <span>•</span>
                          <span>{course.completedChapters}/{course.totalChapters}</span>
                        </div>
                        <Progress value={course.progress} className="h-1 mt-2" />
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Logros */}
        <section>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Logros
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-4 rounded-2xl border transition-all duration-300
                  ${achievement.unlockedAt 
                    ? 'bg-yellow-400/10 border-yellow-400/30' 
                    : 'bg-white/5 border-white/20'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.unlockedAt ? 'text-yellow-400' : 'text-white/70'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-white/60 text-sm">{achievement.description}</p>
                    
                    {achievement.progress && !achievement.unlockedAt && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                          <span>Progreso</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1" />
                      </div>
                    )}
                    
                    {achievement.unlockedAt && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-medium">Desbloqueado</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Actividad reciente */}
        <section>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Actividad Reciente
          </h2>
          
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 bg-black/40 rounded-xl border border-green-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'completed_chapter' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    {activity.type === 'achievement' && <Trophy className="w-4 h-4 text-yellow-400" />}
                    {activity.type === 'started_course' && <Play className="w-4 h-4 text-blue-400" />}
                    {activity.type === 'streak' && <Sparkles className="w-4 h-4 text-orange-400" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{activity.title}</h4>
                    <p className="text-white/70 text-sm">{activity.subtitle}</p>
                    {activity.courseTitle && (
                      <p className="text-green-400 text-xs mt-1">{activity.courseTitle}</p>
                    )}
                    <p className="text-white/50 text-xs mt-1">
                      {activity.timestamp.toLocaleTimeString('es-CO', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="pb-8">
          <div className="bg-gradient-to-r from-green-400/20 to-yellow-400/20 rounded-2xl p-6 border border-green-400/30">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">¡Sigue aprendiendo!</h3>
              <p className="text-white/70 text-sm mb-4">
                Explora nuevos cursos y amplía tus conocimientos
              </p>
              <Link href="/search">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-green-400 to-yellow-400 text-black rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Explorar Cursos
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 