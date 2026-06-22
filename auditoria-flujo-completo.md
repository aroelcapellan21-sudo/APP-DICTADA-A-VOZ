# Plan — Auto-enriquecimiento del catálogo con cada factura

> Plan en modo **solo lectura / sin tocar código**. Pendiente de aprobación del
> usuario antes de implementar.
> Fecha: 2026-06-22 · Rama: `main`
>
> Regla fija del usuario aplicada aquí: *"Antes de tocar código, muéstrame el plan
> y confirma que esto no afecta el Patrón, las categorías, ni nada de lo que ya
> funciona."*

## Objetivo

El catálogo de productos (Ajustes → Catálogo) debe enriquecerse **automáticamente**
con cada factura escaneada, igual que ya hace el diccionario. Cada nombre nuevo
detectado en una factura real debe agregarse al catálogo si no existe ya, para que
los desplegables de **lista manual** y **agregar producto** se mantengan
actualizados solos, sin escribirlos a mano.

## Plan propuesto

### Dónde y cuándo

- Nueva función `enriquecerCatalogo(items)`.
- Se llama dentro de `guardarListaFinal` (`index.html:1198-1227`), **después de
  `saveListas()`** (línea 1216) y **antes del reset** de `allItems` (línea 1222),
  cuando los productos ya están revisados y validados (el guardado está bloqueado
  si hay anomalías, `index.html:1164`). Así solo entran nombres que pasaron la
  revisión del usuario, no basura cruda del OCR.
- Por `guardarListaFinal` pasan **todas** las listas que se guardan (escaneadas y
  manuales), así que el enganche cubre ambos orígenes.

### Qué hace `enriquecerCatalogo`

1. Recorre los items de la lista recién guardada.
2. Para cada nombre, calcula `normNombre` (la **misma** normalización que usan el
   Patrón y el diccionario: minúsculas, sin acentos ni puntuación).
3. Si **no existe** ya en `catalogo` un producto con ese nombre normalizado →
   agrega `{c: item.categoria, n: item.nombre}`.
   - La **categoría** es la que el item ya trae (`categoriaDesdePatron` → categoría
     del Patrón si coincide, o `'Otros'`). No se inventa nada nuevo.
   - Dedup también dentro de la misma factura (si un nombre se repite, se agrega
     una sola vez).
4. Si agregó al menos uno: `localStorage.setItem('bon_cat', …)` y refresca los
   desplegables (`poblarManCat`, `poblarApCat`) y `renderCatalogo`.

### Resultado

Los desplegables "— Selecciona —" de **lista manual** (`m-prod`) y **agregar
producto** (`ap-prod`), que se llenan filtrando `catalogo` por categoría
(`index.html:1700, 1762`), se mantienen al día solos: cada producto nuevo de una
factura real aparece bajo su categoría sin escribirlo a mano.

## Confirmación de que NO afecta lo que ya funciona

| Componente | ¿Se toca? | Por qué |
|---|---|---|
| **Patrón** (`bon_pat`: orden, texto_voz, arrastre) | **NO** | Solo se escribe en `bon_cat`. |
| **Categorías** (`bon_categorias`) | **NO** | Se guarda la categoría *como texto* en la entrada del catálogo; no se crean ni modifican categorías. |
| **Historial** (`listas`) | **NO** | Se *leen* los items recién guardados; no se modifica ningún registro. La factura guardada sigue fiel. |
| **Dictado / orden** (`ordenarPorPatron`) | **NO** | El dictado sigue derivando todo del Patrón; el catálogo no interviene en la lectura. |
| **Migración de los 14** | **NO** | Independiente; los nombres nuevos no son seeds y la bandera ya está puesta. |
| **Diccionario** (`construirDiccionarioNombres`) | Efecto neutro | Ya leía `catalogo` (peso 1). Reforzar un nombre que además viene de `listas` (peso 2) no cambia nada perceptible. |

## Riesgos y mitigación

- **Nombre raro pero válido que entre al catálogo:** solo ocurre tras la revisión
  del usuario (el guardado exige líneas sin anomalías), y siempre se puede borrar
  en Ajustes → Catálogo (la ✕ ya existe, `delProd`).
- **Cambio futuro de categoría en el Patrón:** la entrada del catálogo conserva la
  categoría con que se guardó (el catálogo es solo sugerencia para los
  desplegables; **no** influye en el dictado, que siempre usa el Patrón).

## Tres decisiones pendientes antes de tocar código

1. **Alcance:** enganchar en `guardarListaFinal` cubre **escaneadas y manuales**
   (lo más simple; en manuales casi siempre el nombre ya está en el catálogo, así
   que es no-op). ¿Sirve así, o **solo escaneadas**? (esto último necesita añadir
   una marca de origen a la lista, algo más de trabajo).
2. **Dedup:** ¿por **nombre normalizado en todo el catálogo** (recomendado: nunca
   duplica el mismo producto), o por **nombre+categoría** (permitiría el mismo
   nombre en dos categorías distintas)?
3. **Categoría a asignar:** la del item al guardar (Patrón o `'Otros'`).
   ¿Confirmado?
