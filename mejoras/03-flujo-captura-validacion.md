# Sección 3 — Flujo completo de captura y validación (orden estricto)

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ✅ MAYORMENTE IMPLEMENTADO.** Validación post-OCR en la pantalla "Editar antes de guardar": el backend (`api/index.js`, prompts Gemini/Claude) devuelve `precio`, `total` y confianza por campo (`conf_cantidad/conf_precio/conf_total` = alto/medio/bajo). Líneas dudosas (confianza media/baja) o que no cuadran (`precio×cantidad ≠ total`) se marcan con **franja roja**, son editables inline (categoría/nombre/cantidad/precio/total) y **bloquean Guardar** hasta corregirse (`validarItem`, `hayAnomalias`, `actualizarBloqueoGuardar`). **Pendiente:** agrupación temporal explícita bajo "Sin clasificar" para productos no reconocidos (hoy se marca por validación, no por un grupo aparte). Ver también mejora **B** (señal 🛑 de productos sin coincidencia en el Patrón) y **G** (confianza también en el nombre).

## Contenido original

Manejo de productos no reconocidos:
- No se descartan ni se asignan automáticamente a "Otros" sin avisar.
- Se agregan a la revisión (paso 3) marcados en rojo con ⚠️.
- Se agrupan temporalmente bajo "Sin clasificar" hasta que el usuario los resuelva.
- El bloqueo del paso 3/5 garantiza que nada llega al chofer sin revisión.
