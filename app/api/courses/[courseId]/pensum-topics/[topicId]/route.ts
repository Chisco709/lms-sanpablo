import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; topicId: string }> }
) {
  try {
    const { userId } = await auth();
    const { ...values } = await req.json();
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

    const pensumTopic = await db.pensumTopic.update({
      where: {
        id: topicId,
        courseId: courseId,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(pensumTopic);
  } catch (error) {
    console.log("[PENSUM_TOPIC_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
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

    const pensumTopic = await db.pensumTopic.findUnique({
      where: {
        id: topicId,
        courseId: courseId,
      }
    });

    if (!pensumTopic) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedTopic = await db.pensumTopic.delete({
      where: {
        id: topicId,
      }
    });

    return NextResponse.json(deletedTopic);
  } catch (error) {
    console.log("[PENSUM_TOPIC_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 