"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft,
    Save,
    Trash2,
    Eye,
    CheckCircle,
    Clock,
    Play,
    FileText,
    Link as LinkIcon,
    Upload,
    Settings,
    Target,
    AlertCircle,
    Youtube,
    FileUp,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

// Tipos
interface Chapter {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    pdfUrl: string | null;
    googleFormUrl: string | null;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    pensumTopicId: string | null;
    pensumTopic?: { title: string } | null;
}

interface Course {
    id: string;
    title: string;
}

export default function ChapterEditPage() {
    const router = useRouter();
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("content");
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);

    // Obtener IDs de la URL
    const pathSegments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
    const courseId = pathSegments[pathSegments.indexOf('courses') + 1];
    const chapterId = pathSegments[pathSegments.indexOf('chapters') + 1];

    useEffect(() => {
        if (courseId && chapterId) {
            fetchData();
        }
    }, [courseId, chapterId]);

    const fetchData = async () => {
        try {
            const [chapterResponse, courseResponse] = await Promise.all([
                axios.get(`/api/courses/${courseId}/chapters/${chapterId}`),
                axios.get(`/api/courses/${courseId}`)
            ]);
            setChapter(chapterResponse.data);
            setCourse(courseResponse.data);
        } catch (error) {
            toast.error("Error al cargar los datos");
            router.push(`/teacher/courses/${courseId}`);
        } finally {
            setLoading(false);
        }
    };

    const updateField = async (field: string, value: any) => {
        if (!chapter) return;
        
        try {
            setSaving(true);
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { [field]: value });
            setChapter({ ...chapter, [field]: value });
            setEditingField(null);
            setTempValues({});
            toast.success("Campo actualizado exitosamente");
        } catch (error) {
            toast.error("Error al actualizar");
        } finally {
            setSaving(false);
        }
    };

    const publishChapter = async () => {
        try {
            setSaving(true);
            const endpoint = chapter?.isPublished ? "unpublish" : "publish";
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/${endpoint}`);
            setChapter(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
            toast.success(chapter?.isPublished ? "Clase despublicada" : "¡Clase publicada!");
        } catch (error) {
            toast.error("Error al cambiar estado de publicación");
        } finally {
            setSaving(false);
        }
    };

    const deleteChapter = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta clase?")) return;
        
        try {
            setSaving(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Clase eliminada");
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            toast.error("Error al eliminar la clase");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (file: File, field: string) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            
            if (!response.ok) throw new Error("Error al subir archivo");
            
            const data = await response.json();
            await updateField(field, data.fileUrl);
            toast.success("Archivo subido exitosamente");
        } catch (error) {
            toast.error("Error al subir el archivo");
        }
    };

    const validateYouTubeUrl = (url: string) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
        return youtubeRegex.test(url);
    };

    const validateGoogleFormUrl = (url: string) => {
        return url.includes('docs.google.com/forms') || url.includes('forms.gle');
    };

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.match(/(?:v=|\/)([\w-]{11})/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!chapter || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Clase no encontrada</h2>
                    <Link href={`/teacher/courses/${courseId}`}>
                        <Button className="bg-green-500 hover:bg-green-600 text-black">
                            Volver al curso
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "content", label: "Contenido", icon: FileText },
        { id: "resources", label: "Recursos", icon: Upload },
        { id: "settings", label: "Configuración", icon: Settings }
    ];

    const completionData = {
        title: !!chapter.title,
        description: !!chapter.description,
        video: !!chapter.videoUrl,
        hasContent: !!(chapter.videoUrl || chapter.pdfUrl || chapter.googleFormUrl)
    };

    const completionCount = Object.values(completionData).filter(Boolean).length;
    const totalFields = Object.keys(completionData).length;
    const completionPercentage = (completionCount / totalFields) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link href={`/teacher/courses/${courseId}`}>
                                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver al curso
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl">
                                        <Play className="h-6 w-6 text-black" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            {chapter.title}
                                        </h1>
                                        <p className="text-slate-400">
                                            Clase del curso: {course.title}
                                            {chapter.pensumTopic && (
                                                <span className="ml-2">• Tema: {chapter.pensumTopic.title}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={chapter.isPublished ? "default" : "secondary"} className={
                                        chapter.isPublished 
                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    }>
                                        {chapter.isPublished ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Publicada
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-3 w-3 mr-1" />
                                                Borrador
                                            </>
                                        )}
                                    </Badge>
                                    {chapter.isFree && (
                                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                                            Acceso Gratuito
                                        </Badge>
                                    )}
                                    <span className="text-slate-400 text-sm">
                                        Posición #{chapter.position}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {chapter.isPublished && (
                                <Link href={`/courses/${courseId}/chapters/${chapterId}`}>
                                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver clase
                                    </Button>
                                </Link>
                            )}
                            <Button
                                onClick={publishChapter}
                                disabled={saving}
                                className={
                                    chapter.isPublished
                                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                        : "bg-green-500 hover:bg-green-600 text-black"
                                }
                            >
                                {chapter.isPublished ? "Despublicar" : "Publicar"}
                            </Button>
                            <Button
                                onClick={deleteChapter}
                                disabled={saving}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progreso de la clase</span>
                            <span className="text-green-400">{Math.round(completionPercentage)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <motion.div 
                                className="h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Navegación por tabs */}
                <div className="mb-8">
                    <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-green-500 to-yellow-500 text-black"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700"
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido principal */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "content" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Información básica */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-green-400" />
                                            Información Básica
                                        </h3>

                                        {/* Título */}
                                        <div className="mb-6">
                                            <label className="text-sm font-medium text-slate-400 mb-2 block">
                                                Título de la clase
                                            </label>
                                            {editingField === "title" ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={tempValues.title || chapter.title}
                                                        onChange={(e) => setTempValues({...tempValues, title: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white"
                                                        placeholder="Título de la clase"
                                                    />
                                                    <Button
                                                        onClick={() => updateField("title", tempValues.title)}
                                                        disabled={saving}
                                                        size="sm"
                                                        className="bg-green-500 hover:bg-green-600 text-black"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        setEditingField("title");
                                                        setTempValues({title: chapter.title});
                                                    }}
                                                    className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors"
                                                >
                                                    <p className="text-white">{chapter.title}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <label className="text-sm font-medium text-slate-400 mb-2 block">
                                                Descripción
                                            </label>
                                            {editingField === "description" ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={tempValues.description || chapter.description || ""}
                                                        onChange={(e) => setTempValues({...tempValues, description: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white min-h-24"
                                                        placeholder="Descripción de la clase"
                                                        rows={4}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => updateField("description", tempValues.description)}
                                                            disabled={saving}
                                                            size="sm"
                                                            className="bg-green-500 hover:bg-green-600 text-black"
                                                        >
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => setEditingField(null)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-slate-600 text-slate-300"
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        setEditingField("description");
                                                        setTempValues({description: chapter.description || ""});
                                                    }}
                                                    className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors min-h-24"
                                                >
                                                    <p className="text-white">
                                                        {chapter.description || "Haz clic para agregar una descripción"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Video de YouTube */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <Youtube className="h-5 w-5 text-red-400" />
                                            Video de YouTube
                                        </h3>

                                        {chapter.videoUrl ? (
                                            <div className="space-y-4">
                                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                                                    <iframe
                                                        src={getYouTubeEmbedUrl(chapter.videoUrl) || ""}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                        title={chapter.title}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={tempValues.videoUrl || chapter.videoUrl}
                                                        onChange={(e) => setTempValues({...tempValues, videoUrl: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white"
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                    />
                                                    <Button
                                                        onClick={() => {
                                                            if (validateYouTubeUrl(tempValues.videoUrl)) {
                                                                updateField("videoUrl", tempValues.videoUrl);
                                                            } else {
                                                                toast.error("URL de YouTube inválida");
                                                            }
                                                        }}
                                                        disabled={saving}
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                                                    <Youtube className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                    <p className="text-white font-medium mb-2">
                                                        Agrega un video de YouTube
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        Pega la URL del video para tu clase
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={tempValues.videoUrl || ""}
                                                        onChange={(e) => setTempValues({...tempValues, videoUrl: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white"
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                    />
                                                    <Button
                                                        onClick={() => {
                                                            if (validateYouTubeUrl(tempValues.videoUrl)) {
                                                                updateField("videoUrl", tempValues.videoUrl);
                                                            } else {
                                                                toast.error("URL de YouTube inválida");
                                                            }
                                                        }}
                                                        disabled={saving || !tempValues.videoUrl}
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        Agregar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "resources" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* PDF */}
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FileUp className="h-5 w-5 text-blue-400" />
                                        Guía PDF
                                    </h3>

                                    {chapter.pdfUrl ? (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-8 w-8 text-blue-400" />
                                                        <div>
                                                            <p className="text-white font-medium">PDF subido</p>
                                                            <p className="text-blue-300 text-sm">Archivo disponible para estudiantes</p>
                                                        </div>
                                                    </div>
                                                    <a href={chapter.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file, "pdfUrl");
                                                }}
                                                className="hidden"
                                                id="pdf-upload-replace"
                                            />
                                            <label htmlFor="pdf-upload-replace">
                                                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                                                    Reemplazar PDF
                                                </Button>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file, "pdfUrl");
                                                }}
                                                className="hidden"
                                                id="pdf-upload"
                                            />
                                            <label htmlFor="pdf-upload">
                                                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
                                                    <FileUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                    <p className="text-white font-medium mb-2">
                                                        Sube una guía PDF
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        Material complementario para la clase
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Google Form */}
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <LinkIcon className="h-5 w-5 text-green-400" />
                                        Google Form
                                    </h3>

                                    {chapter.googleFormUrl ? (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <LinkIcon className="h-8 w-8 text-green-400" />
                                                        <div>
                                                            <p className="text-white font-medium">Formulario configurado</p>
                                                            <p className="text-green-300 text-sm">Los estudiantes pueden acceder</p>
                                                        </div>
                                                    </div>
                                                    <a href={chapter.googleFormUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={tempValues.googleFormUrl || chapter.googleFormUrl}
                                                    onChange={(e) => setTempValues({...tempValues, googleFormUrl: e.target.value})}
                                                    className="bg-slate-900/50 border-slate-600 text-white"
                                                    placeholder="https://docs.google.com/forms/d/..."
                                                />
                                                <Button
                                                    onClick={() => {
                                                        if (validateGoogleFormUrl(tempValues.googleFormUrl)) {
                                                            updateField("googleFormUrl", tempValues.googleFormUrl);
                                                        } else {
                                                            toast.error("URL de Google Forms inválida");
                                                        }
                                                    }}
                                                    disabled={saving}
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-black"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                                                <LinkIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                <p className="text-white font-medium mb-2">
                                                    Agrega un Google Form
                                                </p>
                                                <p className="text-slate-400 text-sm">
                                                    Para tareas, evaluaciones o encuestas
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={tempValues.googleFormUrl || ""}
                                                    onChange={(e) => setTempValues({...tempValues, googleFormUrl: e.target.value})}
                                                    className="bg-slate-900/50 border-slate-600 text-white"
                                                    placeholder="https://docs.google.com/forms/d/..."
                                                />
                                                <Button
                                                    onClick={() => {
                                                        if (validateGoogleFormUrl(tempValues.googleFormUrl)) {
                                                            updateField("googleFormUrl", tempValues.googleFormUrl);
                                                        } else {
                                                            toast.error("URL de Google Forms inválida");
                                                        }
                                                    }}
                                                    disabled={saving || !tempValues.googleFormUrl}
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-black"
                                                >
                                                    Agregar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-purple-400" />
                                        Configuración de la Clase
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Acceso gratuito */}
                                        <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-600">
                                            <div>
                                                <h4 className="text-white font-medium">Acceso Gratuito</h4>
                                                <p className="text-slate-400 text-sm">
                                                    Permitir que todos vean esta clase sin pagar
                                                </p>
                                            </div>
                                            <Switch
                                                checked={chapter.isFree}
                                                onCheckedChange={(checked) => updateField("isFree", checked)}
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                        </div>

                                        {/* Información adicional */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-600">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-green-400">{chapter.position}</p>
                                                    <p className="text-sm text-slate-400">Posición</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-600">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-yellow-400">
                                                        {Math.round(completionPercentage)}%
                                                    </p>
                                                    <p className="text-sm text-slate-400">Completado</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lista de verificación */}
                                        <div className="space-y-3">
                                            <h4 className="text-white font-medium">Lista de verificación</h4>
                                            {[
                                                { key: "title", label: "Título de la clase", completed: completionData.title },
                                                { key: "description", label: "Descripción", completed: completionData.description },
                                                { key: "video", label: "Video de YouTube", completed: completionData.video },
                                                { key: "hasContent", label: "Al menos un recurso", completed: completionData.hasContent }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-600">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                        item.completed ? "bg-green-500" : "bg-slate-600"
                                                    }`}>
                                                        {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <span className={`${item.completed ? "text-white" : "text-slate-400"}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}