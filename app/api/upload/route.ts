import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 });
    }

    // Validar tipo de archivo (imágenes)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)' 
      }, { status: 400 });
    }

    // Validar tamaño (4MB máximo para imágenes)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande (máximo 4MB)' 
      }, { status: 400 });
    }

    // Generar nombre único
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Convertir a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar en public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    
    // Retornar la URL pública (usando fileUrl para compatibilidad)
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      fileUrl: fileUrl,
      url: fileUrl, // Alias para compatibilidad
      message: 'Archivo subido exitosamente'
    });
    
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 