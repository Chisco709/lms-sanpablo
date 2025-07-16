"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";
import { 
    Plus, 
    BookOpen, 
    Users, 
    TrendingUp, 
    Eye,
    Edit3,
    MoreVertical,
    Search,
    Filter,
    Grid3X3,
    List,
    Star,
    Play,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    Target,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

// Tipos
interface Course {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
    category: { name: string } | null;
    _count?: {
        chapters: number;
        purchases: number;
    };
}

export default function TeacherCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    
    // Analytics hooks
    const { trackTeacherAction } = useAnalytics();
    usePageTracking();
    useTimeTracking("Teacher - Mis Cursos");

    useEffect(() => {
        fetchCourses();
        trackTeacherAction("view_courses_dashboard", "Main page");
    }, [trackTeacherAction]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get("/api/courses");
            setCourses(response.data);
        } catch (error) {
            toast.error("Error al cargar los cursos");
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (courseId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;
        
        const courseToDelete = courses.find(c => c.id === courseId);
        
        try {
            await axios.delete(`/api/courses/${courseId}`);
            setCourses(courses.filter(course => course.id !== courseId));
            toast.success("Curso eliminado exitosamente");
            trackTeacherAction("delete_course", courseToDelete?.title || courseId);
        } catch (error) {
            toast.error("Error al eliminar el curso");
        }
    };

    const publishCourse = async (courseId: string, isCurrentlyPublished: boolean) => {
        const course = courses.find(c => c.id === courseId);
        
        try {
            const endpoint = isCurrentlyPublished ? "unpublish" : "publish";
            await axios.patch(`/api/courses/${courseId}/${endpoint}`);
            
            setCourses(courses.map(course => 
                course.id === courseId 
                    ? { ...course, isPublished: !isCurrentlyPublished }
                    : course
            ));
            
            const action = isCurrentlyPublished ? "unpublish_course" : "publish_course";
            trackTeacherAction(action, course?.title || courseId);
            
            toast.success(isCurrentlyPublished ? "Curso despublicado" : "¡Curso publicado!");
        } catch (error) {
            toast.error("Error al cambiar estado de publicación");
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || 
                            (filterStatus === "published" && course.isPublished) ||
                            (filterStatus === "draft" && !course.isPublished);
        return matchesSearch && matchesFilter;
    });

    const publishedCourses = courses.filter(course => course.isPublished);
    const draftCourses = courses.filter(course => !course.isPublished);

    const stats = {
        total: courses.length,
        published: publishedCourses.length,
        draft: draftCourses.length,
        students: courses.reduce((acc, course) => acc + (course._count?.purchases || 0), 0)
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
                {/* Header con animación */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl">
                                    <BookOpen className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                        Mis Cursos
                                    </h1>
                                    <p className="text-slate-400">
                                        Gestiona y crea experiencias educativas increíbles
                                    </p>
                                </div>
                            </div>
                        </div>

            <Link href="/teacher/create">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl shadow-lg">
                                    <Plus className="h-5 w-5 mr-2" />
                Crear Curso
                                </Button>
                            </motion.div>
            </Link>
          </div>

                    {/* Estadísticas animadas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        {[
                            { label: "Total Cursos", value: stats.total, icon: BookOpen, color: "from-blue-500 to-purple-500" },
                            { label: "Publicados", value: stats.published, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
                            { label: "Borradores", value: stats.draft, icon: Clock, color: "from-yellow-500 to-orange-500" },
                            { label: "Estudiantes", value: stats.students, icon: Users, color: "from-pink-500 to-rose-500" }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">{stat.label}</p>
                                        <motion.p 
                                            className="text-2xl font-bold text-white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                                        >
                                            {stat.value}
                                        </motion.p>
                </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Controles de búsqueda y filtros */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Buscar cursos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400"
                                    />
              </div>
            </div>

                            <div className="flex items-center gap-3">
                                {/* Filtro de estado */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                            <Filter className="h-4 w-4 mr-2" />
                                            {filterStatus === "all" ? "Todos" : 
                                             filterStatus === "published" ? "Publicados" : "Borradores"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-slate-800 border-slate-600">
                                        <DropdownMenuItem onClick={() => setFilterStatus("all")} className="text-white hover:bg-slate-700">
                                            Todos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterStatus("published")} className="text-white hover:bg-slate-700">
                                            Publicados
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterStatus("draft")} className="text-white hover:bg-slate-700">
                                            Borradores
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Toggle de vista */}
                                <div className="flex bg-slate-900/50 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === "grid" 
                                                ? "bg-green-500 text-black" 
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === "list" 
                                                ? "bg-green-500 text-black" 
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                </div>
                </div>
                  </div>
                </motion.div>

                {/* Lista de cursos */}
                <AnimatePresence>
                    {filteredCourses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 max-w-md mx-auto">
                                <Target className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {searchTerm || filterStatus !== "all" ? "Sin resultados" : "Crea tu primer curso"}
                                </h3>
                                <p className="text-slate-400 mb-8">
                                    {searchTerm || filterStatus !== "all" 
                                        ? "No encontramos cursos que coincidan con tu búsqueda"
                                        : "Comienza a compartir tu conocimiento con el mundo"
                                    }
                                </p>
                                {!searchTerm && filterStatus === "all" && (
                                    <Link href="/teacher/create">
                                        <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Crear primer curso
                                        </Button>
                                    </Link>
                )}
              </div>
                        </motion.div>
                    ) : (
                        <div className={`grid gap-6 ${
                            viewMode === "grid" 
                                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                                : "grid-cols-1"
                        }`}>
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className={`group bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden hover:border-green-400/50 transition-all duration-300 ${
                                        viewMode === "list" ? "flex" : ""
                                    }`}
                                >
                                    {/* Imagen del curso */}
                                    <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-video"}`}>
                                        {course.imageUrl ? (
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                                <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
              )}
                                        
                                        {/* Badge de estado */}
                                        <div className="absolute top-3 left-3">
                                            <Badge 
                                                variant={course.isPublished ? "default" : "secondary"}
                                                className={course.isPublished 
                                                    ? "bg-green-500/90 text-white border-none" 
                                                    : "bg-yellow-500/90 text-black border-none"
                                                }
                                            >
                                                {course.isPublished ? "Publicado" : "Borrador"}
                                            </Badge>
            </div>

                                        {/* Overlay con acciones */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Link href={`/teacher/courses/${course.id}`}>
                                                <Button size="sm" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30">
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {course.isPublished && (
                                                <Link href={`/courses/${course.id}`}>
                                                    <Button size="sm" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                </div>
              </div>

                                    {/* Contenido */}
                                    <div className="p-6 flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                {course.category && (
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {course.category.name}
                                                    </p>
                                                )}
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-slate-800 border-slate-600">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/teacher/courses/${course.id}`} className="text-white hover:bg-slate-700 cursor-pointer">
                                                            <Edit3 className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {course.isPublished && (
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/courses/${course.id}`} className="text-white hover:bg-slate-700 cursor-pointer">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver curso
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator className="bg-slate-600" />
                                                    <DropdownMenuItem 
                                                        onClick={() => publishCourse(course.id, course.isPublished)}
                                                        className="text-white hover:bg-slate-700 cursor-pointer"
                                                    >
                                                        {course.isPublished ? (
                                                            <>
                                                                <Clock className="h-4 w-4 mr-2" />
                                                                Despublicar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Publicar
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-600" />
                                                    <DropdownMenuItem 
                                                        onClick={() => deleteCourse(course.id)}
                                                        className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                                                    >
                                                        <AlertCircle className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                            {course.description || "Sin descripción"}
                                        </p>

                                        {/* Información adicional */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4">
                                                <span className="text-slate-400">
                                                    {course._count?.chapters || 0} clases
                                                </span>
                                                <span className="text-slate-400">
                                                    {course._count?.purchases || 0} estudiantes
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {course.price ? (
                                                    <span className="text-green-400 font-medium">
                                                        ${course.price.toLocaleString()} COP
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-400 font-medium">
                                                        Gratis
                                                    </span>
                                                )}
            </div>
          </div>

                                        {/* Acciones principales */}
                                        <div className="flex gap-2 mt-4">
                                            <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                                                >
                                                    <Edit3 className="h-4 w-4 mr-2" />
                                                    Editar
                                                </Button>
                                            </Link>
                                            {course.isPublished && (
                                                <Link href={`/courses/${course.id}`}>
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-500 hover:bg-green-600 text-black"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
          </div>
        </div>
    );
}