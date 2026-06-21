# Sección 4 — Exportar lista por WhatsApp

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ❌ PENDIENTE — no implementado.**

## Contenido original

Al finalizar el dictado o la asignación a chofer, agregar un botón para **compartir el resumen directamente a WhatsApp** en un solo toque.

Implementación: usar `https://wa.me/?text=` con el texto codificado (`encodeURIComponent`). **No requiere librería externa.** Debe aparecer en:
- Pantalla de **finalización del dictado** (`#done-sec`).
- Vista de **historial** (para reenviar una lista anterior).

## Pistas de implementación (contexto del código actual)
- Finalización del dictado: `finalizarDictado()` muestra `#done-sec` con `#done-sum`.
- Historial: `renderHistorial()` / vista de detalle de lista (`m-ver-lista`).
- Una lista guardada (`listas[]`) tiene `nombre`, `chofer`, `items[]` (cada item `{categoria, nombre, cantidad}`), `fecha`.
- Armar el texto del mensaje agrupando por categoría (reusar `grupBy`), abrir `window.open('https://wa.me/?text='+encodeURIComponent(texto))`.
