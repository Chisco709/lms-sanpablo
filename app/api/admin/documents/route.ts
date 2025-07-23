import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener todos los documentos autorizados
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que sea el profesor autorizado
    if (userId !== "user_2QZQZQZQZQZQZQZQZQZQZQZQZ") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const documents = await db.authorizedDocument.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      documents,
      count: documents.length
    });

  } catch (error) {
    console.error("Error getting documents:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST - Crear nuevo documento autorizado
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que sea el profesor autorizado
    if (userId !== "user_2QZQZQZQZQZQZQZQZQZQZQZQZ") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { documentNumber, documentType, fullName, notes, isActive } = await req.json();

    // Validaciones
    if (!documentNumber || !documentType || !fullName) {
      return NextResponse.json(
        { error: "Número de documento, tipo y nombre son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato del documento
    const documentRegex = /^\d{8,11}$/;
    if (!documentRegex.test(documentNumber)) {
      return NextResponse.json(
        { error: "El número de documento debe tener entre 8 y 11 dígitos" },
        { status: 400 }
      );
    }

    // Verificar que no exista ya
    const existing = await db.authorizedDocument.findUnique({
      where: {
        documentNumber: documentNumber.trim()
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un documento con ese número" },
        { status: 400 }
      );
    }

    // Crear el documento
    const document = await db.authorizedDocument.create({
      data: {
        documentNumber: documentNumber.trim(),
        documentType,
        fullName: fullName.trim(),
        notes: notes?.trim() || null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    console.log(`✅ Documento creado: ${document.documentType} ${document.documentNumber} - ${document.fullName}`);

    return NextResponse.json({
      document,
      message: "Documento autorizado creado exitosamente"
    });

  } catch (error) {
    console.error("Error creating document:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 