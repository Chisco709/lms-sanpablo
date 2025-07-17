import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params } : { params: Promise<{ courseId: string }> }
) {
    try {
        const user = await currentUser();
        const { courseId } = await params;
        const { title, pensumTopicId } = await req.json()

        if(!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: user.id,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        } 

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
                pensumTopicId: pensumTopicId || null
            }
        })

        return NextResponse.json(chapter)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}