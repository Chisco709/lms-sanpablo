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
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: { userId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const coursesWithPurchaseInfo = courses.map((course) => ({
      ...course,
      progress: null,
      isPurchased: course.purchases.length > 0,
    }))

    const purchasedCourses = coursesWithPurchaseInfo.filter(course => course.isPurchased)
    const availableCourses = coursesWithPurchaseInfo.filter(course => !course.isPurchased)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* SALUDO CON IMAGEN DE GRADUACIÓN */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-6 sm:p-8 lg:p-10 border border-slate-700/50 backdrop-blur-sm">
            {/* Imagen de fondo de graduación */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: "url('/imagen-id1.jpg')"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-black/40"></div>
            
            {/* Efectos decorativos responsivos */}
            <div className="absolute -top-8 -right-8 sm:-top-16 sm:-right-16 w-16 h-16 sm:w-32 sm:h-32 bg-yellow-400/10 rounded-full blur-xl sm:blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 sm:-bottom-16 sm:-left-16 w-16 h-16 sm:w-32 sm:h-32 bg-green-400/10 rounded-full blur-xl sm:blur-2xl"></div>
            
            <div className="relative z-10 text-center space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center border border-yellow-400/30">
                  <Image
                    src="/instituto-sanpablo-logo.svg"
                    alt="Instituto San Pablo"
                    width={40}
                    height={40}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
                <span className="text-2xl sm:text-3xl lg:text-4xl">👋</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl">🎓</span>
              </div>
              
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                ¡Hola! Bienvenido al Instituto San Pablo
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <span className="text-base sm:text-lg">📚</span>
                <p className="text-sm sm:text-base lg:text-lg">Pereira, Colombia - Formando profesionales desde 2008</p>
                <span className="text-base sm:text-lg">✨</span>
              </div>
            </div>
          </div>

          {/* MIS CURSOS CON IMAGEN DE GRADUACIÓN */}
          {purchasedCourses.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-yellow-400/10 p-4 sm:p-6 lg:p-8 border border-green-500/20 backdrop-blur-sm">
                {/* Imagen de fondo de graduación */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{
                    backgroundImage: "url('/imagen-id2.jpg')"
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 to-yellow-900/40"></div>
                
                {/* Efectos decorativos responsivos */}
                <div className="absolute -top-6 -right-6 sm:-top-12 sm:-right-12 w-12 h-12 sm:w-24 sm:h-24 bg-green-400/10 rounded-full blur-lg sm:blur-xl"></div>
                
                <div className="relative z-10 text-center space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-green-400/30">
                      <Image
                        src="/logo-sanpablo.jpg"
                        alt="Instituto San Pablo"
                        width={20}
                        height={20}
                        className="w-4 h-4"
                      />
                    </div>
                    <span className="text-xl sm:text-2xl">📖</span>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">MIS CURSOS</h2>
                    <span className="text-xl sm:text-2xl">⭐</span>
        </div>
                  <p className="text-slate-300 text-sm sm:text-base">Continúa donde lo dejaste</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden bg-gradient-to-r from-green-500/10 to-yellow-400/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-green-500/20 backdrop-blur-sm">
                {/* Imagen de fondo sutil */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10"
                  style={{
                    backgroundImage: "url('/imagen-id3.jpg')"
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-transparent"></div>
                
              <div className="relative z-10">
                  <CoursesList items={purchasedCourses} />
                </div>
              </div>
            </div>
          )}

          {/* CURSOS DISPONIBLES - MOBILE OPTIMIZADO */}
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-purple-500/10 p-4 sm:p-6 lg:p-8 border border-blue-500/20 backdrop-blur-sm">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-blue-400/30">
                    <Image
                      src="/logo-sanpablo.jpg"
                      alt="Instituto San Pablo"
                      width={20}
                      height={20}
                      className="w-4 h-4"
                    />
                  </div>
                  <span className="text-xl sm:text-2xl">🚀</span>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">CURSOS DISPONIBLES</h2>
                  <span className="text-xl sm:text-2xl">💡</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-300">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span>🎯</span>
                    <p className="text-sm sm:text-base">Técnico en Primera Infancia</p>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className="text-sm sm:text-base">Técnico en Inglés</p>
                    <span className="text-lg sm:text-2xl">🌟</span>
              </div>
            </div>
          </div>
        </div>

            {availableCourses.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-blue-500/20 backdrop-blur-sm">
                <CoursesList items={availableCourses} />
              </div>
            ) : (
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-8 sm:p-12 lg:p-16 border border-slate-700/50 backdrop-blur-sm">
                {/* Efectos decorativos responsivos */}
                <div className="absolute -top-8 -right-8 sm:-top-16 sm:-right-16 w-16 h-16 sm:w-32 sm:h-32 bg-yellow-400/10 rounded-full blur-xl sm:blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 sm:-bottom-16 sm:-left-16 w-16 h-16 sm:w-32 sm:h-32 bg-green-400/10 rounded-full blur-xl sm:blur-2xl"></div>
                
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl">⏳</span>
                    <span className="text-2xl sm:text-3xl">📚</span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">¡Próximamente!</h3>
                    <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-md mx-auto leading-relaxed">
                      Estamos preparando los cursos de Técnico en Primera Infancia y Técnico en Inglés para ti.
                    </p>
            </div>
          </div>
            </div>
            )}
          </div>
          
          {/* SI NO TIENE CURSOS */}
          {purchasedCourses.length === 0 && availableCourses.length === 0 && (
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-yellow-400/10 p-8 sm:p-12 lg:p-16 border border-green-500/20 backdrop-blur-sm">
              {/* Imagen de fondo inspiradora */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: "url('/imagen-id1.jpg')"
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 to-yellow-900/40"></div>
              
              {/* Efectos decorativos responsivos */}
              <div className="absolute -top-8 -right-8 sm:-top-16 sm:-right-16 w-16 h-16 sm:w-32 sm:h-32 bg-green-400/10 rounded-full blur-xl sm:blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 sm:-bottom-16 sm:-left-16 w-16 h-16 sm:w-32 sm:h-32 bg-yellow-400/10 rounded-full blur-xl sm:blur-2xl"></div>
              
              <div className="relative z-10 text-center space-y-4 sm:space-y-6">
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">🎯</span>
                  <span className="text-2xl sm:text-3xl">📈</span>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">¡Comienza tu aprendizaje!</h3>
                  <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed">
                    Aún no tienes cursos. Explora nuestros programas técnicos y comienza tu formación profesional.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("[STUDENT_PAGE]", error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 sm:px-6">
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