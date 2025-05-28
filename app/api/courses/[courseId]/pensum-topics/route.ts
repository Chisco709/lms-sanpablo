import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    const { courseId } = await params;

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

    const lastTopic = await db.pensumTopic.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      }
    });

    const newPosition = lastTopic ? lastTopic.position + 1 : 1;

    const pensumTopic = await db.pensumTopic.create({
      data: {
        title,
        courseId: courseId,
        position: newPosition,
      }
    });

    return NextResponse.json(pensumTopic);
  } catch (error) {
    console.log("[PENSUM_TOPICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 