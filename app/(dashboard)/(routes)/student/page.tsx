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
        {/* Efectos de fondo móvil optimizados */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute left-[-10%] top-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-green-500/30 rounded-full blur-[60px] sm:blur-[100px] opacity-60 animate-pulse" />
          <div className="absolute right-[-10%] bottom-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-yellow-400/20 rounded-full blur-[80px] sm:blur-[120px] opacity-60" />
          <div className="absolute top-1/2 left-1/3 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-green-400/15 rounded-full blur-[50px] sm:blur-[90px] opacity-40" />
        </div>
        
        {/* CONTENIDO PRINCIPAL MÓVIL */}
        <div className="relative z-10">
          
          {/* Header móvil con saludo personalizado */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-green-400/20 z-30">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo y saludo */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-green-400/80 shadow-lg flex items-center justify-center bg-white overflow-hidden">
                    <Image src="/logo-sanpablo.jpg" alt="Instituto San Pablo" width={40} height={40} className="rounded-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-green-400">Hola, {user?.firstName || 'Estudiante'}! 👋</h1>
                    <p className="text-xs sm:text-sm text-white/70">Instituto San Pablo • Pereira</p>
                  </div>
                </div>
                
                {/* Navegación rápida móvil */}
                <div className="flex items-center gap-2">
                  <Link href="/" className="p-2 rounded-lg bg-green-400/10 hover:bg-green-400/20 transition-colors">
                    <Home className="h-5 w-5 text-green-400" />
                  </Link>
                  <Link href="/progress" className="p-2 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats rápidas móviles */}
          <div className="px-4 sm:px-6 py-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-green-400/30 p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-green-400">{purchasedCourses.length}</div>
                <div className="text-xs sm:text-sm text-white/70">Mis Cursos</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-yellow-400/30 p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-yellow-400">{availableCourses.length}</div>
                <div className="text-xs sm:text-sm text-white/70">Disponibles</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-green-400/30 p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-green-400">95%</div>
                <div className="text-xs sm:text-sm text-white/70">Empleabilidad</div>
              </div>
            </div>
          </div>

          {/* Contenido principal con espaciado móvil */}
          <div className="px-4 sm:px-6 pb-20 space-y-6">
            
            {/* MIS CURSOS - Mobile Optimizado */}
            {purchasedCourses.length > 0 && (
              <div className="space-y-4">
                <div className="bg-black/70 backdrop-blur-xl rounded-2xl border-2 border-green-400/30 p-4 sm:p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-2 rounded-full bg-green-400/20">
                      <GraduationCap className="h-5 w-5 text-green-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">MIS CURSOS</h2>
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <p className="text-center text-green-400 text-sm sm:text-base mb-4">Continúa donde lo dejaste</p>
                  <CoursesList items={purchasedCourses} />
                </div>
              </div>
            )}

            {/* CURSOS DISPONIBLES - Mobile Optimizado */}
            <div className="space-y-4">
              <div className="bg-black/70 backdrop-blur-xl rounded-2xl border-2 border-yellow-400/30 p-4 sm:p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-2 rounded-full bg-yellow-400/20">
                    <BookOpen className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">CURSOS DISPONIBLES</h2>
                  <span className="text-lg">🚀</span>
                </div>
                
                {/* Programas destacados móviles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-400/10 rounded-xl p-3 border border-green-400/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🎯</span>
                      <span className="text-sm sm:text-base font-medium text-green-400">Primera Infancia</span>
                    </div>
                    <p className="text-xs text-white/70">Técnico certificado SENA</p>
                  </div>
                  <div className="bg-yellow-400/10 rounded-xl p-3 border border-yellow-400/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🌍</span>
                      <span className="text-sm sm:text-base font-medium text-yellow-400">Inglés</span>
                    </div>
                    <p className="text-xs text-white/70">Certificación internacional</p>
                  </div>
                </div>
                
                {availableCourses.length > 0 ? (
                  <CoursesList items={availableCourses} />
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-400/10 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="text-white/70 text-sm sm:text-base">No hay cursos disponibles por el momento</p>
                  </div>
                )}
              </div>
            </div>

            {/* MENSAJE DE MOTIVACIÓN CUANDO NO HAY CURSOS */}
            {purchasedCourses.length === 0 && availableCourses.length === 0 && (
              <div className="bg-black/70 backdrop-blur-xl rounded-2xl border-2 border-green-400/30 p-6 sm:p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-400/10 flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">¡Tu futuro comienza aquí!</h3>
                <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto mb-4">
                  Explora nuestros programas técnicos certificados y da el primer paso hacia una carrera exitosa.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="bg-green-400/10 rounded-lg p-3 border border-green-400/30">
                    <span className="text-2xl block mb-1">🎓</span>
                    <p className="text-green-400 font-medium text-sm">Primera Infancia</p>
                  </div>
                  <div className="bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/30">
                    <span className="text-2xl block mb-1">🌍</span>
                    <p className="text-yellow-400 font-medium text-sm">Inglés Certificado</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer motivacional móvil */}
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 text-center">
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
              <p className="text-white/50 text-xs mt-3">Pereira, Risaralda • Formando profesionales desde 2008</p>
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