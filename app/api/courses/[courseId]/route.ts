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
    { params } : { params: Promise<{ courseId: string }> }
) {
    try{
        const { userId } = await auth()
        const { courseId } = await params;
        const values = await req.json()
        
        console.log(`API PATCH /api/courses/${courseId} - User: ${userId}, Values:`, values);
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Validar que el curso pertenece al usuario
        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!existingCourse) {
            console.log(`API PATCH /api/courses/${courseId} - Course not found or not owned by user`);
            return new NextResponse("Course not found", { status: 404 });
        }

        // Si se está actualizando la imagen, validar la URL
        if (values.imageUrl !== undefined) {
            console.log(`API PATCH /api/courses/${courseId} - Updating imageUrl from "${existingCourse.imageUrl}" to "${values.imageUrl}"`);
            
            // Si la nueva URL es null o vacía, permitir
            if (values.imageUrl === null || values.imageUrl === "") {
                console.log(`API PATCH /api/courses/${courseId} - Clearing imageUrl`);
            } else {
                // Validar que la URL sea válida
                try {
                    new URL(values.imageUrl);
                    console.log(`API PATCH /api/courses/${courseId} - Valid imageUrl: ${values.imageUrl}`);
                } catch (error) {
                    console.error(`API PATCH /api/courses/${courseId} - Invalid imageUrl: ${values.imageUrl}`);
                    return new NextResponse("Invalid image URL", { status: 400 });
                }
            }
        }

        // Construir objeto data dinámicamente
        const data: any = {};
        if (values.title !== undefined) data.title = values.title;
        if (values.description !== undefined) data.description = values.description;
        if (values.imageUrl !== undefined) data.imageUrl = values.imageUrl;
        if (values.categoryId !== undefined) data.categoryId = values.categoryId;

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data
        }) 

        console.log(`API PATCH /api/courses/${courseId} - Update successful:`, course);
        return NextResponse.json(course)
    } catch (error) {
        console.error(`API PATCH /api/courses/ - Error:`, error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}