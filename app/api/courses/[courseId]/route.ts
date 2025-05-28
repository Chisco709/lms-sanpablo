import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server"

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
    console.log("[COURSE_ID_DELETE]", error);
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
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        }) 

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSE_ID]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}