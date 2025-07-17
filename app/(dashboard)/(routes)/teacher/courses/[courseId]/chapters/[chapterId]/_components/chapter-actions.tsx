"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Capítulo eliminado");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast.error("Error al eliminar el capítulo");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    try {
      setIsLoading(true);
      
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success("Capítulo despublicado");
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success("Capítulo publicado");
      }
      
      router.refresh();
    } catch {
      toast.error("Error al cambiar el estado del capítulo");
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