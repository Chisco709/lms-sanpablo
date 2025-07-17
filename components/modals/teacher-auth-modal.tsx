"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeacherAuth } from "@/hooks/use-teacher-auth";
import toast from "react-hot-toast";
import { Shield, User, Lock } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido."
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida."
  })
});

export const TeacherAuthModal = () => {
  const { isModalOpen, setModalOpen, authenticate } = useTeacherAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const isAuthenticated = authenticate(values.name, values.password);
      
      if (isAuthenticated) {
        toast.success("¡Autenticación exitosa! Bienvenido al modo profesor.");
        form.reset();
      } else {
        toast.error("Credenciales incorrectas. Verifica tu nombre y contraseña.");
      }
    } catch (error) {
      toast.error("Ocurrió un error durante la autenticación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            Autenticación de Profesor
          </DialogTitle>
          <p className="text-slate-400 text-sm mt-2">
            Ingresa tus credenciales para acceder al modo profesor del Instituto San Pablo
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-green-400" />
                    Nombre Completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ingresa tu nombre completo"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-400" />
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      placeholder="Ingresa tu contraseña"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-400 text-black font-medium"
              >
                {isLoading ? "Verificando..." : "Ingresar"}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            Solo personal autorizado del Instituto San Pablo puede acceder al modo profesor
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 