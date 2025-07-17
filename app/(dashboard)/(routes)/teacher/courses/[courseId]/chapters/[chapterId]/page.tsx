import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, Video, File, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterPdfForm } from "./_components/chapter-pdf-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterActions } from "./_components/chapter-actions";
import { Banner } from "@/components/banner";

const ChapterIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const user = await currentUser();
  const { courseId, chapterId } = await params;

  if (!user) {
    return redirect("/");
  }

  // Verificar que sea el usuario autorizado
  if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      course: true,
    },
  });

  if (!chapter || !chapter.course || chapter.course.userId !== user.id) {
    return redirect("/teacher/courses");
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl || chapter.pdfUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="Este capítulo no está publicado. No será visible para los estudiantes."
        />
      )}
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/teacher/courses/${courseId}`}>
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al curso
              </Button>
            </Link>
            
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6 text-green-400" />
                Configurar Capítulo
              </h1>
              <p className="text-slate-400">
                Completa todos los campos {completionText}
              </p>
            </div>
          </div>

          <ChapterActions
            disabled={!isComplete}
            courseId={courseId}
            chapterId={chapterId}
            isPublished={chapter.isPublished}
          />
        </div>

        {/* Indicador de progreso */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Progreso de configuración
            </span>
            <span className="text-sm text-slate-400">{completionText}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
          {!isComplete && (
            <p className="text-sm text-yellow-400 mt-2">
              Completa todos los campos para poder publicar el capítulo
            </p>
          )}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Información básica */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-6">
                <LayoutDashboard className="h-4 w-4 text-green-400" />
                <h2 className="text-xl text-white">
                  Personaliza tu capítulo
                </h2>
              </div>
              
              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>

            <div>
              <div className="flex items-center gap-x-2 mb-6">
                <Eye className="h-4 w-4 text-blue-400" />
                <h2 className="text-xl text-white">
                  Configuración de acceso
                </h2>
              </div>
              
              <ChapterAccessForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>

          {/* Columna derecha - Contenido multimedia */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-6">
                <Video className="h-4 w-4 text-purple-400" />
                <h2 className="text-xl text-white">
                  Contenido multimedia
                </h2>
              </div>
              
              <ChapterVideoForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              
              <ChapterPdfForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>

            {/* Información adicional */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2">💡 Consejos</h3>
              <ul className="text-blue-300/80 space-y-1 text-sm">
                <li>• Agrega una descripción clara del contenido</li>
                <li>• Incluye videos de YouTube para explicaciones</li>
                <li>• Sube PDFs con material complementario</li>
                <li>• Marca como "Gratis" para contenido de muestra</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage; 