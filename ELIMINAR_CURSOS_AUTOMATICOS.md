# 🗑️ Eliminar Cursos Automáticos

## Cursos automáticos que se eliminarán:

- ⚡ Técnico en Reparación de Computadoras
- ⚡ Técnico en Electrónica Industrial  
- ⚡ Técnico en Mecánica Automotriz
- ⚡ Técnico en Instalaciones Eléctricas
- ⚡ Técnico en Electricidad
- ⚡ Técnico en Mecánica
- ⚡ Técnico en Computación
- ⚡ Técnico en Electrónica
- ⚡ Técnico en Soldadura
- ⚡ Técnico en Refrigeración
- ⚡ Técnico en Automotriz
- ⚡ Técnico en Construcción

## 🚀 Opción 1: Usar el endpoint API (Recomendado)

1. **Inicia sesión** como administrador (chiscojjcm@gmail.com)
2. **Ve a esta URL** en tu navegador:
   ```
   http://localhost:3000/api/admin/delete-auto-courses
   ```
3. **Método**: Usar DELETE (puedes usar Postman o similar)
4. **¡Listo!** Los cursos automáticos se eliminarán automáticamente

## 🛠️ Opción 2: Ejecutar script (Si prefieres terminal)

```bash
# En la carpeta del proyecto
npm run delete-auto-courses
```

## ✅ ¿Qué NO se elimina?

- ✅ **Categorías** se mantienen intactas
- ✅ **Cursos creados manualmente** por profesores
- ✅ **Configuraciones** del sistema
- ✅ **Usuarios** y sus datos

## 📊 Después de la eliminación

El sistema mostrará:
- Número de cursos eliminados
- Cursos restantes en el sistema
- Confirmación de éxito

---

**⚠️ Nota**: Este proceso es **irreversible**. Solo elimina los cursos automáticos específicos que no necesitas. 