import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { url } = await req.json();
    const { courseId  } = params;
    
    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop() || "archivo",
        courseId: courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[CREATE_ATTACHMENT]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}