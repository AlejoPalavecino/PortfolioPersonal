# Campamento — ingeniería y operación vigente

> Cierre 0.3.1-review.1: preferencia manual persistente `camp:motion:v1` aplicada antes de DOM; lectura con un scroll; ghost con máscara alfa. Stack y matriz de fronteras preservados con ESLint10/boundaries7; auditoría completa en CI preparada, sin ejecutar remoto. [Reproducción exacta](QA-CLOSURE.md), [dependencias](DEPENDENCIES-CLOSURE.md) y [aceptación actual](ACEPTACION-CLOSURE.md) tienen precedencia sobre descripciones históricas.

> Actualización 0.3.0-review.1: los contratos de calidad vigentes están en [PLAN-QUALITY](PLAN-QUALITY.md) y los resultados/límites en [ENTREGA-QUALITY](ENTREGA-QUALITY.md). La geometría es explícita en `DESTINATIONS`; la preparación crítica usa `camp-hillside.webp`. Los apartados siguientes conservan el contexto de 0.2.0 cuando no se indica una actualización.

El catálogo editorial y su incorporación se describen en [CREDENTIALS](CREDENTIALS.md). Exportar gráficos con `npm run assets` ya no sobrescribe el CV; un PDF aprobado se importa con `python tools/import_cv.py RUTA_AL_PDF`. La preferencia interna de movimiento dura el montaje y se combina con la del sistema; los cierres habilitan exploración al comenzar salida, manteniendo el panel inerte.

`ESTADO_DISENO: LISTO_PARA_TDD_RED`. Mantener Vite + TypeScript estricto + DOM/CSS, con núcleo puro y adaptadores de navegador. El encargo game-first del 30/10/2026 autoriza implementar en rama de revisión sin otra entrevista; no autoriza publicar esta evolución desde `main`.

## Estructura y dependencias

| Módulo | Responsabilidad |
|---|---|
| `src/core/domain/index.ts` | Tipos, navegación, tokens, geometría, A*, colisiones y WORLD existentes. No se duplica otro sistema de rutas. |
| `src/core/camera/index.ts` | Cámara pura: foco, clamp, seguimiento y conversiones mundo/pantalla. |
| `src/core/experience/index.ts` | Ciclo intro/preparación/entrada/lectura/directo y overlays, sin DOM ni historial. |
| `src/shared/scene-loader/index.ts` | Preparación crítica con IO inyectado, progreso real, timeout y generaciones de reintento. |
| `src/shared/index.ts` | `assetUrl` compatible con BASE_URL y exports compartidos. No depende de app. |
| `src/app/` | Composición, adaptadores IO, input, RAF, audio, HUD y vistas/historial/foco. Dividir módulos antes de concentrar responsabilidades. |
| `src/entities` / `src/widgets` | Hechos/proyección pública y markup de secciones/fichas compartido entre juego y modo directo. |
| `src/styles/` | Viewport, capas, intro, HUD, mundo, panel, responsive y reducción. Retirar reglas viejas de hero/navbar/scroll para evitar cascadas contradictorias. |

Dependencias hacia núcleo; comunicación entre módulos por barril. ESLint boundaries debe reconocer cámara/experience como dominio puro y loader como shared. Meta <200 líneas/archivo y <40/función; unidad de revisión <=400 líneas authored. No hay backend, DB ni Docker `_test`.

Se conserva la elección de stack: tipos discriminados e IO explícito permiten probar cámara/estados/races sin runtime de juego añadido. React, Astro o un motor nuevo no resuelven una limitación necesaria del encargo actual; no se introducen dependencias por comodidad inicial.

## Contratos vigentes

[PLAN-GAME-FIRST](PLAN-GAME-FIRST.md) contiene firmas exactas y semántica. La navegación existente conserva `createNavigation`, `reduceNavigation`, `WORLD`, `findPath`, `moveSafely`, `nearbySection`, sus eventos y revisión monotónica.

El adaptador sincroniza lifecycle con navegación: solo `explore` + escena ready + sin overlay + sin reducción permite mover. Una selección en modo directo, carga, fallo o reducción llama al dominio con apertura directa; no simula una ruta. Cada finalización del loader se compara con la generación vigente antes de habilitar escena.

RAF actualiza posición, frame, profundidad y cámara. La representación física puede correr cada frame; HUD, panel, foco, historial y regiones live solo ante cambios de estado relevante. La clave de HUD excluye coordenadas/cuadro actual, pero incluye ruta/id/status, vista, proximidad y preferencias. No reemplazar escena o HTML de lectura continuamente.

## Viewport, cámara e input

El shell ocupa viewport disponible con `100dvh` y alternativa `100vh`; safe areas se reservan para HUD/paneles. No hay min-height de página, margen negativo para mapa ni scrollIntoView/scrollTo de ventana para abrir, recorrer o leer. Intro/panel/menu permiten scroll interno si el texto ampliado no cabe.

Mundo/objetos/avatar comparten escala y origen lógico; HUD queda fuera del transform. Cámara usa viewport útil descontando áreas reservadas para mantener visible al personaje. Desktop muestra amplitud; móvil usa zoom cercano y follow limitado. Escalas/holguras se afinan en 320–390 px y horizontal.

Input de suelo: restar el rectángulo del viewport útil a clientX/clientY y aplicar `screenToWorld`; no dividir por ancho del mundo transformado. Toque solo si fue breve y no hubo arrastre/multitouch/scroll; conservar pinch zoom. Rótulos HTML mantienen legibilidad, proyectados con cámara o compensando escala.

WASD/flechas y Enter/E solo en escena enfocada y habilitada. Blur, overlay, lectura, ocultación y reducción limpian teclas. Abrir menú/ayuda/ajustes despacha pause si había ruta y suspende manual; cerrar no emite resume. Elegir otro destino cierra overlay y crea nueva intención. Continuar es explícito.

## Panel, foco e historial

Lectura como región HTML integrada, no modal: mundo inactivo, HUD disponible, sin aria-modal ni atrapar Tab. Título/regreso accesibles; panel con scroll interno y páginas largas completas. Si se elige diálogo modal real, debe gestionar foco e inert acordes y revisarse el contrato.

Contextos separados: avatar, cámara, vista, scrollTop del panel y foco de origen. Primera ruta guarda contexto; sustituir no lo sobrescribe. Cancelar restaura vista/lectura y mantiene posición física; cámara recuperada debe contener esa posición en área útil o ajustarse lo mínimo necesario. Cerrar una ficha normal recupera cámara/posición/foco de apertura. Lista→proyecto→lista conserva scrollTop y tarjeta.

Se conservan hashes `#proyectos`, `#sobre-mi`, `#trayectoria`, `#contacto`, `#proyectos/foxmind` y `#proyectos/flower`. Deep-link abre contenido inmediatamente sin intro ni espera gráfica. Historia registra vistas y modo juego/directo, no frames, rutas pendientes, overlays ni loader. Popstate/hashchange cancelan intención y restauran sin añadir historial. No impedir salir con Atrás.

Escape resuelve una acción: edición/control propio, overlay, ruta, detalle→lista o panel→contexto previo. Foco a elemento conectado/visible; fallback Menú del campamento. Intro reconocida una vez por sesión tras Enter mediante sessionStorage seguro; si falla, memoria sin bloqueo. Carga tardía no abandona lectura/directo ni roba foco.

## Loader y ambiente

Críticos: seis imágenes de mundo + metadata avatar +20 frames + validación de navegación: 28 operaciones reales. Cargar y decodificar imágenes antes de ready; conservar referencias preparadas para que primera caminata no descubra sprites. Audio, CV, retrato y evidencias no bloquean entrada.

IO comprueba respuesta JSON, estructura de 20 frames, Image/decode/cache y WORLD/entradas/conectividad. Completed solo cuenta éxitos; falla crítica produce aviso/reintento/directo. A los 8 s pendientes se marca lento y enfatiza continuar directo, sin espera mínima ni fingir éxito. Retry cambia generación y descarta callbacks/timers viejos; dispose invalida todo.

Sonido apagado por visita, una instancia y activación por gesto. Ocultar pestaña pausa movimiento/audio; volver no reanuda rutas ni teclas retenidas. Continuar audio sigue siendo explícito. Reducción respeta sistema/ajuste visible: sin caminar/follow/ambiente continuo ni transiciones decorativas.

## DoR, DoT y DoD

DoR: dirección y alcance explícitos; datos/estados/fallos/concurrencia/permisos/GRASP auditados. Sin escrituras remotas; generation del loader y revision de navegación independientes. Pendientes editoriales no bloquean la revisión.

DoT: tests de cámara/lifecycle/loader más suites existentes. Integración ego(lite), Space dedicado, comprobación funcional y capturas. Viewports 1366×768, 1280×720, 390×844, 360×640, 320×568 y móvil horizontal; texto ampliado/teclado. Preview bajo `/PortfolioPersonal/`. Cada resultado indica entorno/límite; sin teléfono físico, queda pendiente.

Comandos reales: `npm ci`, `npm test`, `npm run lint`, `npm run build`; build incluye `tsc --noEmit`. Preview subruta: `npm run build -- --base=/PortfolioPersonal/` y `npm run preview -- --base=/PortfolioPersonal/`. No hay script separado typecheck. No regenerar maestros ni añadir dependencias sin necesidad.

DoD: tests verdes, lint/tipos/build, revisión de diff/fronteras, Gitleaks staged, preview/capturas, commit local y docs. AC históricos no se cierran por arquitectura; registrar criterios A–M comprobados/parciales/pendientes y conservar faltantes editoriales. Contrato/tareas en [plan](PLAN-GAME-FIRST.md).

## Equipo y publicación

Rama de revisión del coordinador. Core worker posee cámara/experience/scene-loader; UI worker app/estilos; root widgets/entities, configuración, README/publicación y evidencias; test runner solo pruebas; arquitecto estos docs. Nadie edita pruebas ajenas, hace reset o revierte cambios de otros. Worktree es opción para equipos aislados, no necesidad para esta partición compartida.

Cada push a `main` despliega Pages: esta evolución permanece fuera hasta revisión/publicación autorizada. `assetUrl`, BASE_URL y metadatos públicos se conservan. [PUBLICACION](PUBLICACION.md) explica despliegue existente; sus evidencias 0.1.0 son históricas, no validación de la rama nueva.

Engram identifica `portfolioalejo`, pero búsquedas arch/overview y slice/campamento devuelven unknown_project. No sobrescribir ni duplicar memoria tras ese fallo; contrato durable en Git/docs hasta resolver identidad.
