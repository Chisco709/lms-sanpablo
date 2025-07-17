import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!course) {
      return new NextResponse("Course not found or unauthorized", { status: 404 });
    }

    // Obtener notificaciones relacionadas con este curso
    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
        relatedCourseId: courseId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limitar a las últimas 50 notificaciones
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Marcar todas las notificaciones del curso como leídas
    await db.notification.updateMany({
      where: {
        userId: userId,
        relatedCourseId: courseId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 