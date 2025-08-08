// app/api/courses/[courseId]/chapters/[chapterId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = await params;

    if (!user) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Obtener capítulo con todas sus relaciones
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId
      },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        videoUrls: true,
        pdfUrl: true,
        pdfUrls: true,
        position: true,
        isPublished: true,
        isFree: true,
        googleFormUrl: true,
        course: {
          select: {
            title: true,
            id: true
          }
        },
        pensumTopic: {
          select: {
            title: true
          }
        }
      }
    });
    
    console.log('Chapter data from DB:', {
      chapterId: chapterId,
      videoUrl: chapter?.videoUrl,
      videoUrls: chapter?.videoUrls,
      pdfUrl: chapter?.pdfUrl,
      pdfUrls: chapter?.pdfUrls
    });

    if (!chapter) return new NextResponse("Capítulo no encontrado", { status: 404 });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTER_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  console.log('=== PATCH REQUEST START ===');
  
  try {
    const user = await currentUser();
    const { courseId, chapterId } = await params;

    if (!user) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Obtener datos del cuerpo de la petición
    const values = await req.json();
    console.log('User ID:', user.id);
    console.log('Course ID:', courseId);
    console.log('Chapter ID:', chapterId);
    console.log('Request body:', JSON.stringify(values, null, 2));

    // Verificar si el capítulo existe
    const currentChapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
      select: { 
        id: true, 
        courseId: true, 
        pdfUrl: true, 
        pdfUrls: true,
        videoUrl: true,
        videoUrls: true
      }
    });

    if (!currentChapter) {
      console.error('Chapter not found');
      return new NextResponse("Capítulo no encontrado", { status: 404 });
    }

    // Preparar datos para actualizar
    const updateData: any = {};

    // Handle videos
    if (values.videoUrls !== undefined) {
      try {
        console.log('=== PROCESSING VIDEOS ===');
        console.log('Received video values:', JSON.stringify(values.videoUrls, null, 2));
        
        if (Array.isArray(values.videoUrls)) {
          // Validate and clean each video URL
          const processedVideos = values.videoUrls
            .map((url: string) => {
              if (!url || typeof url !== 'string') return null;
              const trimmedUrl = url.trim();
              return trimmedUrl || null;
            })
            .filter((url: string | null): url is string => url !== null);
          
          console.log('Processed videos:', processedVideos);
          
          // Update both the array and legacy single URL for backward compatibility
          updateData.videoUrls = processedVideos;
          updateData.videoUrl = processedVideos[0] || null;
          
          console.log('Updated video data:', {
            videoUrl: updateData.videoUrl,
            videoUrls: updateData.videoUrls
          });
        } else if (values.videoUrls === null) {
          // Handle case where videoUrls is explicitly set to null
          updateData.videoUrl = null;
          updateData.videoUrls = [];
          console.log('Cleared video data');
        } else {
          console.warn('videoUrls is not an array:', values.videoUrls);
          throw new Error('El formato de los videos no es válido');
        }
      } catch (error: unknown) {
        console.error('Error processing video data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        throw new Error(`Error al procesar los videos: ${errorMessage}`);
      }
    }

    // Handle PDFs
    let pdfsForResponse: Array<{ url: string; name: string; ufsUrl?: string }> = [];
    
    if (values.pdfUrls !== undefined) {
      try {
        console.log('=== PROCESSING PDFS ===');
        console.log('Received values:', JSON.stringify(values, null, 2));
        
        type PdfItem = { url: string; name: string; ufsUrl?: string };
        let processedPdfUrls: PdfItem[] = [];
        
        if (Array.isArray(values.pdfUrls)) {
          console.log('Processing PDF URLs array with', values.pdfUrls.length, 'items');
          
          // Process each PDF item
          processedPdfUrls = values.pdfUrls.map((item: string | { url: string; name?: string }, index: number) => {
            try {
              // If it's a string, convert to object with default name
              if (typeof item === 'string') {
                if (!item) throw new Error('Empty URL in PDF array');
                return {
                  url: item,
                  name: `Documento ${index + 1}`,
                  ...(item.includes('utfs.io') ? { ufsUrl: item } : {})
                };
              }
              
              // Validate URL
              if (!item || typeof item !== 'object' || (!item.url && !(item as any).ufsUrl)) {
                throw new Error('Invalid PDF item format - missing URL');
              }
              
              // Clean and validate the URL - support both url and ufsUrl formats
              const url = (item.url || (item as any).ufsUrl).trim();
              if (!url) throw new Error('Empty PDF URL');
              
              // Clean and validate the name
              const name = (item.name || `Documento ${index + 1}`).trim();
              
              // Return normalized object
              return { 
                url, 
                name,
                ...(url.includes('utfs.io') ? { ufsUrl: url } : {})
              };
              
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
              console.error('Error processing PDF item at index', index, ':', errorMessage);
              throw new Error(`Error en el PDF ${index + 1}: ${errorMessage}`);
            }
          });
          
          console.log('Processed PDFs:', JSON.stringify(processedPdfUrls, null, 2));
          
        } else if (values.pdfUrls === null) {
          // Handle case where pdfUrls is explicitly set to null
          processedPdfUrls = [];
          updateData.pdfUrl = null;
          console.log('Cleared PDF data');
        } else {
          console.warn('pdfUrls is not an array or null:', values.pdfUrls);
          throw new Error('El formato de los PDFs no es válido');
        }
        
        // Store just the URLs as an array of strings in the database
        updateData.pdfUrls = processedPdfUrls.map(pdf => pdf.url);
        
        // Update legacy pdfUrl with the first PDF URL for backward compatibility
        updateData.pdfUrl = processedPdfUrls[0]?.url || null;
        
        // Store the full PDF data for the response
        pdfsForResponse = [...processedPdfUrls];
        
      } catch (error: unknown) {
        console.error('Error processing PDF data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        throw new Error(`Error al procesar los PDFs: ${errorMessage}`);
      }
    }

    console.log('Updating chapter with data:', JSON.stringify(updateData, null, 2));
    
    try {
      // Update chapter in database
      const updatedChapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: updateData,
        select: {
          id: true,
          title: true,
          description: true,
          videoUrl: true,
          videoUrls: true,
          pdfUrl: true,
          pdfUrls: true,
          isFree: true,
          isPublished: true,
          position: true,
        }
      });

      // Prepare the response with enriched PDF data
      // If we have the full PDF data from the update, use it; otherwise, create basic objects
      const pdfUrls = pdfsForResponse || updatedChapter.pdfUrls?.map(url => ({
        url,
        name: url.split('/').pop() || 'Documento',
        ...(url.includes('utfs.io') ? { ufsUrl: url } : {})
      })) || [];
      
      // Return the updated chapter data with properly formatted pdfUrls
      return NextResponse.json({
        ...updatedChapter,
        pdfUrls
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      let errorMessage = 'Error interno del servidor';
      let errorDetails = dbError instanceof Error ? dbError.message : 'Error desconocido';
      
      console.error('Database error details:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: errorDetails,
        stack: dbError instanceof Error ? dbError.stack : undefined
      });
      
      return new NextResponse(
        JSON.stringify({
          error: errorMessage,
          details: errorDetails,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error: unknown) {
    console.error('Unexpected error in PATCH handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new NextResponse(
      JSON.stringify({
        error: 'Error interno del servidor',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    console.log('=== PATCH REQUEST END ===\n');
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = await params;

    if (!user) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Eliminar capítulo
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId: courseId
      }
    });

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_DELETE]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}