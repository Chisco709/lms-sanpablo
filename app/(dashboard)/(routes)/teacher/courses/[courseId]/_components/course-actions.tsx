"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const CourseActions = ({
  disabled,
  courseId,
  isPublished
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("✅ Curso despublicado exitosamente");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("🎉 ¡Curso publicado! Los estudiantes ya pueden verlo");
      }

      // Forzar recarga para actualizar el estado
      router.refresh();
      
      // Pequeño delay para asegurar que la UI se actualice
      setTimeout(() => {
        router.refresh();
      }, 500);
      
    } catch (error) {
      console.error("Error publishing/unpublishing course:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`❌ Error: ${error.response.data}`);
      } else {
        const action = isPublished ? "despublicar" : "publicar";
        toast.error(`❌ Error al ${action} el curso. Inténtalo de nuevo.`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("🗑️ Curso eliminado exitosamente");
      router.push(`/teacher/courses`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`❌ Error: ${error.response.data}`);
      } else {
        toast.error("❌ Error al eliminar el curso. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-3">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`${
          isPublished 
            ? "bg-yellow-600 hover:bg-yellow-500 text-white border border-yellow-500" 
            : "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500"
        } font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        size="sm"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando...
          </div>
        ) : isPublished ? "Despublicar" : "Publicar"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button 
          size="sm" 
          disabled={isLoading}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
} 