import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      }
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        }
      }
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Por ahora, crear la compra directamente (sin Stripe)
    // En producción, aquí iría la integración con Stripe
    const newPurchase = await db.purchase.create({
      data: {
        courseId: courseId,
        userId: user.id,
      }
    });

    return NextResponse.json({ 
      url: `/courses/${courseId}`,
      message: "Compra realizada exitosamente" 
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 