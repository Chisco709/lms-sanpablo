/**
 * Página del Estudiante - DISEÑO MOBILE-FIRST OPTIMIZADO
 * Instituto San Pablo - Pereira, Risaralda
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BookOpen, Home, User, GraduationCap, Trophy, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CoursesList } from "@/components/courses-list"
import { StudentQuickNav } from "@/components/student-quick-nav"

const StudentPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/")
  }

  try {
    const courses = await db.course.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        chapters: { where: { isPublished: true }, select: { id: true } },
        purchases: { where: { userId: user.id } },
      },
      orderBy: { createdAt: "desc" },
    })

    const coursesWithPurchaseInfo = courses.map((course) => ({
      ...course,
      progress: null,
      isPurchased: course.purchases.length > 0,
    }))

    const purchasedCourses = coursesWithPurchaseInfo.filter(course => course.isPurchased)
    const availableCourses = coursesWithPurchaseInfo.filter(course => !course.isPurchased)

    return (
      <div className="relative min-h-screen bg-black text-white font-sans antialiased">
        {/* Efectos de fondo sutiles */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute left-[-10%] top-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-green-500/30 rounded-full blur-[60px] sm:blur-[100px] opacity-60 animate-pulse" />
          <div className="absolute right-[-10%] bottom-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-yellow-400/20 rounded-full blur-[80px] sm:blur-[120px] opacity-60" />
        </div>
        {/* CONTENIDO PRINCIPAL */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Acceso rápido */}
          <StudentQuickNav />
          {/* Stats rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/60 rounded-xl border border-green-400/30 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{purchasedCourses.length}</div>
              <div className="text-xs text-white/70">Mis Cursos</div>
            </div>
            <div className="bg-black/60 rounded-xl border border-yellow-400/30 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{availableCourses.length}</div>
              <div className="text-xs text-white/70">Disponibles</div>
            </div>
            <div className="bg-black/60 rounded-xl border border-green-400/30 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">95%</div>
              <div className="text-xs text-white/70">Empleabilidad</div>
            </div>
          </div>
          {/* Mis cursos */}
          {purchasedCourses.length > 0 && (
            <div className="bg-black/70 rounded-2xl border-2 border-green-400/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Mis Cursos</h2>
              </div>
              <CoursesList items={purchasedCourses} />
            </div>
          )}
          {/* Cursos disponibles */}
          <div className="bg-black/70 rounded-2xl border-2 border-yellow-400/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Cursos Disponibles</h2>
            </div>
            {availableCourses.length > 0 ? (
              <CoursesList items={availableCourses} />
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-white/70 text-base">No hay cursos disponibles por el momento</p>
              </div>
            )}
          </div>
          {/* Mensaje motivacional si no hay cursos */}
          {purchasedCourses.length === 0 && availableCourses.length === 0 && (
            <div className="bg-black/70 rounded-2xl border-2 border-green-400/30 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-400/10 flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">¡Tu futuro comienza aquí!</h3>
              <p className="text-white/80 text-base max-w-md mx-auto mb-4">
                Explora nuestros programas técnicos certificados y da el primer paso hacia una carrera exitosa.
              </p>
            </div>
          )}
          {/* Footer motivacional compacto */}
          <div className="bg-black/50 rounded-2xl border border-white/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Image src="/logo-sanpablo.jpg" alt="Instituto San Pablo" width={32} height={32} className="rounded-full" />
              <span className="text-lg font-bold text-white">Instituto San Pablo</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-green-400 font-bold block">15+</span>
                <span className="text-white/60 text-xs">Años</span>
              </div>
              <div>
                <span className="text-yellow-400 font-bold block">500+</span>
                <span className="text-white/60 text-xs">Egresados</span>
              </div>
              <div>
                <span className="text-green-400 font-bold block">SENA</span>
                <span className="text-white/60 text-xs">Certificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("[STUDENT_PAGE]", error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Error de conexión
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
            No pudimos cargar tus cursos. Verifica tu conexión e intenta de nuevo.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-xl font-medium text-black bg-gradient-to-r from-green-400 to-yellow-400 hover:shadow-lg transition-all duration-300 text-sm sm:text-base hover:scale-105"
          >
            <Home className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }
}

export default StudentPage 