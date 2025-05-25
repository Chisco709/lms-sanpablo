import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import ChapterPage from "./_components/chapter-page";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

  if (!userId) {
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
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  return (
    <ChapterPage
      chapter={chapter}
      course={course}
      attachments={attachments}
      nextChapter={nextChapter}
      userProgress={userProgress}
      purchase={purchase}
      userId={userId}
    />
  );
};

export default ChapterIdPage; 