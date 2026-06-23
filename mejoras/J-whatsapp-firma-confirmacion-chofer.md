# Mejora J — Compartir al chofer, firma/confirmación y estado "completado"

**Tipo:** features nuevas (3 relacionadas).
**Estado:** ❌ pendiente (solo documentado, NO implementado).
**Regla:** **agregar, no alterar** lo existente (dictado, Patrón, novedades, etc.).

Las tres giran en torno al chofer y su factura/lista; conviene implementarlas en
orden porque la 3 depende de la 2.

## Contexto del código (común)
- `index.html` (front en un solo archivo).
- **Choferes** en `choferes[]` (localStorage `bon_ch`): `{id, nombre, ficha, foto}`.
  Hoy **no** guardan teléfono.
- **Listas** en `listas[]` (localStorage `bon_listas`); cada lista tiene `chofer`
  (snapshot), `items[]`, `fecha`, `escuchada`. Compartir texto ya existe:
  `textoListaParaCompartir(lista)` + botones `btn-mlp-wa` / `btn-mlp-share` en el
  panel de lista (`m-lista-panel`). El WhatsApp actual abre `wa.me/?text=…` **sin
  número** (el usuario elige el contacto).

---

## J1 — Lista compartible por WhatsApp directamente con el chofer de esa factura
- Enviar la lista por WhatsApp **al número del chofer** (no elegir contacto a mano).
- Requiere **agregar teléfono al chofer**: nuevo campo en el modal `m-chofer`
  (`ch-...`) y en el objeto chofer (`telefono`), con su migración suave (opcional).
- Uso: `https://wa.me/<telefono>?text=<textoListaParaCompartir(lista)>` (número en
  formato internacional, solo dígitos). Si el chofer no tiene teléfono, caer al
  comportamiento actual (sin número).
- Botón "Enviar al chofer" en el panel de lista (junto a los de compartir).

## J2 — Firma digital / confirmación del chofer sobre su factura
- Que el chofer **confirme** su factura. Dos variantes posibles (a decidir):
  - **Confirmación simple:** botón "Confirmar recepción" (con su nombre/fecha-hora).
  - **Firma dibujada:** un `<canvas>` donde el chofer firma con el dedo; se guarda
    como imagen (dataURL) en el registro de la lista.
- Persistencia (aditiva) en la lista:
  `lista.confirmacion = {por, fecha, firma?}` (firma = dataURL opcional).
- Acceso: desde el panel de lista (`m-lista-panel`) o una vista dedicada para el
  chofer. No requiere tocar el dictado.

## J3 — Estado visible "completado por el chofer"
- Indicador visible cuando la lista ya fue **confirmada/firmada** (J2): un check o
  badge "✅ Completado por el chofer".
- Dónde mostrarlo: burbujas de Despacho, panel de lista, e Historial
  (`renderDespacho`, `abrirPanelLista`, `renderHistorial`).
- Derivado de `lista.confirmacion` (si existe → mostrar estado + quién y cuándo).

---

## Criterio de listo
- **J1:** chofer con teléfono; botón "Enviar al chofer" abre WhatsApp al número con
  el texto de la lista; fallback sin número si falta teléfono.
- **J2:** el chofer puede confirmar (y opcionalmente firmar); queda guardado en
  `lista.confirmacion` y sobrevive a recargar.
- **J3:** la lista confirmada muestra el indicador "completado por el chofer" en
  Despacho, panel e Historial.

## Impacto esperado (a confirmar al implementar)
- Aditivo: `chofer.telefono`, `lista.confirmacion`. No altera Patrón, categorías,
  dictado, novedades ni el reporte del día.
