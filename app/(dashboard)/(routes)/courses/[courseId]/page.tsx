import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { CoursePageClient } from "./_components/course-page-client";

const CourseIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string }>
}) => {
  const user = await currentUser();
  const { courseId } = await params;

  if (!user) {
    return redirect("/");
  }
  
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: { userId: user.id }
          },
          pensumTopic: true // Incluye el tema de pensum en cada capítulo
        },
        orderBy: {
          position: "asc"
        }
      },
      pensumTopics: {
        where: {
          isPublished: true,
        },
        include: {
          chapters: {
            where: { isPublished: true },
            orderBy: { position: "asc" }
          }
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

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: { userId: user.id,
        courseId: course.id,
      }
    }
  });

  const progressCount = await getProgress(user.id, course.id);
  const isFreeCoure = !course.price || course.price === 0;
  const hasAccess = !!purchase || isFreeCoure;

  // ✅ SOPORTE PARA CURSOS CON Y SIN TEMAS DEL PENSUM
  let allChapters = [];
  // Filtra solo temas con capítulos publicados
  if (course.pensumTopics && course.pensumTopics.length > 0) {
    course.pensumTopics = course.pensumTopics.filter((topic: any) => topic.chapters && topic.chapters.length > 0);
    if (course.pensumTopics.length > 0) {
      allChapters = course.pensumTopics.flatMap((topic: any) => topic.chapters);
    } else {
      allChapters = course.chapters;
      course.pensumTopics = [{
        id: 'virtual-topic',
        title: 'Contenido del Curso',
        description: 'Todas las clases del curso',
        position: 1,
        isPublished: true,
        courseId: course.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        chapters: course.chapters
      }];
    }
  } else {
    allChapters = course.chapters;
    course.pensumTopics = [{
      id: 'virtual-topic',
      title: 'Contenido del Curso',
      description: 'Todas las clases del curso',
      position: 1,
      isPublished: true,
      courseId: course.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      chapters: course.chapters
    }];
  }

  if (allChapters.length === 0) {
    return redirect("/student");
  }

  const completedChapters = allChapters.filter((ch: any) => ch.userProgress?.[0]?.isCompleted).length;

  return (
    <CoursePageClient 
      course={course}
      progressCount={progressCount}
      completedChapters={completedChapters}
      hasAccess={hasAccess}
      isFreeCoure={isFreeCoure}
      courseId={courseId}
    />
  );
}

export default CourseIdPage;