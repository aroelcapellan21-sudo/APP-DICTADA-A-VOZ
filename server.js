// Servidor local para desarrollo (no se usa en Vercel).
// Reutiliza la misma app Express del backend y además sirve los
// archivos estáticos (index.html, sw.js) desde la raíz del proyecto.
//
//   npm run dev
//   -> http://localhost:3000

// Carga el .env local si existe (Node 20.12+). En Vercel no hace falta:
// las variables se inyectan desde Project Settings.
try { process.loadEnvFile(); } catch { /* sin .env: se usan las vars del entorno */ }

const express = require('express');
const app = require('./api/index.js');

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor local en http://localhost:${PORT}`);
});
