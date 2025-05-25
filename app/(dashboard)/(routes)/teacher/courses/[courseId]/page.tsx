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

import { Course, Category, Attachment, Chapter } from "@prisma/client";

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
      <div className="p-6">
        <div className="flex items-center justify-between">
          <CourseHeader completionText={completionText} />
          <CourseActions
            disabled={completedFields !== totalFields}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">
          Configuración del Curso
        </h1>
        <span className="text-sm text-slate-700">
          Campos completados {completionText}
        </span>
      </div>
    </div>
  );
}

interface CourseCustomizationSectionProps {
  course: CourseWithAttachments;
  categoryOptions: CategoryOption[];
}

function CourseCustomizationSection({ course, categoryOptions }: CourseCustomizationSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutDashboard}/>
        <h2 className="text-xl">
          Personalización del Curso
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

      <CategoryForm
        initialData={course}
        courseId={course.id}
        options={categoryOptions}
      />
    </div>
  );
}

interface ChapterSectionsProps {
  course: CourseWithAttachments;
}

function ChaptersSection({ course }: ChapterSectionsProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={ListChecks}/>
        <h2 className="text-xl">
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
        <IconBadge icon={CircleDollarSign}/>
        <h2 className="text-xl">
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
        <IconBadge icon={File}/>
        <h2 className="text-xl">
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