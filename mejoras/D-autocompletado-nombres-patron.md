# Mejora D — Autocompletado de nombres (facturas) + sugerencia de categoría

**Tipo:** feature.
**Estado:** ✅ implementada y confirmada en dispositivo (Xiaomi, LAN).

## Objetivo
1. Al escribir/crear un producto (Patrón, modal "Agregar producto" y "Crear lista manual"), ofrecer **autocompletado de nombres** a partir de los **productos que ya aparecieron en facturas escaneadas** (historial real), para que el nombre coincida con cómo viene escrito en las facturas — y así mejorar el match (ver mejoras **A** y **B**).
2. En **"Crear lista manual"**, cuando el nombre tecleado coincide con un producto del **Patrón**, **sugerir** su categoría (auto-seleccionar el `select` de categoría). La sugerencia **no es forzada**: solo ocurre cuando hay coincidencia y el usuario puede cambiarla antes de agregar.

## Por qué
El match Patrón↔factura es por nombre. Si el usuario tipea el nombre distinto a como llega en la factura, no machea. Autocompletar desde nombres reales de factura reduce esa discrepancia. Y al cargar a mano, sugerir la categoría del Patrón evita inconsistencias de categoría que rompen el orden de lectura.

## Fuente de datos
- Listas guardadas: `listas[]` (localStorage `bon_listas`); cada `listas[i].items[]` tiene `{categoria, nombre, cantidad}` con el **nombre tal cual vino de la factura** (fuente primaria, con frecuencia).
- Catálogo (`catalogo[]`, `bon_cat`, `{n,c}`) como fuente secundaria.
- Patrón (`patron[]`, `{categoria,nombre,...}`) para la sugerencia de categoría.
- Normalización: se reutiliza `normNombre()` (minúsculas + sin acentos + alfanumérico).

## Qué hacer
1. **Diccionario de nombres** (`construirDiccionarioNombres()`): índice de nombres únicos vistos en `listas` (primario) + `catalogo` (secundario), dedup por `normNombre`, conservando la forma más frecuente, con frecuencia y categorías asociadas; ordenado por frecuencia desc.
2. **Índice del Patrón** (`indicePatronPorNombre()`): `Map(normNombre → categoría)` para la sugerencia.
3. **Datalist nativo** (`dl-man`, `dl-ap`, `dl-pat`) enlazado a los inputs `m-nm`, `ap-nm` y `.pn`. Helper `poblarDatalist(id, catPrioritaria)` que pone primero los nombres de la categoría en contexto y luego el resto por frecuencia. Se repobla: `dl-man` al abrir el modal y al cambiar `m-cat`; `dl-ap` al abrir y al cambiar `ap-cat`; `dl-pat` en `focusin` de cada `.pn`.
4. **Sugerencia de categoría en lista manual**: en `m-nm`, al cambiar el valor, si coincide con el Patrón se fija `m-cat` a esa categoría (modificable) y se refresca `m-prod`.

## Funciones/archivos clave (`index.html`)
`renderPatron()` (input `.pn`), modal `m-add-prod` (`poblarApProd`, `ap-nm`/`ap-cat`), modal `m-manual` (`poblarManCat`/`poblarManProd`, `m-nm`/`m-cat`), `normNombre()`, `listas[]`, `catalogo[]`, `patron[]`.

## Criterio de aceptación
- Al escribir un nombre en cualquiera de los tres inputs, el usuario ve sugerencias tomadas de facturas reales (priorizadas por la categoría en contexto) y, al aceptarlas, el nombre coincide con el de las facturas.
- En "Crear lista manual", al teclear un nombre que existe en el Patrón, la categoría se auto-sugiere (sin forzar) con la del Patrón.
