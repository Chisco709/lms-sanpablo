import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; topicId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, topicId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedTopic = await db.pensumTopic.update({
      where: {
        id: topicId,
        courseId: courseId,
      },
      data: {
        isPublished: false,
      }
    });

    return NextResponse.json(unpublishedTopic);
  } catch (error) {
    console.log("[PENSUM_TOPIC_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 