# Sección 7 — Sonido de transición entre categorías

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ✅ IMPLEMENTADO.** Chime corto (~1.2 s, dos notas) **generado con Web Audio** (sin archivo de audio). Suena al terminar el último producto de la categoría actual, **antes** de anunciar la siguiente. Funciones: `sonarTransicion()`, `ensureAudio()`, integrado en `speakCur()` (modo categoría). Se desbloquea el audio en la primera interacción del usuario (requisito iOS).

## Contenido original

Sonido de mini segundos antes de pasar la próxima categoría, al terminar el último producto de la categoría actual.
