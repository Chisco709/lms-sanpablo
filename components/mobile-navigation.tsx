'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, BookOpen, Search, User, Settings, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'

interface MobileNavigationProps {
  className?: string
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  const router = useRouter()

  // Cerrar menú al navegar
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    {
      icon: Home,
      label: 'Inicio',
      href: '/student',
      description: 'Dashboard principal'
    },
    {
      icon: BookOpen,
      label: 'Mis Cursos',
      href: '/student/courses',
      description: 'Cursos en progreso'
    },
    {
      icon: Search,
      label: 'Explorar',
      href: '/search',
      description: 'Buscar nuevos cursos'
    },
    {
      icon: User,
      label: 'Mi Perfil',
      href: '/student/profile',
      description: 'Configuración de cuenta'
    }
  ]

  const isCurrentPath = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Botón Hamburguesa */}
      <div className={`md:hidden ${className}`}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-green-400/30 shadow-lg"
          aria-label="Abrir menú de navegación"
        >
          <motion.div
            animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-green-400" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menú Lateral */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-black via-zinc-900 to-black border-r border-green-400/30 z-50 md:hidden overflow-y-auto"
          >
            {/* Header del menú */}
            <div className="p-6 border-b border-green-400/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-green-400 bg-white overflow-hidden">
                  <Image
                    src="/logo-sanpablo.jpg"
                    alt="Instituto San Pablo"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-green-400">Instituto</h2>
                  <h3 className="text-lg font-bold text-yellow-400 -mt-1">San Pablo</h3>
                </div>
              </div>

              {/* Info del usuario */}
              {user && (
                <div className="bg-green-400/10 rounded-xl p-4 border border-green-400/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-yellow-400 flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">
                        {user.firstName || 'Estudiante'}
                      </p>
                      <p className="text-green-400 text-xs">
                        {user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navegación principal */}
            <div className="p-6">
              <h4 className="text-white/60 text-xs font-semibold uppercase mb-4 tracking-wide">
                Navegación
              </h4>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isCurrentPath(item.href)
                  
                  return (
                    <motion.div
                      key={item.href}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group
                          ${isActive 
                            ? 'bg-gradient-to-r from-green-400/20 to-yellow-400/20 border border-green-400/30 text-white' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-white/60 group-hover:text-green-400'}`} />
                        <div className="flex-1">
                          <p className={`font-semibold ${isActive ? 'text-white' : 'text-white/80'}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-white/50">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-white/40 group-hover:text-green-400'}`} />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Sección inferior */}
            <div className="mt-auto p-6 border-t border-green-400/20">
              {/* Progreso del estudiante */}
              <div className="bg-black/60 rounded-xl p-4 mb-4 border border-yellow-400/20">
                <h5 className="text-yellow-400 font-semibold text-sm mb-2">📊 Tu Progreso</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Cursos completados</span>
                    <span>3/5</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full w-3/5"></div>
                  </div>
                  <p className="text-green-400 text-xs font-medium">¡60% completado! 🎉</p>
                </div>
              </div>

              {/* Botón de configuración */}
              <Link
                href="/student/settings"
                className="flex items-center gap-3 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 mb-3"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Configuración</span>
              </Link>

              {/* Botón de cerrar sesión */}
              <SignOutButton>
                <button className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-300 w-full">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </SignOutButton>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs text-center">
                  Instituto San Pablo LMS v2.0
                </p>
                <p className="text-green-400/60 text-xs text-center mt-1">
                  Pereira, Risaralda 🇨🇴
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 