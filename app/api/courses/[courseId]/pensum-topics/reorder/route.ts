import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { list } = await req.json();
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

    for (let item of list) {
      await db.pensumTopic.update({
        where: { id: item.id },
        data: { position: item.position }
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 