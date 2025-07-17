import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courses = await db.course.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
        chapters: {
          select: {
            id: true,
            isPublished: true,
          },
        },
        purchases: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.log("[COURSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { title, description, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const course = await db.course.create({
      data: { 
        userId, 
        title,
        description: description || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
