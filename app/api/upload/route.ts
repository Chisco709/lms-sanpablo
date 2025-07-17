import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener el archivo del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    }

    // Validar tamaño (4MB máximo)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo muy grande (máximo 4MB)" }, { status: 400 });
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', userId);
    await mkdir(uploadsDir, { recursive: true });

    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generar URL accesible
    const fileUrl = `/uploads/${userId}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 