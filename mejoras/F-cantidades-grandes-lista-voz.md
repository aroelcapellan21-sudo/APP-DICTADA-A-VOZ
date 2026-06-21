# Mejora F — Números de cantidad más grandes en la lista del lector de voz

**Tipo:** mejora visual (legibilidad).
**Estado:** pendiente.

## Objetivo
En la lista de productos del **lector de voz** (la lista que acompaña al dictado), mostrar los **números de cantidad más grandes**, para poder leerlos de un vistazo a distancia.

## Contexto del código actual
- La lista del dictado es `#item-list`, renderizada por `renderItemList(items)`.
- Cada fila `.irow` muestra: número de orden (`.inum`), check (`.ichk`), nombre (`.iname`), y **cantidad (`.iqty`)**.
- CSS actual relevante: `#item-list`, `.irow`, `.iqty` (definir tamaño de fuente mayor para `.iqty`).

## Qué hacer
- Aumentar el tamaño/peso de fuente de `.iqty` (la cantidad) en la lista `#item-list`, y posiblemente resaltarla (color rojo ya se usa para cantidades en otras vistas).
- Cuidar que no rompa el layout de la fila en pantallas chicas.

## Relación
- Complementa la mejora **E** (panel de dictado a pantalla completa).

## Criterio de aceptación
En la lista del dictado, las cantidades se ven notablemente más grandes y legibles que el resto, sin desarmar la fila.
