import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { CoursesList } from "@/components/courses-list"
import { StudentQuickNav } from "@/components/student-quick-nav"
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Users, 
  Play, 
  CheckCircle, 
  Sparkles, 
  Rocket, 
  Brain, 
  Bolt,
  ArrowRight,
  Clock,
  Flame,
  Bell
} from "lucide-react"

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
      <div className="min-h-screen bg-[#0F172A] px-4 py-8">
        {/* Hero Section Minimalista */}
        <div className="max-w-7xl mx-auto mb-12 animate-in fade-in duration-1000">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-12 border border-white/5">
            {/* Elemento decorativo flotante */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  Aprende.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
                    Evoluciona.
                  </span>
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Tu camino hacia el conocimiento comienza aquí
                </p>
                
                {/* Stats minimalistas */}
                <div className="flex gap-12">
                  <div>
                    <div className="text-4xl font-bold text-yellow-400">{purchasedCourses.length}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">Activos</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-400">{availableCourses.length}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">Disponibles</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white flex items-center">
                      <Flame className="h-8 w-8 text-orange-400 mr-2" />
                      0
                    </div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">Racha días</div>
                  </div>
                </div>
              </div>
              
              {/* Visual abstracto minimalista */}
              <div className="hidden md:block relative h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Círculos concéntricos animados */}
                    <div className="absolute inset-0 w-48 h-48 rounded-full border border-yellow-400/20 animate-spin-slow"></div>
                    <div className="absolute inset-4 w-40 h-40 rounded-full border-2 border-green-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-8 w-32 h-32 rounded-full border border-yellow-400/40 animate-spin-slow"></div>
                    
                    {/* Centro */}
                    <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400/20 to-green-400/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Diseño tipo Bento Grid */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Acción 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/10 to-transparent p-8 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 cursor-pointer animate-in slide-in-from-bottom duration-700 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Continuar aprendiendo</h3>
                <p className="text-gray-400 text-sm mb-4">Retoma donde lo dejaste</p>
                <ArrowRight className="h-5 w-5 text-yellow-400 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Acción 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400/10 to-transparent p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-500 cursor-pointer animate-in slide-in-from-bottom duration-700 delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-green-400/20 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Explorar cursos</h3>
                <p className="text-gray-400 text-sm mb-4">Descubre nuevas habilidades</p>
                <ArrowRight className="h-5 w-5 text-green-400 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Acción 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400/10 to-transparent p-8 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-500 cursor-pointer animate-in slide-in-from-bottom duration-700 delay-400">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-400/20 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Logros</h3>
                <p className="text-gray-400 text-sm mb-4">Ve tu progreso</p>
                <ArrowRight className="h-5 w-5 text-purple-400 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Cursos - Diseño limpio y espacioso */}
        {purchasedCourses.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12 animate-in fade-in duration-700 delay-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Mis cursos</h2>
                <p className="text-gray-400">Continúa tu viaje de aprendizaje</p>
              </div>
              <button className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-2 transition-colors">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <CoursesList items={purchasedCourses} />
          </div>
        )}

        {/* Cursos Disponibles - Con diseño destacado */}
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700 delay-600">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Descubre</h2>
              <p className="text-gray-400">Nuevos cursos para expandir tus conocimientos</p>
            </div>
            {availableCourses.length > 0 && (
              <button className="text-green-400 hover:text-green-300 font-medium flex items-center gap-2 transition-colors">
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {availableCourses.length > 0 ? (
            <CoursesList items={availableCourses} />
          ) : (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-16 text-center border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-yellow-400/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-green-400/20 flex items-center justify-center">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Preparando algo increíble
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Nuevos cursos diseñados para impulsar tu carrera están en camino
                </p>
                <button className="inline-flex items-center px-8 py-4 rounded-full font-medium text-black bg-gradient-to-r from-yellow-400 to-green-400 hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105">
                  <Bell className="h-5 w-5 mr-2" />
                  Notificarme
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Estado vacío total - Ultra minimalista */}
        {purchasedCourses.length === 0 && availableCourses.length === 0 && (
          <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in duration-1000">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-green-400/20 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tu aventura comienza ahora
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Estamos preparando experiencias de aprendizaje únicas para ti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 rounded-full font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
                <Users className="h-5 w-5 mr-2" />
                Hablar con un asesor
              </button>
              <button className="inline-flex items-center px-8 py-4 rounded-full font-medium text-white border border-white/20 hover:border-white/40 transition-all duration-300">
                <Play className="h-5 w-5 mr-2" />
                Ver demo
              </button>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("[STUDENT_PAGE]", error)
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <Zap className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Oops, algo salió mal
          </h1>
          <p className="text-gray-400 mb-8">
            No pudimos cargar tus cursos. Por favor intenta de nuevo.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-full font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }
}

export default StudentPage 