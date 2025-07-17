"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    Plus, 
    BookOpen, 
    Users, 
    Eye,
    Edit3,
    MoreVertical,
    Search,
    Grid3X3,
    List,
    Clock,
    CheckCircle,
    Settings,
    Trash2
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

    useEffect(() => {
        fetchCourses();
    }, []);

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
        
        try {
            await axios.delete(`/api/courses/${courseId}`);
            setCourses(courses.filter(course => course.id !== courseId));
            toast.success("Curso eliminado exitosamente");
        } catch (error) {
            toast.error("Error al eliminar el curso");
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = 
            filterStatus === "all" ||
            (filterStatus === "published" && course.isPublished) ||
            (filterStatus === "draft" && !course.isPublished);
        
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: courses.length,
        published: courses.filter(c => c.isPublished).length,
        draft: courses.filter(c => !c.isPublished).length,
        students: courses.reduce((acc, course) => acc + (course._count?.purchases || 0), 0)
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="text-gray-600">Cargando cursos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header estilo Platzi */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-xl font-semibold text-gray-900">Mis Cursos</h1>
                                <p className="text-sm text-gray-500">Gestiona tus cursos y contenido</p>
                            </div>
                        </div>
                        
                        <Link href="/teacher/create">
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Curso
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Publicados</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Borradores</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Estudiantes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controles */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar cursos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 w-64"
                                />
                            </div>
                            
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">Todos</option>
                                <option value="published">Publicados</option>
                                <option value="draft">Borradores</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Lista de cursos */}
                {filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-lg border p-12 text-center">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {courses.length === 0 ? "No tienes cursos aún" : "No se encontraron cursos"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {courses.length === 0 
                                ? "Crea tu primer curso para comenzar a enseñar"
                                : "Prueba con otros términos de búsqueda"
                            }
                        </p>
                        {courses.length === 0 && (
                            <Link href="/teacher/create">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear tu primer curso
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }>
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={viewMode === "grid"
                                    ? "bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                                    : "bg-white rounded-lg border p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
                                }
                            >
                                {viewMode === "grid" ? (
                                    <>
                                        <div className="relative h-48 bg-gray-200">
                                            {course.imageUrl ? (
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <Badge variant={course.isPublished ? "default" : "secondary"}>
                                                    {course.isPublished ? "Publicado" : "Borrador"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                {course.category?.name || 'Sin categoría'} • {formatDate(course.createdAt)}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <span className="flex items-center">
                                                    <BookOpen className="h-4 w-4 mr-1" />
                                                    {course._count?.chapters || 0} capítulos
                                                </span>
                                                <span className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {course._count?.purchases || 0} estudiantes
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/courses/${course.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver como estudiante
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {course.imageUrl ? (
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {course.category?.name || 'Sin categoría'} • {formatDate(course.createdAt)}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                                        <span className="flex items-center">
                                                            <BookOpen className="h-4 w-4 mr-1" />
                                                            {course._count?.chapters || 0} capítulos
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1" />
                                                            {course._count?.purchases || 0} estudiantes
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                                                        {course.isPublished ? "Publicado" : "Borrador"}
                                                    </Badge>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/teacher/courses/${course.id}`}>
                                                                    <Settings className="h-4 w-4 mr-2" />
                                                                    Editar curso
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/courses/${course.id}`}>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Ver como estudiante
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                onClick={() => deleteCourse(course.id)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}