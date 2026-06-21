# Mejora E — Panel de dictado a pantalla completa

**Tipo:** feature (UX).
**Estado:** pendiente.

## Objetivo
Que la pantalla de **dictado** se pueda ver a **pantalla completa**, maximizando el área útil para leer el producto actual a distancia mientras se trabaja en el freezer/almacén.

## Contexto del código actual
- El dictado es un **modal overlay** (`#m-dictado`, `.mov`), no una página. Se abre con `abrirMov('m-dictado')` y `iniciarDictado()`.
- Ya existe **minimizar/maximizar** con un FAB (`minimizarDictado`/`maximizarDictado`, botón `#btn-min-dictado`, FAB `#fab-dictado`).
- Elementos de la vista: `#cur-cat`, `#cur-prod` (nombre grande, rojo), `#cur-qty`, `#cur-count`, barra de progreso `#prog-bar`, controles `#btn-prev/#btn-pausa/#btn-next`, lista `#item-list`, estado auto-avance `#aa-estado`.

## Qué hacer (a definir con el usuario)
- Un modo "pantalla completa" del dictado: ocultar cromo (header, barra de navegación inferior fija `.mnav`), agrandar `#cur-prod`/`#cur-qty` al máximo, y dejar solo lo esencial (producto actual + Anterior/Pausa/Siguiente + progreso).
- Posiblemente usar la **Fullscreen API** (`element.requestFullscreen()`), o simplemente un layout CSS fullscreen (position:fixed; inset:0; ocultar nav).
- Botón para entrar/salir de pantalla completa dentro del modal de dictado.

## Relación con otras mejoras
- **F** (números de cantidad más grandes) es complementaria: ambas buscan legibilidad a distancia.

## Criterio de aceptación
Durante el dictado, el usuario puede activar un modo a pantalla completa donde el producto actual y la cantidad se ven mucho más grandes, sin la barra de navegación ni el header, y puede volver al modo normal.
