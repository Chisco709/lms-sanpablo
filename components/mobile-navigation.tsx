"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, TrendingUp, Trophy, Search, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";

const navigationItems = [
  {
    name: "Inicio",
    href: "/student",
    icon: Home,
    description: "Dashboard principal"
  },
  {
    name: "Mis Cursos",
    href: "/student/courses",
    icon: BookOpen,
    description: "Cursos matriculados"
  },
  {
    name: "Progreso",
    href: "/progress",
    icon: TrendingUp,
    description: "Estadísticas de aprendizaje"
  },
  {
    name: "Logros",
    href: "/certificates",
    icon: Trophy,
    description: "Certificados y badges"
  },
  {
    name: "Explorar",
    href: "/search",
    icon: Search,
    description: "Buscar nuevos cursos"
  },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="p-2 rounded-xl bg-green-400/20 border border-green-400/30 transition-all duration-300 hover:bg-green-400/30"
        aria-label="Abrir menú de navegación"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-green-400" />
        ) : (
          <Menu className="w-6 h-6 text-green-400" />
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Menú lateral */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 left-0 w-80 h-full bg-black/95 backdrop-blur-xl border-r border-green-400/20 z-50 overflow-y-auto"
          >
            {/* Header del menú */}
            <div className="p-6 border-b border-green-400/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Navegación</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={closeMenu}
                  className="p-2 rounded-lg bg-green-400/20 border border-green-400/30"
                >
                  <X className="w-5 h-5 text-green-400" />
                </motion.button>
              </div>

              {/* Info del usuario */}
              <div className="flex items-center gap-3 p-3 bg-green-400/10 rounded-xl border border-green-400/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-yellow-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {user?.firstName || 'Estudiante'}
                  </p>
                  <p className="text-green-400 text-xs">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Items de navegación */}
            <div className="p-6 space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-green-400/20 hover:bg-green-400/10 hover:border-green-400/40 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                      <item.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">
                        {item.name}
                      </h3>
                      <p className="text-white/60 text-xs">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer del menú */}
            <div className="p-6 border-t border-green-400/20 mt-auto">
              <div className="space-y-3">
                {/* Configuración */}
                <Link
                  href="/settings"
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/10 hover:border-green-400/30 transition-all duration-300"
                >
                  <Settings className="w-5 h-5 text-white/60" />
                  <span className="text-white/80 text-sm">Configuración</span>
                </Link>

                {/* Cerrar sesión */}
                <SignOutButton>
                  <button className="flex items-center gap-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 w-full">
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">Cerrar Sesión</span>
                  </button>
                </SignOutButton>
              </div>

              {/* Versión */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs text-center">
                  Instituto San Pablo v1.0
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 