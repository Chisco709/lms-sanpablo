import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users, MessageCircle, Heart, BookOpen } from "lucide-react";

const CommunityPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Comunidad de Estudiantes
        </h1>
        <p className="text-slate-400">
          Conecta con otros estudiantes y comparte tu experiencia
        </p>
      </div>

      {/* Estado vacío - Próximamente */}
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          🚀 Función en Desarrollo
        </h3>
        <p className="text-slate-400 mb-4">
          Pronto podrás conectar con otros estudiantes y formar parte de nuestra comunidad
        </p>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-purple-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-purple-200 font-medium mb-1">Próximas funcionalidades:</p>
              <ul className="text-purple-300/80 space-y-1 text-xs text-left">
                <li>• Foros de discusión por curso</li>
                <li>• Chat en tiempo real</li>
                <li>• Grupos de estudio</li>
                <li>• Sistema de mentorías</li>
                <li>• Eventos y webinars</li>
              </ul>
            </div>
          </div>
        </div>
        <a
          href="/student"
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mt-6"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
};

export default CommunityPage; 