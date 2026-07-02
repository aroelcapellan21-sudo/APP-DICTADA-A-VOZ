# PLAN — Modificacion #1 (BON: perfil de chofer + sombreado naranja)

> Fecha: 2026-07-02 · Solo analisis, NO se toco codigo. Requiere OK antes de editar.
> Archivo unico a tocar: bon/index.html (+ bon/sw.js para el deploy).
> Base: lectura read-only del index.html actual.

================================================================================
OBJETIVO (pedido de Ariel)
================================================================================
1. El tab "Facturas Reportadas" debe aparecer PRIMERO en el perfil del chofer.
2. Cuando un chofer tiene su reporte del dia APROBADO por el sistema, su carpeta
   en la lista debe mostrar un SOMBREADO NARANJA (ya cargo su factura).

================================================================================
PARTE A — Tab "Reportadas" de primero
================================================================================
Hoy el orden es:  Despachadas (desp) · Reportadas (rep) · Reportes (noche)
y el perfil abre en "Despachadas".

Cambios en index.html:
  1) Reordenar los 3 botones (lineas 741-743) ->
        Reportadas (rep)  ·  Despachadas (desp)  ·  Reportes (noche)
     La Reportadas queda con la clase activa 'bred'; las otras 'bout'.
  2) Tab por defecto: abrirPerfilChofer() llama cambiarTabPerfil('desp') (:2479)
     -> cambiar a 'rep'.
  3) Estado inicial: let cpTabActual='desp' (:2416) -> 'rep'.

No se toca la logica de datos: renderTabReportadas() ya existe y funciona.

================================================================================
PARTE B — Sombreado de la tarjeta segun el estado de DESPACHO (Rev.2)
================================================================================
El sombreado ahora refleja el estado de la factura de HOY del chofer
(listaDeHoyDeChofer = la lista fechada hoy, que sale del reporte de anoche via
auto-import). En BON "despachada" == la lista tiene escuchada:true (se dicto/
finalizo el despacho; ver "Ya despachadas hoy" :445 y finalizarDictado :2011).

  3 ESTADOS (Rev.3 — decision de Ariel: "verde antes de leer", sin naranja):
    VERDE    = factura cargada, SIN despachar (ANTES de leer/dictar).
               (reporto anoche, su factura esta lista pero aun no se despacha)
    AZUL     = factura cargada, SIN despachar, y YA pasaron las 3 PM.
               (alerta de retraso)
    NORMAL   = ya fue despachada/leida (escuchada:true)  O  no hay factura de hoy.
    (Se descarto el NARANJA.)

  '.lleno' se conserva SOLO para lo clicable (cursor:pointer + abrir la factura
  al tocar); el color de estado va en clases aparte.

  CAMBIOS en index.html:
  1) CSS :131 '.ch-card.lleno' -> quitar el borde/sombra verde; dejar solo
     cursor:pointer (+ :active scale). Agregar despues:
       .ch-card.pend{ borde+sombra VERDE }   (sin despachar, antes de las 3 PM)
       .ch-card.retraso{ borde+sombra AZUL } (sin despachar, pasadas las 3 PM)
     (definidos DESPUES de .lleno para que ganen la especificidad).
  2) renderChoferes (:2264) -> calcular la clase:
       let cls='ch-card'+(ld?' lleno':'');
       if(ld && !ld.escuchada) cls += (new Date().getHours()>=15 ? ' retraso' : ' pend');
       div.className=cls;
     Se mantiene el click (:2267) cuando ld existe.

  UMBRAL 3 PM: new Date().getHours()>=15 (hora local RD). Se evalua al renderizar;
  la tarjeta pasa a azul en el siguiente render/sync tras las 3 PM (no salta sola
  al segundo exacto). renderChoferes ya se llama en sync y varios eventos.

  NOTA (alcance): se usa listaDeHoyDeChofer (cualquier factura de hoy sin
  despachar, sin importar origen). El caso principal es la auto-importada del
  reporte de anoche; una factura creada a mano tambien entraria al mismo semaforo.

================================================================================
VERIFICACION (antes de commit)
================================================================================
- Perfil abre en Reportadas; el orden de tabs es el nuevo.
- Chofer 108 con reporte de hoy -> tarjeta naranja; sin reporte de hoy -> normal.
- DEPLOY: al ser cambio de front, subir bon/sw.js  bon-v5 -> bon-v6, o los
  telefonos no veran el cambio (leccion del deploy anterior).
- No se commitea hasta el OK de Ariel.

================================================================================
Ecosistema Polar Breeze · Ariel Capellan · Asesoria Claude (Anthropic) · 2026-07-02
