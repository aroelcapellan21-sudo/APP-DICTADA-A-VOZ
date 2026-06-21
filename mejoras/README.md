# Mejoras — BON Lector de Facturas

Cada archivo es **autocontenido**: para ejecutar una mejora, abrir su archivo y seguirlo sin necesidad de leer los demás.

Leyenda de estado: ✅ implementado · ⚠️ parcial · ❌ pendiente.

## Secciones del informe original (`informe-mejoras-lector-facturas.md`)

| Archivo | Sección | Estado |
|---|---|---|
| `00-bug-configuracion-lectura.md` | 0. Bug configuración de lectura ignorada | ✅ |
| `01-arquitectura-patron.md` | 1. Arquitectura de datos del Patrón (categoria/orden/texto_voz) | ⚠️ (⇄ intermitente → C) |
| `02-modo-de-lectura.md` | 2. Modo de lectura (categoria/individual) | ⚠️ (falta toggle UI) |
| `03-flujo-captura-validacion.md` | 3. Flujo captura + validación con bloqueo | ⚠️ (falta "Sin clasificar") |
| `04-exportar-whatsapp.md` | 4. Exportar lista por WhatsApp | ❌ |
| `05-edicion-universal.md` | 5. Edición universal ✏️ (4 superficies) | ⚠️ |
| `06-visor-imagen-zoom.md` | 6. Visor de imagen (pinch-zoom + pan) | ❌ |
| `07-sonido-transicion-categoria.md` | 7. Sonido de transición entre categorías | ✅ |
| `08-totales-visibles.md` | 8. Totales visibles (4 vistas) | ❌ |
| `09-seguridad-patron.md` | 9. Seguridad del Patrón (env vars + servidor) | ❌ |
| `10-barra-voz-reactiva.md` | 10. Barra de voz reactiva (prioridad baja) | ❌ |

## Mejoras nuevas (pendientes de hoy, 2026-06-20)

| Archivo | Mejora | Estado |
|---|---|---|
| `A-bug-orden-patron-al-dictar.md` | Bug: el orden del Patrón no siempre se respeta al dictar | ❌ diagnosticar |
| `B-senal-stop-sin-coincidencia.md` | Señal 🛑 informativa para productos sin coincidencia en el Patrón | ❌ |
| `C-arrastre-entre-categorias.md` | Arrastre ⇄ entre categorías (intermitente) + registro automático de intentos | ⚠️ en curso |
| `D-autocompletado-nombres-patron.md` | Autocompletado de nombres en el Patrón desde facturas escaneadas | ❌ |
| `E-panel-dictado-pantalla-completa.md` | Panel de dictado a pantalla completa | ❌ |
| `F-cantidades-grandes-lista-voz.md` | Números de cantidad más grandes en la lista del lector de voz | ❌ |
| `G-confianza-nombre-producto.md` | Extender la confianza por campo también al nombre del producto | ❌ |
| `H-novedades-por-producto.md` | Novedades por producto en la lista del chofer (botón + modal de 8 tipos) | ❌ |

## Orden de ejecución sugerido en el informe original

| # | Tarea | Sección |
|---|---|---|
| 1 | Arreglar bug de configuración de lectura ignorada | 0 |
| 2 | Arquitectura de datos del Patrón: categoria, orden, texto_voz | 1 |
| 3 | Pantalla de revisión obligatoria con bloqueo por anomalías | 3 |
| 4 | Edición universal ✏️ en las 4 superficies | 5 |
| 5 | Modo de lectura por categoría + controles ⏮️⏯️⏭️ | 2 y 7 |
| 6 | Exportar lista por WhatsApp | 4 |
| 7 | Totales visibles | 8 |
| 8 | Seguridad del Patrón con variables de entorno | 9 |
| 9 | Zoom de imagen | 6 |
| 10 | Barra de voz reactiva | 10 |

## Cómo usar
- "ejecuta la mejora **A**" (o el nombre) → abrir `A-*.md` y seguirlo.
- "ejecuta la sección **4**" → abrir `04-*.md`.
