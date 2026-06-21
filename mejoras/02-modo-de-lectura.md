# Sección 2 — Modo de lectura (ajuste global)

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ✅ Modo "categoria" IMPLEMENTADO** (encabezado una vez + "cantidad, producto", con chime de transición Web Audio entre categorías — ver Sección 7). El modo "individual" existe como la rama no-categoría de `textoProducto()`. **Pendiente:** el toggle visible en UI para alternar modos (hoy `CONFIG_LECTURA.modo='categoria'` por defecto, sin control en pantalla).

## Contenido original

Vive dentro de `CONFIG_LECTURA.modo`. Dos opciones intercambiables:

### Modo "categoria" (predeterminado)
Dice la categoría una sola vez como encabezado, luego enumera cada producto en el orden del Patrón, en formato **cantidad → producto**.
Ejemplo: "Paletas" → "57, Bonice" → "20, Chocolate" → "8, Fresa" → (chime) → "Paletas Naturales" → "12, Coco"…

### Modo "individual"
Dicta cada producto por separado sin agrupar, en formato **cantidad → producto**, sin mencionar la categoría.

## Notas de implementación
- Lectura por categoría: `agruparPorCategoria()`, `textoProductoCat()`, `esPrimeroDeCat()`, `cantidadVozCat()`.
- Cantidades tipo código (con "/") no se pronuncian; nombre limpiado de códigos `NN/N` con `limpiarVoz()`.
- Gateado por `CONFIG_LECTURA.modo==='categoria'`.
