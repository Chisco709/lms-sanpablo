"use client";

import { BookOpen, Search, Target, Users, Award, TrendingUp, Zap, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickNavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  description: string;
}

const quickNavItems: QuickNavItem[] = [
  {
    icon: BookOpen,
    label: "Mis Cursos",
    href: "/student",
    description: "Ver mis clases"
  },
  {
    icon: Search,
    label: "Buscar",
    href: "/search",
    description: "Encontrar cursos"
  },
  {
    icon: Target,
    label: "Metas",
    href: "/goals",
    description: "Mis objetivos"
  },
  {
    icon: TrendingUp,
    label: "Progreso",
    href: "/progress",
    description: "Cómo voy"
  },
  {
    icon: Users,
    label: "Comunidad",
    href: "/community",
    description: "Otros estudiantes"
  },
  {
    icon: Award,
    label: "Certificados",
    href: "/certificates",
    description: "Mis logros"
  }
];

export const StudentQuickNav = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-green-400 rounded-lg flex items-center justify-center">
            <Zap className="h-3 w-3 text-black" />
          </div>
          <h3 className="text-lg font-bold text-white">Acceso Rápido</h3>
        </div>
        <p className="text-slate-400">Navega fácilmente</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickNavItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 animate-in fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative p-4 bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/50 hover:border-yellow-400/30">
              
              <div className="text-center space-y-3">
                {/* Icono */}
                <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <item.icon className="h-5 w-5 text-black" />
                </div>
                
                {/* Contenido */}
                <div>
                  <h4 className="font-semibold text-sm text-white mb-1 group-hover:text-yellow-400 transition-colors duration-300">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Línea decorativa */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-3/4"></div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Mensaje simple */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
          <Rocket className="h-3 w-3 text-green-400" />
          <span className="text-slate-300 text-xs font-medium">¡Sigue aprendiendo!</span>
        </div>
      </div>
    </div>
  );
}; 