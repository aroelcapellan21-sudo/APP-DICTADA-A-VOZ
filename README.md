# BON — Lector de Facturas (Polar Breeze)

**Producción:** https://app-dictada-a-voz.vercel.app

PWA para leer facturas de helados BON con IA (Gemini o Claude). El frontend
está en `index.html` y un backend Express hace de **proxy** hacia las APIs de
Gemini y Claude, lo que evita los problemas de CORS de Claude y mantiene las
API keys ocultas en el servidor.

## Estructura

```
index.html        Frontend (PWA de una sola página)
sw.js             Service worker (offline / instalación)
api/index.js      Backend Express (Serverless Function en Vercel)
server.js         Servidor para desarrollo local
vercel.json       Enruta /api/* hacia la función Express
.env.example      Plantilla de variables de entorno
```

## Variables de entorno

| Variable          | Descripción                                        |
| ----------------- | -------------------------------------------------- |
| `GEMINI_API_KEY`  | API key de Google Gemini (`AIza...`)               |
| `CLAUDE_API_KEY`  | API key de Anthropic Claude (`sk-ant-...`)         |

Solo necesitas la del proveedor que uses; puedes configurar ambas.

## Desarrollo local

```bash
npm install
cp .env.example .env      # y rellena las keys
npm run dev               # http://localhost:3000
```

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En Vercel: **Add New → Project** e importa el repo (igual que Polar Breeze Hub).
3. Framework Preset: **Other** (no hace falta build).
4. En **Settings → Environment Variables** añade `GEMINI_API_KEY` y/o
   `CLAUDE_API_KEY` (entornos Production y Preview).
5. **Deploy**.

Vercel sirve `index.html` como estático y `api/index.js` como Serverless
Function; `vercel.json` reenvía todas las rutas `/api/*` a esa función.

Comprobación rápida tras desplegar:
`https://app-dictada-a-voz.vercel.app/api/health` debe devolver
`{"ok":true,"gemini":true,"claude":...}`.

## Notas

- Modelos usados: `gemini-2.5-flash` y `claude-sonnet-4-6` (ambos con visión).
- Las imágenes se comprimen en el navegador antes de enviarse para no superar
  el límite de ~4.5 MB del cuerpo de las funciones de Vercel.
