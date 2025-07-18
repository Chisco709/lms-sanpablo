import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; topicId: string }> }
) {
  try {
    const user = await currentUser();
    const { ...values } = await req.json();
    const { courseId, topicId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; topicId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, topicId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
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
    console.log("[PENSUM_TOPIC_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 