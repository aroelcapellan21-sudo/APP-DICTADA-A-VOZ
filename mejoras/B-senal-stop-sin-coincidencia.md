# Mejora B — Señal 🛑 para productos sin coincidencia en el Patrón

**Tipo:** feature (UX informativa, no bloqueante).
**Estado:** pendiente.

## Objetivo
En la **pantalla principal** (la lista de productos que se va a dictar / asignar al chofer), marcar con un **🛑 informativo (NO bloqueante)** cada producto que **no tiene coincidencia en el Patrón**. Sirve para que el usuario sepa de un vistazo cuáles productos la app no reconoció contra su Patrón.

## Requisitos exactos (acordados con el usuario)
1. El 🛑 aparece **sin importar el origen** de la info de productos: factura escaneada por **cámara**, **archivo subido**, o **lista manual** — las tres deben mostrar el 🛑 igual si el producto no coincide con el Patrón.
2. Es **informativo, no bloqueante** (a diferencia de la franja roja de validación post-OCR de la Sección 3, que sí bloquea Guardar). El 🛑 no impide avanzar.
3. Debe ser **editable desde la pantalla de asignación al chofer** — es decir, el usuario puede corregir/ajustar ahí mismo (p.ej. corregir el nombre para que matchee, o asignarlo).

## Definición de "sin coincidencia"
Un producto **no coincide** si su `nombre` no machea ningún producto del Patrón. Hoy el match es exacto por nombre (case-insensitive) — ver `vozDe()`/`ordenarPorPatron()`. Coordinar con mejora **A** (orden) y **D** (autocompletado): idealmente usar la MISMA función de match/normalización en los tres lugares. Conviene crear un helper único, p.ej. `coincideEnPatron(nombre)` → bool, y reutilizarlo.

## Qué hacer
1. Crear el helper de match único `coincideEnPatron(nombre)` (normalización a acordar con mejora A).
2. En el render de la lista principal (productos a dictar/asignar), si un item no coincide, mostrar 🛑 junto al nombre (no romper el layout existente con numeración/checks de `#item-list`).
3. Mostrarlo en los **tres orígenes**: factura (`renderEditAntes` / `#item-list`), manual (`renderManList`), archivo (mismo camino que cámara → `analizar()`).
4. En la **pantalla de asignación al chofer**, permitir editar el item marcado (nombre/categoría) para resolver la falta de coincidencia.

## Funciones/archivos clave (`index.html`)
`renderItemList()`, `renderEditAntes()`, `renderManList()`, la tarjeta de asignación (`#asig-card`, `chofer-sel`), `vozDe()`/`ordenarPorPatron()` (lógica de match), `patron[]`.

## Criterio de aceptación
Un producto que no está en el Patrón muestra 🛑 en las tres fuentes (cámara/archivo/manual), no bloquea el flujo, y puede corregirse desde la asignación al chofer; al corregirlo para que coincida, el 🛑 desaparece.
