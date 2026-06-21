# Sección 9 — Seguridad del Patrón

> Del informe `informe-mejoras-lector-facturas.md`.

**Estado (2026-06-21): ✅ IMPLEMENTADO.** La verificación de la contraseña pasó
al servidor; se eliminó la comparación en el cliente y el default `'2024'`.

## Comportamiento

- **Candado en el botón 📝 del header** (`pedirClavePatron()`): cada entrada al
  tab del Patrón pide la contraseña, sin excepción. Igual para ⚙️ Ajustes
  (`pedirAjustes()`) y para crear una 2ª lista del mismo chofer.
- Una sola contraseña fija, compartida por las tres puertas. Sin usuarios ni login.
- **Con conexión:** siempre se verifica contra el servidor (`POST /api/verify-clave`).
  Si es correcta, se entra y se **renueva la marca de sesión** local.
- **Sin conexión (o servidor inalcanzable):** respaldo de **sesión de 8 h**. Si la
  última verificación exitosa fue hace < 8 h, se entra; si expiró o nunca se
  verificó online, queda bloqueado hasta reconectar. No se pide clave offline
  porque no se puede comparar sin servidor.
- La marca de sesión (`bon_clave_sess` en localStorage) es **solo un timestamp**,
  nunca la contraseña.

## Seguridad

- La contraseña vive **solo** como variable de entorno **`PATRON_PASSWORD`**
  (Vercel / `.env` local). Nunca está escrita en el front-end.
- La comparación ocurre en el servidor (`api/index.js`) en tiempo constante
  (`crypto.timingSafeEqual`). Respuestas: `200 {ok:true}`, `401 {ok:false}`,
  `500` si falta la env var.
- **Limitación conocida (alcance acordado):** el contenido del Patrón se
  renderiza en el cliente desde localStorage, así que un usuario técnico con
  DevTools podría saltar la pantalla de clave. Protección total exigiría servir
  el Patrón desde el backend (rework mayor, fuera de alcance).

## Cambios realizados

- `api/index.js`: endpoint `POST /api/verify-clave` + `claveCorrecta()`; `patron`
  añadido a `/api/health`.
- `index.html`: helpers `verificarClave()`, `marcarSesion()`/`sesionVigente()`,
  puerta reutilizable `pedirClave(titulo,onOk)`; migradas las 3 puertas; el botón
  📝 llama `pedirClavePatron()`; eliminado `ajPwd`/`'2024'`. El bloque "Cambiar
  contraseña" se reemplazó por una nota (la clave se gestiona en Vercel).
- `.env.example`: añadida `PATRON_PASSWORD`.

## Acción de despliegue

- Configurar `PATRON_PASSWORD` en **Vercel** (Project Settings → Environment
  Variables) y en el `.env` local para `npm run dev`. Sin ella, no se entra a
  Patrón/Ajustes (el endpoint responde 500).
