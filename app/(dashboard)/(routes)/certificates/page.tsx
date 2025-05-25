import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { Award, Download, Calendar, CheckCircle, BookOpen } from "lucide-react";

const CertificatesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Mis Certificados
        </h1>
        <p className="text-slate-400">
          Descarga y comparte tus logros académicos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Certificados Obtenidos</p>
              <p className="text-white text-xl font-bold">{completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Cursos Completados</p>
              <p className="text-white text-xl font-bold">{completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Tasa de Éxito</p>
              <p className="text-white text-xl font-bold">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de certificados */}
      {completedCourses.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Certificados Disponibles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCourses.map((course) => (
              <div key={course.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{course.title}</h4>
                      <p className="text-slate-400 text-sm">{course.category?.name}</p>
                    </div>
                  </div>
                  <div className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded-full">
                    ✅ Completado
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>Completado el {new Date().toLocaleDateString('es-ES')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Descargar Certificado
                    </button>
                    <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            ¡Aún no tienes certificados!
          </h3>
          <p className="text-slate-400 mb-4">
            Completa tus primeros cursos para obtener certificados oficiales
          </p>
          <a
            href="/search"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Explorar Cursos
          </a>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-200 font-medium mb-1">Sobre los Certificados</p>
            <ul className="text-blue-300/80 space-y-1 text-xs">
              <li>• Los certificados se generan automáticamente al completar un curso</li>
              <li>• Incluyen tu nombre, el curso completado y la fecha de finalización</li>
              <li>• Son válidos y pueden ser compartidos en redes profesionales</li>
              <li>• Formato PDF de alta calidad para impresión</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage; 