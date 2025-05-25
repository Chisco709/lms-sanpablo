import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import Link from "next/link";
import { db } from "@/lib/db"
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";


const ChapterIdPage = async({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {
    const { userId } = await auth();
    
    if (!userId) {
        return redirect("/")
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
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
          href={`/teacher/courses/${params.courseId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al setup de cursos
        </Link>

        <section className="flex flex-col gap-y-2 mb-8">
          <h1 className="text-2xl font-medium">
            {chapter.title || "Nuevo capítulo"}
          </h1>
          <p className="text-sm text-slate-700">
            Campos completados {completionText}
          </p>
        </section>
        <ChapterActions 
          disabled={!isComplete}
          courseId={params.courseId}
          chapterId={params.chapterId}
          isPublished={chapter.isPublished}
        />
      </header>

      <section className="space-y-6">
        {/* Sección de Personalización */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              Personaliza tu capítulo
            </h2>
          </header>
          
          <ChapterTitleForm 
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
          <ChapterDescriptionForm 
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </article>

        {/* Sección de Configuración de Acceso */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={Eye}/>
            <h2 className="text-xl">
              Configuración de acceso
            </h2>
          </header>
          <ChapterAccessForm 
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </article>

        {/* Sección de Video */}
        <article className="space-y-6">
          <header className="flex items-center gap-x-2">
            <IconBadge icon={Video}/>
            <h2 className="text-xl">
              URL del Video (YouTube)
            </h2>
          </header>
          <ChapterVideoForm 
            initialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
        </article>
      </section>
    </main>
    </>
  );
}

export default ChapterIdPage;