"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import BackgroundMusic from "@/components/background-music";
import { TeacherAuthGuard } from "@/components/teacher-auth-guard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Detectar si estamos en una página de curso
  const isCoursePage =
    pathname?.includes("/courses/") && !pathname?.includes("/teacher/courses");

  return (
    <TeacherAuthGuard>
      <div className="h-full bg-black min-h-screen">
        {/* Navbar fijo - Solo se muestra si no es página de curso */}
        {!isCoursePage && (
          <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
            <Navbar />
          </div>
        )}

        {/* Sidebar - Solo se muestra si no es página de curso */}
        {!isCoursePage && (
          <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
            <Sidebar />
          </div>
        )}

        {/* Contenido principal - Padding condicional */}
        <main
          className={`h-full min-h-screen bg-black ${
            isCoursePage
              ? "" // Sin padding para páginas de curso
              : "md:pl-56 pt-[80px]" // Con padding para otras páginas
          }`}
        >
          {isCoursePage ? (
            children // Sin wrapper adicional para páginas de curso
          ) : (
            <div className="h-full p-6 bg-black">{children}</div>
          )}
        </main>
        {/* Música de fondo automática */}
        <BackgroundMusic />
      </div>
    </TeacherAuthGuard>
  );
};

export default DashboardLayout;