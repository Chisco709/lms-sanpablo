"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Users, 
  MapPin, 
  Award, 
  Clock, 
  Loader2,
  Target,
  TrendingUp,
  GraduationCap,
  Building,
  Star,
  Zap,
  Globe,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";

interface TechnicalProgram {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  modality: string | null;
  senaCode: string | null;
  qualification: string | null;
  isActive: boolean;
  stats: {
    activeEnrollments: number;
    departments: number;
    departmentsList: string[];
    publishedCourses: number;
    totalCourses: number;
    nextUnlock: string | null;
  };
}

export default function TechnicalProgramsPage() {
  const [programs, setPrograms] = useState<TechnicalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Analytics hooks
  const { trackTeacherAction } = useAnalytics();
  usePageTracking();
  useTimeTracking("Teacher - Programas Técnicos");

  // Cargar programas desde la API
  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
        trackTeacherAction("view_programs", `Total: ${data.length}`);
      } else {
        toast.error("Error al cargar programas");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Crear programa de ejemplo
  const createSampleProgram = async () => {
    setCreating(true);
    try {
      const sampleProgram = {
        title: "Técnico en Desarrollo de Software",
        description: "Programa técnico laboral en desarrollo de aplicaciones web y móviles con enfoque en tecnologías modernas",
        duration: 18,
        senaCode: "228106",
        qualification: "Técnico Laboral en Desarrollo de Software",
        modality: "Virtual",
        price: 2500000
      };

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleProgram),
      });

      if (response.ok) {
        toast.success("Programa creado exitosamente");
        trackTeacherAction("create_program", sampleProgram.title);
        fetchPrograms(); // Recargar la lista
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al crear programa");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setCreating(false);
    }
  };

  const totalStudents = programs.reduce((sum, p) => sum + p.stats.activeEnrollments, 0);
  const totalCourses = programs.reduce((sum, p) => sum + p.stats.totalCourses, 0);
  const uniqueDepartments = [...new Set(programs.flatMap(p => p.stats.departmentsList))].length;
  const activePrograms = programs.filter(p => p.isActive).length;

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
                  <GraduationCap className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Programas Técnicos
                  </h1>
                  <p className="text-slate-400">
                    Gestiona los programas técnicos laborales de 18 meses
                  </p>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={createSampleProgram}
                disabled={creating}
                className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl shadow-lg"
              >
                {creating ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5 mr-2" />
                )}
                {creating ? "Creando..." : "Nuevo Programa"}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Estadísticas principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              title: "Programas Activos",
              value: activePrograms.toString(),
              icon: BookOpen,
              color: "from-blue-500 to-purple-500",
              description: "En funcionamiento"
            },
            {
              title: "Estudiantes Inscritos",
              value: totalStudents.toLocaleString(),
              icon: Users,
              color: "from-green-500 to-emerald-500",
              description: "Estudiantes totales"
            },
            {
              title: "Cursos Totales",
              value: totalCourses.toString(),
              icon: Calendar,
              color: "from-yellow-500 to-orange-500",
              description: "En todos los programas"
            },
            {
              title: "Departamentos",
              value: uniqueDepartments.toString(),
              icon: MapPin,
              color: "from-pink-500 to-rose-500",
              description: "Cobertura nacional"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-400/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-slate-500 text-xs">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lista de programas */}
        <AnimatePresence>
          {programs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 max-w-md mx-auto">
                <Target className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Crea tu primer programa técnico
                </h3>
                <p className="text-slate-400 mb-8">
                  Comienza a ofrecer programas técnicos laborales de 18 meses certificados por el SENA
                </p>
                <Button 
                  onClick={createSampleProgram}
                  disabled={creating}
                  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {creating ? "Creando..." : "Crear Programa de Ejemplo"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden hover:border-green-400/50 transition-all duration-300"
                >
                  <div className="p-8">
                    {/* Header del programa */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl">
                            <Award className="h-8 w-8 text-black" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                              {program.title}
                            </h2>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className={`${program.isActive 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}>
                                {program.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                              {program.senaCode && (
                                <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                                  SENA: {program.senaCode}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                          {program.description}
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Gestionar
                      </Button>
                    </div>

                    {/* Información del programa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-slate-900/50 rounded-2xl p-6 text-center">
                        <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                        <p className="text-2xl font-bold text-white mb-1">{program.duration}</p>
                        <p className="text-slate-400 text-sm">meses de duración</p>
                      </div>
                      
                      <div className="bg-slate-900/50 rounded-2xl p-6 text-center">
                        <Globe className="h-8 w-8 text-green-400 mx-auto mb-3" />
                        <p className="text-2xl font-bold text-white mb-1">{program.modality}</p>
                        <p className="text-slate-400 text-sm">modalidad</p>
                      </div>
                      
                      <div className="bg-slate-900/50 rounded-2xl p-6 text-center">
                        <Users className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                        <p className="text-2xl font-bold text-white mb-1">{program.stats.activeEnrollments}</p>
                        <p className="text-slate-400 text-sm">estudiantes activos</p>
                      </div>
                      
                      <div className="bg-slate-900/50 rounded-2xl p-6 text-center">
                        <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                        <p className="text-2xl font-bold text-white mb-1">
                          {program.stats.nextUnlock 
                            ? new Date(program.stats.nextUnlock).toLocaleDateString('es-CO', { month: 'short' })
                            : 'N/A'
                          }
                        </p>
                        <p className="text-slate-400 text-sm">próximo desbloqueo</p>
                      </div>
                    </div>
                    
                    {/* Departamentos donde se ofrece */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Cobertura Geográfica</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {program.stats.departmentsList.length > 0 ? (
                          program.stats.departmentsList.map((dept) => (
                            <Badge key={dept} variant="outline" className="border-slate-600 text-slate-300 bg-slate-800/30 px-4 py-2">
                              {dept}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="border-slate-600 text-slate-500 bg-slate-800/30 px-4 py-2">
                            Sin estudiantes inscritos aún
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Barra de progreso del programa */}
                    <div className="bg-slate-900/50 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-400" />
                          <span className="text-white font-medium">Progreso del programa</span>
                        </div>
                        <span className="text-slate-300 text-sm">Mes 3 de {program.duration}</span>
                      </div>
                      <Progress 
                        value={(3 / program.duration) * 100} 
                        className="h-3 bg-slate-700"
                      />
                      <div className="flex justify-between text-sm text-slate-400 mt-2">
                        <span>Iniciado</span>
                        <span>{Math.round((3 / program.duration) * 100)}% completado</span>
                        <span>Graduación en {program.duration - 3} meses</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Información adicional para Colombia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="p-4 bg-blue-500/20 rounded-2xl">
                  <Award className="h-12 w-12 text-blue-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Programas Técnicos Laborales en Colombia
                    </h3>
                    <p className="text-blue-200 leading-relaxed">
                      Los programas técnicos laborales tienen una duración de 18 meses y están diseñados para formar 
                      profesionales competentes en el mercado laboral colombiano. Cada programa incluye certificación 
                      reconocida por el SENA y el Ministerio de Educación Nacional.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-blue-500/10 rounded-xl p-4">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Certificación SENA</p>
                        <p className="text-blue-200 text-sm">Reconocimiento oficial</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-500/10 rounded-xl p-4">
                      <Star className="h-6 w-6 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Reconocimiento MEN</p>
                        <p className="text-blue-200 text-sm">Ministerio de Educación</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-500/10 rounded-xl p-4">
                      <Zap className="h-6 w-6 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Modalidad Flexible</p>
                        <p className="text-blue-200 text-sm">Presencial y virtual</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 