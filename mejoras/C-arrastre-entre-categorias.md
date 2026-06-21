# Mejora C — Arrastre ⇄ entre categorías (intermitente)

**Tipo:** bug en curso + feature.
**Estado:** parcialmente resuelto / intermitente. Hay un **panel de diagnóstico implementado**; **pendiente el registro automático de intentos**.

## Contexto del Patrón y sus gestos
El Patrón (`renderPatron`) muestra los productos **agrupados por categoría**. Cada fila tiene dos manijas de arrastre táctil (pointer events):
- **⠿ (`.pat-grip-row`)** → reordenar el producto **dentro** de su categoría (reasigna `orden`). **Funciona bien.**
- **⇄ (`.pat-grip-move`)** → **mover el producto a otra categoría** e insertarlo en la **posición exacta** elegida (reasigna `categoria` + `orden`, vía `moverACategoriaEnPos`). **Intermitente/falla.**
- El **encabezado** de categoría tiene **⠿ (`.pat-cat-grip`)** para reordenar las categorías entre sí.

Motor de arrastre: `arrancarArrastre()` (captura el puntero con `setPointerCapture`, crea un "ghost" flotante), `moverArrastre()` → `evaluarObjetivo(x,y)` (detecta destino y resalta), `soltarArrastre()` (aplica), `cerrarArrastre()` (limpia), más `cancelarArrastre()` (pointercancel) y **auto-scroll** (`calcularAutoScroll`/`loopAutoScroll`).

## Historia del bug (importante para no repetir caminos)
1. El ⇄ no reasignaba: al soltar, el producto volvía a su lugar.
2. Se descartó que sea cache (se probó en **incógnito** y persistía → bug real).
3. Hipótesis de detección: `evaluarObjetivo` para ⇄/categorías usaba **hit-testing** (`document.elementFromPoint`/`elementsFromPoint`), que en el navegador del usuario (Xiaomi) **devolvía null** (no encontraba el `.pat-cat-group`). El gesto ⠿ funciona porque usa **geometría** (`getBoundingClientRect`), no hit-testing.
4. **Fix aplicado:** se reescribió la detección de ⇄ y categorías para usar **geometría** (recorrer los `.pat-cat-group` y elegir aquel cuyo rect contiene la Y del dedo, o el más cercano). Se eliminó `grupoBajo`/`elementsFromPoint`.
5. **Fix aplicado:** drop en posición exacta dentro de la categoría destino (`moverACategoriaEnPos`, con `pDrag.objetivoPos`), no solo "al final".
6. **Síntoma que seguía:** el usuario reportó que con ⇄ "solo se puede intercambiar de lugar en la misma categoría", no mover a otra.
7. **Panel de diagnóstico IMPLEMENTADO** (`dbgDrag()`): un recuadro fijo en pantalla que muestra en vivo, durante el arrastre: `gesto` (row/move/group), categoría `origen`, `DESTINO cat` detectada, `pos`, `rowObj`, `vel` (auto-scroll) y `y`. Sirve para ver si el problema es: (a) gesto equivocado (manijas ⠿/⇄ muy juntas → se toca la que no es), (b) la detección nunca cambia de la categoría origen (geometría no ve otras categorías, p.ej. categoría origen tan grande que su rect cubre todo el viewport y solo el auto-scroll permitiría alcanzar otra), o (c) el auto-scroll no se dispara.

## Pendiente concreto
1. **Registro automático de intentos:** que el panel de diagnóstico **loguee** cada intento de arrastre ⇄ (gesto, origen, destino detectado, si se aplicó o no, vel de scroll), para capturar el comportamiento sin depender de que el usuario lea el recuadro en el momento. Guardar en memoria/array y poder exportarlo (o mostrarlo en una vista).
2. Con esos datos, **cerrar la causa real** del intermitente y arreglarlo definitivamente.
3. **Quitar el panel de diagnóstico** (`dbgDrag` + sus llamadas en `evaluarObjetivo`/`cerrarArrastre` + el helper) una vez resuelto.
4. (Idea de UX que el usuario propuso y luego pausó) Gesto **"mantener y expandir"**: al detenerse 0.6s sobre un encabezado, esa categoría se vuelve el destino activo y se puede soltar en posición exacta dentro de ella — depende de que la detección del encabezado (el azul) funcione de forma confiable.

## Señales visuales ya implementadas
- Encabezado destino se pone **azul** (`.pat-cat-head.drop-head`) cuando la detección lo reconoce (atado a que `objetivoCat` quede seteado).
- Línea verde de inserción (`.pat-row.drop-row`) marca la posición dentro de la categoría destino.

## Criterio de aceptación
Con ⇄ se puede mover un producto de la categoría 1 a la 3 (o cualquiera), aprovechando el auto-scroll para alcanzar categorías fuera de vista, y cae en la posición exacta elegida. El panel de diagnóstico se retira al cerrar el bug.
