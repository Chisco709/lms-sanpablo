"use client";

import { useState } from "react";
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface CourseResource {
  id: string;
  name: string;
  type: "pdf" | "google_form" | "external_link";
  url: string;
  description?: string;
  isRequired?: boolean;
}

interface CourseResourcesProps {
  resources: CourseResource[];
  className?: string;
}

// Base Button Component
const ResourceButton = ({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50",
    ghost: "hover:bg-slate-800/30 text-slate-400 hover:text-slate-300"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], "h-8 px-3 text-sm", className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Resource Item Component
const ResourceItem = ({ resource }: { resource: CourseResource }) => {
  const getResourceIcon = () => {
    switch (resource.type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-400" />;
      case "google_form":
        return <ExternalLink className="h-4 w-4 text-blue-400" />;
      case "external_link":
        return <ExternalLink className="h-4 w-4 text-green-400" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getResourceBgColor = () => {
    switch (resource.type) {
      case "pdf":
        return "bg-red-400/10 border-red-400/20";
      case "google_form":
        return "bg-blue-400/10 border-blue-400/20";
      case "external_link":
        return "bg-green-400/10 border-green-400/20";
      default:
        return "bg-slate-400/10 border-slate-400/20";
    }
  };

  const handleResourceClick = () => {
    if (typeof window !== 'undefined') {
      if (resource.type === "pdf") {
        // Para PDFs, abrir en nueva pestaña para visualización
        window.open(resource.url, "_blank");
      } else {
        // Para formularios y enlaces externos
        window.open(resource.url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:bg-slate-800/20",
      getResourceBgColor()
    )}>
      <div className="flex-shrink-0">
        {getResourceIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-white truncate">
          {resource.name}
        </h4>
        {resource.description && (
          <p className="text-xs text-slate-400 mt-1">
            {resource.description}
          </p>
        )}
        {resource.isRequired && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
            Obligatorio
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ResourceButton
          variant="ghost"
          onClick={handleResourceClick}
          className="p-2 h-auto"
          title={resource.type === "pdf" ? "Ver PDF" : "Abrir enlace"}
        >
          {resource.type === "pdf" ? (
            <Eye className="h-4 w-4" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
        </ResourceButton>
        
        {resource.type === "pdf" && (
          <ResourceButton
            variant="ghost"
            onClick={() => {
              // Crear enlace de descarga
              if (typeof document !== 'undefined') {
                const link = document.createElement('a');
                link.href = resource.url;
                link.download = resource.name;
                link.click();
              }
            }}
            className="p-2 h-auto"
            title="Descargar PDF"
          >
            <Download className="h-4 w-4" />
          </ResourceButton>
        )}
      </div>
    </div>
  );
};

// Main Component
export const CourseResources = ({ resources, className }: CourseResourcesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!resources || resources.length === 0) {
    return null;
  }

  // Separar recursos por tipo
  const pdfs = resources.filter(r => r.type === "pdf");
  const forms = resources.filter(r => r.type === "google_form");
  const links = resources.filter(r => r.type === "external_link");

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header con toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-300 text-sm font-medium">
          Recursos del programa
        </h3>
        <ResourceButton
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 h-auto"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </ResourceButton>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="space-y-4">
          {/* PDFs */}
          {pdfs.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Manuales técnicos
              </h4>
              <div className="space-y-2">
                {pdfs.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* Formularios Google */}
          {forms.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                Evaluaciones online
              </h4>
              <div className="space-y-2">
                {forms.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* Enlaces externos */}
          {links.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                Enlaces adicionales
              </h4>
              <div className="space-y-2">
                {links.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista compacta cuando está colapsado */}
      {!isExpanded && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {pdfs.length > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-red-400" />
              {pdfs.length} PDF{pdfs.length > 1 ? 's' : ''}
            </span>
          )}
          {forms.length > 0 && (
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3 text-blue-400" />
              {forms.length} evaluación{forms.length > 1 ? 'es' : ''}
            </span>
          )}
          {links.length > 0 && (
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3 text-green-400" />
              {links.length} enlace{links.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Hook para datos de ejemplo (esto se reemplazaría con datos reales)
export const useCourseResources = (courseId: string): CourseResource[] => {
  // Datos de ejemplo - en producción esto vendría de la API
  return [
    {
      id: "1",
      name: "Manual de Reparación de Hardware",
      type: "pdf",
      url: "/resources/manual-hardware.pdf",
      description: "Guía completa para diagnóstico y reparación de componentes",
      isRequired: true
    },
    {
      id: "2",
      name: "Evaluación Módulo 1",
      type: "google_form",
      url: "https://forms.google.com/evaluacion-modulo-1",
      description: "Evaluación de conocimientos básicos",
      isRequired: true
    },
    {
      id: "3",
      name: "Normas de Seguridad Técnica",
      type: "pdf",
      url: "/resources/normas-seguridad.pdf",
      description: "Protocolos de seguridad en el laboratorio"
    },
    {
      id: "4",
      name: "Simulador de Circuitos",
      type: "external_link",
      url: "https://simulator.example.com",
      description: "Herramienta online para práctica"
    }
  ];
}; 