import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { CoursePageClient } from "./_components/course-page-client";

interface CourseIdPageProps {
  params: { courseId: string }
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const user = await currentUser();
  const { courseId } = params;

  if (!user) {
    return redirect("/");
  }
  
  // Fetch the course with all necessary relations
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true
    },
    include: {
      category: true,
      pensumTopics: {
        where: {
          isPublished: true,
          chapters: {
            some: {
              isPublished: true
            }
          }
        },
        include: {
          chapters: {
            where: { 
              isPublished: true 
            },
            include: {
              userProgress: {
                where: { userId: user.id }
              }
            },
            orderBy: { 
              position: 'asc' 
            }
          }
        },
        orderBy: {
          position: 'asc'
        }
      },
      chapters: {
        where: { 
          isPublished: true 
        },
        include: {
          userProgress: {
            where: { userId: user.id }
          },
          pensumTopic: {
            select: { 
              id: true,
              title: true,
              isPublished: true
            }
          }
        },
        orderBy: { 
          position: 'asc' 
        }
      }
    }
  });

  if (!course) {
    return redirect("/");
  }

  // Check if user has purchased the course
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: { 
        userId: user.id,
        courseId: course.id
      }
    }
  });

  const progressCount = await getProgress(user.id, course.id);
  const isFreeCourse = !course.price || course.price === 0;
  const hasAccess = !!purchase || isFreeCourse;

  // Process Pensum Topics and chapters
  let allChapters = [];
  
  console.log('Course PensumTopics:', course.pensumTopics);
  console.log('Course Chapters:', course.chapters);
  
  // If there are published Pensum Topics with chapters
  if (course.pensumTopics?.length > 0) {
    console.log('Found Pensum Topics, count:', course.pensumTopics.length);
    // Filter out topics without chapters and ensure we have published chapters
    course.pensumTopics = course.pensumTopics.filter(
      (topic: any) => topic.chapters?.length > 0
    );

    if (course.pensumTopics.length > 0) {
      // Use the published Pensum Topics
      allChapters = course.pensumTopics.flatMap((topic: any) => topic.chapters);
    } else {
      // No valid Pensum Topics, fallback to chapters directly
      allChapters = course.chapters || [];
      
      // Create a virtual topic with all chapters
      const now = new Date();
      course.pensumTopics = [{
        id: 'virtual-topic',
        title: 'Neurobiología',
        description: 'Todas las clases del curso',
        position: 1,
        isPublished: true,
        courseId: course.id,
        createdAt: now,
        updatedAt: now,
        chapters: allChapters
      }];
    }
  } else {
    // No Pensum Topics, use chapters directly
    allChapters = course.chapters || [];
    
    // Create a virtual topic with all chapters
    const now = new Date();
    course.pensumTopics = [{
      id: 'virtual-topic',
      title: 'Contenido del Curso',
      description: 'Todas las clases del curso',
      position: 1,
      isPublished: true,
courseId: course.id,
      createdAt: now,
      updatedAt: now,
      chapters: allChapters
    }];
  }

  if (allChapters.length === 0) {
    console.log('No chapters found, redirecting to /student');
    return redirect("/student");
  }
  
  console.log('Final PensumTopics to render:', course.pensumTopics);
  console.log('All chapters count:', allChapters.length);

  const completedChapters = allChapters.filter((ch: any) => ch.userProgress?.[0]?.isCompleted).length;

  return (
    <CoursePageClient 
      course={course}
      progressCount={progressCount}
      completedChapters={completedChapters}
      hasAccess={hasAccess}
      isFreeCoure={isFreeCourse}
      courseId={courseId}
    />
  );
}

export default CourseIdPage;