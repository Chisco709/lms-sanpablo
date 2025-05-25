"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import { GripVertical, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; // Importación corregida

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersList = ({
  items,
  onReorder,
  onEdit
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedChapters = Array.from(chapters);
    const [movedChapter] = reorderedChapters.splice(result.source.index, 1);
    reorderedChapters.splice(result.destination.index, 0, movedChapter);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = reorderedChapters.slice(startIndex, endIndex + 1);

    setChapters(reorderedChapters);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: reorderedChapters.findIndex((item) => item.id === chapter.id)
    }));

    onReorder(bulkUpdateData); // Llamada faltante a la prop onReorder
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-700/50 border-slate-600 border text-slate-200 rounded-md mb-4 text-sm hover:bg-slate-600/50 transition-colors",
                      chapter.isPublished && "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-600 hover:bg-slate-600 rounded-l-md transition cursor-grab active:cursor-grabbing",
                        chapter.isPublished && "border-r-emerald-500/30 hover:bg-emerald-500/20"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <GripVertical className="h-5 w-5 text-slate-400" />
                    </div>
                    <span className="truncate font-medium">{chapter.title}</span>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Gratis
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-slate-600 text-slate-200 border border-slate-500",
                          chapter.isPublished && "bg-emerald-600 text-white border-emerald-500"
                        )}
                      >
                        {chapter.isPublished ? "✅ Publicado" : "📝 Borrador"}
                      </Badge>
                      <button
                        onClick={() => onEdit(chapter.id)}
                        className="p-1 hover:bg-slate-600 rounded transition-colors text-slate-400 hover:text-white"
                        aria-label="Editar capítulo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
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
  );
};