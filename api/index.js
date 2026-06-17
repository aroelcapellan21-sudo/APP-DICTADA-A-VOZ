// Backend Express para el lector de facturas BON (Polar Breeze).
// Hace de proxy hacia Gemini y Claude para evitar CORS y mantener las
// API keys ocultas en el servidor (variables de entorno de Vercel).
//
// En Vercel este archivo se ejecuta como una Serverless Function. El
// vercel.json reescribe todas las rutas /api/* hacia esta función.
// Para desarrollo local se usa server.js, que reutiliza esta misma app.

const express = require('express');

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

async function analizarGemini({ data, mime, cats }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw { status: 500, message: 'GEMINI_API_KEY no está configurada en el servidor.' };
  }
  const categorias = cats || 'Otros';
  const prompt = `Eres un lector de facturas de helados BON de Polar Breeze, S.R.L. Esta factura tiene columnas: Cant (cantidad), Descripción (nombre del producto), Precio, Total. Extrae TODOS los productos con su cantidad. Responde SOLO con JSON válido sin texto adicional: [{"categoria":"Paletas","nombre":"Paleta Choco Mani 32/1","cantidad":"8"}]. Categorías posibles: ${categorias}. Si no puedes determinar la categoría usa "Otros".`;

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
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
      })
    }
  );

  const d = await res.json();
  if (!res.ok) {
    throw { status: res.status, message: d.error?.message || `Error Gemini ${res.status}` };
  }
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
      max_tokens: 2048,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mime, data } },
        { type: 'text', text: 'Analiza esta factura BON. JSON solo: [{"categoria":"Paletas","nombre":"Paleta Coco","cantidad":"24 unidades"}]' }
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
    claude: Boolean(process.env.CLAUDE_API_KEY)
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { provider, image, cats } = req.body || {};
    const { data, mime } = parseImage(image);
    const text = provider === 'claude'
      ? await analizarClaude({ data, mime })
      : await analizarGemini({ data, mime, cats });
    res.json({ text });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Error interno del servidor.' });
  }
});

module.exports = app;
