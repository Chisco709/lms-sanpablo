import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import ChapterPage from "./_components/chapter-page";
import { Chapter, Course, Purchase } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface ChapterWithVideos extends Chapter {
  videos: Array<{
    id: string;
    title: string;
    url: string;
    position: number;
    isPrimary: boolean;
    chapterId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
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

    const chapterData = {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description || "",
      videoUrl: chapter.videoUrl || "",
      position: chapter.position || 1,
      pdfUrl: chapter.pdfUrl || "",
      googleFormUrl: chapter.googleFormUrl || "",
      isFree: chapter.isFree || false,
      videos: Array.isArray((chapter as ChapterWithVideos).videos) 
        ? (chapter as ChapterWithVideos).videos 
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