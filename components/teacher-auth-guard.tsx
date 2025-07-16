"use client";

import { useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useTeacherAuth } from "@/hooks/use-teacher-auth";
import { TeacherAuthModal } from "@/components/modals/teacher-auth-modal";

interface TeacherAuthGuardProps {
  children: ReactNode;
}

export const TeacherAuthGuard = ({ children }: TeacherAuthGuardProps) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setModalOpen } = useTeacherAuth();

  // Verificar si estamos en una ruta de profesor
  const isTeacherRoute = pathname?.startsWith("/teacher");
  
  // Verificar si el usuario tiene el email autorizado
  const isAuthorizedEmail = user?.primaryEmailAddress?.emailAddress === "chiscojjcm@gmail.com";

  useEffect(() => {
    // Si estamos en una ruta de profesor
    if (isTeacherRoute) {
      // Primero verificar si tiene el email autorizado
      if (!isAuthorizedEmail) {
        // Si no tiene el email autorizado, redirigir al dashboard principal
        router.push("/");
        return;
      }
      
      // Si tiene el email autorizado pero no está autenticado con credenciales
      if (!isAuthenticated) {
        // Mostrar modal de autenticación
        setModalOpen(true);
      }
    }
  }, [isTeacherRoute, isAuthorizedEmail, isAuthenticated, router, setModalOpen]);

  // Si estamos en una ruta de profesor y no está autenticado, no renderizar el contenido
  if (isTeacherRoute && (!isAuthorizedEmail || !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando acceso...</p>
        </div>
        <TeacherAuthModal />
      </div>
    );
  }

  return (
    <>
      {children}
      <TeacherAuthModal />
    </>
  );
}; 