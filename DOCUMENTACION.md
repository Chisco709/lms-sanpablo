# Documentación - Sistema de Gestión de Aprendizaje (LMS San Pablo)

## 1. Visión General del Proyecto

El proyecto "LMS San Pablo" es una plataforma de gestión de aprendizaje moderna construida con tecnologías web de última generación. Este sistema permite la administración de cursos, contenidos educativos y recursos académicos.

## 2. Arquitectura Técnica

### Frontend
- **Framework**: Next.js 15.3.2 (App Router)
- **Biblioteca de UI**: React 19
- **Lenguaje**: TypeScript 5

### Backend
- **API Routes**: Integradas en Next.js
- **Base de datos**: PostgreSQL
- **ORM**: Prisma 6.7.0

### Autenticación
- Clerk para gestión de usuarios y sesiones

## 3. Estructura de Carpetas

```
lms-sanpablo/
├── .next/                  # Archivos compilados de Next.js
├── .clerk/                 # Configuración de Clerk
├── app/                    # Aplicación principal (App Router)
│   ├── api/                # Rutas de API
│   ├── (auth)/             # Rutas para autenticación
│   ├── (dashboard)/        # Rutas del panel principal
│   │   ├── (routes)/       # Subrutas del dashboard
│   │   │   ├── teacher/    # Área de profesores
│   │   │   ├── search/     # Funcionalidad de búsqueda
│   │   ├── _components/    # Componentes específicos del dashboard
│   │   ├── globals.css         # Estilos globales
│   │   ├── layout.tsx          # Layout principal
├── components/             # Componentes reutilizables
│   ├── providers/          # Proveedores de contexto
│   ├── ui/                 # Componentes de interfaz
├── lib/                    # Utilidades y helpers
├── prisma/                 # Configuración de Prisma ORM
│   ├── schema.prisma       # Esquema de la base de datos
├── public/                 # Archivos estáticos
```

## 4. Tecnologías y Dependencias

### Dependencias Principales
- **Next.js**: Framework React para renderizado del lado del servidor
- **React**: Biblioteca para construcción de interfaces
- **Prisma**: ORM para interacción con la base de datos
- **Clerk**: Gestión de autenticación y usuarios
- **TailwindCSS**: Framework CSS para estilos
- **Radix UI**: Componentes accesibles y personalizables
- **Zod**: Validación de esquemas
- **React Hook Form**: Manejo de formularios

### Dependencias de Desarrollo
- **TypeScript**: Lenguaje tipado que compila a JavaScript
- **ESLint**: Herramienta para linting de código
- **Tailwind**: Utilidades para estilización

## 5. Modelos de Datos

### Curso (Course)
- Propiedades principales: id, título, descripción, precio, estado de publicación
- Relaciones: 
  - Pertenece a una categoría
  - Contiene múltiples archivos adjuntos

### Categoría (Category)
- Propiedades principales: id, nombre
- Relaciones:
  - Contiene múltiples cursos

### Archivo Adjunto (Attachment)
- Propiedades principales: id, nombre, URL
- Relaciones:
  - Pertenece a un curso

## 6. Flujos Principales

### Autenticación
- Registro/inicio de sesión mediante Clerk
- Middleware para protección de rutas

### Panel de Control
- Dashboard principal para usuarios autenticados
- Vista específica para profesores

### Gestión de Cursos
- Creación, edición y eliminación de cursos
- Asignación de categorías y materiales

## 7. Configuración de Desarrollo

### Requisitos Previos
- Node.js (versión recomendada: 18+)
- PostgreSQL
- Cuenta en Clerk (para autenticación)

### Instalación
```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
cd lms-sanpablo
npm install

# Configurar variables de entorno
# Crear archivo .env con las siguientes variables:
# DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/lms_sanpablo"
# CLERK_SECRET_KEY="..."
# CLERK_PUBLISHABLE_KEY="..."

# Iniciar migraciones de base de datos
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

## 8. Despliegue

### Preparación para Producción
```bash
# Compilar para producción
npm run build

# Iniciar en modo producción
npm start
```

### Opciones de Despliegue
- Vercel (recomendado para Next.js)
- Netlify
- Servidor propio con Node.js

## 9. Áreas de Mejora

### Técnicas
- Implementación de tests unitarios y de integración
- CI/CD para automatización de despliegue
- Monitoreo de rendimiento y errores

### Funcionales
- Sistema de notificaciones
- Panel de análisis y estadísticas
- Integración con plataformas de pago
- Soporte para múltiples idiomas

### Diseño
- Mejorar accesibilidad (WCAG)
- Implementar modo oscuro
- Optimizar para dispositivos móviles

## 10. Mantenimiento

### Actualizaciones
- Mantener dependencias actualizadas regularmente
- Revisar cambios en APIs externas (Clerk, etc.)

### Seguridad
- Auditorías de seguridad periódicas
- Actualización de políticas de privacidad 