# Auditoría — orden y categorías (factura escaneada · dictado · lista manual)

> Auditoría en modo **solo lectura**. No se modificó código.
> Fecha: 2026-06-22 · Rama: `main` · Archivos revisados: `index.html`, `api/index.js`

Esta auditoría revisa el flujo completo desde que se escanea una factura hasta
que se dicta, verificando tres reglas:

1. **Pantalla de revisión** (antes de pasar al chofer): los productos se muestran
   en el orden crudo de la factura, sin reagrupar por categoría del Patrón, y la
   categoría de cada producto viene del Patrón (cuando coincide) o de "Otros"
   (cuando no coincide), sin que la IA la invente.
2. **Momento de dictar**: el orden se recalcula correctamente contra el Patrón
   vigente (categoría + orden), agrupando cada categoría en un solo tramo sin
   repetirse.
3. **Lista manual**: se comporta igual que la factura escaneada en ambos puntos.

---

## 1. Pantalla de revisión (antes del chofer)

### Factura escaneada — ✅ correcto

- **Orden crudo:** `analizar()` (`index.html:984-985`) hace `allItems=items` con
  los productos tal como salen del OCR, **sin reordenar ni reagrupar**.
  `renderEditAntes()` (`index.html:1064`) los pinta iterando `allItems` en ese
  mismo orden. La factura se ve en orden crudo. ✅
- **Categoría desde el Patrón, no inventada por la IA:** el backend
  (`api/index.js:40-44` y `:95`) instruye explícitamente *"NO clasifiques ni
  asignes categorías"*. La categoría se asigna en el cliente con
  `it.categoria = categoriaDesdePatron(it.nombre)` (`index.html:984`). Esa
  función (`index.html:719-723`) busca coincidencia **exacta por nombre
  normalizado** contra el Patrón y devuelve su categoría, o `'Otros'` si no
  coincide. La IA nunca categoriza. ✅

### Lista manual — ⚠️ IGUAL en el orden, DISTINTO en la categoría

- **Orden crudo:** `btn-m-start` (`index.html:1744`) hace `allItems=[...manItems]`,
  preservando el orden de carga. La revisión respeta el orden de entrada. ✅
  (igual que la factura)
- **Categoría:** aquí **no** se aplica `categoriaDesdePatron()`. La categoría es
  la que el usuario eligió en el modal (`m-cat`, `index.html:1727`). El Patrón
  solo **sugiere** una categoría cuando el nombre coincide
  (`index.html:1706-1719`), pero el usuario puede sobreescribirla. Es decir, en
  manual la categoría es *asignada por el usuario*, no *derivada estrictamente
  del Patrón*.

  Como en manual no interviene la IA, la regla "sin que la IA invente" se cumple
  trivialmente. Pero **no es idéntico** a la factura: un producto manual cuyo
  nombre coincide con el Patrón puede quedar con una categoría distinta a la del
  Patrón si el usuario la cambia.

---

## 2. Momento de dictar — ✅ correcto

- **Recalcula contra el Patrón vigente:** `iniciarDictado()` (`index.html:1353`)
  llama `allItems=ordenarPorPatron(allItems)` **siempre**, sea primer dictado o
  redictado. Trabaja sobre **copias** (`items.map(it=>({...it}))`,
  `index.html:732`), así el registro guardado nunca se altera. ✅
- **Orden categoría + dentro de categoría:** `ordenarPorPatron`
  (`index.html:731-748`) recorre `patronOrdenado()` —que ordena por índice de
  categoría en el array `categorias` y luego por `orden` interno
  (`index.html:1937-1942`)— y empareja por nombre exacto normalizado, heredando
  `_catLect` del Patrón. Los no coincidentes van al final en orden de factura. ✅
- **Cada categoría en un solo tramo, sin repetirse:** `agruparPorCategoria()`
  (`index.html:757-768`) hace un sort **estable** por rango de categoría
  normalizada, de modo que todos los items de una categoría quedan contiguos (un
  solo tramo). Además **unifica etiquetas equivalentes**
  ("Paletas"/"paletas "/"Paletas " → una sola, `index.html:759-764`), evitando
  tramos repetidos por variantes de texto. ✅
- **Consistencia de orden entre categorías:** tanto `patronOrdenado()` como
  `agruparPorCategoria()` rankean por el array `categorias`, y el arrastre de
  categorías (`moverCategoria`, `index.html:1928-1935`) reordena ese mismo array
  y lo persiste. Las dos rutas usan la misma fuente de orden, así que no se
  contradicen. ✅
- **Pantalla y audio sincronizados:** `renderItemList()` (`index.html:1335-1345`)
  pinta en el mismo orden ya calculado, con encabezado por cambio de categoría e
  índice = `curIdx`. ✅

### Lista manual al dictar

Pasa por exactamente el mismo `ordenarPorPatron`. Para productos **que están** en
el Patrón, el `_catLect` se toma del Patrón (`index.html:743`), sobreescribiendo
la categoría manual *solo a efectos de lectura*. ✅

---

## 3. Diferencia real entre factura y manual (no es un crash, es divergencia de regla)

El único punto donde manual **no** se comporta igual que la factura:

| Producto **sin coincidencia** en el Patrón | Factura | Manual |
|---|---|---|
| `it.categoria` en revisión | forzado a `'Otros'` (`categoriaDesdePatron`) | la que eligió el usuario |
| `_catLect` al dictar (rama no-coincidente, `index.html:747`) | `'Otros'` | la categoría elegida por el usuario |

- **Factura:** un producto que no está en el Patrón → siempre `'Otros'`.
- **Manual:** un producto que no está en el Patrón → conserva la categoría que el
  usuario le puso, y se dicta bajo esa categoría.

**¿Es un bug?** Estrictamente según la regla enunciada ("la categoría sale del
Patrón o de Otros"), la factura la cumple al pie de la letra y la manual le da
control explícito al usuario. Es **divergencia de diseño, no rotura**: en manual
el usuario *escribe a mano* la categoría a propósito, mientras que en factura no
hay intención humana detrás de la categoría y por eso se fuerza a `'Otros'`.

---

## Qué propondría (sin tocar código aún)

Solo si se busca **paridad estricta** factura↔manual, hay dos opciones, y es
decisión del usuario:

1. **Dejarlo como está (recomendado).** El comportamiento actual es coherente: la
   factura no debe inventar categoría, pero en manual el usuario sí decide
   conscientemente. La sugerencia del Patrón ya empuja hacia la categoría
   correcta.
2. **Forzar también en manual:** aplicar `categoriaDesdePatron(nombre)` en
   `btn-m-start` (`index.html:1744`) en lugar de respetar `it.categoria`. Costo:
   el usuario perdería la capacidad de clasificar manualmente productos que no
   estén en el Patrón (todos caerían en `'Otros'`).

---

## Conclusión

Los tres puntos planteados funcionan correctamente para la factura escaneada y
para el dictado. La lista manual coincide en el **orden** (ambas pantallas) y en
el **dictado**, y difiere solo en cómo nace la **categoría** en la pantalla de
revisión (elección del usuario vs. derivación estricta del Patrón). No se
encontró nada roto en el sentido de fallo o desincronización; la única decisión
pendiente es si se quiere unificar esa semántica de categoría.

### Mapa de referencias de código

| Función / handler | Ubicación | Rol |
|---|---|---|
| `analizarGemini` / `analizarClaude` | `api/index.js:35-105` | OCR sin clasificar |
| `analizar()` | `index.html:965-998` | Asigna categoría desde Patrón |
| `categoriaDesdePatron()` | `index.html:719-723` | Match exacto → categoría o 'Otros' |
| `renderEditAntes()` | `index.html:1058-1103` | Pantalla de revisión (orden crudo) |
| `ordenarPorPatron()` | `index.html:731-748` | Recalcula orden al dictar |
| `agruparPorCategoria()` | `index.html:757-768` | Un tramo por categoría |
| `patronOrdenado()` | `index.html:1937-1942` | Orden categoría + orden interno |
| `moverCategoria()` | `index.html:1928-1935` | Orden entre categorías |
| `iniciarDictado()` | `index.html:1347-1361` | Entrada al dictado |
| `renderItemList()` | `index.html:1335-1345` | Pinta pantalla = audio |
| `btn-m-start` (lista manual) | `index.html:1741-1750` | Crea lista manual |
| `btn-m-add` (alta manual) | `index.html:1722-1731` | Categoría elegida por usuario |

---

## Anexo — Diagnóstico del "catálogo viejo" y los 14 productos de plantilla

> Diagnóstico solicitado por separado. Sigue siendo **solo lectura**: no se
> modificó código. Aclaración importante: la auditoría nunca caracterizó ningún
> catálogo como "viejo"; el término lo introdujo el usuario. Aquí se confirma con
> certeza qué es esa estructura y qué implica borrarla.

### Qué es el `catalogo`

Lista de productos-plantilla con la forma `{c: categoría, n: nombre}`, persistida
en `localStorage` bajo la clave **`bon_cat`** (`index.html:633`). Sirve para (1)
llenar los desplegables "— Selecciona —" de los modales manual y agregar
producto, y (2) alimentar las sugerencias de texto. Trae **14 productos sembrados
por defecto** (`index.html:633-639`), que solo aparecen si `bon_cat` nunca se ha
guardado; una vez editado, el sembrado no vuelve.

### ¿Vive separado del Patrón? — Sí, totalmente

| Cosa | Clave localStorage | Qué guarda |
|---|---|---|
| `catalogo` | `bon_cat` | productos-plantilla `{c, n}` |
| `patron` | `bon_pat` | categoría, **orden**, **texto_voz**, productos del Patrón (`index.html:632, 2057`) |
| `categorias` | `bon_categorias` | lista única de categorías (`index.html:644, 650`) |
| `listas` | `bon_listas` | historial de facturas guardadas |

El **arrastre** no es un dato: es interacción que escribe `orden`/`categoria`
dentro de `patron` (`bon_pat`). Nada de eso toca `catalogo`.

### ¿Borrar el catálogo afecta lo de hoy?

- **Orden, texto_voz, arrastre, categoría del Patrón → NO se tocan** (viven en `bon_pat`).
- **Categorías (`bon_categorias`) → NO se borran** (independientes una vez persistidas).
- **Historial de listas → NO se toca.**
- **SÍ se afecta:** los desplegables de producto de los modales manual (`m-prod`)
  y agregar producto (`ap-prod`) se llenan *puramente* del catálogo
  (`index.html:1700, 1762`) → quedarían vacíos. Y las sugerencias de texto pierden
  los nombres que **solo** estaban en el catálogo.

### ¿Cómo se identifica "viejo" vs. "lo de hoy"? — con certeza: NO por fecha

Cada producto del catálogo es solo `{c, n}`: **no tiene timestamp ni marca de
origen**. No hay forma en los datos de distinguir "antes de hoy" vs. "hoy". El
único criterio objetivo es comparar contra los **14 productos sembrados por
defecto** (`index.html:633-639`). Lo que coincida exactamente = plantilla
original; el resto se agregó en un momento desconocido.

**Decisión confirmada por el usuario:** "catálogo viejo" = **los 14 productos de
plantilla por defecto**.

### ¿Interfiere en las sugerencias de texto del catálogo? — Sí (secundario)

`construirDiccionarioNombres()` (`index.html:676-694`), que alimenta los datalist
(`dl-man`, `dl-ap`, `dl-pat`), usa dos fuentes:

- **Primaria (peso 2):** nombres de facturas guardadas (`listas`, `index.html:686`).
- **Secundaria (peso 1):** el `catalogo` (`index.html:688`).

Al borrar el catálogo, los nombres que solo estaban ahí desaparecen de las
sugerencias; los que también están en facturas guardadas sobreviven. La
sugerencia de **categoría** ("💡 sugerida por el Patrón", `index.html:1709`) viene
de `indicePatronPorNombre()` = el **Patrón**, no del catálogo → **no se afecta**.

### Los 14 productos de plantilla por defecto

```
Paletas    → Paleta Coco, Paleta Fresa, Paleta Chocolate, Paleta Vainilla
Helados    → Helado Vainilla, Helado Chocolate, Helado Fresa
Conos      → Cono Simple, Cono Doble
Vasos      → Vaso Pequeño, Vaso Grande
Bombones   → Bombón Chocolate
Sándwiches → Sándwich Helado
Otros      → Producto Especial
```

### Plan de borrado propuesto (aún sin tocar código)

1. **Extraer los 14 a una constante** (`CATALOGO_SEED`) como fuente única del
   sembrado y del filtro.
2. **Migración única con bandera:** al cargar, si no existe `bon_cat_seed_purgado`,
   filtrar `catalogo` quitando los pares que coincidan **exactamente** (`{c, n}`
   con `trim`, sin normalización agresiva) con `CATALOGO_SEED`, guardar `bon_cat` y
   marcar la bandera. Idempotente: no vuelve a borrar si luego se re-agrega un
   nombre igual.
3. **Sembrado por defecto para instalaciones nuevas → arreglo vacío** (las
   categorías no se pierden: se siembran desde la lista base en `index.html:646`).

**Qué se toca:** `bon_cat` (quita solo los 14 exactos) y `bon_cat_seed_purgado`
(bandera nueva). **Qué NO se toca:** `bon_pat`, `bon_categorias`, `bon_listas`,
`bon_ch`.

**Riesgo único:** si antes de la migración existe un producto re-creado a mano con
nombre y categoría idénticos a un seed, no se puede distinguir del seed y se
quitaría.

**Verificación posterior:** (1) Ajustes → Catálogo: los 14 ya no están, lo demás
sigue; (2) Patrón: orden, texto_voz y arrastre intactos; (3) recargar: no
reaparecen ni se vuelve a borrar nada.

**Decisiones pendientes antes de implementar:** (a) ¿catálogo por defecto vacío
para instalaciones nuevas, o seguir sembrando los 14 y solo limpiar la instalación
actual? (b) ¿migración permanente en `index.html`, o borrado puntual vía consola
del navegador sin cambiar el código fuente?

---

## Anexo — Implementación aprobada: migración del catálogo + candado por categoría

> **Decisiones confirmadas por el usuario:** (a) catálogo por defecto **vacío**
> para instalaciones nuevas (sin los 14 de ejemplo); (b) **migración permanente
> en `index.html`** que se ejecuta automáticamente y quita solo los 14 productos
> de plantilla exactos, sin tocar Patrón, categorías ni historial.
> Esta sección documenta los cambios exactos propuestos **antes de aplicarlos**.

### A. Migración del catálogo — cambios exactos

**Un solo bloque cambia:** `index.html:633-639` (declaración + sembrado de
`catalogo`). La línea 647 (`categorias=[...]`) **no se toca**: con catálogo vacío,
`categorias` se siembra solo desde `base`, que ya contiene esas 7 categorías, así
que no se pierde ninguna.

#### Antes (`index.html:633-639`)

```js
let catalogo=JSON.parse(localStorage.getItem('bon_cat')||'null')||[
  {c:'Paletas',n:'Paleta Coco'},{c:'Paletas',n:'Paleta Fresa'},{c:'Paletas',n:'Paleta Chocolate'},
  {c:'Paletas',n:'Paleta Vainilla'},{c:'Helados',n:'Helado Vainilla'},{c:'Helados',n:'Helado Chocolate'},
  {c:'Helados',n:'Helado Fresa'},{c:'Conos',n:'Cono Simple'},{c:'Conos',n:'Cono Doble'},
  {c:'Vasos',n:'Vaso Pequeño'},{c:'Vasos',n:'Vaso Grande'},{c:'Bombones',n:'Bombón Chocolate'},
  {c:'Sándwiches',n:'Sándwich Helado'},{c:'Otros',n:'Producto Especial'}
];
```

#### Después

```js
// Catálogo de plantilla original (14 productos). Se conserva SOLO como referencia
// para la purga única de abajo. Las instalaciones NUEVAS ya no lo siembran:
// arrancan con catálogo vacío.
const CATALOGO_SEED=[
  {c:'Paletas',n:'Paleta Coco'},{c:'Paletas',n:'Paleta Fresa'},{c:'Paletas',n:'Paleta Chocolate'},
  {c:'Paletas',n:'Paleta Vainilla'},{c:'Helados',n:'Helado Vainilla'},{c:'Helados',n:'Helado Chocolate'},
  {c:'Helados',n:'Helado Fresa'},{c:'Conos',n:'Cono Simple'},{c:'Conos',n:'Cono Doble'},
  {c:'Vasos',n:'Vaso Pequeño'},{c:'Vasos',n:'Vaso Grande'},{c:'Bombones',n:'Bombón Chocolate'},
  {c:'Sándwiches',n:'Sándwich Helado'},{c:'Otros',n:'Producto Especial'}
];
// Instalaciones nuevas: catálogo VACÍO (ya no se siembran los 14 de ejemplo).
let catalogo=JSON.parse(localStorage.getItem('bon_cat')||'null')||[];
// Migración ÚNICA: quita de bon_cat solo los 14 productos de plantilla EXACTOS
// (par categoría+nombre, con trim). Respeta TODO lo agregado por el usuario y
// no toca bon_pat, bon_categorias ni bon_listas. La bandera evita que se repita
// y que vuelva a borrar un nombre re-agregado a mano más adelante.
if(!localStorage.getItem('bon_cat_seed_purgado')){
  const claveSeed=p=>`${String(p.c||'').trim()} ${String(p.n||'').trim()}`;
  const seedSet=new Set(CATALOGO_SEED.map(claveSeed));
  const antes=catalogo.length;
  catalogo=catalogo.filter(p=>!seedSet.has(claveSeed(p)));
  if(catalogo.length!==antes)localStorage.setItem('bon_cat',JSON.stringify(catalogo));
  localStorage.setItem('bon_cat_seed_purgado','1');
}
```

**Comportamiento paso a paso:**

- Instalación nueva (`bon_cat` null) → `catalogo=[]`; la migración corre sobre `[]`,
  no borra nada, guarda `bon_cat='[]'` y marca la bandera. Catálogo vacío.
- Instalación actual → carga el `bon_cat` existente, quita solo los 14 pares
  exactos, conserva lo demás, guarda y marca la bandera.
- Recarga → la bandera ya existe, la migración no vuelve a correr.

**Toca:** `bon_cat`, `bon_cat_seed_purgado`.
**No toca:** `bon_pat`, `bon_categorias`, `bon_listas`, `bon_ch`.

**Riesgo único:** si en `bon_cat` hay un producto re-tecleado a mano idéntico
(misma categoría + mismo nombre) a uno de los 14, se irá junto con el seed.

### B. Candado por categoría — plan

#### Interpretación de la regla

Candado **cerrado (🔒)** en una categoría = **sus productos no se pueden arrastrar**:

- ⠿ de fila (reordenar dentro) → bloqueado.
- ⇆ (mover a otra categoría / *salir*) → bloqueado.
- Un ⇆ que venga de otra categoría y apunte a esta como destino (*entrar*) →
  bloqueado (no se puede soltar aquí).

**No bloquea** (queda igual que hoy): el ⠿ del **encabezado** (reordenar la
categoría entera entre categorías), el botón **+** (agregar producto) y la **✕**
(borrar producto). → *Punto a confirmar (1).*

#### Modelo de datos

- Nueva clave `localStorage` **`bon_cat_locks`** = array de **nombres de categoría**
  bloqueadas.
- `let catLocks=JSON.parse(localStorage.getItem('bon_cat_locks')||'[]');`
- Helpers: `estaBloqueada(cat)`; `saveLocks()`; `toggleLock(cat)`.

#### UI (en `renderPatron`, `index.html:1857-1860`)

- Añadir al final del encabezado (`.pat-cat-head`) un botón `🔒`/`🔓` a la derecha
  (después del `+`).
- Al pulsarlo: `toggleLock(cat); saveLocks(); renderPatron();`
- Estado visual: clase `locked` en el `.pat-cat-group`; CSS atenúa
  (`opacity` + `cursor:not-allowed`) los grips ⠿/⇆ de esa categoría.
- *Ubicación:* el encabezado es una fila flex de una sola línea → el candado queda
  en el extremo derecho. Si se quiere literalmente en la esquina inferior derecha,
  se posiciona con CSS absoluto. → *Punto a confirmar (2).*

#### Bloqueo en el motor de arrastre

1. **Salida (origen bloqueado)** — en `arrancarArrastre` (`index.html:1948`): al
   inicio, si `tipo` es `'row'` o `'move'` y `estaBloqueada(cat)`, hacer `return`
   sin iniciar el arrastre.
2. **Entrada (destino bloqueado)** — en `evaluarObjetivo` (`index.html:1971`, rama
   `'move'`): si el grupo candidato está bloqueado, descartarlo como destino (no
   resaltar, dejar `objetivoCat=null`).
3. **Doble seguro** — en `soltarArrastre` (`index.html:2047-2053`, rama `'move'`):
   aplicar `moverACategoriaEnPos` solo si `!estaBloqueada(dr.objetivoCat)`.

#### Coherencia con otras acciones existentes

- **Renombrar categoría** (`renomCat`, `index.html:2172`): si estaba bloqueada,
  propagar el nuevo nombre también en `catLocks`.
- **Borrar categoría** (`delCat`, `index.html:2165`): quitar su entrada de
  `catLocks` si existía.

#### Qué se toca / qué no

- **Toca:** `bon_cat_locks` (nuevo), `renderPatron`, `arrancarArrastre`,
  `evaluarObjetivo`, `soltarArrastre`, `renomCat`, `delCat`, + un poco de CSS.
- **No toca:** el flujo de factura/dictado, `ordenarPorPatron`, el orden ya
  guardado, ni `texto_voz`. El candado es solo una restricción de edición en la
  pantalla del Patrón.

#### Verificación posterior

1. Cerrar 🔒 una categoría → sus ⠿ y ⇆ no arrastran; no se puede soltar un
   producto de otra categoría dentro de ella.
2. Abrir 🔓 → todo vuelve a funcionar como hoy.
3. Recargar → el estado del candado persiste.
4. Renombrar una categoría bloqueada → sigue bloqueada con el nombre nuevo.

#### Puntos a confirmar antes de tocar código

1. ¿Candado = bloquea solo el **arrastre de productos** (no reordenar la categoría
   entera ni los botones +/✕)?
2. ¿Candado en el **extremo derecho del encabezado** (simple) o en la **esquina
   inferior derecha** con CSS absoluto?
3. ¿Aplicar **ya** la migración del catálogo (A) y dejar el candado (B) para un
   segundo paso, o aplicar **ambos juntos** tras confirmar?
