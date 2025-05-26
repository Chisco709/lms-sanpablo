import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import Link from "next/link";
import { db } from "@/lib/db"
import { ArrowLeft, Eye, LayoutDashboard, Video, FileText, Calendar } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterPdfForm } from "./_components/chapter-pdf-form";
import { ChapterGoogleForm } from "./_components/chapter-google-form";
import { ChapterUnlockDateForm } from "./_components/chapter-unlock-date-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";


const ChapterIdPage = async({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    
    if (!userId) {
        return redirect("/")
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId
        }
    })

    if (!chapter) {
        return redirect("/")
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean)

    return (
      <>
      {!chapter.isPublished && (
        <Banner 
          variant="warning"
          label="Este capítulo no está publicado y no será visible en el curso"
        />
      )}
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="flex items-center text-sm text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al setup de cursos
        </Link>

        <section className="flex flex-col gap-y-2 mb-8">
          <h1 className="text-2xl font-bold text-white">
            {chapter.title || "Nuevo Capítulo"}
          </h1>
          <p className="text-sm text-slate-400">
            Campos completados {completionText}
          </p>
        </section>
        <ChapterActions 
          disabled={!isComplete}
          courseId={courseId}
          chapterId={chapterId}
          isPublished={chapter.isPublished}
        />
      </header>

      <section className="space-y-6">
        {/* Sección de Personalización */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} variant="success" />
            <h2 className="text-xl font-semibold text-white">
              Personalización del Capítulo
            </h2>
          </header>
          
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
        </article>

        {/* Sección de Configuración de Acceso */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={Eye} variant="warning"/>
            <h2 className="text-xl font-semibold text-white">
              Configuración de Acceso
            </h2>
          </header>
          <ChapterAccessForm 
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
          <ChapterUnlockDateForm 
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </article>

        {/* Sección de Video */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={Video} variant="info"/>
            <h2 className="text-xl font-semibold text-white">
              Contenido del Video
            </h2>
          </header>
          <ChapterVideoForm 
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
        </article>

        {/* Sección de Guía PDF */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={FileText} variant="warning"/>
            <h2 className="text-xl font-semibold text-white">
              Guía de Estudio (PDF)
            </h2>
          </header>
          <ChapterPdfForm 
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
        </article>

        {/* Sección de Google Form */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={FileText} variant="info"/>
            <h2 className="text-xl font-semibold text-white">
              Formulario de Evaluación
            </h2>
          </header>
          <ChapterGoogleForm 
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
        </article>
      </section>
    </main>
    </>
  );
}

export default ChapterIdPage;