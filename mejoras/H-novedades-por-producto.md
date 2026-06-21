# Mejora H — Novedades por producto (en la lista del chofer)

**Tipo:** feature nueva.
**Estado:** pendiente (solo documentado).
**Regla:** agregar, **no alterar** la lógica existente del dictado ni del patrón de pronunciación.

## Contexto / motivo
Cuando se está **escuchando/llamando la lista de un chofer producto por producto**, el operario necesita registrar **novedades** por cada producto (faltantes, dañados, sobrantes, etc.) en el momento, asociadas a ese producto específico de esa factura/lista — para reportar incidencias del despacho sin perder el detalle de a qué producto corresponden.

## Archivo afectado
`index.html` (todo el front es un solo archivo). Superficies candidatas (CONFIRMAR cuál antes de implementar, ver más abajo):
- **Dictado / lista del chofer producto-por-producto:** `#item-list` renderizado por `renderItemList(items)` dentro del modal `#m-dictado` (muestra el banner del chofer `#ch-banner`). Es lo que el usuario describe como "escuchando/llamando producto por producto".
- **Panel de edición de la lista del chofer:** `renderPanelEditList(items, listaId)` (usa `activoListaId`).

Almacenamiento: las listas viven en `listas[]` (localStorage `bon_listas`); cada `listas[i].items[j]` es `{categoria, nombre, cantidad}`. Durante el dictado se trabaja sobre una **copia** (`allItems = [...l.items]`), así que para persistir hay que escribir en el item real de `listas` y llamar `saveListas()`.

## ⚠️ Pre-implementación: confirmar con el usuario
1. **¿En qué superficie va el botón "Novedades"?** ¿En la lista del **dictado** (`#item-list`/`renderItemList`), en el **panel de edición** de la lista del chofer (`renderPanelEditList`), o en **ambas**?
2. **Persistencia durante el dictado:** como el dictado usa `allItems` (copia), confirmar que las novedades se escriben de vuelta en `listas[i].items[j]` (match por índice/nombre) + `saveListas()`, para que queden guardadas en la factura/lista del chofer.

## Comportamiento esperado

### Botón "Novedades" por producto
- Cada producto de la lista del chofer tiene un botón **"Novedades"**.
- Si el producto tiene **al menos una novedad activa** → el botón **parpadea** (animación intermitente) para llamar la atención.
- Si **no tiene ninguna** novedad activa → botón **gris/normal**, sin parpadear.

### Modal de novedades
- Al tocar el botón se abre un **modal** con **8 tipos** de novedad, cada uno como su propio botón dentro del modal:
  1. Faltante
  2. Dañados
  3. Sobrantes
  4. Pendientes
  5. Entradas
  6. Agotado
  7. Retirados por
  8. Retirados para

### Comportamiento de cada botón de tipo
- Al tocar un tipo se **activa/desactiva (toggle)** para ese producto.
- Si está **activo** → parpadea igual que el botón principal; si no → gris.
- Un producto puede tener **varias novedades activas a la vez** (ej: Faltante **y** Dañados). **No es excluyente.**

### Nota opcional
- Cada tipo activado puede llevar una **nota de texto libre opcional** (ej. en "Retirados por" anotar quién se lo llevó).
- La nota **no es obligatoria** para activar el tipo.

### Botón visible en todos, info guardada solo en los que tienen novedad
- **Todos** los productos de la lista muestran el botón "Novedades" (no se oculta en ninguno).
- Pero **solo los productos que tengan al menos una novedad activa guardan información adicional**; el resto no persiste nada extra (ver Almacenamiento).

### Consulta desde guardados (revisar la lista después)
- Al **consultar la lista desde guardados** (la factura/lista del chofer ya almacenada), **cada producto muestra su propia información en su lugar**: las novedades y notas que se le marcaron aparecen junto a ese producto y solo ese, sin mezclarse con los demás.
- Un producto sin novedades se ve normal (botón gris, sin info extra) también al consultarlo desde guardados.

### Almacenamiento
- Las novedades y sus notas se guardan **asociadas específicamente a ese producto dentro de esa lista/factura del chofer** — no a la lista completa ni a otros productos.
- Si el producto **no tuvo ninguna novedad** marcada, **no se guarda nada extra** para él.
- Estructura sugerida (a confirmar): en el item de la lista, un campo opcional `novedades` solo cuando hay alguna, p.ej.:
  ```
  item.novedades = {
    "Faltante": { activo: true, nota: "" },
    "Retirados por": { activo: true, nota: "Juan" }
  }
  ```
  (o un array de `{tipo, nota}`). Omitir el campo si no hay ninguna activa.

## Criterio de listo
- **Todos** los productos de la lista del chofer muestran el botón "Novedades"; parpadea si tiene ≥1 novedad activa, gris si no.
- Solo los productos con ≥1 novedad activa guardan información adicional; los demás no persisten nada extra.
- Al consultar la lista desde guardados, cada producto muestra **su propia** información (novedades/notas) en su lugar, sin mezclarse con otros productos.
- El modal permite activar/desactivar los 8 tipos de forma independiente (varios a la vez), con nota opcional por tipo.
- Las novedades y notas se persisten en el producto correcto de esa lista (`listas[...]`) y sobreviven a recargar; un producto sin novedades no guarda nada extra.
- No se altera el dictado, el auto-avance, ni el patrón de pronunciación.
