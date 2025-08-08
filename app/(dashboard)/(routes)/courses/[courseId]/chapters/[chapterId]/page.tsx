import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import ChapterPage from "./_components/chapter-page";

const ChapterIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const user = await currentUser();
  const { courseId, chapterId } = await params;

  if (!user) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({ 
    userId: user.id,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  // Simplificar los tipos para evitar conflictos
  const chapterData = {
    id: chapter.id,
    title: chapter.title,
    description: chapter.description || "",
    videoUrl: chapter.videoUrl || "",
    videoUrls: Array.isArray(chapter.videoUrls) ? chapter.videoUrls : (chapter.videoUrl ? [chapter.videoUrl] : []),
    position: chapter.position || 1,
    pdfUrl: chapter.pdfUrl || "",
    pdfUrls: Array.isArray(chapter.pdfUrls) ? chapter.pdfUrls : (chapter.pdfUrl ? [chapter.pdfUrl] : []),
    googleFormUrl: chapter.googleFormUrl || "",
    isFree: chapter.isFree || false,
  };

  return (
    <ChapterPage
      chapter={chapterData}
      course={course}
      attachments={attachments}
      nextChapter={nextChapter ?? undefined}
      userProgress={userProgress ?? undefined}
      purchase={purchase}
      userId={user.id}
    />
  );
};

export default ChapterIdPage; 