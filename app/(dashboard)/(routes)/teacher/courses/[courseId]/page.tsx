// app/(dashboard)/(routes)/teacher/courses/[courseId]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { CourseActions } from "./_components/course-actions";

import { Course, Attachment, Chapter } from "@prisma/client";

interface CourseWithAttachments extends Course {
  attachments: Attachment[];
  chapters: Chapter[];
}

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

interface CategoryOption {
  label: string;
  value: string;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    return redirect("/");
  }

  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId
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
        }
      }
    });

    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      }
    });

    if (!course) {
      return redirect("/");
    }

    const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);
    
    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.categoryId,
      hasPublishedChapters
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const categoryOptions = categories.map((category) => ({
      label: category.name,
      value: category.id
    }));

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <CourseHeader completionText={completionText} />
          <CourseActions
            disabled={completedFields !== totalFields}
            courseId={courseId}
            isPublished={course.isPublished}
          />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseCustomizationSection
            course={course}
            categoryOptions={categoryOptions}
          />
          
          <div className="space-y-6">
            <ChaptersSection course={course} />
            <PricingSection course={course} />
            <ResourcesSection course={course} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[COURSE_ID_PAGE]", error);
    return redirect("/teacher/courses");
  }
}

interface CourseHeaderProps {
  completionText: string;
}

function CourseHeader({ completionText }: CourseHeaderProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-bold text-white">
        Configuración del Curso
      </h1>
      <span className="text-sm text-slate-400">
        Campos completados {completionText}
      </span>
    </div>
  );
}

interface CourseCustomizationSectionProps {
  course: CourseWithAttachments;
  categoryOptions: CategoryOption[];
}

function CourseCustomizationSection({ course, categoryOptions }: CourseCustomizationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutDashboard} variant="success"/>
        <h2 className="text-xl font-semibold text-white">
          Personalización del Curso
        </h2>
      </div>

      <div className="space-y-4">
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

        <CategoryForm
          initialData={course}
          courseId={course.id}
          options={categoryOptions}
        />
      </div>
    </div>
  );
}

interface ChapterSectionsProps {
  course: CourseWithAttachments;
}

function ChaptersSection({ course }: ChapterSectionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={ListChecks} variant="success"/>
        <h2 className="text-xl font-semibold text-white">
          Gestión de Capítulos
        </h2>
      </div>
      <ChaptersForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}

interface PricingSectionProps {
  course: CourseWithAttachments;
}

function PricingSection({ course }: PricingSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={CircleDollarSign} variant="warning"/>
        <h2 className="text-xl font-semibold text-white">
          Configuración de Precio
        </h2>
      </div>
      <PriceForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}

interface ResourcesSectionProps {
  course: CourseWithAttachments;
}

function ResourcesSection({ course }: ResourcesSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={File} variant="info"/>
        <h2 className="text-xl font-semibold text-white">
          Recursos Adicionales
        </h2>
      </div>
      <AttachmentForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}