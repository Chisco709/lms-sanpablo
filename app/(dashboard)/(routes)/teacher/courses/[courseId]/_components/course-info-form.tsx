"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, ImageIcon, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { SmartImageUpload } from "@/components/smart-image-upload";
import { Course, Category } from "@prisma/client";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.string().optional(),
});

interface CourseInfoFormProps {
  initialData: Course & { category: Category | null };
  courseId: string;
  categories: Category[];
}

export const CourseInfoForm = ({
  initialData,
  courseId,
  categories
}: CourseInfoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso actualizado");
      setIsEditing(null);
      router.refresh();
    } catch {
      toast.error("Error al actualizar el curso");
    }
  };

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Pencil className="h-4 w-4 text-green-400" />
            Título del curso
          </h2>
          <Button
            onClick={() => setIsEditing(isEditing === "title" ? null : "title")}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            {isEditing === "title" ? "Cancelar" : "Editar"}
          </Button>
        </div>

        {isEditing === "title" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Ej: Introducción a la Pedagogía Infantil"
                        className="bg-slate-900 border-slate-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <p className="text-slate-300">
            {initialData.title}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Pencil className="h-4 w-4 text-blue-400" />
            Descripción
          </h2>
          <Button
            onClick={() => setIsEditing(isEditing === "description" ? null : "description")}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            {isEditing === "description" ? "Cancelar" : (initialData.description ? "Editar" : "Agregar")}
          </Button>
        </div>

        {isEditing === "description" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Describe de qué trata este curso..."
                        className="bg-slate-900 border-slate-600 text-white resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div>
            {!initialData.description && (
              <p className="text-slate-400 italic">
                No hay descripción
              </p>
            )}
            {initialData.description && (
              <p className="text-slate-300">
                {initialData.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Imagen */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-purple-400" />
            Imagen del curso
          </h2>
          <Button
            onClick={() => setIsEditing(isEditing === "image" ? null : "image")}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            {isEditing === "image" ? "Cancelar" : (initialData.imageUrl ? "Cambiar" : "Agregar")}
          </Button>
        </div>

        {isEditing === "image" ? (
          <div>
            <SmartImageUpload
              value={initialData.imageUrl || ""}
              onChange={(url) => {
                if (url) {
                  onSubmit({ ...form.getValues(), imageUrl: url });
                }
              }}
              onRemove={() => onSubmit({ ...form.getValues(), imageUrl: "" })}
            />
          </div>
        ) : (
          <div>
            {!initialData.imageUrl && (
              <div className="flex items-center justify-center h-60 bg-slate-700 rounded-lg">
                <ImageIcon className="h-10 w-10 text-slate-400" />
              </div>
            )}
            {initialData.imageUrl && (
              <div className="relative aspect-video">
                <Image
                  alt="Upload"
                  fill
                  className="object-cover rounded-lg"
                  src={initialData.imageUrl}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Categoría */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <List className="h-4 w-4 text-yellow-400" />
            Categoría
          </h2>
          <Button
            onClick={() => setIsEditing(isEditing === "category" ? null : "category")}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            {isEditing === "category" ? "Cancelar" : (initialData.categoryId ? "Cambiar" : "Seleccionar")}
          </Button>
        </div>

        {isEditing === "category" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        options={categoryOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona una categoría"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <p className="text-slate-300">
            {initialData.category?.name || "Sin categoría"}
          </p>
        )}
      </div>
    </div>
  );
}; 