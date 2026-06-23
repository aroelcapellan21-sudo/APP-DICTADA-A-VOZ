# Manual de Usuario — BON Lector de Facturas (Polar Breeze)

App para leer facturas de helados BON con IA, organizar los productos en un orden
fijo (el **Patrón**), asignarlas a choferes y **dictarlas en voz alta** producto por
producto durante el despacho.

**Dónde está:** https://app-dictada-a-voz.vercel.app
Funciona en el navegador del celular y se puede **instalar** como app (ver el final).

---

## 1. La barra de abajo (navegación)

| Icono | Sección | Para qué |
|---|---|---|
| 🏠 Inicio | Capturar / crear listas | Escanear una factura o armar una lista a mano |
| 🚚 Despacho | Listas del día | Ver pendientes y despachadas, abrir y leer cada lista |
| 👤 Choferes | Choferes | Registrar y administrar los choferes |
| 📋 Historial | Listas guardadas | Consultar listas por fecha y las novedades |
| 📒 Reporte | Reporte del día | Anotar sobrantes, dañados, pendientes, etc. |

Arriba a la derecha: **📝 Patrón** (orden de lectura) y **⚙️ Ajustes** — ambos
piden contraseña.

> En casi todas las ventanas hay un botón **🔙** (arriba a la izquierda) para volver
> atrás, igual que tocar fuera de la ventana.

---

## 2. Escanear una factura (🏠 Inicio)

1. En **Inicio**, elige cómo capturar:
   - **📷 Cámara** → **📸 Capturar** la foto de la factura.
   - **🗂 Archivo** → subir una foto ya tomada.
   - **✏️ Manual** → armar la lista a mano (ver punto 3).
2. Toca **🔍 Analizar con IA**. La app lee la factura (nombre, cantidad, precio,
   total). *No inventa categorías:* la categoría de cada producto sale del **Patrón**
   (o queda como "Otros" si no coincide).
3. Aparece **"Productos detectados — Editar si es necesario"**:
   - Las filas en **rojo** tienen datos dudosos o que no cuadran → **corrígelas**
     (no se puede guardar con filas en rojo).
   - Puedes **editar** nombre/cantidad/precio/total, cambiar la **categoría**,
     **arrastrar** para reordenar, borrar con **✕** o **＋ Agregar producto**.
   - **🗑 Descartar análisis** borra todo y empieza de cero.
4. En **"Asignar lista a chofer"**: ponle nombre, elige el **chofer** (opcional),
   escribe **notas** (opcional) y toca **💾 Guardar Lista**.
   - Si ese chofer ya tiene una lista hoy, pedirá la **contraseña** para crear otra.

> Cada producto nuevo que aparezca en una factura se **agrega solo al Catálogo**,
> así los desplegables se mantienen al día sin escribir a mano.

---

## 3. Crear una lista manual (✏️ Manual)

1. Inicio → **✏️ Manual**.
2. Elige **Categoría** y **Producto** del desplegable, o escribe el **nombre libre**
   (te sugiere nombres ya usados; si coincide con el Patrón, sugiere su categoría).
3. Pon la **Cantidad** y toca **＋ Agregar**. Repite para cada producto.
4. Toca **▶ Continuar** → pasa a la pantalla de revisión y guardado (igual que el
   punto 2.3–2.4).

---

## 4. Despacho (🚚) — ver y leer las listas del día

- **⏳ Pendientes de leer** y **✅ Ya despachadas hoy**: cada chofer es una burbuja,
  ordenadas por número de **ficha**.
- **📝 Nota:** las burbujas pendientes tienen una marca **📝 ámbar** a la izquierda.
  Tócala para **ver/escribir una nota** del despacho sobre ese chofer (sin contraseña).
- **Tocar la burbuja** abre el **panel de la lista**, con:
  - Datos del chofer y la nota.
  - **👤 Asignar / cambiar chofer** (pide contraseña si el chofer ya tiene lista hoy).
  - La lista de productos (se puede reordenar, editar, **＋ Agregar producto**).
  - **💬 WhatsApp** y **📤 Compartir**: envían la lista como texto.
  - **🔊 Leer lista**: inicia el dictado en voz alta.

---

## 5. Dictado en voz alta (🔊 Leer lista)

La app lee los productos **agrupados por categoría**, en el orden del Patrón.

- **⏭ Siguiente / ⏮ Anterior**: avanzar o retroceder un producto.
- **⏸ Pausa / ▶ Reanudar**: el auto-avance se detiene o sigue.
- **🔁 Repetir**: vuelve a leer el producto actual.
- **− / +**: ajustan el tiempo del auto-avance.
- **🆕 Novedades** (en cada producto): registra un imprevisto en el momento
  (ver punto 8).
- **▽ Minimizar**: el dictado sigue activo y aparece un botón flotante **🔊 DICTADO**
  para volver. **Cerrar y volver al despacho** termina.

---

## 6. Choferes (👤)

- **＋ Nuevo** para registrar: foto (**📷 Cambiar foto**), **Nombre** y
  **Ficha / Código**. Editar con **✏️**, borrar con **🗑**.
- Aparecen ordenados por **ficha** (de menor a mayor).
- Un chofer con **lista de hoy** se ve "lleno" (sombra verde); **tócalo** para abrir
  directamente el panel de su lista.

---

## 7. Historial (📋) — consultar listas guardadas

- Muestra las listas ya leídas. Por defecto, las de **Hoy**; con el **selector de
  fecha** consultas días anteriores (o "Todas las fechas"). También hay **filtro por
  chofer**.
- Cada tarjeta muestra: número de productos y, si tiene, una **burbuja 🆕 naranja**
  con cuántos productos traen novedades.
- Botones: **👁 Ver** (detalle completo por categoría, con notas y novedades),
  **🔊 Releer** (volver a dictar), **🗑** (borrar).
- **🆕 Novedades por chofer**: tabla de todas las novedades, filtrable por **fecha**
  y **chofer**.

---

## 8. Novedades por producto (🆕)

Sirven para registrar imprevistos de un producto durante el despacho.

- Desde el **panel de la lista** o el **dictado**, toca **🆕** en un producto.
- Marca uno o varios tipos (no son excluyentes):
  - **Faltante** — no se le entregó lo que debía.
  - **Retirado** — el chofer decidió no llevárselo.
  - **Agregado** — pide que se le agregue algo para después (**la nota es obligatoria**).
- Cada tipo permite **Cantidad** y **Nota**. Al guardar, el producto queda
  **sombreado** y la novedad acompaña a la lista en el Historial.

---

## 9. Reporte del día (📒)

Notas generales del despacho del día (no de un chofer).

- **＋ Agregar al reporte** → elige tipo (**Sobrante, Dañados, Pendientes, Agotado,
  Notas**) y, opcional, producto/cantidad/nota.
- La vista muestra **solo lo de hoy** (cada día empieza en blanco).
- **📅 Ver por fecha**: consulta los reportes de días anteriores.

---

## 10. El Patrón (📝, con contraseña)

Define el **orden fijo** en que se leerán los productos en todas las listas, sin
importar de dónde vengan.

- Cada producto tiene **categoría**, **orden** dentro de la categoría y, opcional,
  **texto de voz** (cómo quieres que se escuche, p. ej. "Chocolate").
- **Arrastra** con ⠿ para reordenar dentro de la categoría, con ⇆ para moverlo a otra,
  y el ⠿ del encabezado para reordenar las categorías.
- **Candado 🔒/🔓** (esquina inferior derecha de cada categoría): cerrado, **bloquea
  mover/arrastrar productos** de esa categoría (el ＋ y la ✕ siguen funcionando).
- **📋 Desde catálogo** agrega los productos del catálogo que falten.

---

## 11. Ajustes (⚙️, con contraseña)

- **Aplicación** → **📲 Instalar la app**.
- **Seguridad** → la contraseña se gestiona en el servidor.
- **Categorías** → crear, renombrar, borrar.
- **Catálogo de productos** → se llena solo con cada factura; también puedes agregar
  o borrar a mano.
- **Proveedor de IA** → Gemini o Claude.
- **Datos** → **🗑 Borrar todas las listas** / **🗑 Borrar todos los choferes**.

---

## 12. Instalar la app en el celular

Ajustes (⚙️) → **📲 Instalar la app**:
- **Android (Chrome):** abre la URL → menú ⋮ → "Agregar a pantalla de inicio".
- **iPhone (Safari):** botón compartir → "Añadir a pantalla de inicio".
- También hay **📋 Copiar URL** y un **código QR** para pasar la dirección a otro
  teléfono.

---

## 13. Funciona sin internet

Una vez abierta, la app sigue funcionando sin conexión (las listas se guardan en el
teléfono). El **análisis con IA** sí necesita internet. La contraseña, sin conexión,
se recuerda por unas horas para no bloquearte.

---

## Consejos rápidos

- Si no ves un cambio reciente, **recarga** la página (la app trae siempre la última
  versión cuando hay internet).
- Mantén el **Patrón** actualizado: es lo que define el orden y la categoría de todo
  lo que se dicta.
- Corrige las filas en **rojo** antes de guardar; evitan errores de lectura del OCR.
