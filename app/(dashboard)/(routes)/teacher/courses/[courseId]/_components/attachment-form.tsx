// components/attachment-form.tsx
"use client";

import axios from "axios";
import { PlusCircle, File, Loader2, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Course, Attachment } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] }
    courseId: string;
}

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            toast.success("Subida cancelada");
        }
        setIsEditing(false);
    };

    const onSubmit = async (url?: string) => {
        try {
            abortControllerRef.current = new AbortController();
            setIsSubmitting(true);

            if (!url) {
                toast.error("URL no válida");
                return;
            }

            const fileName = url.split('/').pop() || "Archivo";

            // Modificar la llamada a axios para usar la nueva ruta y enviar courseId en el body
            await axios.post(
                `/api/upload-attachment`,
                { url, name: fileName, courseId: courseId }, // Enviar courseId en el body
                { signal: abortControllerRef.current.signal }
            );

            toast.success("Archivo subido");
            setIsEditing(false);
            router.refresh();

        } catch (error) {
            if (axios.isCancel(error)) {
                toast.error("Subida cancelada");
            } else {
                toast.error("Error al subir");
            }
        } finally {
            setIsSubmitting(false);
            abortControllerRef.current = null;
        }
    };

    const deleteAttachment = async (attachmentId: string) => {
        try {
            setDeletingId(attachmentId);
            await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`);
            toast.success("Archivo eliminado");
            router.refresh();

        } catch(error) {
            console.error("Error deleting attachment:", error);
            toast.error("Error al eliminar");
        } finally {
            setDeletingId(null);
        }
    };

    const getFileType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return {
            isImage: ['jpg', 'jpeg', 'png', 'gif'].includes(extension || ''),
            isPDF: extension === 'pdf'
        };
    };

    const currentAttachments = initialData.attachments;


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Recursos del curso
                <Button
                    onClick={isEditing ? handleCancel : toggleEdit}
                    variant="ghost"
                    disabled={isSubmitting}
                >
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Añadir archivo
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div className="mt-4 space-y-2">
                    {currentAttachments.length === 0 && (
                        <p className="text-sm text-slate-500 italic">
                            No hay archivos adjuntos
                        </p>
                    )}
                    {currentAttachments.map((attachment) => {
                        const { isImage, isPDF } = getFileType(attachment.name);
                        return (
                            <div
                                key={attachment.id}
                                className="flex items-center p-3 w-full bg-white border rounded-md group hover:bg-sky-50 transition-colors"
                            >
                                {isImage ? (
                                    <div className="relative h-12 w-12 mr-3">
                                        <Image
                                            src={attachment.url}
                                            alt={attachment.name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <File className="h-12 w-12 p-2 mr-3 bg-slate-100 rounded-md"/>
                                )}

                                <div className="flex-1 min-w-0">
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium hover:underline"
                                    >
                                        {attachment.name}
                                    </a>
                                    <p className="text-xs text-muted-foreground">
                                        {isPDF ? 'PDF Document' :
                                         isImage ? 'Image File' :
                                         'Archivo adjunto'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteAttachment(attachment.id)}
                                    className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={deletingId === attachment.id}
                                >
                                    {deletingId === attachment.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    ) : (
                                        <X className="h-4 w-4 text-red-600 hover:text-red-800"/>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {isEditing && (
                <div className="mt-4">
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => url && onSubmit(url)}
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                        Formatos soportados: imágenes (JPEG, PNG, GIF), PDFs
                    </div>
                    {isSubmitting && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-sky-600">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            Subiendo archivo...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
