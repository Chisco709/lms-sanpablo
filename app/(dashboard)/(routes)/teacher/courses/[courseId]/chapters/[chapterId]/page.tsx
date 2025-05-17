import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import Link from "next/link";
import db from "@/lib/db"
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";

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
        },
        include: {
            muxData: true
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

    return (
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
            Crear capítulo
          </h1>
          <p className="text-sm text-slate-700">
            Completar todos los campos {completionText}
          </p>
        </section>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Segunda columna para otros componentes */}
        <article>
          {/* Contenido adicional */}
        </article>
      </section>
    </main>
  );
}
export default ChapterIdPage