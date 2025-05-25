"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished
}: {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}) => {
  const router = useRouter();

  const handlePublish = async () => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/${isPublished ? "unpublish" : "publish"}`
      );
      
      toast.success(isPublished ? "✅ Capítulo despublicado exitosamente" : "🎉 ¡Capítulo publicado! Los estudiantes ya pueden verlo");
      router.refresh();
      
      // Pequeño delay para asegurar que la UI se actualice
      setTimeout(() => {
        router.refresh();
      }, 500);
      
    } catch (error) {
      console.error("Error publishing/unpublishing chapter:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`❌ Error: ${error.response.data}`);
      } else {
        const action = isPublished ? "despublicar" : "publicar";
        toast.error(`❌ Error al ${action} el capítulo. Inténtalo de nuevo.`);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Capítulo eliminado");
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Error al eliminar el capítulo");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handlePublish}
        disabled={disabled}
        variant={isPublished ? "destructive" : "default"}
      >
        {isPublished ? "Despublicar" : "Publicar"}
      </Button>

      <Button
        onClick={handleDelete}
        variant="destructive"
        size="icon"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};