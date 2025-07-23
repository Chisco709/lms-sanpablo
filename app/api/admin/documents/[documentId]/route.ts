import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH - Actualizar documento autorizado
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId } = await auth();
    const { documentId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que sea el profesor autorizado
    if (userId !== "user_2QZQZQZQZQZQZQZQZQZQZQZQZ") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updates = await req.json();

    // Verificar que el documento existe
    const existing = await db.authorizedDocument.findUnique({
      where: {
        id: documentId
      }
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Validaciones para actualizaciones específicas
    if (updates.documentNumber) {
      const documentRegex = /^\d{8,11}$/;
      if (!documentRegex.test(updates.documentNumber)) {
        return NextResponse.json(
          { error: "El número de documento debe tener entre 8 y 11 dígitos" },
          { status: 400 }
        );
      }

      // Verificar que no exista otro documento con el mismo número
      const duplicate = await db.authorizedDocument.findFirst({
        where: {
          documentNumber: updates.documentNumber.trim(),
          id: {
            not: documentId
          }
        }
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Ya existe otro documento con ese número" },
          { status: 400 }
        );
      }
    }

    // Actualizar el documento
    const updatedDocument = await db.authorizedDocument.update({
      where: {
        id: documentId
      },
      data: {
        ...updates,
        documentNumber: updates.documentNumber?.trim(),
        fullName: updates.fullName?.trim(),
        notes: updates.notes?.trim() || null,
        updatedAt: new Date()
      }
    });

    console.log(`✅ Documento actualizado: ${updatedDocument.documentType} ${updatedDocument.documentNumber} - ${updatedDocument.fullName}`);

    return NextResponse.json({
      document: updatedDocument,
      message: "Documento actualizado exitosamente"
    });

  } catch (error) {
    console.error("Error updating document:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE - Eliminar documento autorizado
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId } = await auth();
    const { documentId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que sea el profesor autorizado
    if (userId !== "user_2QZQZQZQZQZQZQZQZQZQZQZQZ") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Verificar que el documento existe
    const existing = await db.authorizedDocument.findUnique({
      where: {
        id: documentId
      }
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el documento
    await db.authorizedDocument.delete({
      where: {
        id: documentId
      }
    });

    console.log(`🗑️ Documento eliminado: ${existing.documentType} ${existing.documentNumber} - ${existing.fullName}`);

    return NextResponse.json({
      message: "Documento eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error deleting document:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 