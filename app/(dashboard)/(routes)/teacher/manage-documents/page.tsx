"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Alert from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  User, 
  Plus, 
  Trash2, 
  Edit,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

interface AuthorizedDocument {
  id: string;
  documentNumber: string;
  documentType: string;
  fullName: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ManageDocumentsPage = () => {
  const [documents, setDocuments] = useState<AuthorizedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "CC" | "TI">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Formulario para agregar/editar documento
  const [formData, setFormData] = useState({
    documentNumber: "",
    documentType: "CC" as "CC" | "TI",
    fullName: "",
    notes: "",
    isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Cargar documentos
  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/admin/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      } else {
        toast.error("Error al cargar documentos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar documentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.documentNumber.includes(searchTerm) || 
                         doc.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && doc.isActive) ||
                         (filterStatus === "inactive" && !doc.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Agregar documento
  const handleAddDocument = async () => {
    if (!formData.documentNumber.trim() || !formData.fullName.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch("/api/admin/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Documento agregado exitosamente");
        resetForm();
        loadDocuments();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al agregar documento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al agregar documento");
    } finally {
      setIsAdding(false);
    }
  };

  // Editar documento
  const handleEditDocument = async () => {
    if (!editingId || !formData.documentNumber.trim() || !formData.fullName.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch(`/api/admin/documents/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Documento actualizado exitosamente");
        resetForm();
        loadDocuments();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al actualizar documento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar documento");
    } finally {
      setIsAdding(false);
    }
  };

  // Eliminar documento
  const handleDeleteDocument = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este documento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Documento eliminado exitosamente");
        loadDocuments();
      } else {
        toast.error("Error al eliminar documento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar documento");
    }
  };

  // Cambiar estado del documento
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Documento ${!currentStatus ? "activado" : "desactivado"} exitosamente`);
        loadDocuments();
      } else {
        toast.error("Error al cambiar estado del documento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cambiar estado del documento");
    }
  };

  // Iniciar edición
  const startEdit = (doc: AuthorizedDocument) => {
    setFormData({
      documentNumber: doc.documentNumber,
      documentType: doc.documentType as "CC" | "TI",
      fullName: doc.fullName,
      notes: doc.notes || "",
      isActive: doc.isActive
    });
    setEditingId(doc.id);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      documentNumber: "",
      documentType: "CC",
      fullName: "",
      notes: "",
      isActive: true
    });
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            🆔 Gestión de Documentos Autorizados
          </h1>
          <p className="text-white/70">
            Administra los documentos de identidad autorizados para acceder a los cursos
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? "Cancelar" : "Agregar Documento"}
        </Button>
      </div>

      {/* Formulario de agregar/editar */}
      {isAdding && (
        <Card className="bg-black/80 border-2 border-green-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              {editingId ? "Editar Documento" : "Agregar Nuevo Documento"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Número de Documento *
                </label>
                <Input
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                  placeholder="Ej: 1234567890"
                  className="bg-black/60 border-green-400/30 text-white placeholder:text-white/50"
                  maxLength={11}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Tipo de Documento *
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.documentType === "CC" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${
                      formData.documentType === "CC" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-black/60 border-green-400/30 text-white hover:bg-green-400/10"
                    }`}
                    onClick={() => setFormData({...formData, documentType: "CC"})}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Cédula
                  </Button>
                  <Button
                    type="button"
                    variant={formData.documentType === "TI" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${
                      formData.documentType === "TI" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-black/60 border-green-400/30 text-white hover:bg-green-400/10"
                    }`}
                    onClick={() => setFormData({...formData, documentType: "TI"})}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Tarjeta de Identidad
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Nombre Completo *
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Nombre completo del estudiante"
                className="bg-black/60 border-green-400/30 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Notas (opcional)
              </label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Información adicional"
                className="bg-black/60 border-green-400/30 text-white placeholder:text-white/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-green-400/30 bg-black/60"
              />
              <label htmlFor="isActive" className="text-sm text-white">
                Documento activo
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={editingId ? handleEditDocument : handleAddDocument}
                disabled={isAdding}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {editingId ? "Actualizar" : "Agregar"}
                  </>
                )}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1 bg-black/60 border-green-400/30 text-white hover:bg-green-400/10"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card className="bg-black/80 border-2 border-green-400/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Buscar por número o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/60 border-green-400/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "all" | "CC" | "TI")}
                className="px-3 py-2 bg-black/60 border border-green-400/30 text-white rounded-md"
              >
                <option value="all">Todos los tipos</option>
                <option value="CC">Cédula</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
                className="px-3 py-2 bg-black/60 border border-green-400/30 text-white rounded-md"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <Card className="bg-black/80 border-2 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            Documentos Autorizados ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white/70">Cargando documentos...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No se encontraron documentos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-black/40 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center border border-green-400/30">
                      {doc.documentType === "CC" ? (
                        <CreditCard className="h-5 w-5 text-green-400" />
                      ) : (
                        <User className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{doc.fullName}</h3>
                        <Badge 
                          variant={doc.isActive ? "default" : "secondary"}
                          className={doc.isActive ? "bg-green-400/20 text-green-400 border-green-400/30" : "bg-red-400/20 text-red-400 border-red-400/30"}
                        >
                          {doc.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">
                        {doc.documentType}: {doc.documentNumber}
                      </p>
                      {doc.notes && (
                        <p className="text-white/50 text-xs mt-1">{doc.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => startEdit(doc)}
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white hover:bg-green-400/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(doc.id, doc.isActive)}
                      variant="ghost"
                      size="sm"
                      className={doc.isActive ? "text-red-400 hover:text-red-300 hover:bg-red-400/10" : "text-green-400 hover:text-green-300 hover:bg-green-400/10"}
                    >
                      {doc.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => handleDeleteDocument(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Alert className="bg-green-400/10 border-green-400/30">
        <AlertTriangle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-400">
          <strong>Nota:</strong> Solo los documentos activos pueden acceder a los cursos. 
          Los documentos inactivos no podrán verificar su identidad.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ManageDocumentsPage;