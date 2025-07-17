import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BookOpen, Users, Eye, TrendingUp, Calendar, Award } from "lucide-react";

const TeacherAnalyticsPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  // Verificar que sea el usuario autorizado
  if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
    return redirect("/");
  }

  // Obtener estadísticas del profesor
  const [
    totalCourses,
    publishedCourses,
    totalChapters,
    totalStudents,
    recentProgress
  ] = await Promise.all([
    db.course.count({ where: { userId: user.id } }),
    db.course.count({ where: { userId: user.id, isPublished: true } }),
    db.chapter.count({
      where: {
        course: { userId: user.id }
      }
    }),
    db.purchase.count({
      where: {
        course: { userId: user.id }
      }
    }),
    db.userProgress.findMany({
      where: {
        chapter: {
          course: { userId: user.id }
        }
      },
      include: {
        chapter: {
          include: {
            course: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 5
    })
  ]);

  const coursesWithProgress = await db.course.findMany({
    where: {
      userId: user.id,
      isPublished: true
    },
    include: {
      chapters: {
        include: {
          userProgress: true
        }
      },
      _count: {
        select: {
          purchases: true
        }
      }
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Estadísticas del Profesor
        </h1>
        <p className="text-slate-400 mt-1">
          Monitorea el rendimiento de tus cursos y estudiantes
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Cursos</p>
              <p className="text-3xl font-bold text-white">{totalCourses}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Publicados</p>
              <p className="text-3xl font-bold text-white">{publishedCourses}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Estudiantes</p>
              <p className="text-3xl font-bold text-white">{totalStudents}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Users className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Capítulos</p>
              <p className="text-3xl font-bold text-white">{totalChapters}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Award className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Actividad Reciente
        </h2>
        
        {recentProgress.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">No hay actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProgress.map((progress) => (
              <div key={progress.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    Un estudiante {progress.isCompleted ? "completó" : "vio"} el capítulo "{progress.chapter.title}"
                  </p>
                  <p className="text-slate-400 text-xs">
                    en {progress.chapter.course.title} • {new Date(progress.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rendimiento por curso */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Rendimiento por Curso
        </h2>
        
        {coursesWithProgress.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">No hay cursos publicados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coursesWithProgress.map((course) => {
              const totalChapters = course.chapters.length;
              const totalCompletions = course.chapters.reduce(
                (acc, chapter) => acc + chapter.userProgress.filter(p => p.isCompleted).length,
                0
              );
              const completionRate = totalChapters > 0 ? Math.round((totalCompletions / (totalChapters * course._count.purchases)) * 100) : 0;

              return (
                <div key={course.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-medium">{course.title}</h3>
                      <p className="text-slate-400 text-sm">
                        {course._count.purchases} estudiantes • {totalChapters} capítulos
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-400">
                      {isNaN(completionRate) ? "0%" : `${completionRate}%`} completado
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${isNaN(completionRate) ? 0 : completionRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Consejos */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-blue-400 font-medium mb-3">💡 Consejos para mejorar</h3>
        <ul className="text-blue-300/80 space-y-2 text-sm">
          <li>• Agrega descripciones claras a tus cursos para atraer más estudiantes</li>
          <li>• Incluye videos de YouTube y PDFs para enriquecer el contenido</li>
          <li>• Organiza el contenido en temas del pensum para mejor comprensión</li>
          <li>• Publica cursos regularmente para mantener a los estudiantes comprometidos</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherAnalyticsPage; 