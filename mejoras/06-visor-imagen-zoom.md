# Sección 6 — Visor de imagen escaneada

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ❌ PENDIENTE — no implementado.**

## Contenido original

- Pellizcar para zoom (**pinch-to-zoom**).
- Arrastrar para mover (**pan**).
- **Descartado:** girar y recortar (sobre-alcance; el caso de uso es leer esquinas cortadas, no editar la foto).

## Contexto del código
- La imagen capturada se guarda en `capUrl` y se muestra en `#cap-img`.
- Implementar con pointer events (gestos táctiles), sin librería externa: 2 punteros = pinch (escala), 1 puntero = pan (translate). Aplicar `transform: scale() translate()` a la imagen.
