import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Users, BookOpen, TrendingUp, Award } from "lucide-react";

const TeacherStudentsPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  // Verificar que sea el usuario autorizado
  if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
    return redirect("/");
  }

  // Obtener estudiantes inscritos en cursos del profesor
  const students = await db.purchase.findMany({
    where: {
      course: {
        userId: user.id,
      },
    },
    include: {
      course: {
        select: {
          title: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Obtener progreso de estudiantes
  const studentsWithProgress = await Promise.all(
    students.map(async (student) => {
      const totalChapters = await db.chapter.count({
        where: {
          courseId: student.courseId,
          isPublished: true,
        },
      });

      const completedChapters = await db.userProgress.count({
        where: {
          userId: student.userId,
          isCompleted: true,
          chapter: {
            courseId: student.courseId,
            isPublished: true,
          },
        },
      });

      const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

      return {
        ...student,
        totalChapters,
        completedChapters,
        progressPercentage,
      };
    })
  );

  // Estadísticas generales
  const totalStudents = new Set(students.map(s => s.userId)).size;
  const totalEnrollments = students.length;
  const averageProgress = studentsWithProgress.length > 0 
    ? Math.round(studentsWithProgress.reduce((acc, s) => acc + s.progressPercentage, 0) / studentsWithProgress.length)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Gestión de Estudiantes
        </h1>
        <p className="text-slate-400 mt-1">
          Monitorea el progreso y participación de tus estudiantes
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Estudiantes</p>
              <p className="text-3xl font-bold text-white">{totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Inscripciones</p>
              <p className="text-3xl font-bold text-white">{totalEnrollments}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Progreso Promedio</p>
              <p className="text-3xl font-bold text-white">{averageProgress}%</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-green-400" />
          Estudiantes Inscritos
        </h2>

        {studentsWithProgress.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay estudiantes inscritos
            </h3>
            <p className="text-slate-400">
              Los estudiantes aparecerán aquí cuando se inscriban en tus cursos
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {studentsWithProgress.map((student) => (
              <div key={`${student.userId}-${student.courseId}`} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {student.userId.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Estudiante {student.userId.slice(-8)}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {student.course.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {student.progressPercentage}% completado
                    </p>
                    <p className="text-slate-400 text-sm">
                      {student.completedChapters}/{student.totalChapters} capítulos
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Progreso del curso</span>
                    <span>{student.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  Inscrito el {new Date(student.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-blue-400 font-medium mb-3">📊 Información del Panel</h3>
        <ul className="text-blue-300/80 space-y-2 text-sm">
          <li>• Los estudiantes se muestran automáticamente cuando se inscriben</li>
          <li>• El progreso se actualiza en tiempo real según completan capítulos</li>
          <li>• Puedes ver cuántos capítulos ha completado cada estudiante</li>
          <li>• La información se mantiene privada y solo visible para ti</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherStudentsPage; 