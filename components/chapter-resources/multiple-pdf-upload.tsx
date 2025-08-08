"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { File, X, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultipleFileUpload } from "@/components/multiple-file-upload";

type PdfItem = {
  url: string;
  name: string;
};

export const MultiplePdfUpload = ({
  courseId,
  chapterId,
  initialPdfUrls = [],
}: {
  courseId: string;
  chapterId: string;
  initialPdfUrls?: string[] | { url: string; name: string }[];
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfs, setPdfs] = useState<PdfItem[]>(() => {
    if (!initialPdfUrls || initialPdfUrls.length === 0) return [];
    
    return initialPdfUrls.map((item, index) => {
      if (typeof item === 'string') {
        return { url: item, name: `Documento ${index + 1}` };
      }
      return {
        url: item.url,
        name: item.name || `Documento ${index + 1}`
      };
    });
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (initialPdfUrls) {
      setPdfs(
        initialPdfUrls.map((item, index) => {
          if (typeof item === 'string') {
            return { url: item, name: `Documento ${index + 1}` };
          }
          return {
            url: item.url,
            name: item.name || `Documento ${index + 1}`
          };
        })
      );
    }
  }, [initialPdfUrls]);

  const handleUploadComplete = (urls: string[]) => {
    setIsUploading(false);
    if (!urls || urls.length === 0) return;
    
    const newPdfs: PdfItem[] = urls.map((url, index) => ({
      url,
      name: `Documento ${pdfs.length + index + 1}`
    }));
    
    const updatedPdfs = [...pdfs, ...newPdfs];
    setPdfs(updatedPdfs);
    savePdfUrls(updatedPdfs);
  };

  const savePdfUrls = async (pdfItems: PdfItem[]) => {
    try {
      setIsSaving(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        pdfUrls: pdfItems
      });
    } catch (error) {
      console.error("Error saving PDFs:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePdf = async (urlToRemove: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este PDF?")) return;
    
    try {
      setIsSaving(true);
      const updatedPdfs = pdfs.filter(pdf => pdf.url !== urlToRemove);
      
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { 
        pdfUrls: updatedPdfs
      });
      
      // Update local state with the response from the server
      if (response.data?.pdfUrls) {
        setPdfs(response.data.pdfUrls);
      } else {
        setPdfs(updatedPdfs);
      }
      
    } catch (error) {
      console.error("Error removing PDF:", error);
      alert("No se pudo eliminar el PDF. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditName(pdfs[index].name);
  };

  const saveName = async (index: number) => {
    if (index < 0 || index >= pdfs.length) {
      console.error('Invalid PDF index:', index);
      return;
    }
    
    const newName = editName.trim() || `Documento ${index + 1}`;
    const updatedPdfs = pdfs.map((pdf, i) => 
      i === index ? { ...pdf, name: newName } : pdf
    );
    
    console.group('=== PDF Name Update ===');
    console.log('Course ID:', courseId);
    console.log('Chapter ID:', chapterId);
    console.log('Updating PDF at index:', index);
    console.log('New name:', newName);
    
    try {
      setIsSaving(true);
      
      // Prepare the data to send - ensure we're using the correct URL format
      const requestData = {
        pdfUrls: updatedPdfs.map(pdf => {
          // Use ufsUrl if available, otherwise fall back to url
          const fileUrl = (pdf as any).ufsUrl || pdf.url;
          return {
            url: fileUrl,
            name: pdf.name || `Documento ${index + 1}`,
            // Include ufsUrl for backward compatibility
            ...(fileUrl.includes('utfs.io') ? { ufsUrl: fileUrl } : {})
          };
        })
      };
      
      console.log('Sending PATCH request with data:', JSON.stringify(requestData, null, 2));
      
      // Make the API request
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 500, // Don't throw for 4xx errors
        }
      );
      
      console.log('Server response status:', response.status);
      console.log('Server response data:', response.data);
      
      if (response.status >= 200 && response.status < 300) {
        // Success case
        if (response.data?.pdfUrls) {
          console.log('Successfully updated PDF names:', response.data.pdfUrls);
          setPdfs(response.data.pdfUrls);
        } else if (response.data) {
          console.log('Received response without pdfUrls, using local update');
          setPdfs(updatedPdfs);
        } else {
          console.warn('Empty response from server, using local update');
          setPdfs(updatedPdfs);
        }
        setEditingIndex(null);
      } else {
        // Handle API error responses
        const errorMessage = response.data?.error || 
                           response.data?.message || 
                           `Error del servidor (${response.status})`;
        
        console.error('API Error:', {
          status: response.status,
          message: errorMessage,
          data: response.data
        });
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error updating PDF name:', error);
      
      // Extract error message
      let errorMessage = 'Error al actualizar el nombre del PDF';
      let errorDetails = '';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      `Error del servidor (${error.response.status})`;
        errorDetails = error.response.data?.details || '';
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No se recibió respuesta del servidor';
        errorDetails = 'El servidor no respondió a la solicitud';
      } else if (error.message) {
        // Other errors
        errorMessage = error.message;
      }
      
      console.error('Error details:', { errorMessage, errorDetails });
      
      // Revert to the original name in case of error
      setPdfs([...pdfs]);
      
      // Show detailed error message to user
      alert(`Error: ${errorMessage}${errorDetails ? `\n\nDetalles: ${errorDetails}` : ''}\n\nPor favor, inténtalo de nuevo.`);
    } finally {
      setIsSaving(false);
      console.groupEnd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Archivos PDF ({pdfs.length})</h3>
        <MultipleFileUpload
          endpoint="chapterPdf"
          onChange={handleUploadComplete}
          onUploadBegin={() => setIsUploading(true)}
          multiple={true}
          maxFiles={10}
        />
      </div>

      {(isUploading || isSaving) && (
        <div className="text-sm text-muted-foreground">
          {isUploading ? "Subiendo archivos..." : "Guardando cambios..."}
        </div>
      )}

      {pdfs.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Archivos subidos:</div>
          <ul className="space-y-2">
            {pdfs.map((pdf, index) => (
              <li key={index} className="flex flex-col p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    
                    {editingIndex === index ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => saveName(index)}
                          disabled={isSaving}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium line-clamp-1">
                        {pdf.name}
                      </span>
                    )}
                    
                    {editingIndex !== index && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(index);
                        }}
                        disabled={isSaving}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemovePdf(pdf.url)}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <a 
                  href={pdf.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-1 truncate block w-full text-left"
                >
                  {pdf.url.split('/').pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
