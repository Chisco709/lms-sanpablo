import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');

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
    
    // Return the PDF with proper headers for viewing in browser
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="guia.pdf"',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
    return new NextResponse('Error al procesar el PDF', { status: 500 });
  }
}
