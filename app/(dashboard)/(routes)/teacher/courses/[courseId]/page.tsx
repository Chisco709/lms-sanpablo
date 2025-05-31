// app/(dashboard)/(routes)/teacher/courses/[courseId]/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { NotificationsPanel } from "./_components/notifications-panel";

import { PensumTopicsForm } from "./_components/pensum-topics-form";
import { CourseActions } from "./_components/course-actions";

import { Course, Attachment, Chapter, PensumTopic } from "@prisma/client";

interface CourseWithAttachments extends Course {
  attachments: Attachment[];
  chapters: Chapter[];
  pensumTopics: (PensumTopic & { chapters: Chapter[] })[];
}

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const user = await currentUser();
  const { courseId } = await params;

  if (!user) {
    return redirect("/");
  }

  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc"
          }
        },
        attachments: {
          orderBy: {
            createdAt: "desc"
          }
        },
        pensumTopics: {
          include: {
            chapters: true
          },
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (!course) {
      return redirect("/");
    }

    const hasPublishedChapters = course.chapters.some((chapter: Chapter) => chapter.isPublished);
    
    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      hasPublishedChapters
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    return (
      <div className="min-h-screen bg-slate-950 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <CourseHeader completionText={completionText} />
          <div className="flex items-center gap-3">
            <NotificationsPanel courseId={courseId} />
            <CourseActions
              disabled={completedFields !== totalFields}
              courseId={courseId}
              isPublished={course.isPublished}
            />
          </div>
        </div>

        {/* Success Banner */}
        {completedFields === totalFields && !course.isPublished && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-emerald-400 text-sm font-medium">
                    ¡Curso listo para publicar!
                  </p>
                  <p className="text-emerald-300/70 text-xs mt-1">
                    Todos los campos están completos. Haz clic en &quot;Publicar&quot; para que los estudiantes puedan verlo.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 text-sm font-bold">
                  ✅ {completedFields}/{totalFields}
                </div>
                <div className="text-emerald-300/70 text-xs">
                  Completado
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Published Banner */}
        {course.isPublished && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-blue-400 text-sm font-medium">
                    🎉 ¡Curso publicado exitosamente!
                  </p>
                  <p className="text-blue-300/70 text-xs mt-1">
                    Los estudiantes ya pueden ver y inscribirse en tu curso.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-400 text-sm font-bold">
                  🌟 ACTIVO
                </div>
                <div className="text-blue-300/70 text-xs">
                  Visible para estudiantes
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Banner */}
        {completedFields !== totalFields && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-yellow-400 text-sm font-medium">
                    Completa todos los campos requeridos para publicar tu curso
                  </p>
                  <p className="text-yellow-300/70 text-xs mt-1">
                    Una vez publicado, los estudiantes podrán verlo inmediatamente
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 text-sm font-bold">
                  {completedFields}/{totalFields}
                </div>
                <div className="text-yellow-300/70 text-xs">
                  Campos completados
                </div>
              </div>
            </div>
            <div className="mt-3 bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedFields / totalFields) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <CourseCustomizationSection course={course} />
          <PensumTopicsSection course={course} />
          <PricingSection course={course} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("[COURSE_ID_PAGE]", error);
    return redirect("/teacher/courses");
  }
}

// Componente del Header
interface CourseHeaderProps {
  completionText: string;
}

function CourseHeader({ completionText }: CourseHeaderProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-medium text-white">
        Configuración del curso
      </h1>
      <span className="text-sm text-slate-400">
        Completa todos los campos {completionText}
      </span>
    </div>
  );
}

// Sección de personalización del curso
interface CourseCustomizationSectionProps {
  course: CourseWithAttachments;
}

function CourseCustomizationSection({ course }: CourseCustomizationSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutDashboard} />
        <h2 className="text-xl text-white">
          Personaliza tu curso
        </h2>
      </div>
      <TitleForm
        initialData={course}
        courseId={course.id}
      />
      <DescriptionForm
        initialData={course}
        courseId={course.id}
      />
      <ImageForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}

// Sección de temas del pensum
interface PensumTopicsSectionProps {
  course: CourseWithAttachments;
}

function PensumTopicsSection({ course }: PensumTopicsSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={ListChecks} />
        <h2 className="text-xl text-white">
          Temas del Pensum
        </h2>
      </div>
      <PensumTopicsForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}

// Sección de precios
interface PricingSectionProps {
  course: CourseWithAttachments;
}

function PricingSection({ course }: PricingSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={CircleDollarSign} />
        <h2 className="text-xl text-white">
          Vende tu curso
        </h2>
      </div>
      <PriceForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}



