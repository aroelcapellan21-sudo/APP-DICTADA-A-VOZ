# Mejora G — Extender la confianza por campo también al NOMBRE del producto

**Tipo:** feature (extiende la validación post-OCR existente).
**Estado:** pendiente.

## Contexto
Ya está implementada la **validación por confianza del OCR** (ver Sección 3 / `03-flujo-captura-validacion.md`). El backend (`api/index.js`, prompts de Gemini y Claude) devuelve por cada línea de factura:
- `cantidad`, `precio`, `total`
- Nivel de confianza por campo numérico: `conf_cantidad`, `conf_precio`, `conf_total` (valores `alto`/`medio`/`bajo`).

En el front (`validarItem` en `index.html`), si algún campo viene `medio`/`bajo`, o si `precio×cantidad ≠ total`, la línea se marca con **franja roja** y bloquea Guardar hasta corregir.

## Objetivo
Extender la confianza también al **nombre del producto**: agregar `conf_nombre` (`alto`/`medio`/`bajo`). Si la IA no está segura de haber leído bien el nombre (borroso, ambiguo), debe declararlo, y esa línea se marca igual que las demás (franja roja, editable) para que el usuario revise el nombre antes de que pase al dictado/chofer.

## Por qué importa
El nombre es la clave del match con el Patrón (mejoras A/B/D). Un nombre mal leído rompe el orden y el reconocimiento. Hoy solo se valida la parte numérica; el nombre puede venir mal sin alerta.

## Qué hacer
1. **Backend (`api/index.js`):** agregar `conf_nombre` al JSON pedido en los prompts de Gemini y Claude, con la misma regla de "no adivines: si está borroso, baja la confianza".
2. **Front (`validarItem`):** incluir `conf_nombre` en el chequeo de confianza (medio/bajo → anomalía). Reusar el bucle existente que ya recorre `['cantidad','precio','total']` → agregar `'nombre'`.
3. Asegurar que al **editar el nombre** en la fila (que ya marca `it.revisado=true`), la anomalía por `conf_nombre` se limpie igual que las otras.

## Funciones/archivos clave
- `api/index.js`: prompts de `analizarGemini` y `analizarClaude` (el JSON de ejemplo y la "REGLA CRÍTICA" de confianza).
- `index.html`: `validarItem()` (el bucle `for(const c of ['cantidad','precio','total'])`), `renderEditAntes()` (inputs editables + `it.revisado`).

## Criterio de aceptación
El OCR devuelve `conf_nombre`; una línea con nombre de baja confianza se marca en rojo y bloquea Guardar; al corregir/confirmar el nombre, la fila pasa a ✅. No rompe la validación numérica ya existente.
