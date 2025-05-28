import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Eye, LayoutDashboard } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { TopicTitleForm } from "./_components/topic-title-form";
import { TopicDescriptionForm } from "./_components/topic-description-form";
import { TopicActions } from "./_components/topic-actions";
import { TopicChaptersForm } from "./_components/topic-chapters-form";

interface TopicIdPageProps {
  params: {
    courseId: string;
    topicId: string;
  };
}

export default async function TopicIdPage({ params }: TopicIdPageProps) {
  const { userId } = await auth();
  const { courseId, topicId } = await params;

  if (!userId) {
    return redirect("/");
  }

  // Primero verificar que el curso pertenece al usuario
  const courseOwner = await db.course.findUnique({
    where: {
      id: courseId,
      userId: userId,
    },
  });

  if (!courseOwner) {
    return redirect("/");
  }

  // Luego obtener el tema con sus relaciones
  const topic = await db.pensumTopic.findUnique({
    where: {
      id: topicId,
      courseId: courseId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      course: true,
    },
  });

  if (!topic) {
    return redirect("/");
  }

  const requiredFields = [
    topic.title,
    topic.description,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm text-slate-400 hover:text-white transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la configuración del curso
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-bold text-white">
                  Configuración del Tema
                </h1>
                <span className="text-sm text-slate-400">
                  Completa todos los campos {completionText}
                </span>
              </div>
              <TopicActions
                disabled={!isComplete}
                courseId={courseId}
                topicId={topicId}
                isPublished={topic.isPublished}
              />
            </div>
          </div>
        </div>

        {/* Banner de estado del tema */}
        {isComplete && topic.isPublished && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-emerald-400 text-sm font-medium">
                    🎉 ¡Tema publicado exitosamente!
                  </p>
                  <p className="text-emerald-300/70 text-xs mt-1">
                    Los estudiantes ya pueden ver este tema y sus clases.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 text-sm font-bold">
                  ✅ PUBLICADO
                </div>
                <div className="text-emerald-300/70 text-xs">
                  Visible para estudiantes
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner de progreso */}
        {!isComplete && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-yellow-400 text-sm font-medium">
                    Completa todos los campos para publicar el tema
                  </p>
                  <p className="text-yellow-300/70 text-xs mt-1">
                    Una vez completado, podrás publicar el tema para los estudiantes
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={LayoutDashboard} variant="success" />
                <h2 className="text-xl font-semibold text-white">
                  Personaliza tu tema
                </h2>
              </div>
              <TopicTitleForm
                initialData={topic}
                courseId={courseId}
                topicId={topicId}
              />
              <TopicDescriptionForm
                initialData={topic}
                courseId={courseId}
                topicId={topicId}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={BookOpen} variant="success" />
                <h2 className="text-xl font-semibold text-white">
                  Clases del tema
                </h2>
              </div>
              <TopicChaptersForm
                initialData={topic}
                courseId={courseId}
                topicId={topicId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 