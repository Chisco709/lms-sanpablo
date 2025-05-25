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
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
    initialData: Course
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number()
})

export const PriceForm = ({
    initialData,
    courseId
}: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);


    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined    
        }, 
    })


    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Precio actualizado")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Algo malo esta pasando")
        }
    }

    return(
         <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
            <div className="font-medium flex items-center justify-between text-white">
                Precio del Curso
                <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                    {isEditing ? (
                        <>Cancelar</>
                    )  : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Editar Precio
                    </>

                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.price && "text-slate-400 italic",
                    initialData.price && "text-slate-300"
                )}>
                    {initialData.price
                    ? formatPrice(initialData.price)
                : "Sin precio establecido"
                }
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                    >
                        <FormField
                        control={form.control}
                        name="price"
                        render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                type="number"
                                step="0.01"
                                disabled={isSubmitting}
                                placeholder="e.g 'Escribe el precio de tu curso...'"
                                {...field }
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