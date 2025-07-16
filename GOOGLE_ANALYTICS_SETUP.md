# 📊 Configuración de Google Analytics 4 - Instituto San Pablo LMS

## 🚀 Implementación Completada

Se ha implementado **Google Analytics 4** en todo el LMS con tracking avanzado para estudiantes y profesores.

## 📋 Pasos para Activar Google Analytics

### 1. Crear Cuenta de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una cuenta nueva o usa una existente
3. Configura una nueva propiedad para "Instituto San Pablo LMS"
4. Selecciona **Google Analytics 4 (GA4)**
5. Configura los datos básicos:
   - **Nombre de la propiedad**: Instituto San Pablo LMS
   - **Zona horaria**: (GMT-05:00) Bogotá, Lima, Quito
   - **Moneda**: Peso colombiano (COP)

### 2. Obtener el ID de Seguimiento

1. En tu propiedad GA4, ve a **Administración** ⚙️
2. Clic en **Flujos de datos**
3. Selecciona tu flujo de datos web
4. Copia el **ID de medición** (formato: `G-XXXXXXXXXX`)

### 3. Configurar Variables de Entorno

Agrega la variable de entorno en tu archivo `.env.local`:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**⚠️ Importante**: Reemplaza `G-XXXXXXXXXX` con tu ID real de Google Analytics.

### 4. Reiniciar la Aplicación

```bash
npm run dev
```

## 🎯 Eventos Implementados

### 📚 Eventos de Estudiantes

| Evento | Descripción | Cuándo se dispara |
|--------|-------------|-------------------|
| `view_course` | Ver detalles de un curso | Al abrir la página de un curso |
| `enroll_course` | Inscribirse a un curso | Al completar inscripción |
| `start_chapter` | Iniciar un capítulo | Al acceder a un capítulo |
| `complete_chapter` | Completar un capítulo | Al marcar como completado |
| `play_video` | Reproducir video | Al iniciar un video |
| `complete_video` | Completar video | Al terminar un video |
| `search` | Buscar cursos | Al usar la barra de búsqueda |
| `download_certificate` | Descargar certificado | Al obtener certificación |

### 👨‍🏫 Eventos de Profesores

| Evento | Descripción | Cuándo se dispara |
|--------|-------------|-------------------|
| `create_course` | Crear curso nuevo | Al crear un curso exitosamente |
| `publish_course` | Publicar curso | Al hacer público un curso |
| `form_submit` | Envío de formularios | Al completar formularios |
| `teacher_actions` | Acciones generales | Diversas acciones de teaching |

### 🔍 Eventos de Navegación

| Evento | Descripción | Cuándo se dispara |
|--------|-------------|-------------------|
| `page_view` | Ver página | Automático en cada página |
| `time_on_page` | Tiempo en página | Al abandonar una página |
| `scroll_25/50/75/100` | Porcentaje de scroll | Al hacer scroll en páginas |

## 📊 Dashboards Recomendados en GA4

### 1. Panel de Estudiantes
- Cursos más populares
- Tasa de finalización de capítulos
- Tiempo promedio en videos
- Búsquedas más frecuentes

### 2. Panel de Profesores
- Cursos creados por período
- Tasa de publicación de cursos
- Errores en creación de contenido

### 3. Panel de Rendimiento
- Páginas más visitadas
- Tiempo de sesión promedio
- Tasa de rebote por sección
- Rutas de navegación más comunes

## 🎛️ Configuraciones Avanzadas en GA4

### Audiencias Personalizadas

1. **Estudiantes Activos**: Usuarios que han visto al menos 3 cursos
2. **Profesores Productivos**: Usuarios que han creado al menos 1 curso
3. **Usuarios Comprometidos**: Sesiones > 5 minutos

### Conversiones Importantes

Configura estos eventos como conversiones en GA4:

- `enroll_course` - Inscripciones a cursos
- `complete_course` - Finalización de cursos
- `download_certificate` - Obtención de certificados
- `create_course` - Creación de cursos (profesores)

### Dimensiones Personalizadas

- **Tipo de Usuario**: Estudiante vs Profesor
- **Categoría de Curso**: Técnico, Inglés, Primera Infancia
- **Estado del Curso**: Gratuito vs Premium

## 🔧 Funciones Disponibles

### En Componentes React

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

const MiComponente = () => {
  const { trackLMSEvent, trackCourseInteraction } = useAnalytics();
  
  const handleCourseClick = () => {
    trackLMSEvent.courseView(courseId, courseName);
  };
  
  return (
    <button onClick={handleCourseClick}>
      Ver Curso
    </button>
  );
};
```

### Tracking Directo

```tsx
import { trackEvent, trackLMSEvent } from '@/components/google-analytics';

// Evento personalizado
trackEvent('custom_action', 'user_engagement', 'button_click');

// Evento del LMS
trackLMSEvent.courseEnroll(courseId, courseName);
```

## 🚨 Resolución de Problemas

### Analytics no aparece
1. ✅ Verifica que `NEXT_PUBLIC_GA_ID` esté configurado
2. ✅ Confirma que el ID comience con `G-`
3. ✅ Reinicia el servidor de desarrollo
4. ✅ Revisa la consola del navegador para errores

### Eventos no se registran
1. ✅ Espera 24-48 horas para datos completos
2. ✅ Usa el **Realtime** en GA4 para ver eventos inmediatos
3. ✅ Verifica que los eventos estén bien configurados

### Debugging
Agrega esto a la consola del navegador para ver eventos:
```javascript
// Ver eventos en tiempo real
window.dataLayer = window.dataLayer || [];
console.log(window.dataLayer);
```

## 📈 Métricas Clave del Instituto San Pablo

### KPIs Principales
- **Inscripciones mensuales** por programa técnico
- **Tasa de finalización** por curso
- **Tiempo promedio** de estudio
- **Satisfacción del estudiante** (via eventos de interacción)

### Reportes Automáticos
- Reporte semanal de cursos populares
- Análisis mensual de retención de estudiantes
- Tendencias de búsqueda de programas técnicos

## 🎯 Próximos Pasos

1. **Configurar alertas** para métricas importantes
2. **Crear informes personalizados** para directivos
3. **Implementar A/B testing** en páginas clave
4. **Configurar integración** con Google Ads (si aplica)

---

✅ **Google Analytics 4 está completamente configurado y listo para usar.**

Para soporte técnico, contacta al equipo de desarrollo del LMS. 