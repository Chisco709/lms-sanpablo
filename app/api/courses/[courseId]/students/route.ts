import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId   } = await params;
    const { userEmail, paymentType, amount, notes } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Curso no encontrado" }, 
        { status: 404 }
      );
    }

    // Buscar el usuario por email (esto requeriría integración con Clerk)
    // Por ahora, crearemos el registro con el email como userId temporal
    
    // Verificar si ya existe un pago para este usuario en este curso
    const existingPayment = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userEmail, // Temporal: usar email como userId
          courseId: courseId,
        }
      }
    });

    if (existingPayment) {
      return new NextResponse("Student already enrolled", { status: 400 });
    }

    // Calcular fecha de vencimiento (1 mes desde ahora)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // Crear el registro de pago del estudiante
    const studentPayment = await db.purchase.create({
      data: {
        userId: userEmail, // Temporal: usar email como userId
        courseId: courseId,
      }
    });

    return NextResponse.json({
      message: "Estudiante registrado exitosamente",
      student: studentPayment
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId   } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Curso no encontrado" }, 
        { status: 404 }
      );
    }

    // Obtener todos los estudiantes del curso
    const students = await db.purchase.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Aquí podrías agregar información del usuario desde Clerk si es necesario
    const formattedStudents = students.map((student: any) => ({
      id: student.id,
      user: {
        firstName: "Usuario", // Temporal
        lastName: "",
        emailAddress: student.userId, // Usar directamente userId
      },
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 