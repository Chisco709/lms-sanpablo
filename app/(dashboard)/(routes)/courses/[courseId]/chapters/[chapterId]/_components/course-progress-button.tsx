"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
  chapter?: {
    pdfUrl?: string;
    googleFormUrl?: string;
  };
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
  chapter
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasViewedPdf, setHasViewedPdf] = useState(false);
  const [hasViewedForm, setHasViewedForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rastrear clics en PDF y formulario
  useEffect(() => {
    if (!isClient || typeof document === 'undefined') return;
    
    const handlePdfClick = () => setHasViewedPdf(true);
    const handleFormClick = () => setHasViewedForm(true);

    // Escuchar clics en enlaces de PDF y formularios
    const pdfLinks = document.querySelectorAll('a[href*=".pdf"], a[href*="pdf"]');
    const formLinks = document.querySelectorAll('a[href*="forms.google"], a[href*="googleform"]');

    pdfLinks.forEach(link => link.addEventListener('click', handlePdfClick));
    formLinks.forEach(link => link.addEventListener('click', handleFormClick));

    // También detectar si se abre en nueva pestaña/ventana
    const handleWindowFocus = () => {
      if (typeof window === 'undefined') return;
      
      // Simular que vio los recursos si regresa al tab
      setTimeout(() => {
        if (chapter?.pdfUrl) setHasViewedPdf(true);
        if (chapter?.googleFormUrl) setHasViewedForm(true);
      }, 3000); // Dar 3 segundos para "ver" el contenido
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleWindowFocus);
    }

    return () => {
      pdfLinks.forEach(link => link.removeEventListener('click', handlePdfClick));
      formLinks.forEach(link => link.removeEventListener('click', handleFormClick));
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleWindowFocus);
      }
    };
  }, [isClient, chapter]);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progreso actualizado");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  // Determinar si puede marcar como completado
  const canComplete = () => {
    // Si no hay recursos adicionales, puede completar directamente
    if (!chapter?.pdfUrl && !chapter?.googleFormUrl) {
      return true;
    }
    
    // Si hay PDF o formulario, debe haberlos visto
    let requirementsMet = true;
    if (chapter?.pdfUrl && !hasViewedPdf) requirementsMet = false;
    if (chapter?.googleFormUrl && !hasViewedForm) requirementsMet = false;
    
    return requirementsMet;
  };

  const getButtonText = () => {
    if (isCompleted) {
      return "No completado";
    }
    
    if (!canComplete()) {
      const pendingItems = [];
      if (chapter?.pdfUrl && !hasViewedPdf) pendingItems.push("PDF");
      if (chapter?.googleFormUrl && !hasViewedForm) pendingItems.push("formulario");
      
      return `Revisar ${pendingItems.join(" y ")} para completar`;
    }
    
    return "Marcar como completado";
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  if (!isClient) {
    return (
      <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading || (!isCompleted && !canComplete())}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      <Icon className="h-4 w-4 mr-2" />
      {getButtonText()}
    </Button>
  )
} 