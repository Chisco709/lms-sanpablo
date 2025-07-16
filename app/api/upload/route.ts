import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import path from "path";
import fs from "fs/promises";

// Configuración
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

    // Obtener el archivo del formData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se encontró archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se permiten imágenes." },
        { status: 400 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande. Máximo 4MB." },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Crear subdirectorio para el usuario
    const userDir = path.join(UPLOAD_DIR, user.id);
    try {
      await fs.access(userDir);
    } catch {
      await fs.mkdir(userDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = path.extname(file.name).toLowerCase();
    const filename = `${timestamp}-${random}${extension}`;
    const filepath = path.join(userDir, filename);

    // Convertir archivo a buffer y guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filepath, buffer);

    // Generar URL pública
    const fileUrl = `/uploads/${user.id}/${filename}`;

    return NextResponse.json(
      { 
        fileUrl,
        message: "Archivo subido exitosamente",
        filename 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en upload:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Configurar el tamaño máximo del body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
} 