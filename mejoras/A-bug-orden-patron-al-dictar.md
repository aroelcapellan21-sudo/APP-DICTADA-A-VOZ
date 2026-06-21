# Mejora A — Bug: el orden del Patrón no siempre se respeta al dictar

**Tipo:** bug a diagnosticar.
**Estado:** pendiente (sin diagnosticar a fondo).

## Contexto
La app dicta listas de productos. El **orden de lectura debe salir siempre del Patrón**, nunca del orden en que los productos aparecen en la factura escaneada. El Patrón define:
- El orden **entre categorías** = orden de la lista `bon_categorias` (array `categorias`).
- El orden **dentro de cada categoría** = campo `orden` (entero) de cada producto del Patrón.

La función que debería garantizar esto es `patronOrdenado()` (ordena el Patrón por `(índice de categoría en 'categorias', orden)`), y `ordenarPorPatron(items)` la usa para reordenar los items de una factura matcheando por **nombre** (case-insensitive).

## Síntoma reportado
Al dictar, el orden del Patrón **no siempre se respeta**.

## Hipótesis a revisar (diagnóstico)
1. **Match por nombre falla por variantes:** `ordenarPorPatron` matchea `it.nombre.toLowerCase() === p.nombre.toLowerCase()` (exacto). Si la factura trae "PALETA COCO 70ML" y el Patrón "Paleta Coco", **no machean** → el item cae al final (los no-encontrados se anexan al final en orden de factura). Esto rompe el orden. Ver también mejora **B** (señal 🛑) y **D** (autocompletado).
2. **Items con mismo nombre / duplicados:** `ord.includes(f)` evita duplicar referencias, pero si hay dos items de factura con el mismo nombre, solo uno machea.
3. **`agruparPorCategoria`** (modo categoría) se aplica DESPUÉS de `ordenarPorPatron` en `iniciarDictado`; verificar que no reordene de forma inconsistente cuando hay categorías no presentes en `categorias`.
4. **Camino de entrada al dictado:** confirmar que TODAS las entradas al dictado pasan por `ordenarPorPatron`/`patronOrdenado` (escuchar lista desde despacho/historial, "usar patrón", etc.). Una lista guardada se dicta desde `listas[i].items` (orden ya fijado al guardar) — revisar si el orden del Patrón se aplica al guardar o al dictar.

## Qué hacer
1. Reproducir con una factura cuyos nombres NO sean idénticos a los del Patrón y confirmar si el problema es el match exacto.
2. Decidir con el usuario la estrategia de match tolerante (normalización: minúsculas, sin acentos, sin códigos `NN/N`, sin sufijos tipo "70ML") — coordinar con mejora **D**.
3. Asegurar que el orden del Patrón se aplique en el momento de DICTAR (no solo al guardar), por si el Patrón cambió después de guardar la lista.

## Funciones/archivos clave (`index.html`)
`patronOrdenado()`, `ordenarPorPatron()`, `agruparPorCategoria()`, `iniciarDictado()`, `renderItemList()`, y el guardado `guardarListaFinal()`.

## Criterio de aceptación
Dada una factura con productos que existen en el Patrón (aunque el texto difiera en variantes acordadas), el dictado los lee en el **orden exacto del Patrón** (categorías y `orden`), y los no-coincidentes quedan claramente identificados (mejora B) sin desordenar a los demás.
