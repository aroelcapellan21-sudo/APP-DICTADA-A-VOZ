# Sección 0 — Problema raíz: configuración de lectura ignorada (resolver primero)

> Del informe `informe-mejoras-lector-facturas.md`. Regla general del informe: no romper nada existente; cada cambio se verifica contra el flujo actual antes de push.

**Estado (2026-06-20): ✅ IMPLEMENTADO** — commit `d5e2d6e`. Existe `CONFIG_LECTURA` (fuente única) y `hablar()` (función única de dictado) en `index.html`. `speakCur()` arma el texto vía `textoProducto()`.

## Contenido original

Antes de tocar cualquier UI nueva, corregir el bug detectado: el módulo de lectura de voz no respeta la configuración global porque cada módulo construye su propio formato de dictado de forma independiente.

Solución obligatoria: crear una **única fuente de configuración** y una **única función de dictado** que todos los módulos consuman, sin excepción.

Ningún módulo (factura escaneada, lista manual, historial, despacho) puede tener su propia lógica de construcción de texto a dictar. **Todos llaman a `hablar()`.**

## Dónde quedó en el código
- `CONFIG_LECTURA` (objeto persistido en `localStorage` bajo `bon_cfg_lectura`).
- `hablar(txt)` reemplazó a `speak()`.
- `textoProducto(it)` arma el texto de un producto; `speakCur()` lo usa.
