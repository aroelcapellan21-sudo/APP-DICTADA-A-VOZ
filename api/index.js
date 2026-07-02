// Backend Express para el lector de facturas BON (Polar Breeze).
// Hace de proxy hacia Gemini y Claude para evitar CORS y mantener las
// API keys ocultas en el servidor (variables de entorno de Vercel).
//
// En Vercel este archivo se ejecuta como una Serverless Function. El
// vercel.json reescribe todas las rutas /api/* hacia esta función.
// Para desarrollo local se usa server.js, que reutiliza esta misma app.

const express = require('express');
const crypto = require('crypto');

const app = express();

// Las imágenes llegan en base64 dentro del JSON. Vercel limita el body
// a ~4.5 MB; el frontend comprime antes de enviar para no superarlo.
app.use(express.json({ limit: '10mb' }));

const GEMINI_MODEL = 'gemini-2.5-flash';
const CLAUDE_MODEL = 'claude-sonnet-4-6';

// Separa un data URL ("data:image/jpeg;base64,...") en mime + base64.
// Acepta también base64 "pelado" por compatibilidad.
function parseImage(image) {
  if (typeof image !== 'string' || !image) {
    throw { status: 400, message: 'Falta la imagen.' };
  }
  if (image.startsWith('data:')) {
    const mime = image.split(';')[0].split(':')[1] || 'image/jpeg';
    const data = image.split(',')[1] || '';
    return { mime, data };
  }
  return { mime: 'image/jpeg', data: image };
}

async function analizarGemini({ data, mime }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw { status: 500, message: 'GEMINI_API_KEY no está configurada en el servidor.' };
  }
  const prompt = `Eres un lector de facturas de helados BON de Polar Breeze, S.R.L. Esta factura tiene columnas: Cant (cantidad), Descripción (nombre del producto), Precio, Total. Extrae TODOS los productos con su nombre, cantidad, precio y total, EXACTAMENTE como aparecen. NO clasifiques ni asignes categorías: tu único trabajo es leer lo que dice la factura.

Por cada producto indica además tu nivel de CONFIANZA al leer cada número, con el valor "alto", "medio" o "bajo": conf_cantidad, conf_precio, conf_total. REGLA CRÍTICA: si un número está borroso, en letra pequeña, ambiguo o dudoso (p.ej. confundir 18 con 19, o 31 con 21), NO adivines el valor más probable: baja su confianza a "medio" o "bajo". Si un campo no se puede leer, su confianza es "bajo".

Responde SOLO con JSON válido sin texto adicional: [{"nombre":"Paleta Choco Mani 32/1","cantidad":"8","precio":"120","total":"960","conf_cantidad":"alto","conf_precio":"alto","conf_total":"alto"}].`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: mime, data } },
          { text: prompt }
        ] }],
        // thinkingBudget: 0 desactiva el "thinking" de gemini-2.5-flash, que
        // por defecto consume el presupuesto de tokens y deja la respuesta sin
        // texto. maxOutputTokens más alto da margen para facturas largas.
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    }
  );

  const d = await res.json();
  if (!res.ok) {
    throw { status: res.status, message: d.error?.message || `Error Gemini ${res.status}` };
  }
  // El texto no siempre está en parts[0]; concatenamos todos los parts con texto.
  const parts = d.candidates?.[0]?.content?.parts || [];
  return parts.map(p => p?.text || '').join('').trim();
}

async function analizarClaude({ data, mime }) {
  const key = process.env.CLAUDE_API_KEY;
  if (!key) {
    throw { status: 500, message: 'CLAUDE_API_KEY no está configurada en el servidor.' };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mime, data } },
        { type: 'text', text: 'Analiza esta factura BON (columnas: Cant, Descripción, Precio, Total). Por cada producto extrae nombre, cantidad, precio y total EXACTAMENTE como aparecen; NO clasifiques ni asignes categorías. Indica tu nivel de CONFIANZA al leer cada número ("alto"/"medio"/"bajo"): conf_cantidad, conf_precio, conf_total. REGLA CRÍTICA: si un número está borroso o dudoso (p.ej. confundir 18 con 19, o 31 con 21), NO adivines: usa "medio" o "bajo". Si no se puede leer, confianza "bajo". JSON solo: [{"nombre":"Paleta Coco","cantidad":"24","precio":"50","total":"1200","conf_cantidad":"alto","conf_precio":"alto","conf_total":"alto"}]' }
      ] }]
    })
  });

  const d = await res.json();
  if (!res.ok) {
    throw { status: res.status, message: d.error?.message || `Error Claude ${res.status}` };
  }
  return d.content?.[0]?.text || '';
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    gemini: Boolean(process.env.GEMINI_API_KEY),
    claude: Boolean(process.env.CLAUDE_API_KEY),
    patron: Boolean(process.env.PATRON_PASSWORD)
  });
});

// Verificación de la contraseña del Patrón/Ajustes (Sección 9). La clave vive
// SOLO como variable de entorno PATRON_PASSWORD; nunca se expone al cliente.
// El front envía la clave por HTTPS y aquí se compara en tiempo constante.
function claveCorrecta(input) {
  const esperada = process.env.PATRON_PASSWORD;
  if (!esperada) {
    throw { status: 500, message: 'PATRON_PASSWORD no está configurada en el servidor.' };
  }
  if (typeof input !== 'string') return false;
  const a = Buffer.from(input);
  const b = Buffer.from(esperada);
  // timingSafeEqual exige misma longitud; distinta longitud => no coincide.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

app.post('/api/verify-clave', (req, res) => {
  try {
    const { password } = req.body || {};
    if (claveCorrecta(password)) return res.json({ ok: true });
    return res.status(401).json({ ok: false });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Error interno del servidor.' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { provider, image } = req.body || {};
    const { data, mime } = parseImage(image);
    const text = provider === 'claude'
      ? await analizarClaude({ data, mime })
      : await analizarGemini({ data, mime });
    res.json({ text });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Error interno del servidor.' });
  }
});

// ─── Lecturas del ecosistema (read-only) para BON ─────────────────────────────
// BON LEE (nunca escribe) `reportes_chofer` y `talonario` con la service account
// (Regla 3: procesos separados; Regla 4: lectura server-side). Alimenta la
// auto-importación de facturas y los 3 tabs del perfil de chofer. Si la service
// account no está configurada, `require('../lib/admin')` lanza y el endpoint
// responde 500 → el frontend lo trata como "sin conexión" (offline-first).

// Fecha YYYY-MM-DD en zona RD (UTC-4) con un desfase de días desde hoy.
function fechaRDdesde(offsetDias = 0) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santo_Domingo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(Date.now() + offsetDias * 86400000));
}

// Lee ?desde=YYYY-MM-DD; si falta o es inválido, usa 30 días atrás (RD).
function desdeParam(req) {
  const q = req.query && req.query.desde;
  if (typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
  return fechaRDdesde(-30);
}

// GET /api/reportes-chofer?desde=YYYY-MM-DD
// Reportes diarios de cada chofer (reportes_chofer/{ficha}/dias/{fecha}) desde `desde`.
app.get('/api/reportes-chofer', async (req, res) => {
  try {
    const { db } = require('../lib/admin');
    const desde = desdeParam(req);
    const chofSnap = await db.collection('reportes_chofer').get();
    const reportes = [];
    for (const chof of chofSnap.docs) {
      const diasSnap = await chof.ref.collection('dias').where('fecha', '>=', desde).get();
      diasSnap.forEach((d) => {
        const r = d.data() || {};
        reportes.push({
          ficha:   r.ficha || chof.id,
          nombre:  r.nombre || '',
          fecha:   r.fecha || d.id,
          items:   Array.isArray(r.items) ? r.items : [],
          totales: r.totales || null,
        });
      });
    }
    res.json({ reportes });
  } catch (e) {
    console.error('GET /api/reportes-chofer:', e.message);
    res.status(500).json({ error: 'No se pudieron leer los reportes de choferes.' });
  }
});

// GET /api/despachos-chofer?desde=YYYY-MM-DD
// Despachos del Hub (talonario, tipo "retirada") desde `desde`. Solo lectura.
app.get('/api/despachos-chofer', async (req, res) => {
  try {
    const { db, admin } = require('../lib/admin');
    const desde = desdeParam(req);
    const inicio = new Date(`${desde}T00:00:00-04:00`); // 00:00 RD (UTC-4)
    const snap = await db.collection('talonario')
      .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(inicio))
      .get();
    const despachos = [];
    snap.forEach((d) => {
      const t = d.data() || {};
      if (t.tipo !== 'retirada') return;
      const ts = t.timestamp && typeof t.timestamp.toDate === 'function' ? t.timestamp.toDate() : null;
      const fecha = ts
        ? new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Santo_Domingo', year: 'numeric', month: '2-digit', day: '2-digit',
          }).format(ts)
        : '';
      despachos.push({
        ficha:     t.choferFicha || '',
        nombre:    t.choferNombre || '',
        productos: Array.isArray(t.productos) ? t.productos : [],
        fuente:    t.fuente || '',
        fecha,
        ts: ts ? ts.getTime() : 0,
      });
    });
    res.json({ despachos });
  } catch (e) {
    console.error('GET /api/despachos-chofer:', e.message);
    res.status(500).json({ error: 'No se pudieron leer los despachos.' });
  }
});

module.exports = app;
