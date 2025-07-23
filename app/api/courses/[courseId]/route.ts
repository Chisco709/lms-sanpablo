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

    // Construir objeto data dinámicamente
    const data: any = {};
    if (values.description !== undefined) {
      if (typeof values.description === "string") {
        data.description = values.description;
      } else if (values.description === null) {
        data.description = null;
      }
    }
    if (values.imageUrl !== undefined) {
      if (typeof values.imageUrl === "string") {
        data.imageUrl = values.imageUrl;
      } else if (values.imageUrl === null) {
        data.imageUrl = null;
      }
    }

    if (Object.keys(data).length === 0) {
      return new NextResponse("No valid fields to update", { status: 400 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId
      },
      data
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}