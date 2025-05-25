import { db } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server"


export async function PATCH(
    req: NextRequest,
    { params } : { params: { courseId: string }}
) {
    try{
        const { userId } = getAuth(req)
        const values = await req.json()
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.update({
            where: {
                id: params.courseId,
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