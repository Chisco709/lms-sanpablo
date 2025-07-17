"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation" 
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast"
import { Course } from "@prisma/client";
import { SimpleImageUpload } from "@/components/simple-image-upload";

interface ImageFormProps {
    initialData: Course
    courseId: string;
}

export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const onSubmit = async (values: { imageUrl: string }) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Imagen actualizada")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Algo salió mal al guardar la imagen")
        }
    }

    return(
         <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
            <div className="font-medium flex items-center justify-between text-white">
                Imagen del Curso
                <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                    {isEditing && (
                        <>Cancelar</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Añadir Imagen
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Editar Imagen
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-700/50 border border-slate-600 rounded-md mt-2">
                        <ImageIcon className="h-10 w-10 text-slate-400" />
                    </div>
                ) : (
                    <div className="relative h-[300px] w-full mt-2 overflow-hidden rounded-md">
                        <Image 
                            alt="Imagen del curso"
                            fill
                            className="object-cover"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <SimpleImageUpload 
                        value={initialData.imageUrl || ""}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-slate-400 mt-4">
                        Proporción 16:9 recomendada
                    </div>
                </div>
            )}
        </div>
    ) 
}