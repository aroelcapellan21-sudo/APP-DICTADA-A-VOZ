# Resumen — Trabajo completado el 2026-06-22

> Todo lo de abajo está **implementado, pusheado a `main` y confirmado por el
> usuario en el Xiaomi**, sirviéndose en producción
> (https://app-dictada-a-voz.vercel.app).
> Ninguno de estos cambios toca el Patrón (`bon_pat`), las categorías
> (`bon_categorias`) ni el historial (`listas`).

## 1. Migración del catálogo viejo — commit `2c5a090`

- Instalaciones **nuevas** arrancan con **catálogo vacío** (ya no se siembran los
  14 productos de ejemplo).
- Constante `CATALOGO_SEED` con esos 14 productos, usada solo como referencia.
- **Migración única** con bandera `bon_cat_seed_purgado`: al cargar, quita de
  `bon_cat` solo los **14 pares EXACTOS** (categoría + nombre, con `trim`),
  respetando todo lo demás. No se repite ni vuelve a borrar nombres re-agregados.
- Toca: `bon_cat`, `bon_cat_seed_purgado`. No toca: Patrón, categorías, historial.

## 2. Candado por categoría 🔒/🔓 en el Patrón — commit `2c5a090`

- Botón 🔒/🔓 en la **esquina inferior derecha** de cada encabezado de categoría.
- **Cerrado** bloquea SOLO el arrastre de productos: ⠿ (reordenar dentro) y ⇆
  (mover a otra categoría), tanto para **salir** como para **entrar**.
- Siguen funcionando: el **+** (agregar), la **✕** (borrar) y el reordenar la
  **categoría entera** (⠿ del encabezado).
- Estado en `bon_cat_locks` (helpers `estaBloqueada` / `toggleLock` / `saveLocks`).
  Se propaga al renombrar y al borrar categoría.

## 3. Auto-enriquecimiento del catálogo — commit `b1c5372`

- Al **guardar** una lista (escaneada o manual), `enriquecerCatalogo(allItems)`
  dentro de `guardarListaFinal` agrega a `bon_cat` los **nombres nuevos**.
- Dedup por **nombre normalizado** (`normNombre`), también dentro de la misma
  factura. La **categoría** es la del item (del Patrón o `'Otros'`).
- Refresca los desplegables (`poblarManCat` / `poblarApCat` / `renderCatalogo`),
  así lista manual y agregar producto se mantienen al día solos.
- Solo entran nombres ya revisados (el guardado se bloquea si hay anomalías).

## 4. README con URL real de producción — commit `8b1d80a`

- Reemplazado el placeholder `TU-APP.vercel.app` por
  `https://app-dictada-a-voz.vercel.app` (encabezado y comprobación `/api/health`).

## Verificación de producción

- `/api/health` → `HTTP 200`, `{"ok":true,"gemini":true,"claude":true,"patron":true}`.
- `index.html` en vivo idéntico al local, con las marcas de cada release
  (`CATALOGO_SEED`, `bon_cat_seed_purgado`, `pat-cat-lock`, `catLocks`,
  `enriquecerCatalogo`).
- Las cuatro funciones confirmadas funcionando por el usuario en el Xiaomi.

## Estado

Árbol de trabajo limpio. No quedan tareas pendientes de esta tanda. Pendiente
anterior aún abierto (de sesiones previas): señal 🛑 informativa para productos
sin coincidencia en el Patrón — ver `mejoras/B-senal-stop-sin-coincidencia.md`.
