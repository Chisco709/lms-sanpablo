import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { CoursePageClient } from "./_components/course-page-client";
import Head from "next/head";

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
  const hasAccess = !!purchase || isFreeCoure;

  // ✅ SOPORTE PARA CURSOS CON Y SIN TEMAS DEL PENSUM
  let allChapters = [];
  
  if (course.pensumTopics && course.pensumTopics.length > 0) {
    // Si tiene temas del pensum, usar esos capítulos
    allChapters = course.pensumTopics.flatMap(topic => topic.chapters);
  } else {
    // Si NO tiene temas del pensum, usar capítulos directos
    allChapters = course.chapters;
    
    // Crear un tema virtual para mantener la UI consistente
    const virtualTopic = {
      id: 'virtual-topic',
      title: 'Contenido del Curso',
      description: 'Todas las clases del curso',
      position: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      courseId: course.id,
      chapters: course.chapters
    };
    
    // Crear nuevo objeto course con pensumTopics
    const courseWithTopics = {
      ...course,
      pensumTopics: [virtualTopic]
    };
    
    // Pasar courseWithTopics al componente
    return (
      <CoursePageClient 
        course={courseWithTopics}
        progressCount={progressCount}
        completedChapters={0}
        hasAccess={hasAccess}
        isFreeCoure={isFreeCoure}
        courseId={courseId}
      />
    );
  }

  if (allChapters.length === 0) {
    return redirect("/student");
  }

  const completedChapters = allChapters.filter(ch => ch.userProgress?.[0]?.isCompleted).length;

  // SEO dinámico
  const seoTitle = `${course.title} | Instituto San Pablo`;
  const seoDescription = course.description || `Curso de ${course.title} en el Instituto San Pablo. Aprende y certifícate con los mejores.`;
  const seoImage = course.imageUrl || "/logo-sanpablo.jpg";
  const seoUrl = `https://institutosanpablo.edu.co/courses/${courseId}`;
  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "Instituto San Pablo",
      "sameAs": "https://institutosanpablo.edu.co"
    },
    "url": seoUrl,
    "image": seoImage
  };

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <CoursePageClient 
        course={course}
        progressCount={progressCount}
        completedChapters={completedChapters}
        hasAccess={hasAccess}
        isFreeCoure={isFreeCoure}
        courseId={courseId}
      />
    </>
  );
}

export default CourseIdPage;