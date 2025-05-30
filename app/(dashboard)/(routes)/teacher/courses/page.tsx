import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, BookOpen, Users, TrendingUp } from "lucide-react";

const CoursesPage = async() => {

  const user = await currentUser();

  if (!user) {
    return redirect("/")
  }

  const courses = await db.course.findMany(
    {
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      }
    }
  )

  const publishedCourses = courses.filter(course => course.isPublished)
  const draftCourses = courses.filter(course => !course.isPublished)

    return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Mis Cursos</h1>
              <p className="text-slate-400">Gestiona y crea nuevos cursos para tus estudiantes</p>
            </div>
            <Link href="/teacher/create">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                Crear Curso
              </button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Cursos</p>
                  <p className="text-xl font-bold text-white">{courses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Publicados</p>
                  <p className="text-xl font-bold text-white">{publishedCourses.length}</p>
                </div>
                {publishedCourses.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">En vivo</span>
                  </div>
                )}
              </div>
              {publishedCourses.length > 0 && (
                <div className="mt-2 text-xs text-green-300/70">
                  Visible para {publishedCourses.length} curso{publishedCourses.length !== 1 ? 's' : ''} en la página de inicio de estudiantes
                </div>
              )}
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Borradores</p>
                  <p className="text-xl font-bold text-white">{draftCourses.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <DataTable columns={columns} data={courses} />
          </div>
        </div>
    )
}

export default CoursesPage