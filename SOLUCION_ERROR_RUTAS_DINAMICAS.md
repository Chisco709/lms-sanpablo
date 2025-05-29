# 🚨 Solución: Error de Rutas Dinámicas Conflictivas

## ❌ Problema Identificado

### Error Crítico:
```
Error: You cannot use different slug names for the same dynamic path ('courseId' !== 'notificationId').
    at Array.forEach (<anonymous>)
```

### Causa Raíz:
En **Next.js**, no puedes tener **dos rutas dinámicas diferentes en el mismo nivel de directorio**. Esto ocurría porque teníamos:

```
app/api/teacher/notifications/
├── [courseId]/route.ts          ❌ CONFLICTO
└── [notificationId]/read/route.ts ❌ CONFLICTO
```

Next.js no puede diferenciar entre `[courseId]` y `[notificationId]` en el mismo nivel porque ambos son parámetros dinámicos.

## ✅ Solución Implementada

### Nueva Estructura:
```
app/api/teacher/notifications/
├── course/[courseId]/route.ts              ✅ SEPARADO
└── notification/[notificationId]/read/route.ts ✅ SEPARADO
```

### Cambios de Rutas:

#### Antes (❌ Conflictivas):
- `GET /api/teacher/notifications/[courseId]` - Obtener notificaciones del curso
- `PATCH /api/teacher/notifications/[courseId]` - Marcar todas como leídas
- `PATCH /api/teacher/notifications/[notificationId]/read` - Marcar una como leída

#### Después (✅ Corregidas):
- `GET /api/teacher/notifications/course/[courseId]` - Obtener notificaciones del curso
- `PATCH /api/teacher/notifications/course/[courseId]` - Marcar todas como leídas
- `PATCH /api/teacher/notifications/notification/[notificationId]/read` - Marcar una como leída

## 🔧 Archivos Afectados

### Creados:
- `/app/api/teacher/notifications/course/[courseId]/route.ts`
- `/app/api/teacher/notifications/notification/[notificationId]/read/route.ts`

### Eliminados:
- `/app/api/teacher/notifications/[courseId]/route.ts` (conflictivo)
- `/app/api/teacher/notifications/[notificationId]/read/route.ts` (conflictivo)

## 📋 Código Migrado

### 1. Ruta por Curso (`course/[courseId]/route.ts`):
```typescript
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario sea el propietario del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!course) {
      return new NextResponse("Course not found or unauthorized", { status: 404 });
    }

    // Obtener notificaciones relacionadas con este curso
    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
        relatedCourseId: courseId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limitar a las últimas 50 notificaciones
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log("[TEACHER_NOTIFICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Marcar todas las notificaciones del curso como leídas
    await db.notification.updateMany({
      where: {
        userId: userId,
        relatedCourseId: courseId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[TEACHER_NOTIFICATIONS_READ_ALL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

### 2. Ruta por Notificación (`notification/[notificationId]/read/route.ts`):
```typescript
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    const { userId } = await auth();
    const { notificationId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Marcar la notificación como leída solo si pertenece al usuario
    const notification = await db.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId
      },
      data: {
        isRead: true
      }
    });

    if (notification.count === 0) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[NOTIFICATION_READ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

## 🎯 Actualización de Frontend

### Si hay código frontend que use estas rutas, actualizar de:

```typescript
// ❌ Antes
fetch(`/api/teacher/notifications/${courseId}`)
fetch(`/api/teacher/notifications/${notificationId}/read`, { method: 'PATCH' })
```

```typescript
// ✅ Después
fetch(`/api/teacher/notifications/course/${courseId}`)
fetch(`/api/teacher/notifications/notification/${notificationId}/read`, { method: 'PATCH' })
```

## 📊 Verificación

### Comandos para verificar la estructura:
```bash
# Verificar que no hay rutas conflictivas
Get-ChildItem -Path app -Recurse -Directory | Where-Object { $_.Name -match "^\[.*\]$" }

# Verificar la nueva estructura
Get-ChildItem "app/api/teacher/notifications/" -Recurse
```

### Resultado esperado:
```
app/api/teacher/notifications/
├── course/[courseId]/route.ts              ✅
└── notification/[notificationId]/read/route.ts ✅
```

## 🚀 Estado Actual

- ✅ **Error resuelto**: No más conflictos de rutas dinámicas
- ✅ **Servidor estable**: No más crashes del servidor de desarrollo
- ✅ **Funcionalidad preservada**: Todas las funciones de notificaciones operativas
- ✅ **Estructura clara**: Separación lógica por tipo de operación

## 📚 Lecciones Aprendidas

### Reglas de Next.js para Rutas Dinámicas:
1. **No mezclar slugs diferentes en el mismo nivel**
2. **Usar directorios padre para separar conceptos**
3. **Mantener estructura jerárquica clara**
4. **Nombres descriptivos para mejor organización**

### Mejores Prácticas:
1. **Agrupar por funcionalidad**: `/course/` vs `/notification/`
2. **Usar nombres explícitos**: `[courseId]` vs `[notificationId]`
3. **Estructurar jerárquicamente**: `notification/[id]/read` vs `course/[id]`
4. **Documentar cambios de API**: Para frontend y testing

---

## 📅 Fecha de Corrección
**Enero 2025** - Error crítico de rutas dinámicas resuelto exitosamente.

*El servidor de desarrollo ahora funciona sin crashes y las rutas están correctamente organizadas.* 