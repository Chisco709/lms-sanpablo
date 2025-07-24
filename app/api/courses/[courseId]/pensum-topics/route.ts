import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { title } = await req.json();
    const { courseId } = await params;

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

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = params;
    // Solo temas publicados y ordenados
    const topics = await db.pensumTopic.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      orderBy: {
        position: "asc",
      },
      include: {
        chapters: true,
      },
    });
    return NextResponse.json(topics);
  } catch (error) {
    console.log("[PENSUM_TOPICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}