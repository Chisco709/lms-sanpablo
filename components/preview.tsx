"use client"

interface PreviewProps {
  value: string;
}

// Preview que elimina completamente las etiquetas HTML y muestra solo texto limpio
export const Preview = ({ value }: PreviewProps) => {
  // Si no hay valor, mostrar mensaje por defecto
  if (!value || value.trim() === '') {
    return (
      <div className="text-slate-400 italic text-sm">
        Sin descripción disponible
      </div>
    );
  }

  // Función para limpiar completamente el HTML y extraer solo el texto
  const cleanText = (html: string): string => {
    // Crear un elemento temporal para extraer el texto
    if (typeof window !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // Fallback para server-side: remover todas las etiquetas HTML
    return html
      .replace(/<[^>]*>/g, '') // Eliminar todas las etiquetas HTML
      .replace(/&nbsp;/g, ' ') // Reemplazar espacios no separables
      .replace(/&amp;/g, '&') // Reemplazar entidades HTML
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalizar espacios múltiples
      .trim();
  };

  const cleanedText = cleanText(value);

  // Si después de limpiar no hay texto, mostrar mensaje por defecto
  if (!cleanedText) {
    return (
      <div className="text-slate-400 italic text-sm">
        Sin descripción disponible
      </div>
    );
  }

  return (
    <div className="text-slate-300 leading-relaxed">
      {cleanedText}
    </div>
  );
};