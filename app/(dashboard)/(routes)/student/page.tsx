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
  Bolt 
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
      <div className="student-page-container space-y-6 bg-slate-950 min-h-screen no-white-lines">
        {/* Header minimalista con animación fade-in */}
        <div className="bg-slate-900 rounded-xl p-6 border-slate-700 animate-in fade-in duration-700" style={{ borderWidth: '1px', borderColor: '#334155' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-400 rounded-lg flex items-center justify-center animate-in zoom-in duration-500 delay-200">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white animate-in slide-in-from-left duration-500 delay-300">
                ¡Hola! Continúa aprendiendo
              </h1>
              <p className="text-slate-400 animate-in slide-in-from-left duration-500 delay-400">
                Tus cursos te están esperando
              </p>
            </div>
          </div>
          
          {/* Estadísticas simples */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center animate-in slide-in-from-bottom duration-500 delay-500">
              <div className="text-2xl font-bold text-yellow-400">{purchasedCourses.length}</div>
              <div className="text-slate-400 text-sm">Mis cursos</div>
            </div>
            <div className="text-center animate-in slide-in-from-bottom duration-500 delay-600">
              <div className="text-2xl font-bold text-green-400">{availableCourses.length}</div>
              <div className="text-slate-400 text-sm">Disponibles</div>
            </div>
            <div className="text-center animate-in slide-in-from-bottom duration-500 delay-700">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-slate-400 text-sm">Completados</div>
            </div>
          </div>
        </div>

        {/* Navegación rápida */}
        <div className="bg-slate-900 rounded-xl p-6 border-slate-700 animate-in fade-in duration-700 delay-200" style={{ borderWidth: '1px', borderColor: '#334155' }}>
          <StudentQuickNav />
        </div>

        {/* Mis Cursos - Solo si tiene cursos */}
        {purchasedCourses.length > 0 && (
          <div className="bg-slate-900 rounded-xl p-6 border-slate-700 animate-in slide-in-from-bottom duration-700 delay-300" style={{ borderWidth: '1px', borderColor: '#334155' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Continúa donde lo dejaste</h2>
                <p className="text-slate-400">Tus cursos activos</p>
              </div>
            </div>
            <CoursesList items={purchasedCourses} />
          </div>
        )}

        {/* Cursos Disponibles */}
        <div className="bg-slate-900 rounded-xl p-6 border-slate-700 animate-in slide-in-from-bottom duration-700 delay-400" style={{ borderWidth: '1px', borderColor: '#334155' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
              <Rocket className="h-4 w-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Descubre nuevos cursos</h2>
              <p className="text-slate-400">Aprende algo nuevo hoy</p>
            </div>
          </div>
          
          {availableCourses.length > 0 ? (
            <CoursesList items={availableCourses} />
          ) : (
            <div className="text-center py-12 animate-in fade-in duration-700 delay-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center border-slate-700" style={{ borderWidth: '1px', borderColor: '#334155' }}>
                <Brain className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                ¡Pronto habrá más cursos!
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Estamos preparando contenido increíble para ti
              </p>
              <button className="inline-flex items-center px-6 py-3 rounded-lg text-base font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
                <Bolt className="h-4 w-4 mr-2" />
                Avisarme cuando estén listos
              </button>
            </div>
          )}
        </div>
        
        {/* Estado completamente vacío - Más simple */}
        {purchasedCourses.length === 0 && availableCourses.length === 0 && (
          <div className="bg-slate-900 rounded-xl p-12 text-center border-slate-700 animate-in fade-in duration-700 delay-500" style={{ borderWidth: '1px', borderColor: '#334155' }}>
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border-slate-700" style={{ borderWidth: '1px', borderColor: '#334155' }}>
              <Rocket className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              ¡Tu aventura educativa comienza aquí!
            </h3>
            <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto">
              Estamos preparando cursos increíbles para ti. 
              Pronto podrás empezar a aprender.
            </p>
            <button className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
              <Users className="h-5 w-5 mr-3" />
              Hablar con un profesor
            </button>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("[STUDENT_PAGE]", error)
    return (
      <div className="bg-slate-900 rounded-xl p-12 text-center border-slate-700" style={{ borderWidth: '1px', borderColor: '#334155' }}>
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center border-red-500/30" style={{ borderWidth: '1px' }}>
          <Zap className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-4">
          Algo salió mal
        </h1>
        <p className="text-slate-400 mb-6">
          No pudimos cargar tus cursos. Intenta de nuevo.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300"
        >
          <BookOpen className="h-4 w-4" />
          <span>Volver al inicio</span>
        </a>
      </div>
    )
  }
}

export default StudentPage 