"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Plus, Grip, Eye, EyeOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PensumTopic, Chapter } from "@prisma/client";

interface PensumTopicsListProps {
  initialData: (PensumTopic & { chapters: Chapter[] })[];
  courseId: string;
}

export const PensumTopicsList = ({
  initialData,
  courseId,
}: PensumTopicsListProps) => {
  const router = useRouter();
  const [topics, setTopics] = useState(initialData);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/pensum-topics/reorder`, {
        list: updateData
      });
      toast.success("Temas reordenados");
    } catch {
      toast.error("Error al reordenar los temas");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(topics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedTopics = items.slice(startIndex, endIndex + 1);

    setTopics(items);

    const bulkUpdateData = updatedTopics.map((topic) => ({
      id: topic.id,
      position: items.findIndex((item) => item.id === topic.id)
    }));

    onReorder(bulkUpdateData);
  };

  const onCreate = async () => {
    if (!newTopicTitle.trim()) {
      toast.error("El título del tema es requerido");
      return;
    }

    try {
      setIsCreating(true);
      const response = await axios.post(`/api/courses/${courseId}/pensum-topics`, {
        title: newTopicTitle.trim()
      });
      
      setTopics([...topics, response.data]);
      setNewTopicTitle("");
      toast.success("Tema del pensum creado");
      router.refresh();
    } catch {
      toast.error("Error al crear el tema");
    } finally {
      setIsCreating(false);
    }
  };

  const onTogglePublish = async (topicId: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/pensum-topics/${topicId}/unpublish`);
        toast.success("Tema despublicado");
      } else {
        await axios.patch(`/api/courses/${courseId}/pensum-topics/${topicId}/publish`);
        toast.success("Tema publicado");
      }
      router.refresh();
    } catch {
      toast.error("Error al cambiar el estado del tema");
    }
  };

  const onDelete = async (topicId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/pensum-topics/${topicId}`);
      setTopics(topics.filter(topic => topic.id !== topicId));
      toast.success("Tema eliminado");
      router.refresh();
    } catch {
      toast.error("Error al eliminar el tema");
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Temas del Pensum</h2>
          <p className="text-slate-400 text-sm">
            Organiza el contenido en temas para una mejor estructura curricular
          </p>
        </div>
        <Badge className="bg-slate-700 text-white">
          {topics.length} {topics.length === 1 ? 'tema' : 'temas'}
        </Badge>
      </div>

      {/* Crear nuevo tema */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="Ej: Fundamentos de Primera Infancia"
            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-400"
            disabled={isCreating}
            onKeyPress={(e) => e.key === 'Enter' && onCreate()}
          />
          <Button
            onClick={onCreate}
            disabled={isCreating || !newTopicTitle.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de temas */}
      {topics.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">📚</div>
          <p className="text-slate-400">No hay temas creados aún</p>
          <p className="text-slate-500 text-sm">Crea el primer tema del pensum</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="topics">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {topics.map((topic, index) => (
                  <Draggable key={topic.id} draggableId={topic.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-3 group hover:border-slate-500 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="text-slate-400 hover:text-white cursor-grab"
                          >
                            <Grip className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white truncate">
                                {topic.title}
                              </h3>
                              {topic.isPublished && (
                                <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                                  Publicado
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">
                              {topic.chapters.length} {topic.chapters.length === 1 ? 'capítulo' : 'capítulos'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onTogglePublish(topic.id, topic.isPublished)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            >
                              {topic.isPublished ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(topic.id)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-400 font-medium text-sm mb-2">💡 Consejos para organizar temas</h4>
        <ul className="text-blue-300/80 text-xs space-y-1">
          <li>• Agrupa capítulos relacionados en un mismo tema</li>
          <li>• Usa nombres descriptivos como "Fundamentos", "Práctica", etc.</li>
          <li>• Ordena los temas según la secuencia de aprendizaje</li>
          <li>• Publica los temas cuando estén listos para estudiantes</li>
        </ul>
      </div>
    </div>
  );
}; 