import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Settings, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseActions } from "./_components/course-actions";
import { CourseInfoForm } from "./_components/course-info-form";
import { ChaptersList } from "./_components/chapters-list";
import { PensumTopicsList } from "./_components/pensum-topics-list";

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

  // Verificar que sea el usuario autorizado
  if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId: user.id,
    },
    include: {
      category: true,
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      pensumTopics: {
        include: {
          chapters: {
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  // Check if there are any published chapters with PDFs for the publish button
  const hasPublishedChapters = await db.chapter.count({
    where: {
      courseId: courseId,
      isPublished: true,
      pdfUrl: {
        not: null
      }
    }
  }) > 0;

  if (!course) {
    return redirect("/teacher/courses");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // ✅ SIMPLIFICADO: Solo título es requerido para publicar
  const requiredFields = [
    course.title,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  // Debug: Mostrar qué campos están completados
  console.log('🔍 DEBUG - Campos del curso:', {
    title: course.title ? '✅' : '❌',
    description: course.description ? '✅' : '❌', 
    imageUrl: course.imageUrl ? '✅' : '❌',
    isComplete
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/courses">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Mis Cursos
            </Button>
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-green-400" />
              Configurar Curso
            </h1>
            <p className="text-slate-400">
              Solo título requerido para publicar {completionText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{course._count.purchases} estudiantes</span>
          </div>
          
          <CourseActions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
            hasPublishedChapters={hasPublishedChapters}
          />
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">
            Progreso de configuración
          </span>
          <span className="text-sm text-slate-400">{completionText}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedFields / totalFields) * 100}%` }}
          ></div>
        </div>
        {!isComplete && (
          <p className="text-sm text-yellow-400 mt-2">
            Solo necesitas completar el título para poder publicar el curso
          </p>
        )}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda - Información básica */}
        <div className="space-y-6">
          <CourseInfoForm 
            initialData={course}
            courseId={course.id}
            categories={categories}
          />
        </div>

        {/* Columna derecha - Capítulos y contenido */}
        <div className="space-y-6">
          {/* Primero: Temas del pensum */}
          <PensumTopicsList 
            initialData={course.pensumTopics}
            courseId={course.id}
          />

          {/* Segundo: Capítulos (dependen de temas) */}
          <ChaptersList 
            initialData={course.chapters}
            courseId={course.id}
            pensumTopics={course.pensumTopics}
          />
          
          {/* Información adicional */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">💡 Guía rápida de publicación</h3>
            <ul className="text-blue-300/80 space-y-1 text-sm">
              <li>• <strong>Paso 1:</strong> Crea temas del pensum para organizar</li>
              <li>• <strong>Paso 2:</strong> Agrega capítulos a cada tema</li>
              <li>• <strong>Paso 3:</strong> Solo necesitas el título para publicar</li>
              <li>• <strong>¿Listo?</strong> ¡Publica cuando quieras!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage; 