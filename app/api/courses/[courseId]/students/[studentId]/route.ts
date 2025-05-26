import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; studentId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, studentId } = await params;
    const { status, notes } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Actualizar el estudiante
    const updatedStudent = await db.studentPayment.update({
      where: {
        id: studentId,
        courseId: courseId,
      },
      data: {
        status: status,
        notes: notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.log("[STUDENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; studentId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, studentId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Eliminar el estudiante
    await db.studentPayment.delete({
      where: {
        id: studentId,
        courseId: courseId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[STUDENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 