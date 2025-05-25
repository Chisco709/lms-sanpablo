"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LogOut, Crown, Heart, Bell } from "lucide-react";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");

  return (
    <div className="flex items-center space-x-4">
      {/* Icono de favoritos */}
      <button 
        className="p-2 text-slate-400 hover:text-white transition-colors"
        title="Favoritos"
        aria-label="Ver favoritos"
      >
        <Heart className="h-5 w-5" />
      </button>
      
      {/* Notificaciones */}
      <button 
        className="p-2 text-slate-400 hover:text-white transition-colors relative"
        title="Notificaciones"
        aria-label="Ver notificaciones"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-green-400 text-slate-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          0
        </span>
      </button>

      {/* Botón de modo profesor/salir */}
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-200 border border-slate-700">
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <button className="flex items-center space-x-2 px-3 py-2 bg-green-400 hover:bg-green-300 text-slate-900 rounded-lg transition-all duration-200 font-medium">
            <Crown className="h-4 w-4" />
            <span className="text-sm">Modo Profesor</span>
          </button>
        </Link>
      )}

      {/* Avatar del usuario */}
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
  );
};