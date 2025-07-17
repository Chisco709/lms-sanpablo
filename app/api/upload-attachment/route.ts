import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, name, courseId } = body;

    if (!url || !name || !courseId) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el usuario sea propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado o no autorizado" },
        { status: 404 }
      );
    }

    // Crear el attachment en la base de datos
    const attachment = await db.attachment.create({
      data: {
        name,
        url,
        courseId
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("Error en upload-attachment:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 