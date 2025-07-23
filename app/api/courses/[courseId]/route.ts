import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server"

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

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc"
          }
        },
        pensumTopics: {
          include: {
            chapters: {
              orderBy: {
                position: "asc"
              }
            }
          },
          orderBy: {
            position: "asc"
          }
        },
        attachments: {
          orderBy: {
            createdAt: "desc"
          }
        },
        category: true
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            userProgress: true,
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json(deletedCourse);
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
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validar que el curso pertenece al usuario
    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!existingCourse) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Validar y actualizar solo la descripción
    if (typeof values.description !== "string" || values.description.trim() === "") {
      return new NextResponse("Description is required and must be a string", { status: 400 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId
      },
      data: {
        description: values.description
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}