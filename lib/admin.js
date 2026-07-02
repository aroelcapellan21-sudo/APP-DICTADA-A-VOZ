// ─── Inicialización de firebase-admin (BON) ───────────────────────────────────
// BON LEE (nunca escribe) las colecciones del ecosistema `reportes_chofer` y
// `talonario` con la service account del proyecto polar-breeze. Copia del mismo
// patrón de APP-CHOFER (app-chofer/lib/admin.js). La credencial llega por una
// variable de entorno (JSON en línea) o, en desarrollo, desde un archivo local.
// Se inicializa una sola vez y se reutiliza (importante para serverless en Vercel).

const admin = require("firebase-admin");
const fs = require("fs");

function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (inline && inline.trim().startsWith("{")) {
    return JSON.parse(inline);
  }
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path && fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }
  throw new Error(
    "Falta la service account de Firebase. Define FIREBASE_SERVICE_ACCOUNT (JSON) " +
    "o FIREBASE_SERVICE_ACCOUNT_PATH (ruta a un .json) en el entorno."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
