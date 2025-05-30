"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface StudentPayment {
  id: string;
  userId: string;
  paymentType: "director" | "platform";
  amount: number;
  status: "active" | "suspended" | "cancelled";
  startDate: string;
  expiryDate: string;
  notes?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
  };
}

interface StudentManagementProps {
  courseId: string;
  students: StudentPayment[];
}

export const StudentManagement = ({ courseId, students }: StudentManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: "",
    paymentType: "director" as "director" | "platform",
    notes: ""
  });
  const router = useRouter();

  const handleAddStudent = async () => {
    if (!formData.userEmail.trim()) {
      toast.error("El email del estudiante es requerido");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    try {
      setIsLoading(true);
      
      const amount = formData.paymentType === "director" ? 80000 : 90000;
      
      await axios.post(`/api/courses/${courseId}/students`, {
        userEmail: formData.userEmail.toLowerCase().trim(),
        paymentType: formData.paymentType,
        amount,
        notes: formData.notes.trim()
      });

      const priceText = formData.paymentType === "director" ? "80,000" : "90,000";
      toast.success(`✅ Estudiante agregado exitosamente (${priceText} COP/mes)`);
      setIsOpen(false);
      setFormData({ userEmail: "", paymentType: "director", notes: "" });
      router.refresh();
      
    } catch (error: unknown) {
      console.error("Error adding student:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 400) {
          toast.error("Este estudiante ya está registrado en el curso");
        } else {
          toast.error(axiosError.response?.data?.message || "Error al agregar estudiante");
        }
      } else {
        toast.error("Error al agregar estudiante");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (studentId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/courses/${courseId}/students/${studentId}`, {
        status: newStatus
      });
      
      const statusText = newStatus === "active" ? "activado" : 
                        newStatus === "suspended" ? "suspendido" : "cancelado";
      toast.success(`Estudiante ${statusText}`);
      router.refresh();
      
    } catch {
      toast.error("Error al actualizar estado del estudiante");
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("¿Estás seguro de eliminar este estudiante? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await axios.delete(`/api/courses/${courseId}/students/${studentId}`);
      toast.success("Estudiante eliminado");
      router.refresh();
    } catch {
      toast.error("Error al eliminar estudiante");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "suspended":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "suspended":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-white mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          <span>Gestión de Estudiantes</span>
          <span className="text-sm text-slate-400">({students.length} estudiantes)</span>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Agregar Nuevo Estudiante</DialogTitle>
              <DialogDescription className="text-slate-400">
                Agrega un estudiante al curso con su tipo de pago correspondiente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Email del Estudiante
                </label>
                <Input
                  placeholder="estudiante@email.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Tipo de Pago
                </label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value: "director" | "platform") => 
                    setFormData(prev => ({ ...prev, paymentType: value }))
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="director" className="text-white">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span>Estudiante del Director - $80,000 COP/mes</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="platform" className="text-white">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-400" />
                        <span>Estudiante Directo - $90,000 COP/mes</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Notas (Opcional)
                </label>
                <Textarea
                  placeholder="Notas adicionales sobre el estudiante..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddStudent}
                  disabled={isLoading || !formData.userEmail.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Agregando...
                    </div>
                  ) : (
                    "Agregar Estudiante"
                  )}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  disabled={isLoading}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de estudiantes */}
      {students.length === 0 ? (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center bg-slate-700/30">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                No hay estudiantes registrados
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Comienza agregando estudiantes del director o estudiantes directos
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-white">
                        {student.user?.firstName || "Usuario"} {student.user?.lastName || ""} 
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">
                          {student.status === "active" ? "Activo" : 
                           student.status === "suspended" ? "Suspendido" : "Cancelado"}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{student.user?.emailAddress || student.userId}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(student.amount)}/mes
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Vence: {formatDate(student.expiryDate)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        student.paymentType === "director" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {student.paymentType === "director" ? "Director" : "Directo"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={student.status}
                    onValueChange={(value: string) => handleStatusChange(student.id, value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-600 border-slate-500 text-white text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="active" className="text-white">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          Activo
                        </div>
                      </SelectItem>
                      <SelectItem value="suspended" className="text-white">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-yellow-400" />
                          Suspendido
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled" className="text-white">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-3 w-3 text-red-400" />
                          Cancelado
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => handleRemoveStudent(student.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {student.notes && (
                <div className="mt-3 p-2 bg-slate-600/50 rounded text-xs text-slate-300">
                  <strong>Notas:</strong> {student.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {students.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Estudiantes Director</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {students.filter(s => s.paymentType === "director" && s.status === "active").length}
            </p>
            <p className="text-xs text-green-300">
              {formatCurrency(students.filter(s => s.paymentType === "director" && s.status === "active").length * 80000)}/mes
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Estudiantes Directos</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {students.filter(s => s.paymentType === "platform" && s.status === "active").length}
            </p>
            <p className="text-xs text-blue-300">
              {formatCurrency(students.filter(s => s.paymentType === "platform" && s.status === "active").length * 90000)}/mes
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Total Mensual</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {formatCurrency(
                students.filter(s => s.status === "active").reduce((total, s) => total + s.amount, 0)
              )}
            </p>
            <p className="text-xs text-yellow-300">
              {students.filter(s => s.status === "active").length} estudiantes activos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 