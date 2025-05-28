import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { CoursesList } from "@/components/courses-list"

const StudentPage = async () => {
  const { userId } = await auth()

  if (!userId) {
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
          where: {
            userId,
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
      <div className="min-h-screen bg-[#0F172A] px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Saludo creativo y bonito */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-8 border border-slate-700/50 backdrop-blur-sm">
            {/* Efectos decorativos de fondo */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">👋</span>
                <span className="text-4xl">🎓</span>
              </div>
              
              <h1 className="text-2xl font-bold text-white">
                ¡Hola! Bienvenido a Instituto San Pablo
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <span className="text-lg">📚</span>
                <p className="text-base">Aquí están tus cursos disponibles</p>
                <span className="text-lg">✨</span>
              </div>
            </div>
          </div>

          {/* Mis Cursos - Mejorado */}
          {purchasedCourses.length > 0 && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-yellow-400/10 p-6 border border-green-500/20 backdrop-blur-sm">
                {/* Efectos decorativos */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-green-400/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">📖</span>
                    <h2 className="text-2xl font-bold text-white">MIS CURSOS</h2>
                    <span className="text-2xl">⭐</span>
        </div>
                  <p className="text-slate-300">Continúa donde lo dejaste</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-yellow-400/10 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                <CoursesList items={purchasedCourses} />
              </div>
            </div>
          )}

          {/* Cursos Disponibles - Mejorado */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-purple-500/10 p-6 border border-blue-500/20 backdrop-blur-sm">
              {/* Efectos decorativos */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🚀</span>
                  <h2 className="text-2xl font-bold text-white">CURSOS DISPONIBLES</h2>
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-300">
                  <span>🎯</span>
                  <p>Técnico en Primera Infancia</p>
                  <span>•</span>
                  <p>Técnico en Inglés</p>
                  <span className="text-2xl">🌟</span>
                </div>
              </div>
            </div>

            {availableCourses.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                <CoursesList items={availableCourses} />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-12 border border-slate-700/50 backdrop-blur-sm">
                {/* Efectos decorativos */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-3xl">⏳</span>
                    <span className="text-3xl">📚</span>
            </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">¡Próximamente!</h3>
                    <p className="text-slate-300 max-w-md mx-auto">
                      Estamos preparando los cursos de Técnico en Primera Infancia y Técnico en Inglés para ti.
                    </p>
          </div>
        </div>
              </div>
            )}
          </div>
          
          {/* Si no tiene cursos - Mejorado */}
          {purchasedCourses.length === 0 && availableCourses.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-yellow-400/10 p-12 border border-green-500/20 backdrop-blur-sm">
              {/* Efectos decorativos */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-3xl">🎯</span>
                  <span className="text-3xl">📈</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">¡Comienza tu aprendizaje!</h3>
                  <p className="text-slate-300 max-w-lg mx-auto">
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Oops, algo salió mal
          </h1>
          <p className="text-gray-400 mb-8">
            No pudimos cargar tus cursos. Por favor intenta de nuevo.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-full font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }
}

export default StudentPage 