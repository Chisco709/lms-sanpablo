"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Users, 
    BookOpen, 
    TrendingUp, 
    Eye,
    Clock,
    Award,
    BarChart3,
    CheckCircle,
    RefreshCw,
    Calendar,
    PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Tipos para las estadísticas
interface CourseStats {
    id: string;
    title: string;
    imageUrl: string | null;
    studentsEnrolled: number;
    completionRate: number;
    revenue: number;
    isPublished: boolean;
    createdAt: string;
    category: { name: string } | null;
    _count: {
        chapters: number;
        purchases: number;
    };
}

interface AnalyticsData {
    overview: {
        totalCourses: number;
        publishedCourses: number;
        totalStudents: number;
        totalRevenue: number;
        averageCompletionRate: number;
    };
    courseStats: CourseStats[];
    recentActivity: {
        id: string;
        type: 'enrollment' | 'completion' | 'video_watched';
        studentName: string;
        courseName: string;
        timestamp: string;
        details: string;
    }[];
    topPerformingCourses: CourseStats[];
}

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedPeriod]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/teacher/analytics?period=${selectedPeriod}`);
            setAnalyticsData(response.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast.error("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        await fetchAnalyticsData();
        setRefreshing(false);
        toast.success("Datos actualizados");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="text-gray-600">Cargando analytics...</span>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <BarChart3 className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
                    <p className="text-gray-500 mb-4">Aún no tienes cursos o estudiantes para mostrar estadísticas.</p>
                    <Button onClick={fetchAnalyticsData} className="bg-green-600 hover:bg-green-700">
                        Reintentar
                    </Button>
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
                                    <BarChart3 className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
                                <p className="text-sm text-gray-500">Estadísticas de tus cursos</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="7d">Últimos 7 días</option>
                                <option value="30d">Últimos 30 días</option>
                                <option value="90d">Últimos 90 días</option>
                                <option value="1y">Último año</option>
                            </select>
                            
                            <Button
                                onClick={refreshData}
                                disabled={refreshing}
                                variant="outline"
                                size="sm"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Estudiantes</p>
                                        <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalStudents}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <BookOpen className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Cursos</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analyticsData.overview.publishedCourses}/{analyticsData.overview.totalCourses}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Tasa de Completado</p>
                                        <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageCompletionRate}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Award className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Ingresos</p>
                                        <p className="text-2xl font-bold text-gray-900">$0</p>
                                        <p className="text-xs text-gray-400">Sistema en desarrollo</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de cursos */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tus Cursos</CardTitle>
                                <CardDescription>
                                    Rendimiento de cada curso publicado
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analyticsData.courseStats.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cursos publicados</h3>
                                        <p className="text-gray-500">Publica tu primer curso para ver las estadísticas aquí.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {analyticsData.courseStats.map((course, index) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {course.imageUrl ? (
                                                        <Image
                                                            src={course.imageUrl}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="ml-4 flex-1">
                                                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {course.category?.name || 'Sin categoría'} • Creado {formatDate(course.createdAt)}
                                                    </p>
                                                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                                        <span className="flex items-center">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {course.studentsEnrolled} estudiantes
                                                        </span>
                                                        <span className="flex items-center">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            {course.completionRate}% completado
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <div className="w-16">
                                                        <Progress 
                                                            value={course.completionRate} 
                                                            className="h-2"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actividad reciente */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Actividad Reciente</CardTitle>
                                <CardDescription>
                                    Últimas acciones de tus estudiantes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analyticsData.recentActivity.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Sin actividad reciente</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {analyticsData.recentActivity.map((activity, index) => (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className={`p-1 rounded-full ${
                                                    activity.type === 'completion' ? 'bg-green-100' :
                                                    activity.type === 'enrollment' ? 'bg-blue-100' : 'bg-yellow-100'
                                                }`}>
                                                    {activity.type === 'completion' ? (
                                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                                    ) : activity.type === 'enrollment' ? (
                                                        <Users className="h-3 w-3 text-blue-600" />
                                                    ) : (
                                                        <PlayCircle className="h-3 w-3 text-yellow-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">{activity.studentName}</p>
                                                    <p className="text-xs text-gray-500">{activity.details}</p>
                                                    <p className="text-xs text-gray-400">{activity.courseName}</p>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(activity.timestamp)}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}