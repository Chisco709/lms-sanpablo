import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import { BookOpen, Play, Search, GraduationCap } from "lucide-react"
import { CoursesList } from "@/components/courses-list"
import { getDashboardCourses } from "@/actions/get-dashboard-courses"
import { getPublishedCourses } from "@/actions/get-published-courses"
import Link from "next/link"

export default async function Dashboard() {
  const { user.id } = auth()

  if (!user) {
    return redirect("/")
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    user.id
  )
  
  const availableCourses = await getPublishedCourses()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header súper simple */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-yellow-400 rounded-full">
            <GraduationCap className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Instituto San Pablo
        </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Bienvenido a tu plataforma de aprendizaje. Aquí puedes ver y acceder a todos tus cursos de manera fácil y rápida.
        </p>
      </div>

      {/* Mis Cursos - LO MÁS IMPORTANTE ARRIBA */}
      {[...coursesInProgress, ...completedCourses].length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">MIS CURSOS</h2>
            <p className="text-gray-400">Continúa donde lo dejaste</p>
            </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-yellow-400/10 rounded-2xl p-6 border border-green-500/20">
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
          </div>
        </div>
      )}

      {/* Cursos Disponibles - SÚPER VISIBLE */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            CURSOS DISPONIBLES
          </h2>
          <p className="text-gray-400">
            Técnico en Primera Infancia • Técnico en Inglés
          </p>
            </div>
        
        {availableCourses.length > 0 ? (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
            <CoursesList items={availableCourses} />
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-4 bg-yellow-400/10 rounded-full w-fit mx-auto">
                <BookOpen className="h-16 w-16 text-yellow-400" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  ¡Próximamente!
                </h3>
                <p className="text-gray-400 text-lg">
                  Estamos preparando los cursos de Técnico en Primera Infancia y Técnico en Inglés para ti.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>

      {/* Si no tiene cursos - MENSAJE SÚPER CLARO */}
      {[...coursesInProgress, ...completedCourses].length === 0 && (
        <div className="bg-gradient-to-r from-green-500/10 to-yellow-400/10 rounded-2xl p-12 text-center border border-green-500/20">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="p-4 bg-green-500/20 rounded-full w-fit mx-auto">
              <Play className="h-16 w-16 text-green-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                ¡Comienza tu aprendizaje!
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Aún no tienes cursos. Explora nuestros programas técnicos y comienza tu formación profesional.
              </p>
              <Link 
                href="/search"
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-black font-bold text-lg rounded-xl hover:bg-green-400 transition-all duration-300 hover:scale-105"
              >
                <Search className="h-6 w-6" />
                VER CURSOS DISPONIBLES
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Botón de explorar más - SÚPER VISIBLE */}
      <div className="text-center py-8">
            <Link 
              href="/search"
          className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all duration-300 hover:scale-105"
        >
          <Search className="h-6 w-6" />
          EXPLORAR TODOS LOS CURSOS
          </Link>
      </div>
    </div>
  )
}