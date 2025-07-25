"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
  hasPublishedChapters: boolean;
}

export const CourseActions = ({
  disabled,
  courseId,
  isPublished,
  hasPublishedChapters
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Curso eliminado");
      router.refresh();
      router.push("/teacher/courses");
    } catch {
      toast.error("Error al eliminar el curso");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    try {
      setIsLoading(true);
      
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Curso despublicado");
      } else {
        if (!hasPublishedChapters) {
          toast.error("Debes publicar al menos un capítulo con PDF antes de publicar el curso");
          return;
        }
        
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("¡Curso publicado exitosamente!");
      }
      
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data || "Error al cambiar el estado del curso";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        className={`border-slate-600 ${
          isPublished 
            ? "text-yellow-400 hover:text-yellow-300 hover:border-yellow-400/50" 
            : "text-green-400 hover:text-green-300 hover:border-green-400/50"
        }`}
      >
        {isPublished ? (
          <>
            <EyeOff className="h-4 w-4 mr-2" />
            Despublicar
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-2" />
            Publicar
          </>
        )}
      </Button>
      
      <ConfirmModal onConfirm={onDelete}>
        <Button 
          size="sm" 
          disabled={isLoading}
          variant="outline"
          className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-400/50"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}; 