# Sección 9 — Seguridad del Patrón

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-20): ❌ PENDIENTE.** Hoy existe una clave de Ajustes pero comparada en el cliente (`ajPwd` en JS, default '2024'). Falta mover la verificación al servidor y el candado directo en el botón 📝.

## Contenido original

- Candado de contraseña **directo en el botón 📝** del header (NO anidado dentro de Ajustes).
- Una sola contraseña fija. Sin sistema de usuarios ni login.
- **Crítico:** la contraseña y la API key deben vivir como **variables de entorno en Vercel** (`PATRON_PASSWORD`, `ANTHROPIC_API_KEY`), nunca escritas en el front-end.
- La verificación ocurre en el **servidor** (`server.js` o funciones en `/api`), nunca como comparación visible en JavaScript del cliente.
- Sigue el patrón ya establecido en el proyecto (existe `.env.example`).

## Contexto del código
- Backend: `api/index.js` (ya usa `GEMINI_API_KEY`/`CLAUDE_API_KEY` desde env). Agregar endpoint `/api/verify-patron` que compare contra `PATRON_PASSWORD`.
- Front: el botón 📝 (`navTo('patron')`) debería pedir clave y validar contra el endpoint, no contra `ajPwd` local.
