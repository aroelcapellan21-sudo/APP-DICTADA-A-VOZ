# Sección 10 — Barra de voz reactiva al micrófono

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ❌ PENDIENTE — prioridad más baja.**

## Contenido original

**Prioridad más baja.** Es cosmético — no reduce errores ni acelera el trabajo. Implementar **solo si todo lo demás está resuelto y queda tiempo disponible**.

Una barra/indicador visual que reaccione al nivel del micrófono durante el reconocimiento de voz.

## Contexto del código
- Reconocimiento de voz: `startVoice()` / `recognition` (Web Speech API). Para nivel de audio real se necesitaría `getUserMedia` + `AnalyserNode` (Web Audio) — separado del `SpeechRecognition`.
