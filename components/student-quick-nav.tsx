"use client";

import Link from "next/link";
import { BookOpen, Compass, Trophy, Calendar, Users, TrendingUp, Target, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    title: "Mis Cursos",
    description: "Continúa tu aprendizaje",
    icon: BookOpen,
    href: "/student/courses",
    color: "from-yellow-400/20 to-yellow-400/10",
    iconColor: "text-yellow-400",
    borderColor: "border-yellow-400/20 hover:border-yellow-400/40"
  },
  {
    title: "Explorar",
    description: "Descubre nuevos cursos",
    icon: Compass,
    href: "/student/browse",
    color: "from-green-400/20 to-green-400/10",
    iconColor: "text-green-400",
    borderColor: "border-green-400/20 hover:border-green-400/40"
  },
  {
    title: "Progreso",
    description: "Revisa tus estadísticas",
    icon: TrendingUp,
    href: "/student/progress",
    color: "from-blue-400/20 to-blue-400/10",
    iconColor: "text-blue-400",
    borderColor: "border-blue-400/20 hover:border-blue-400/40"
  },
  {
    title: "Logros",
    description: "Tus certificados y badges",
    icon: Trophy,
    href: "/student/achievements",
    color: "from-purple-400/20 to-purple-400/10",
    iconColor: "text-purple-400",
    borderColor: "border-purple-400/20 hover:border-purple-400/40"
  },
];

export const StudentQuickNav = () => {
  return (
    <div className="w-full">
      {/* Título minimalista */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Acceso rápido</h2>
        <p className="text-gray-400">Navega por las secciones principales</p>
      </div>

      {/* Grid tipo Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-6 transition-all duration-500",
              "bg-gradient-to-br border backdrop-blur-sm",
              link.color,
              link.borderColor,
              "hover:scale-[1.02] hover:shadow-xl",
              "animate-in slide-in-from-bottom duration-500",
              `delay-${(index + 1) * 100}`
            )}
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>

            {/* Contenido */}
            <div className="relative z-10">
              {/* Icono */}
              <div className={cn(
                "w-12 h-12 rounded-xl bg-black/20 backdrop-blur-sm",
                "flex items-center justify-center mb-4",
                "group-hover:scale-110 transition-transform duration-300"
              )}>
                <link.icon className={cn("h-6 w-6", link.iconColor)} />
              </div>

              {/* Texto */}
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-gray-400">
                {link.description}
              </p>

              {/* Indicador de hover */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/10 rounded-full animate-pulse delay-700"></div>
          </Link>
        ))}
      </div>

      {/* Sección adicional - Learning Path */}
      <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 border border-white/5">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-green-400/20 flex items-center justify-center">
                <Brain className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                Nuevo
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Rutas de Aprendizaje Personalizadas
            </h3>
            <p className="text-gray-400 mb-6">
              Descubre cursos recomendados basados en tus intereses y objetivos profesionales
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-green-400 text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105">
              <Target className="h-5 w-5" />
              Comenzar mi ruta
            </button>
          </div>
          
          {/* Visual decorativo */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-48 h-48">
              {/* Órbitas animadas */}
              <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-2 border-green-400/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '10s' }}></div>
              <div className="absolute inset-8 rounded-full border border-purple-400/20 animate-spin-slow" style={{ animationDuration: '15s' }}></div>
              
              {/* Centro */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-green-400/20 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 