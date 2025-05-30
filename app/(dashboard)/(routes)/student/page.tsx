/**
 * Cambios principales:
 * - Fondo global negro con luces verdes y amarillas (como landing-professional)
 * - Tarjetas y overlays con bordes y gradientes en verde/amarillo
 * - Elimina gradientes azules/morados y fondos slate
 * - Usa los mismos estilos de botones, bordes y overlays de la landing
 * - Mantén la estructura de cursos, saludos y mensajes
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CoursesList } from "@/components/courses-list"

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
      <div className="relative min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
        {/* Luces de fondo globales */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute left-[-15%] top-[-15%] w-[500px] h-[500px] bg-green-500/40 rounded-full blur-[120px] opacity-80" />
          <div className="absolute right-[-15%] bottom-[-15%] w-[600px] h-[600px] bg-yellow-400/30 rounded-full blur-[140px] opacity-80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadein-slideup">
          {/* SALUDO */}
          <div className="relative overflow-hidden rounded-2xl bg-black/80 border-4 border-green-400/30 shadow-2xl p-8 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-yellow-400/10 to-black/0 pointer-events-none" />
            <div className="flex items-center justify-center gap-3 mb-4">
              
              <span className="text-3xl lg:text-4xl">👋</span>
              <span className="text-3xl lg:text-4xl">🎓</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Hola! Bienvenido al <span className="text-green-400">Instituto San Pablo</span></h1>
            <div className="flex items-center justify-center gap-2 text-white/80 mb-2">
              <span className="text-base md:text-lg">📚</span>
              <p className="text-sm md:text-base lg:text-lg">Pereira, Colombia - Formando profesionales desde 2008</p>
              <span className="text-base md:text-lg">✨</span>
            </div>
          </div>

          {/* MIS CURSOS */}
          {purchasedCourses.length > 0 && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-black/80 border-4 border-green-400/30 shadow-2xl p-8 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-yellow-400/10 to-black/0 pointer-events-none" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-green-400 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-yellow-400 pointer-events-none"></div>
                    <Image src="/logo-sanpablo.jpg" alt="Instituto San Pablo" width={32} height={32} className="rounded-full" />
                  </div>
                  <span className="text-2xl">📖</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">MIS CURSOS</h2>
                  <span className="text-2xl">⭐</span>
                </div>
                <p className="text-green-400 text-base mb-4">Continúa donde lo dejaste</p>
                <div className="w-full">
                  <CoursesList items={purchasedCourses} />
                </div>
              </div>
            </div>
          )}

          {/* CURSOS DISPONIBLES */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-black/80 border-4 border-yellow-400/30 shadow-2xl p-8 flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-green-400/10 to-black/0 pointer-events-none" />
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-green-400 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-400 pointer-events-none"></div>
                  <Image src="/logo-sanpablo.jpg" alt="Instituto San Pablo" width={32} height={32} className="rounded-full" />
                </div>
                <span className="text-2xl">🚀</span>
                <h2 className="text-xl md:text-2xl font-bold text-white">CURSOS DISPONIBLES</h2>
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-white/80 mb-4">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <p className="text-base">Técnico en Primera Infancia</p>
                </div>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-2">
                  <p className="text-base">Técnico en Inglés</p>
                  <span className="text-xl">🌟</span>
                </div>
              </div>
              <div className="w-full">
                {availableCourses.length > 0 ? (
                  <CoursesList items={availableCourses} />
                ) : (
                  <div className="text-center text-white/70 py-8">No hay cursos disponibles por el momento.</div>
                )}
              </div>
            </div>
          </div>

          {/* SI NO TIENE CURSOS */}
          {purchasedCourses.length === 0 && availableCourses.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-black/80 border-4 border-green-400/30 shadow-2xl p-8 flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-yellow-400/10 to-black/0 pointer-events-none" />
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">¡Comienza tu aprendizaje!</h3>
              <p className="text-white/80 text-base max-w-lg mx-auto mb-2">Aún no tienes cursos. Explora nuestros programas técnicos y comienza tu formación profesional.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("[STUDENT_PAGE]", error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Oops, algo salió mal
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
            No pudimos cargar tus cursos. Por favor intenta de nuevo.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 text-sm sm:text-base hover:scale-105"
          >
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }
}

export default StudentPage 