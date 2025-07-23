import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { documentNumber, documentType } = await req.json();

    console.log(`🔍 Verificando documento: ${documentType} - ${documentNumber}`);

    if (!documentNumber || !documentType) {
      return NextResponse.json(
        { error: "Número de documento y tipo son requeridos" },
        { status: 400 }
      );
    }

    // Buscar el documento en la base de datos
    const authorizedDocument = await db.authorizedDocument.findUnique({
      where: {
        documentNumber: documentNumber.trim()
      }
    });

    console.log(`📋 Resultado de búsqueda:`, authorizedDocument);

    if (!authorizedDocument) {
      console.log(`❌ Documento no encontrado: ${documentNumber}`);
      return NextResponse.json({
        authorized: false,
        message: "Documento no autorizado"
      });
    }

    // Verificar que el documento esté activo
    if (!authorizedDocument.isActive) {
      console.log(`❌ Documento inactivo: ${documentNumber}`);
      return NextResponse.json({
        authorized: false,
        message: "Documento inactivo"
      });
    }

    // Verificar que el tipo de documento coincida (opcional, para mayor seguridad)
    if (authorizedDocument.documentType !== documentType) {
      console.log(`⚠️  Tipo de documento no coincide: esperado ${authorizedDocument.documentType}, recibido ${documentType}`);
      // Podemos ser flexibles aquí, pero registramos la diferencia
    }

    console.log(`✅ Documento autorizado: ${documentNumber} - ${authorizedDocument.fullName}`);

    return NextResponse.json({
      authorized: true,
      document: {
        id: authorizedDocument.id,
        documentNumber: authorizedDocument.documentNumber,
        documentType: authorizedDocument.documentType,
        fullName: authorizedDocument.fullName,
        isActive: authorizedDocument.isActive
      },
      message: "Documento verificado exitosamente"
    });

  } catch (error) {
    console.error("❌ Error verificando documento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 