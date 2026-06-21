# Mejora D — Autocompletado de nombres en el Patrón (basado en facturas ya escaneadas)

**Tipo:** feature.
**Estado:** pendiente.

## Objetivo
Al escribir/crear un producto en el **Patrón**, ofrecer **autocompletado de nombres** a partir de los **productos que ya aparecieron en facturas escaneadas** (historial real), para que el nombre del Patrón coincida con cómo viene escrito en las facturas — y así mejorar el match (ver mejoras **A** y **B**).

## Por qué
El match Patrón↔factura es por nombre. Si el usuario tipea el nombre del Patrón distinto a como llega en la factura, no machea. Autocompletar desde nombres reales de factura reduce esa discrepancia.

## Fuente de datos
- Listas guardadas: `listas[]` (localStorage `bon_listas`); cada `listas[i].items[]` tiene `{categoria, nombre, cantidad}` con el **nombre tal cual vino de la factura**.
- También el catálogo (`catalogo[]`, `bon_cat`) como fuente secundaria.

## Qué hacer
1. Construir un índice de nombres únicos vistos en facturas (`listas`) — opcionalmente con frecuencia (los más usados primero).
2. En los inputs de nombre del Patrón (`.pn` en `renderPatron`) y en el modal de agregar al Patrón (`m-add-prod`, `ap-nm`/`ap-prod`), ofrecer sugerencias (datalist o lista desplegable de coincidencias mientras se escribe).
3. Al elegir una sugerencia, se rellena el nombre exactamente como aparece en facturas.

## Funciones/archivos clave (`index.html`)
`renderPatron()` (input `.pn`), modal `m-add-prod` (`poblarApProd`, `ap-nm`), `listas[]`, `catalogo[]`.

## Criterio de aceptación
Al crear/editar un producto en el Patrón, el usuario ve sugerencias de nombres tomadas de facturas reales y, al aceptarlas, el nombre del Patrón coincide con el de las facturas (mejorando el match del dictado).
