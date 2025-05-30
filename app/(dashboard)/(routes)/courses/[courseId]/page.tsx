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
            where: { userId: user.id,
            }
          }
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
            where: {
              isPublished: true,
            },
            include: {
              userProgress: {
                where: { userId: user.id,
                }
              }
            },
            orderBy: {
              position: "asc"
            }
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
  const hasAccess = purchase || isFreeCoure;

  // ✅ SOPORTE PARA CURSOS CON Y SIN TEMAS DEL PENSUM
  let allChapters = [];
  
  if (course.pensumTopics && course.pensumTopics.length > 0) {
    // Si tiene temas del pensum, usar esos capítulos
    allChapters = course.pensumTopics.flatMap(topic => topic.chapters);
  } else {
    // Si NO tiene temas del pensum, usar capítulos directos
    allChapters = course.chapters;
    
    // Crear un tema virtual para mantener la UI consistente
    course.pensumTopics = [{
      id: 'virtual-topic',
      title: 'Contenido del Curso',
      description: 'Todas las clases del curso',
      position: 1,
      isPublished: true,
      chapters: course.chapters
    }];
  }

  if (allChapters.length === 0) {
    return redirect("/student");
  }

  const completedChapters = allChapters.filter(ch => ch.userProgress?.[0]?.isCompleted).length;

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