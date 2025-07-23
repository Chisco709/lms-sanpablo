"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Alert, { AlertTitle, AlertDescription } from "../../../components/ui/alert";
import { Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const DeleteCoursesPage = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const coursesToDelete = [
    "Tecnico en instalaciones Electricas",
    "Tecnico en electronica industrial"
  ];

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar estos cursos? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsDeleting(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/delete-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success("Cursos eliminados exitosamente");
      } else {
        throw new Error(data.message || "Error al eliminar cursos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar cursos");
      setResult({ error: error instanceof Error ? error.message : "Error desconocido" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          🗑️ Eliminar Cursos No Deseados
        </h1>
        <p className="text-slate-400">
          Eliminar cursos que no fueron creados por el profesor
        </p>
      </div>

      <Card className="bg-slate-800/50 border border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trash2 className="h-5 w-5 text-red-400" />
            Cursos a Eliminar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {coursesToDelete.map((course, index) => (
              <div key={index} className="flex items-center gap-2 text-white">
                <XCircle className="h-4 w-4 text-red-400" />
                <span>{course}</span>
              </div>
            ))}
          </div>

          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle>ADVERTENCIA</AlertTitle>
            <AlertDescription className="text-red-400">
              ⚠️ Esta acción eliminará permanentemente estos cursos y todos sus datos relacionados:
              <ul className="mt-2 ml-4 list-disc">
                <li>Todos los capítulos y su contenido</li>
                <li>Todo el progreso de los usuarios</li>
                <li>Todas las tareas y entregas</li>
                <li>Todos los archivos adjuntos</li>
                <li>Todas las compras</li>
                <li>Todos los temas del pensum</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cursos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {result.error ? (
                <XCircle className="h-5 w-5 text-red-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-400" />
              )}
              Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <div className="text-red-400">
                <p className="font-semibold">Error:</p>
                <p>{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4 text-white">
                <div>
                  <p className="font-semibold text-green-400">✅ Operación completada</p>
                  <p>Mensaje: {result.message}</p>
                </div>
                
                <div>
                  <p className="font-semibold">Cursos eliminados: {result.deletedCount}</p>
                  {result.deletedCourses && result.deletedCourses.length > 0 && (
                    <ul className="ml-4 list-disc">
                      {result.deletedCourses.map((course: string, index: number) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {result.remainingCount > 0 && (
                  <div>
                    <p className="font-semibold text-yellow-400">Cursos no eliminados: {result.remainingCount}</p>
                    <ul className="ml-4 list-disc">
                      {result.remainingCourses.map((course: string, index: number) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeleteCoursesPage;