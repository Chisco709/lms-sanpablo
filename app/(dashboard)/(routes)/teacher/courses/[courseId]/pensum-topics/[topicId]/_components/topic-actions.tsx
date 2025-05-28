"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface TopicActionsProps {
  disabled: boolean;
  courseId: string;
  topicId: string;
  isPublished: boolean;
}

export const TopicActions = ({
  disabled,
  courseId,
  topicId,
  isPublished
}: TopicActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/pensum-topics/${topicId}/unpublish`);
        toast.success("Tema despublicado");
      } else {
        await axios.patch(`/api/courses/${courseId}/pensum-topics/${topicId}/publish`);
        toast.success("Tema publicado");
      }

      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/pensum-topics/${topicId}`);

      toast.success("Tema eliminado");
      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        className={`border-slate-600 text-white hover:bg-slate-700 ${
          isPublished 
            ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-500" 
            : "bg-yellow-600 hover:bg-yellow-700 border-yellow-500"
        }`}
      >
        {isPublished ? "Despublicar" : "Publicar"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button 
          size="sm" 
          disabled={isLoading}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
} 