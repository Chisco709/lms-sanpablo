import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'guia.pdf';

  if (!pdfUrl) {
    return new NextResponse('URL del PDF no proporcionada', { status: 400 });
  }

  try {
    // Fetch the PDF from the URL
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      throw new Error(`Error al obtener el PDF: ${response.statusText}`);
    }

    // Get the PDF buffer
    const buffer = await response.arrayBuffer();
    
    // Return the PDF with proper headers for downloading
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error al procesar la descarga del PDF:', error);
    return new NextResponse('Error al procesar la descarga del PDF', { status: 500 });
  }
}
