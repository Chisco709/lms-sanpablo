// app/courses/[courseId]/page.tsx

import { auth } from "@clerk/nextjs/server";   
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";


interface Props {
  params: { courseId: string };
}

export default async function CourseIdPage({ params }: Props) {
  // auth() es asíncrono y solo funciona en Server Components del App Router
  const { userId } = await auth();

  // Si no hay sesión, redirige al home
  if (!userId) {
    redirect("/");
  }

  // Obtenemos el parámetro courseId
  const courseId = params.courseId;

  // Y luego lo usamos en la consulta
  try {
    // Busca el curso en la base de datos
    const course = await db.course.findUnique({
      where: { 
        id: courseId,
        userId
      },
    });

    const categories = await db.category.findMany({
      orderBy: {
        name : "asc",
      }
    })


    // Si no existe, también redirige
    if (!course) {
      redirect("/");
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

    // Renderiza la página para usuarios autenticados
    return <div className="p-6">
          <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">
                      Course Setup
                  </h1>
                  <span className="text-sm text-slate-700">
                      Completa todos los {completionText}
                  </span>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
                      options={categories.map((category) => ({
                        label: category.name,
                        value: category.id
                      }))}
                      />
                     
              </div>
          </div>
      </div>
  } catch (error) {
    console.error("[COURSE_ID_PAGE]", error);
    return redirect("/teacher/courses");
  }
}
