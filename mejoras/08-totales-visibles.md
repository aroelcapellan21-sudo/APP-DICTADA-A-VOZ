# Sección 8 — Totales visibles

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ❌ PENDIENTE — no implementado.**

## Contenido original

Mostrar **conteo total de productos** (y unidades si aplica) en las 4 vistas:
- Lista escaneada
- Lista manual
- Historial
- Despacho

Ejemplo: un contador tipo "N productos · M unidades".

## Contexto del código
- Escaneada → `renderEditAntes` (array `allItems`).
- Manual → `renderManList` (array `manItems`).
- Historial → `renderHistorial` (cada `listas[i].items`).
- Despacho → `renderDespacho`.
- "Unidades" = suma de `cantidad` numérica (cuidado con cantidades tipo código "24/1": decidir si se cuentan).
