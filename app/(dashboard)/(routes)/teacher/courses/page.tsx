import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Plus, BookOpen, Users, Eye, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TeacherCoursesPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  // Verificar que sea el usuario autorizado
  if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
    return redirect("/");
  }

  // Obtener cursos del profesor
  const courses = await db.course.findMany({
    where: {
      userId: user.id,
    },
    include: {
      category: true,
      chapters: {
        select: {
          id: true,
          isPublished: true,
        },
      },
      _count: {
        select: {
          chapters: true,
          purchases: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Mis Cursos
          </h1>
          <p className="text-slate-400 mt-1">
            Gestiona y crea cursos para tus estudiantes
          </p>
        </div>
        
        <Link href="/teacher/courses/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Curso
          </Button>
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
              <p className="text-sm text-slate-400">Total Cursos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Eye className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {courses.filter(course => course.isPublished).length}
              </p>
              <p className="text-sm text-slate-400">Publicados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Users className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {courses.reduce((acc, course) => acc + course._count.purchases, 0)}
              </p>
              <p className="text-sm text-slate-400">Estudiantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de cursos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Tus Cursos</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No tienes cursos creados
            </h3>
            <p className="text-slate-400 mb-6">
              Comienza creando tu primer curso para estudiantes
            </p>
            <Link href="/teacher/courses/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Curso
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-green-500/50 transition-colors"
              >
                {/* Imagen del curso */}
                <div className="relative aspect-video">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Badge de estado */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {course.isPublished ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span>{course._count.chapters} capítulos</span>
                    <span>{course._count.purchases} estudiantes</span>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/teacher/courses/${course.id}`}
                      className="flex-1"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-slate-600 text-slate-300 hover:border-green-500 hover:text-green-400"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesPage; 