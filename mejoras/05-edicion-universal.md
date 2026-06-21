# Sección 5 — Edición universal (✏️)

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ⚠️ PARCIAL.** El Patrón ya tiene edición inline (nombre, cantidad, voz, categoría por arrastre) y la pantalla "Editar antes de guardar" es editable inline. **Pendiente:** unificar un modal de edición ✏️ idéntico en las 4 superficies y agregar el ✏️ por fila en el Patrón (hoy hay edición inline pero no el modal estándar unificado).

## Contenido original

Debe funcionar de forma idéntica en las 4 superficies:
- Facturas escaneadas
- Listas manuales
- Historial
- Patrón

Modal de edición estándar (mismo para las 4 superficies).

En el **Patrón específicamente**, cada fila debe mostrar el ✏️ además del 🗑️.
(Actualmente faltaba el ✏️, solo existía 🗑️.)

## Contexto del código
- Modal de agregar/editar existente: `m-add-prod` (`addProdTarget` define el destino: 'antes', 'panel', 'patron').
- Superficies: factura → `renderEditAntes`; manual → `renderManList`; historial → `m-ver-lista`/`renderPanelEditList`; Patrón → `renderPatron`.
