# Sección 1 — Arquitectura de datos del Patrón (fuente de verdad única)

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ✅ MAYORMENTE IMPLEMENTADO.**
- Campos `categoria`, `nombre`, `cantidad`, `texto_voz`, `orden` viven en cada producto del Patrón (`localStorage` `bon_pat`).
- `texto_voz`: campo manual, opcional, resuelto al hablar vía `vozDe()` (lookup por nombre). **La sugerencia automática fue DESCARTADA por el usuario** — se escribe a mano.
- `orden`: entero dentro de la categoría; lectura por `patronOrdenado()` = (orden de categoría según lista `bon_categorias`, luego `orden`). Migración automática (`migrarOrdenPatron`).
- Dos arrastres separados: ⠿ reordena dentro (campo `orden`), ⇄ mueve entre categorías (campo `categoria`) e inserta en posición exacta (`moverACategoriaEnPos`).
- **Pendiente relacionado:** el arrastre ⇄ es intermitente (ver mejora **C**).

## Contenido original

Cada producto en el Patrón debe tener estos campos: `categoria`, `orden`, `texto_voz` (más nombre/cantidad).

Reglas:
- El Patrón es la **única fuente de verdad**. La factura nunca lo modifica, solo lo consulta.
- El campo `orden` es independiente del orden en que los productos aparezcan en la factura escaneada. El lector **siempre sigue el orden del Patrón**.
- El campo `texto_voz` se llena **una sola vez** al crear el producto — nunca se vuelve a pedir por cada factura nueva. Una vez fijado, queda permanente.
- Sugerencia automática de `texto_voz`: al crear un producto nuevo, la app propone un acortamiento quitando la palabra implícita en la categoría (ej. categoría "Paletas" + nombre "Fudge Chocolate" → sugiere "Chocolate"). El usuario acepta o corrige. Solo ocurre al crear. **(NOTA: el usuario decidió NO usar sugerencia automática; entrada manual.)**

Dos tipos de arrastre (drag) con efectos distintos:
- Arrastrar **entre categorías** → reasigna el campo `categoria`.
- Arrastrar **dentro de una categoría** → reasigna el campo `orden`.
- Implementar como interacciones separadas, no genéricas.

## Funciones clave en el código
`patronOrdenado()`, `migrarOrdenPatron()`, `reordenarDentro()`, `moverACategoriaEnPos()`, `normalizarOrden()`, `vozDe()`, `renderPatron()`, motor de arrastre (`arrancarArrastre`/`moverArrastre`/`evaluarObjetivo`/`soltarArrastre`).
