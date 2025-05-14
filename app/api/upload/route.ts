import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    // Verificar el tamaño del archivo (4MB máximo)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "El archivo es demasiado grande. Máximo 4MB permitido." 
      }, { status: 400 });
    }

    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: "El archivo debe ser una imagen." 
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const relativeUploadDir = `/uploads/${userId}`;
    const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);
    
    // Asegúrate de que el directorio exista
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Error al crear el directorio:", error);
      return NextResponse.json({ 
        error: "Error al crear el directorio de uploads" 
      }, { status: 500 });
    }
    
    const filePath = path.join(uploadDir, filename);
    
    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error("Error al escribir el archivo:", error);
      return NextResponse.json({ 
        error: "Error al guardar el archivo" 
      }, { status: 500 });
    }
    
    // La URL relativa para acceder al archivo
    const fileUrl = `${relativeUploadDir}/${filename}`;
    
    console.log(`Archivo subido exitosamente: ${fileUrl}`);
    
    return NextResponse.json({ 
      success: true, 
      fileUrl,
      fileName: filename,
      fileSize: file.size,
      fileType: file.type
    });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ 
      error: `Error al subir el archivo: ${errorMessage}` 
    }, { status: 500 });
  }
} 