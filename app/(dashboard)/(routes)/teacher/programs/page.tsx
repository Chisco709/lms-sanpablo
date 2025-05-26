"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Calendar, Users, MapPin, Award, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

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

  // Cargar programas desde la API
  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando programas técnicos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Programas Técnicos
          </h1>
          <p className="text-slate-400 mt-2">
            Gestiona los programas técnicos laborales de 18 meses
          </p>
        </div>
        
        <Button 
          onClick={createSampleProgram}
          disabled={creating}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {creating ? "Creando..." : "Nuevo Programa"}
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{programs.filter(p => p.isActive).length}</p>
                <p className="text-xs text-slate-400">Programas Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {programs.reduce((sum, p) => sum + p.stats.activeEnrollments, 0)}
                </p>
                <p className="text-xs text-slate-400">Estudiantes Inscritos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {programs.reduce((sum, p) => sum + p.stats.totalCourses, 0)}
                </p>
                <p className="text-xs text-slate-400">Cursos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {[...new Set(programs.flatMap(p => p.stats.departmentsList))].length}
                </p>
                <p className="text-xs text-slate-400">Departamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de programas */}
      {programs.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No hay programas técnicos
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Crea tu primer programa técnico para comenzar a gestionar estudiantes
                </p>
                <Button 
                  onClick={createSampleProgram}
                  disabled={creating}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {creating ? "Creando..." : "Crear Programa de Ejemplo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {programs.map((program) => (
          <Card key={program.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl text-white">
                      {program.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      {program.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  
                  <CardDescription className="text-slate-400">
                    {program.description}
                  </CardDescription>
                  
                  {program.senaCode && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-slate-300">Código SENA: {program.senaCode}</span>
                    </div>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  Gestionar
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Información del programa */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="h-4 w-4" />
                    Duración
                  </div>
                  <p className="text-white font-medium">{program.duration} meses</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <BookOpen className="h-4 w-4" />
                    Modalidad
                  </div>
                  <p className="text-white font-medium">{program.modality}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="h-4 w-4" />
                    Estudiantes
                  </div>
                  <p className="text-white font-medium">{program.stats.activeEnrollments}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    Próximo Desbloqueo
                  </div>
                  <p className="text-white font-medium">
                    {program.stats.nextUnlock 
                      ? new Date(program.stats.nextUnlock).toLocaleDateString('es-CO')
                      : 'No programado'
                    }
                  </p>
                </div>
              </div>
              
              {/* Departamentos donde se ofrece */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Departamentos donde se ofrece:
                </p>
                <div className="flex flex-wrap gap-2">
                  {program.stats.departmentsList.length > 0 ? (
                    program.stats.departmentsList.map((dept) => (
                      <Badge key={dept} variant="outline" className="border-slate-600 text-slate-300">
                        {dept}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="border-slate-600 text-slate-500">
                      Sin estudiantes inscritos
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Barra de progreso del programa */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progreso del programa</span>
                  <span className="text-slate-300">Mes 3 de {program.duration}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(3 / program.duration) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Información adicional para Colombia */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Programas Técnicos Laborales en Colombia
              </h3>
              <p className="text-blue-200 text-sm">
                Los programas técnicos laborales tienen una duración de 18 meses y están diseñados para formar 
                profesionales competentes en el mercado laboral colombiano. Cada programa incluye certificación 
                reconocida por el SENA y el Ministerio de Educación Nacional.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  Certificación SENA
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  Reconocimiento MEN
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  Modalidad Flexible
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 