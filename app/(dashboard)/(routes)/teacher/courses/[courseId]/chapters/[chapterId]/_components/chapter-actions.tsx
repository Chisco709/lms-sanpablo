"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';

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
      const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/${isPublished ? "unpublish" : "publish"}`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Error al publicar");
      toast.success(isPublished ? "Capítulo despublicado" : "Capítulo publicado");
      router.refresh();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      toast.success("Capítulo eliminado");
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error("Error al eliminar");
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