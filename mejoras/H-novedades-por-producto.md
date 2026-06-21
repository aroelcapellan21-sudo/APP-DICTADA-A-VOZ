# Mejora H — Sistema de Novedades (dos partes)

**Tipo:** feature nueva.
**Estado:** pendiente (solo documentado).
**Regla:** **agregar, no alterar** la lógica existente del dictado, del FAB minimizar, ni del patrón de pronunciación.

El sistema se divide en **dos partes separadas**:
- **PARTE A — Novedades por producto/chofer** (ligadas a un producto de la lista de un chofer).
- **PARTE B — Reporte de Despacho del día** (general del día, no ligado a chofer ni a un producto de un chofer).

---

## Contexto del código (común)

`index.html` (todo el front es un solo archivo).

- **Lista del chofer, producto por producto:** `#item-list` renderizado por `renderItemList(items)` dentro del modal `#m-dictado` (con banner del chofer `#ch-banner`). Es lo que se "llama" producto por producto.
- **Panel de edición de la lista del chofer:** `renderPanelEditList(items, listaId)` (usa `activoListaId`).
- **Almacenamiento de listas:** viven en `listas[]` (localStorage `bon_listas`); cada `listas[i].items[j]` es `{categoria, nombre, cantidad}`. El registro de lista guarda además chofer y fecha (ver `guardarListaFinal`, `fechaStr`/`hoyStr`). Durante el dictado se trabaja sobre una **copia** (`allItems = [...l.items]`); para persistir hay que escribir en el item real de `listas` y llamar `saveListas()`.
- **Despacho / historial:** `navTo('despacho')` + `renderDespacho()`, `navTo('historial')` + `renderHistorial()`.

## ⚠️ Pre-implementación: confirmar con el usuario (Nota general)
Antes de tocar código, confirmar:
1. **Dónde vive estructuralmente la "lista del chofer"** y en qué superficie va el botón "Novedades" de la Parte A: ¿en el dictado (`#item-list`/`renderItemList`), en el panel de edición (`renderPanelEditList`), o en ambas?
2. **Persistencia durante el dictado:** como el dictado usa `allItems` (copia), confirmar que las novedades se escriben de vuelta en `listas[i].items[j]` (match por índice/nombre) + `saveListas()`.
3. **Dónde tiene sentido ubicar el "Reporte de Despacho del día"** (Parte B) en el código actual, si no es evidente (candidato: la sección Despacho).

---

# PARTE A — Novedades por producto/chofer

### Botón "Novedades" por producto
- Cada producto de la lista del chofer (vista por producto) tiene un botón **"Novedades"**.
- **Sin** novedad activa → botón **gris, apagado**.
- Con **al menos una** novedad activa → botón en **color llamativo, fijo (sin parpadeo)**.

### Modal: 3 tipos, no excluyentes
Al tocar el botón se abre un modal con **exactamente 3 tipos**, cada uno como botón independiente (un producto puede tener **varios a la vez**):
1. **Faltante** — no se le entregó al chofer lo que debía.
2. **Retirado** — el chofer decidió por voluntad propia no llevarse ese producto.
3. **Agregado** — el chofer pide que se le agregue algo que no se le pudo dar en el momento, para entregárselo después.

### Campos al activar un tipo
- Al activar un tipo se despliegan **dos campos opcionales**: **Cantidad** (numérica) y **Nota** (texto libre).
- **Excepción:** para **"Agregado"**, la **Nota es obligatoria**.

### Fila del producto
- La fila del producto se muestra con **sombreado fijo (sin parpadeo)** si tiene alguna novedad activa.
- Sin novedad = fila normal.

### Persistencia
- Al **guardar la lista del chofer**, las novedades de cada producto quedan guardadas (**tipo + cantidad + nota**) dentro de ese registro del historial.
- Solo los productos con ≥1 novedad activa guardan información extra; el resto no persiste nada adicional.
- Estructura sugerida (a confirmar): campo opcional en el item solo cuando hay alguna, p.ej.:
  ```
  item.novedades = [
    { tipo: "Faltante", cantidad: 3, nota: "" },
    { tipo: "Agregado", cantidad: 2, nota: "entregar mañana" }  // nota obligatoria
  ]
  ```
  Omitir el campo si no hay ninguna.

### Tabla "Novedades por Chofer"
- Consultable **después de cerrar la sesión de despacho**.
- **Una fila por cada novedad** registrada (si un producto tiene 2 tipos activos → 2 filas).
- Columnas: **Fecha | Chofer | Producto | Tipo | Cantidad | Nota**.
- **Filtrable por fecha y por chofer.**

---

# PARTE B — Reporte de Despacho del día

General del día de despacho, **no ligado a chofer ni a un producto de un chofer**.

### Alcance y tipos
- Sección **separada**, **una sola vez por día de despacho** (no por chofer).
- Tipos:
  1. **Sobrante de despacho**
  2. **Dañados de despacho**
  3. **Pendientes**
  4. **Agotado**
  5. **Notas** (texto libre general, **sin tipo asociado**)
- Para cada entrada: **producto (opcional)**, **cantidad (opcional)**, **nota (opcional)**.

### Comportamiento por día ("pizarra del día")
- Cada **día nuevo de despacho**, la vista de novedades generales aparece **vacía/en blanco** para empezar de cero.
- Los **días anteriores quedan guardados** y se pueden consultar después **filtrando por fecha**.
- Es decir: la vista se **limpia visualmente cada día**, mientras el **historial completo permanece accesible** hacia atrás.

### Tabla "Reporte de Despacho"
- **Una fila por entrada.**
- Columnas: **Fecha | Tipo | Producto | Cantidad | Nota**.
- Consultable **por fecha**, **independiente** de la tabla de Novedades por Chofer.

---

## Criterio de listo

**Parte A**
- Todos los productos de la lista del chofer muestran el botón "Novedades": gris apagado sin novedad; color llamativo fijo (sin parpadeo) con ≥1 activa.
- Modal con los 3 tipos independientes y no excluyentes; al activar cada uno aparecen Cantidad y Nota (Nota obligatoria solo en "Agregado").
- Fila con sombreado fijo si tiene novedades; normal si no.
- Al guardar la lista, las novedades (tipo+cantidad+nota) quedan en el registro del historial, asociadas al producto correcto, y sobreviven a recargar.
- Tabla "Novedades por Chofer" con columnas Fecha | Chofer | Producto | Tipo | Cantidad | Nota; una fila por novedad; filtrable por fecha y chofer.

**Parte B**
- Sección de Reporte de Despacho del día, una sola vez por día, con los 5 tipos (Notas sin tipo asociado) y campos producto/cantidad/nota opcionales.
- La vista se limpia visualmente cada nuevo día; los días anteriores se consultan filtrando por fecha.
- Tabla "Reporte de Despacho" con columnas Fecha | Tipo | Producto | Cantidad | Nota; una fila por entrada; consultable por fecha e independiente de la tabla de Parte A.

**Global**
- No se altera el dictado, el auto-avance, el FAB minimizar, ni el patrón de pronunciación.
