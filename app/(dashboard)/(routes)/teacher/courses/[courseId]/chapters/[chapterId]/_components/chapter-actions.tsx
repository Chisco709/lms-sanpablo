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
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/${isPublished ? "unpublish" : "publish"}`
      );
      
      toast.success(isPublished ? "Capítulo despublicado" : "Capítulo publicado");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Error al actualizar el capítulo");
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