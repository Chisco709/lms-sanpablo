import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CheckCircle, Clock, BookOpen, TrendingUp, Target, Award } from "lucide-react";
import { CourseProgress } from "@/components/course-progress";

const ProgressPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses({ userId: user.id });

  const totalCourses = completedCourses.length + coursesInProgress.length;
  const completionRate = totalCourses > 0 ? (completedCourses.length / totalCourses) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Mi Progreso de Aprendizaje
        </h1>
        <p className="text-slate-400">
          Revisa tu avance y logros académicos
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Cursos</p>
              <p className="text-white text-xl font-bold">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Completados</p>
              <p className="text-white text-xl font-bold">{completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">En Progreso</p>
              <p className="text-white text-xl font-bold">{coursesInProgress.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Tasa Completado</p>
              <p className="text-white text-xl font-bold">{Math.round(completionRate)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso general */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Progreso General</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Completado</span>
            <span className="text-white">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Cursos en progreso */}
      {coursesInProgress.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            Cursos en Progreso
          </h3>
          <div className="space-y-4">
            {coursesInProgress.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{course.title}</h4>
                    <p className="text-slate-400 text-sm">{course.category?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <CourseProgress
                    variant={course.progress === 100 ? "success" : "default"}
                    size="sm"
                    value={course.progress || 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos completados */}
      {completedCourses.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            Cursos Completados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedCourses.map((course) => (
              <div key={course.id} className="p-4 bg-slate-700/50 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{course.title}</h4>
                    <p className="text-slate-400 text-xs">{course.category?.name}</p>
                  </div>
                </div>
                <div className="text-emerald-400 text-xs font-medium">
                  ✅ Completado
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {totalCourses === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            ¡Comienza tu viaje de aprendizaje!
          </h3>
          <p className="text-slate-400 mb-4">
            Inscríbete en tu primer curso para ver tu progreso aquí
          </p>
          <a
            href="/search"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Explorar Cursos
          </a>
        </div>
      )}
    </div>
  );
};

export default ProgressPage; 