import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    const { userId } = await auth();
    const { notificationId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Marcar la notificación como leída solo si pertenece al usuario
    const notification = await db.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId
      },
      data: {
        isRead: true
      }
    });

    if (notification.count === 0) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[NOTIFICATION_READ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 