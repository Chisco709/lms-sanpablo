"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { LogOut, Crown, Home } from "lucide-react";
import { memo, useMemo } from "react";

const NavbarRoutes = memo(() => {
  const pathname = usePathname();
  const { user } = useUser();
  
  // Memoizar cálculos costosos
  const pageState = useMemo(() => ({
    isTeacherPage: pathname?.startsWith("/teacher"),
    isPlayerPage: pathname?.startsWith("/chapter"),
    isCoursePage: pathname?.includes('/courses/') && !pathname?.includes('/teacher/courses'),
    isChisco: user?.primaryEmailAddress?.emailAddress === "chiscojjcm@gmail.com",
  }), [pathname, user?.primaryEmailAddress?.emailAddress]);

  const { isTeacherPage, isPlayerPage, isCoursePage, isChisco } = pageState;

  const buttonClass = "flex items-center gap-2 px-3 py-1 border border-green-400 text-green-500 hover:bg-green-100/10 hover:text-green-700 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400/40";

  return (
    <nav 
      className={`flex items-center ${isCoursePage ? 'flex-col space-y-4 w-full' : 'space-x-3'}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Enlace principal solo en drawer de curso */}
      {isCoursePage && (
        <div className="w-full">
          <Link 
            href="/student"
            className={buttonClass}
            aria-label="Ir al inicio"
          >
            <Home className="h-5 w-5 text-green-500" aria-hidden="true" />
            <span>Inicio</span>
          </Link>
        </div>
      )}

      {/* Botón de modo profesor/salir */}
      {isTeacherPage || isPlayerPage ? (
        <Link href="/" prefetch={false}>
          <button 
            className={buttonClass}
            aria-label="Salir del modo profesor"
          >
            <LogOut className="h-4 w-4 text-green-500" aria-hidden="true" />
            <span>Salir</span>
          </button>
        </Link>
      ) : (
        isChisco && (
          <Link href="/teacher/courses" prefetch={true}>
            <button 
              className={buttonClass}
              aria-label="Acceder al modo profesor"
            >
              <Crown className="h-4 w-4 text-green-500" aria-hidden="true" />
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
    </nav>
  );
});

NavbarRoutes.displayName = 'NavbarRoutes';

export { NavbarRoutes };