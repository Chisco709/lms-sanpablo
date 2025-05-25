"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LogOut, Crown, Heart, Bell, Home, Search } from "lucide-react";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");
  const isCoursePage = pathname?.includes('/courses/') && !pathname?.includes('/teacher/courses');

  return (
    <div className={`flex items-center ${isCoursePage ? 'flex-col space-y-4 w-full' : 'space-x-4'}`}>
      {/* Enlaces de navegación principales - Solo en drawer de curso */}
      {isCoursePage && (
        <div className="w-full space-y-2">
          <Link 
            href="/student"
            className="flex items-center gap-3 w-full p-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <Link 
            href="/search"
            className="flex items-center gap-3 w-full p-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            <Search className="h-5 w-5" />
            <span>Explorar Cursos</span>
          </Link>
        </div>
      )}

      {/* Separador en drawer */}
      {isCoursePage && <div className="w-full h-px bg-slate-800/50" />}

      {/* Icono de favoritos */}
      <button 
        className={`p-2 text-slate-400 hover:text-white transition-colors ${
          isCoursePage ? 'w-full flex items-center gap-3 justify-start' : ''
        }`}
        title="Favoritos"
        aria-label="Ver favoritos"
      >
        <Heart className="h-5 w-5" />
        {isCoursePage && <span>Favoritos</span>}
      </button>
      
      {/* Notificaciones */}
      <button 
        className={`p-2 text-slate-400 hover:text-white transition-colors relative ${
          isCoursePage ? 'w-full flex items-center gap-3 justify-start' : ''
        }`}
        title="Notificaciones"
        aria-label="Ver notificaciones"
      >
        <Bell className="h-5 w-5" />
        {isCoursePage && <span>Notificaciones</span>}
        <span className={`absolute bg-green-400 text-slate-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
          isCoursePage ? '-top-1 left-7' : '-top-1 -right-1'
        }`}>
          0
        </span>
      </button>

      {/* Separador en drawer */}
      {isCoursePage && <div className="w-full h-px bg-slate-800/50" />}

      {/* Botón de modo profesor/salir */}
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <button className={`flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-200 border border-slate-700 ${
            isCoursePage ? 'w-full justify-center' : ''
          }`}>
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <button className={`flex items-center space-x-2 px-3 py-2 bg-green-400 hover:bg-green-300 text-slate-900 rounded-lg transition-all duration-200 font-medium ${
            isCoursePage ? 'w-full justify-center' : ''
          }`}>
            <Crown className="h-4 w-4" />
            <span className="text-sm">Modo Profesor</span>
          </button>
        </Link>
      )}

      {/* Avatar del usuario */}
      <div className={`${isCoursePage ? 'w-full flex justify-center pt-4' : ''}`}>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 border-2 border-slate-600 hover:border-green-400 transition-all duration-200",
              userButtonPopoverCard: "bg-slate-800 border border-slate-700 shadow-xl",
              userButtonPopoverActionButton: "text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200",
              userButtonPopoverActionButtonText: "text-slate-300",
              userButtonPopoverFooter: "bg-slate-700 border-t border-slate-600"
            }
          }}
        />
      </div>
    </div>
  );
};