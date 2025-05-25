import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CheckCircle, Clock, BookOpen, Trophy, Search, Plus } from "lucide-react"
import { CoursesList } from "@/components/courses-list"
import { InfoCard } from "./_components/info-card"
import { getDashboardCourses } from "@/actions/get-dashboard-courses"
import { getPublishedCourses } from "@/actions/get-published-courses"
import Link from "next/link"

export default async function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    return redirect("/")
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  )
  
  const availableCourses = await getPublishedCourses()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">
          Juan Jose, continúa aprendiendo
        </h1>
        <p className="text-slate-400">
          Explora nuevos cursos y continúa con tu progreso
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">En Progreso</p>
              <p className="text-xl font-bold text-white">{coursesInProgress.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Completados</p>
              <p className="text-xl font-bold text-white">{completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Cursos</p>
              <p className="text-xl font-bold text-white">{coursesInProgress.length + completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Puntos</p>
              <p className="text-xl font-bold text-white">1,289</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mis Cursos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Mis Cursos</h2>
          <Link href="/search" className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1">
            <Search className="h-4 w-4" />
            Explorar más
          </Link>
        </div>
        {[...coursesInProgress, ...completedCourses].length > 0 ? (
          <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              ¡Aún no tienes cursos!
            </h3>
            <p className="text-slate-400 mb-4">
              Explora nuestra biblioteca de cursos y comienza tu aprendizaje
            </p>
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-colors"
            >
              <Search className="h-4 w-4" />
              Explorar Cursos
            </Link>
          </div>
        )}
      </div>

      {/* Cursos Disponibles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Cursos Disponibles</h2>
          <Link href="/search" className="text-green-400 hover:text-green-300 text-sm font-medium">
            Ver todos
          </Link>
        </div>
        {availableCourses.length > 0 ? (
          <CoursesList items={availableCourses.slice(0, 4)} />
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <Plus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No hay cursos disponibles
            </h3>
            <p className="text-slate-400">
              Los profesores aún no han publicado cursos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}