import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // <-- Cambio 1: Import desde /server
import db from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    // Cambio 2: Agrega await antes de auth()
    const { userId } = await auth(); // <-- Aquí estaba el error principal
    
    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[BORRAR_ARCHIVO_ADJUNTO]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}