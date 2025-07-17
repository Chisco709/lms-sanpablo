import { NextRequest, NextResponse } from "next/server";
import { dailyUnlockCheck } from "@/lib/unlock-system";

/**
 * API Route para cron job de desbloqueo automático
 * Se ejecuta diariamente para verificar y desbloquear cursos
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autorización (opcional: agregar API key para seguridad)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "No autorizado" }, 
        { status: 401 }
      );
    }

    // Ejecutar verificación de desbloqueos
    const results = await dailyUnlockCheck();
    
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      coursesUnlocked: results.length,
      details: results,
      message: results.length > 0 
        ? `Se desbloquearon ${results.length} cursos exitosamente`
        : "No hay cursos para desbloquear en este momento"
    };

    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error("Error en cron job de desbloqueo:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Error interno del servidor",
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}

/**
 * Endpoint POST para desbloqueo manual (solo para administradores)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, force = false } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId es requerido" },
        { status: 400 }
      );
    }

    // Aquí podrías agregar verificación de permisos de administrador
    // const { userId } = auth();
    // const isAdmin = await checkAdminPermissions(userId);

    if (force) {
      // Desbloqueo forzado (ignora fechas y prerequisitos)
      const { db } = await import("@/lib/db");
      
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: true }
      });

      return NextResponse.json({
        success: true,
        message: "Curso desbloqueado manualmente",
        courseId
      });
    } else {
      // Desbloqueo normal (respeta reglas)
      const results = await dailyUnlockCheck();
      const unlockedCourse = results.find(r => r.courseId === courseId);
      
      if (unlockedCourse) {
        return NextResponse.json({
          success: true,
          message: "Curso desbloqueado",
          courseId
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "El curso no cumple las condiciones para desbloquearse",
          courseId
        }, { status: 400 });
      }
    }
    
  } catch (error) {
    console.error("Error en desbloqueo manual:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Error interno del servidor"
      }, 
      { status: 500 }
    );
  }
} 