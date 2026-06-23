# Mejora H — Sistema de Novedades (IMPLEMENTADO en rama, a probar)

> Estado: **implementado en la rama `mejora-h-novedades`** (commit `dcf8542`),
> pendiente de probar en preview y fusionar a `main`.
> JS validado sin errores. NO toca `main` todavía.
> Fecha: 2026-06-22.

## Parte A — Novedades por producto

- Botón **🆕 (naranja)** en cada producto, en **dictado, panel de lista y panel de
  edición**. Gris si no hay novedad; naranja si hay ≥1.
- **Fila sombreada** naranja fija si el producto tiene novedad — visible al abrir el
  panel, sin entrar a editar.
- **Modal** con 3 tipos **no excluyentes** (Faltante / Retirado / Agregado); cada
  uno con **Cantidad** + **Nota** (la **Nota es obligatoria en "Agregado"**).
- **Persistencia** por `item._uid` en `listas[i].items[j]` + `saveListas()`
  (el `_uid` se asigna al guardar la lista y al abrir listas viejas).
- **Tabla "Novedades por Chofer"** en Historial (botón 🆕): columnas
  **Fecha | Chofer | Producto | Tipo | Cantidad | Nota**, filtrable por fecha y
  por chofer.

## Parte B — Reporte del día (tab propio en la barra inferior)

- **Tab propio "📒 Reporte"** en la navegación inferior (movido fuera de Despacho).
- Sección **"📒 Reporte del día"**: agregar entradas con 5 tipos
  (**Sobrante / Dañados / Pendientes / Agotado / Notas**); producto, cantidad y
  nota opcionales.
- **"Pizarra del día":** la sección se ve vacía cada día nuevo; lo anterior queda
  guardado. Almacenado en `localStorage` → `bon_reporte`.
- **Tabla "Reporte de Despacho"** (botón "Ver por fecha"): columnas
  **Fecha | Tipo | Producto | Cantidad | Nota**, filtrable por fecha, independiente
  de la tabla de Parte A.

## Coordinación visual (con Mejora I, ya en producción)

- **Novedades** (Mejora H) = **naranja 🆕**, en la **fila del producto**.
- **Nota del despacho** (Mejora I) = **ámbar 📝**, en la **burbuja del chofer**.
- Colores e íconos deliberadamente distintos para no confundirse.

## Confirmación de impacto (NO se toca)

No toca el **Patrón** (`bon_pat`: orden, texto_voz, candados), las **categorías**
(`bon_categorias`), el **dictado / orden de lectura / auto-avance / FAB**, ni la
**pronunciación**. Todo es **aditivo**: `item.novedades`, `item._uid`,
`bon_reporte`. Las listas viejas siguen válidas (campos opcionales ausentes; el
`_uid` se completa al abrirlas).

## Cómo probar en el Xiaomi (preview de la rama)

Abre la **preview** de `mejora-h-novedades` con el botón **"Visit Preview"** en
Vercel/GitHub (no teclees el slug largo). Checklist:

1. Panel de lista / dictado: botón 🆕 en cada producto; marca
   Faltante/Retirado/Agregado → la fila se sombrea de inmediato.
2. "Agregado" exige nota (no deja guardar sin ella).
3. Historial → **🆕 Novedades por chofer**: tabla con filtros por fecha y chofer.
4. Despacho → **📒 Reporte del día**: agrega entradas; "Ver por fecha" muestra la
   tabla; al cambiar de día la lista del día aparece vacía.
5. Confirma que el dictado, el Patrón, las categorías y el historial siguen igual.

## Siguiente paso

Cuando confirmes que todo funciona en el Xiaomi, se **fusiona `mejora-h-novedades`
a `main`** y queda en producción.
