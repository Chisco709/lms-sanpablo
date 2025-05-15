// app/(dashboard)/(routes)/teacher/courses/[courseId]/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";

import db from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";

import { Course, Category, Attachment } from "@prisma/client";
import { ChaptersForm } from "./_components/chapters-form";

interface CourseWithAttachments extends Course {
  attachments: Attachment[];
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

  if (!userId) {
    return redirect("/");
  }

  // Mover el acceso a courseId después del primer await
  const { courseId } = params;

  try {
    const [course, categories] = await Promise.all([
      fetchCourse(userId, courseId),
      fetchCategories()
    ]);

    if (!course) {
      return redirect("/");
    }



    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.categoryId
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
        <CourseHeader
          completionText={completionText}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <CourseCustomizationSection
            course={course}
            categoryOptions={categoryOptions}
          />

          <div className="space-y-6">
            <ChaptersSection course={course}/>
            <PricingSection course={course} />
            <ResourcesSection course={course} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[COURSE_ID_PAGE]", error);
    // Considerar un mensaje de error más amigable o una página 404
    return redirect("/teacher/courses");
  }
}

async function fetchCourse(userId: string, courseId: string): Promise<CourseWithAttachments | null> {
  return db.course.findUnique({
    where: {
      id: courseId,
      userId
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
}


async function fetchCategories(): Promise<Category[]> {
  return db.category.findMany({
    orderBy: {
      name: "asc",
    }
  });
}



interface CourseHeaderProps {
  completionText: string;
}

function CourseHeader({ completionText }: CourseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">
          Course Setup
        </h1>
        <span className="text-sm text-slate-700">
          Completa todos los campos {completionText}
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
          Capítulos del curso
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

interface ResourcesSectionProps {
  course: CourseWithAttachments;
}

function ResourcesSection({ course }: ResourcesSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={File}/>
        <h2 className="text-xl">
          Recursos y Videos
        </h2>
      </div>
      <AttachmentForm
        initialData={course}
        courseId={course.id}
      />
    </div>
  );
}
