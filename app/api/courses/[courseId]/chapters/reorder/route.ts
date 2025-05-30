import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db"

export async function PUT(
    req: Request,
    { params } : {params: Promise<{ courseId: string }> }
) {
    try {
        const user = await currentUser();
        const { courseId } = await params;

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { list } = await req.json()

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: user.id
            }
        });

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 })   
        }

        for (const item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data:  { position: item.position }
            });
        }

        return new NextResponse("Success", { status: 200 })

    } catch (error) {
        console.log("[REORDER]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}