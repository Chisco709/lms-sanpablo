import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; studentId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, studentId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Buscar la compra existente
    const purchase = await db.purchase.findUnique({
      where: {
        id: studentId,
        courseId: courseId,
      },
    });

    if (!purchase) {
      return new NextResponse("Purchase not found", { status: 404 });
    }

    return NextResponse.json(purchase);
  } catch (error) {
    console.log("[STUDENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; studentId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, studentId   } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Eliminar el estudiante
    await db.purchase.delete({
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