"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";
import { 
    BookOpen, 
    Upload, 
    Type, 
    FileText, 
    Image as ImageIcon,
    Plus,
    Check,
    ArrowRight,
    Sparkles,
    Target,
    Users
} from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const formSchema = z.object({
    title: z.string().min(1, { message: "El título es requerido" }),
    description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
    imageUrl: z.string().url({ message: "URL de imagen válida requerida" }).optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreatePage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    
    // Analytics hooks
    const { trackTeacherAction, trackFormSubmission } = useAnalytics();
    usePageTracking();
    useTimeTracking("Teacher - Crear Curso");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [dragActive, setDragActive] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            imageUrl: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;
    const watchedFields = form.watch();

    const steps = [
        {
            id: 0,
            title: "Nombre del Curso",
            subtitle: "¿Cómo se llamará tu curso?",
            icon: Type,
            color: "from-green-400 to-green-600"
        },
        {
            id: 1,
            title: "Descripción",
            subtitle: "Cuéntanos de qué se trata",
            icon: FileText,
            color: "from-yellow-400 to-yellow-600"
        },
        {
            id: 2,
            title: "Imagen del Curso",
            subtitle: "Una imagen atractiva para tus estudiantes",
            icon: ImageIcon,
            color: "from-purple-400 to-purple-600"
        },
        {
            id: 3,
            title: "¡Listo para Crear!",
            subtitle: "Revisa y confirma los detalles",
            icon: Sparkles,
            color: "from-green-400 to-yellow-400"
        }
    ];

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Manejo de imagen por URL o subida
    const handleImageUrl = (url: string) => {
        setImagePreview(url);
        form.setValue("imageUrl", url);
    };

    const handleImageUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            
            if (!response.ok) throw new Error("Error al subir imagen");
            
            const data = await response.json();
            handleImageUrl(data.fileUrl);
            toast.success("¡Imagen subida con éxito!");
        } catch (error) {
            toast.error("Error al subir la imagen");
            console.error(error);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files[0] && files[0].type.startsWith('image/')) {
            handleImageUpload(files[0]);
        }
    };

    const onSubmit = async (values: FormData) => {
        try {
            setIsCreating(true);
            
            // Track form submission attempt
            trackFormSubmission("course_creation", "new_course_form");
            
            const response = await axios.post("/api/courses", values);
            
            // Track successful course creation
            trackTeacherAction("create_course", `Curso: ${values.title}`);
            
            toast.success("¡Curso creado exitosamente! 🎉");
            router.push(`/teacher/courses/${response.data.id}`);
        } catch (error) {
            toast.error("Error al crear el curso");
            console.error(error);
            
            // Track error
            trackTeacherAction("create_course_error", `Error creando: ${values.title}`);
        } finally {
            setIsCreating(false);
        }
    };

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return watchedFields.title?.length > 0;
            case 1:
                return watchedFields.description?.length >= 10;
            case 2:
                return true; // Imagen es opcional
            case 3:
                return isValid;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
            {/* Efectos de fondo animados */}
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
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl">
                            <BookOpen className="h-8 w-8 text-black" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Crear Nuevo Curso
                        </h1>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <motion.div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                            index <= currentStep 
                                                ? 'bg-gradient-to-r from-green-500 to-yellow-500 border-transparent' 
                                                : 'border-slate-600 bg-slate-800'
                                        }`}
                                        animate={{ scale: index === currentStep ? 1.1 : 1 }}
                                    >
                                        {index < currentStep ? (
                                            <Check className="h-5 w-5 text-black" />
                                        ) : (
                                            <step.icon className={`h-5 w-5 ${index <= currentStep ? 'text-black' : 'text-slate-400'}`} />
                                        )}
                                    </motion.div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                                            index < currentStep ? 'bg-gradient-to-r from-green-500 to-yellow-500' : 'bg-slate-700'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <motion.div 
                                className="h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contenido principal */}
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
                        >
                            {/* Título del paso */}
                            <div className="text-center mb-8">
                                <motion.div 
                                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentStepData.color} mb-4`}
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <currentStepData.icon className="h-8 w-8 text-black" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {currentStepData.title}
                                </h2>
                                <p className="text-slate-400">
                                    {currentStepData.subtitle}
                                </p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Paso 1: Título */}
                                    {currentStep === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-white text-lg font-medium">
                                                            Título del curso
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field}
                                                                disabled={isSubmitting}
                                                                placeholder="ej. 'Técnico en Primera Infancia'"
                                                                className="h-14 text-lg bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20 rounded-xl"
                                                            />
                                                        </FormControl>
                                                        <FormDescription className="text-slate-400">
                                                            Elige un nombre claro y atractivo para tu curso
                                                        </FormDescription>
                                                        <FormMessage className="text-red-400" />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            {/* Vista previa en tiempo real */}
                                            {watchedFields.title && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                                                >
                                                    <p className="text-green-400 text-sm font-medium mb-2">Vista previa:</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                            <BookOpen className="h-6 w-6 text-green-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-medium">{watchedFields.title}</h3>
                                                            <p className="text-slate-400 text-sm">Instituto San Pablo</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Paso 2: Descripción */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-white text-lg font-medium">
                                                            Descripción del curso
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea 
                                                                {...field}
                                                                disabled={isSubmitting}
                                                                placeholder="Describe de qué se trata tu curso, qué aprenderán los estudiantes y por qué es importante..."
                                                                className="min-h-32 text-lg bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20 rounded-xl resize-none"
                                                                rows={6}
                                                            />
                                                        </FormControl>
                                                        <div className="flex justify-between items-center">
                                                            <FormDescription className="text-slate-400">
                                                                Mínimo 10 caracteres para una buena descripción
                                                            </FormDescription>
                                                            <span className={`text-sm ${
                                                                (watchedFields.description?.length || 0) >= 10 
                                                                    ? 'text-green-400' 
                                                                    : 'text-slate-400'
                                                            }`}>
                                                                {watchedFields.description?.length || 0}/10
                                                            </span>
                                                        </div>
                                                        <FormMessage className="text-red-400" />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Paso 3: Imagen */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-6"
                                        >
                                            {/* Subida por URL */}
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name="imageUrl"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-white text-lg font-medium">
                                                                URL de la imagen
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    {...field}
                                                                    disabled={isSubmitting}
                                                                    placeholder="https://ejemplo.com/imagen.jpg"
                                                                    className="h-14 text-lg bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20 rounded-xl"
                                                                    onChange={(e) => {
                                                                        field.onChange(e);
                                                                        if (e.target.value) setImagePreview(e.target.value);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-slate-400">
                                                                Pega la URL de una imagen desde internet
                                                            </FormDescription>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="text-center">
                                                <span className="text-slate-400">o</span>
                                            </div>

                                            {/* Zona de subida por archivo */}
                                            <div
                                                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                                                    dragActive 
                                                        ? 'border-green-400 bg-green-400/10' 
                                                        : 'border-slate-600 hover:border-slate-500'
                                                }`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file);
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="text-center">
                                                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                    <p className="text-white font-medium mb-2">
                                                        Arrastra una imagen aquí o haz clic para seleccionar
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        PNG, JPG, WEBP hasta 4MB
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Vista previa de imagen */}
                                            {(imagePreview || watchedFields.imageUrl) && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="relative"
                                                >
                                                    <img 
                                                        src={imagePreview || watchedFields.imageUrl}
                                                        alt="Vista previa"
                                                        className="w-full h-48 object-cover rounded-xl border border-slate-600"
                                                        onError={() => {
                                                            setImagePreview("");
                                                            form.setValue("imageUrl", "");
                                                            toast.error("No se pudo cargar la imagen");
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview("");
                                                            form.setValue("imageUrl", "");
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Paso 4: Resumen */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                                                <h3 className="text-white text-lg font-medium mb-4">Resumen del curso</h3>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <Target className="h-5 w-5 text-green-400 mt-1" />
                                                        <div>
                                                            <p className="text-green-400 text-sm font-medium">Título</p>
                                                            <p className="text-white">{watchedFields.title}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <FileText className="h-5 w-5 text-yellow-400 mt-1" />
                                                        <div>
                                                            <p className="text-yellow-400 text-sm font-medium">Descripción</p>
                                                            <p className="text-white text-sm leading-relaxed">
                                                                {watchedFields.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {(imagePreview || watchedFields.imageUrl) && (
                                                        <div className="flex items-start gap-3">
                                                            <ImageIcon className="h-5 w-5 text-purple-400 mt-1" />
                                                            <div>
                                                                <p className="text-purple-400 text-sm font-medium">Imagen</p>
                                                                <img 
                                                                    src={imagePreview || watchedFields.imageUrl}
                                                                    alt="Imagen del curso"
                                                                    className="w-24 h-16 object-cover rounded-lg border border-slate-600 mt-2"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-5 w-5 text-green-400" />
                                                    <div>
                                                        <p className="text-green-400 text-sm font-medium">¿Qué sigue?</p>
                                                        <p className="text-white text-sm">
                                                            Después de crear el curso podrás agregar temas del pensum y clases
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            </Form>

                            {/* Botones de navegación */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
                                <Button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
                                >
                                    Anterior
                                </Button>

                                <div className="flex gap-3">
                                    <Link href="/teacher/courses">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                                        >
                                            Cancelar
                                        </Button>
                                    </Link>

                                    {currentStep < steps.length - 1 ? (
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!validateCurrentStep()}
                                            className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-medium disabled:opacity-50"
                                        >
                                            Siguiente
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={form.handleSubmit(onSubmit)}
                                            disabled={!isValid || isCreating}
                                            className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-medium disabled:opacity-50"
                                        >
                                            {isCreating ? (
                                                <>
                                                    <motion.div 
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"
                                                    />
                                                    Creando...
                                                </>
                                            ) : (
                                                <>
                                                    Crear Curso
                                                    <Sparkles className="h-4 w-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;