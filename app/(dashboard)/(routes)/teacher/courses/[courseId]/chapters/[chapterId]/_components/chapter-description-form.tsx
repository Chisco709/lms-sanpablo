"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {Pencil} from "lucide-react";
import { useRouter } from "next/navigation" 

import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast"
import { cn } from "@/lib/utils";

import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

interface ChapterDescriptionFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string
}

const formSchema = z.object({
    description: z.string().min(1)
})

export const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""    
        }, 
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Capítulo actualizado")
            toggleEdit()
            router.refresh()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Error al actualizar el capítulo");
            }
        }
    }

    return(
         <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
            <div className="font-medium flex items-center justify-between text-white">
                Descripción del Capítulo
                <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                    {isEditing ? (
                        <>Cancelar</>
                    )  : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Editar Descripción
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-400 italic"
                )}>
                    {!initialData.description && "Sin descripción"}
                    {initialData.description && (
                        <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-600/40 mt-4 shadow-lg">
                            <div className="text-slate-200 leading-relaxed text-sm">
                                <Preview 
                                    value={initialData.description}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>    
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    ) 
        
}