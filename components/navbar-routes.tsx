"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { LogOut, Crown, Heart, Bell, Home } from "lucide-react";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");
  const isCoursePage = pathname?.includes('/courses/') && !pathname?.includes('/teacher/courses');
  const isChisco = user?.primaryEmailAddress?.emailAddress === "chiscojjcm@gmail.com";

  const buttonClass = "flex items-center gap-2 px-3 py-1 border border-green-400 text-green-500 hover:bg-green-100/10 hover:text-green-700 rounded-md transition-colors text-sm font-medium";

  return (
    <div className={`flex items-center ${isCoursePage ? 'flex-col space-y-4 w-full' : 'space-x-3'}`}>
      {/* Enlace principal solo en drawer de curso */}
      {isCoursePage && (
        <div className="w-full">
          <Link 
            href="/student"
            className={buttonClass}
          >
            <Home className="h-5 w-5 text-green-500" />
            <span>Inicio</span>
          </Link>
        </div>
      )}
      {/* Favoritos */}
      <button 
        className={buttonClass}
        title="Favoritos"
        aria-label="Ver favoritos"
      >
        <Heart className="h-5 w-5 text-green-500" />
        <span>Favoritos</span>
      </button>
      {/* Notificaciones */}
      <button 
        className={buttonClass + " relative"}
        title="Notificaciones"
        aria-label="Ver notificaciones"
      >
        <Bell className="h-5 w-5 text-green-500" />
        <span>Notificaciones</span>
        <span className="absolute bg-yellow-400 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold -top-2 -right-2">0</span>
      </button>
      {/* Botón de modo profesor/salir */}
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <button className={buttonClass}>
            <LogOut className="h-4 w-4 text-green-500" />
            <span>Salir</span>
          </button>
        </Link>
      ) : (
        isChisco && (
          <Link href="/teacher/courses">
            <button className={buttonClass}>
              <Crown className="h-4 w-4 text-green-500" />
              <span>Soy Profesor</span>
            </button>
          </Link>
        )
      )}
      {/* Avatar del usuario SIEMPRE visible */}
      <div>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 border border-green-400 transition-all duration-200",
              userButtonPopoverCard: "bg-black border border-green-400/30 shadow-xl",
              userButtonPopoverActionButton: "text-black hover:text-green-700 hover:bg-green-400/10 transition-all duration-200",
              userButtonPopoverActionButtonText: "text-black",
              userButtonPopoverFooter: "bg-black border-t border-green-400/20"
            }
          }}
        />
      </div>
    </div>
  );
};