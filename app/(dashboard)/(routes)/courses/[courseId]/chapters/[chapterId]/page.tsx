import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import ChapterPage from "./_components/chapter-page";
import { Chapter, Course, Purchase } from "@prisma/client";

export const dynamic = 'force-dynamic';

// Interfaz para el tipo de video que espera el componente ChapterPage
interface ChapterVideo {
  id: string;
  title: string;
  url: string;
  position: number;
  isPrimary: boolean;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaz para los datos del capítulo que espera el componente ChapterPage
interface ChapterData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  pdfUrl: string;
  googleFormUrl: string;
  isFree: boolean;
  videos?: ChapterVideo[];
}

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}): Promise<JSX.Element> => {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = params;

    if (!user) {
      return redirect("/");
    }

    const result = await getChapter({ 
      userId: user.id,
      chapterId,
      courseId,
    });

    if (!result || !result.chapter || !result.course) {
      console.error("Chapter or course not found");
      return redirect("/dashboard");
    }

    const { chapter, course, attachments, nextChapter, userProgress, purchase } = result;

    // Función para convertir fechas a string
    const formatDate = (date: Date | string | undefined): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date ? date.toISOString() : date;
    };

    // Crear el objeto de datos del capítulo asegurando que las fechas sean strings
    const chapterData: ChapterData = {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description || "",
      videoUrl: chapter.videoUrl || "",
      position: chapter.position || 1,
      pdfUrl: chapter.pdfUrl || "",
      googleFormUrl: chapter.googleFormUrl || "",
      isFree: chapter.isFree || false,
      videos: Array.isArray((chapter as any).videos) 
        ? (chapter as any).videos.map((video: any) => ({
            id: video.id,
            title: video.title,
            url: video.url,
            position: video.position,
            isPrimary: video.isPrimary,
            chapterId: video.chapterId,
            createdAt: formatDate(video.createdAt),
            updatedAt: formatDate(video.updatedAt)
          }))
        : []
    };

    return (
      <ChapterPage
        chapter={chapterData}
        course={course}
        attachments={attachments || []}
        nextChapter={nextChapter || undefined}
        userProgress={userProgress || undefined}
        purchase={purchase as Purchase | null | undefined}
        userId={user.id}
      />
    );
  } catch (error) {
    console.error("Error in ChapterIdPage:", error);
    return redirect("/dashboard");
  }
};

export default ChapterIdPage;