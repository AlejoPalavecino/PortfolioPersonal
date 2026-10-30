# Campamento — contrato y operación

`ESTADO_DISENO: LISTO_PARA_TDD_RED`. Implementar un sitio estático con Vite, TypeScript estricto y DOM/CSS modular. Núcleo puro sin DOM, audio, temporizadores ni dependencias de infraestructura. El dossier autoriza los detalles reversibles aquí definidos; la versión local de revisión no equivale a publicación ni a contenido aprobado.

## Stack y mantenimiento

| Opción | Fiabilidad, tipos y concurrencia | Mantenimiento / decisión |
|---|---|---|
| Vite + TypeScript + DOM | Unión discriminada para estados/eventos; núcleo determinista; build estático. Una sola intención de ruta elimina carreras de callbacks. | Elegida: pocas dependencias, adecuada para cuatro secciones y escena 2D; requiere renderizar componentes sin destruir foco/escena. |
| React + TypeScript | Tipado equivalente y estado declarativo; debe controlar cierres obsoletos y efectos repetidos de animación/audio. | Válida si crece la UI; añade runtime y ciclo de efectos sin necesidad actual. |
| Astro + TypeScript e isla interactiva | HTML estático de base y aislamiento del código interactivo. | Útil para contenido editorial mayor; añade frontera isla/estado para esta experiencia persistente pequeña. |

Un backend Go/.NET/Rust no aporta una transacción necesaria: no existen cuentas, escritura ni mensajes almacenados. No se introduce servidor por el stack de los proyectos exhibidos. Activar `strict`, `noUncheckedIndexedAccess` y compilación `tsc --noEmit`; Vite por sí solo no acredita tipos. Fijar versiones efectivamente instaladas en lockfile.

Consulta Context7 intentada: cuota mensual agotada; no hay documentación recuperada por esa vía. Las APIs finales se verifican con paquetes instalados, comprobación de tipos y documentación oficial de [Vite](https://vite.dev/guide/) y [build estático](https://vite.dev/guide/static-deploy.html). Esta elección no depende de un benchmark.

## Archivos y fronteras

| Unidad | Responsabilidad y archivos previstos |
|---|---|
| Dominio compartido | `src/core/domain/{index,types,navigation,geometry,pathfinding,world}.ts`; API pública solo por `index.ts`. Cada archivo <200 líneas, función <40; partir antes de crecer. |
| Composición | `src/app/{main,controller,history,preferences}.ts`; conecta dominio, HTML, RAF, visibilidad y audio. |
| UI | `src/widgets/{header,camp,reading,route-controls}.ts`; `src/pages/{projects,about,journey,contact,project}.ts`; cada módulo importa otros slices solo por su barril. |
| Contenido | `src/content/{index,portfolio}.ts`; proyección pública explícita, no importación del dossier editorial completo. |
| Estilos | `src/styles/` por tokens/base/cabecera/mundo/lectura/responsive, sin archivo monolítico. |
| Recursos | `tools/export_assets.py` y `public/assets/`; derivados WebP, fuentes, audio y PDF. Maestros del dossier intactos. |
| Pruebas | `tests/{navigation,geometry,content}.test.ts`; dueño exclusivo `test_runner`. Producción no puede relajarlas. |

Los nombres internos de UI pueden ajustarse sin cambiar la API de dominio. El contrato compartido se establece antes de implementar; después se trabaja por slice. Coordinador posee configuración/derivados, implementador posee `src/`, test runner posee pruebas y arquitecto posee estos dos documentos. Nadie revierte cambios de otros. Unidades de revisión/commit <=400 líneas; no crear worktree sobre esta carpeta compartida sin coordinar una copia aislada. No hay migraciones ni DB.

## Tipos públicos exactos

```ts
type Point = Readonly<{ x: number; y: number }>;
type SectionId = 'projects' | 'about' | 'journey' | 'contact';
type ProjectId = 'foxmind' | 'flower';
type View = { kind: 'camp' }
  | { kind: 'section'; section: SectionId }
  | { kind: 'project'; project: ProjectId };
type SceneStatus = 'loading' | 'ready' | 'failed';
type Target = { kind: 'section'; section: SectionId }
  | { kind: 'ground'; point: Point };
type Route = { id: number; target: Target;
  status: 'active' | 'paused'; origin: View };
type NavigationState = {
  view: View; position: Point; scene: SceneStatus;
  reducedMotion: boolean; route: Route | null;
  revision: number; visited: readonly SectionId[];
};
type NavigationEvent =
  | { type: 'select-section'; section: SectionId; arrived?: boolean }
  | { type: 'select-ground'; point: Point }
  | { type: 'arrive'; id: number; position: Point }
  | { type: 'move'; position: Point }
  | { type: 'cancel' } | { type: 'open-now' }
  | { type: 'pause' } | { type: 'resume' }
  | { type: 'set-motion'; reduced: boolean }
  | { type: 'set-scene'; scene: SceneStatus }
  | { type: 'route-failed'; id: number }
  | { type: 'manual' }
  | { type: 'open-project'; project: ProjectId }
  | { type: 'back-projects' } | { type: 'camp' }
  | { type: 'restore'; view: View };
declare function createNavigation(position: Point): NavigationState;
declare function reduceNavigation(
  state: NavigationState, event: NavigationEvent
): NavigationState;
```

Estado inicial: campamento, escena loading, movimiento habilitado, ruta null, revisión 0 y visitas vacías. El adaptador aplica la preferencia del sistema antes de habilitar movimiento. Ninguna transición muta el estado recibido.

| Evento / condición | Resultado obligatorio |
|---|---|
| Seleccionar sección | Lista y sin reducción: ruta activa con token nuevo, vista camp; conserva `origin` de la primera ruta si sustituye otra. Mismo destino activo/pausado no reinicia. |
| Misma sección abierta | No-op: conserva scroll, foco, posición y visitas. |
| Escena no lista / reducido / `arrived:true` | Apertura directa y única; invalida cualquier intención anterior. `arrived` solo lo calcula UI mediante zona geométrica, nunca con temporizador. |
| Arrive | Solo acepta id vigente y ruta activa; actualiza posición. Sección abre y marca visitada; suelo termina en camp sin abrir. Repetidos/obsoletos son no-op. |
| Reemplazar / cancelar | Nueva ruta invalida token anterior; cancelar vuelve a origin y mantiene posición alcanzada. No añade historial. |
| Manual | Cancela autoruta y apertura pendiente, queda en camp. Solo se despacha con escena enfocada/activa/lista y sin reducción. |
| Pause / resume | Pause conserva token/destino/origen. Resume solo por acción explícita; visibilidad recuperada no lo emite. |
| Movimiento reducido | Activar durante ruta a sección la abre; a suelo la cancela en camp. Desactivar no recupera rutas/teclas antiguas. |
| Scene loading/failed durante ruta | Ruta a sección abre vigente con aviso; suelo se detiene sin abrir. Terminar carga no navega ni enfoca. |
| Route-failed | Solo token vigente; sección abre con aviso, suelo cancela. UI anuncia sin inventar sección. |
| Open-project/back-projects/camp/restore | Inmediatos, invalidan ruta. Restore atiende historial sin volver a escribirlo. `open-now` solo corresponde a target sección. |
| Select-ground | UI valida suelo, gesto breve y escena activa; dominio ignora si lectura abierta, escena no lista o reducido. Sustituye ruta sin intención de apertura. |

`revision` incrementa al crear o invalidar intención; mover/pausar no crea un token. `visited` añade sin duplicados al abrir sección por cualquier acceso, nunca por proximidad o ruta cancelada; vive solo en memoria de la visita.

## Contrato geométrico

```ts
type Arrival = { point: Point; radius: number; proximityRadius: number };
type Obstacle = { kind: 'polygon'; points: readonly Point[] }
  | { kind: 'circle'; center: Point; radius: number };
type World = {
  width: number; height: number; spawn: Point;
  boundary: readonly Point[]; obstacles: readonly Obstacle[];
  arrivals: Readonly<Record<SectionId, Arrival>>;
  clearance: number; cellSize: number;
};
declare const WORLD: World;
declare function isWalkable(world: World, point: Point): boolean;
declare function findPath(world: World, from: Point,
  to: Point): readonly Point[] | null;
declare function moveSafely(world: World, from: Point, delta: Point): Point;
declare function nearbySection(world: World, point: Point): SectionId | null;
```

Coordenadas del apoyo de pies en marco lógico 1000×650 alineado al terreno completo. En móvil se conserva ese mismo terreno con ajuste responsive/encuadre; no se reordenan sus plataformas. Es una decisión reversible de integración frente al marco móvil de planificación 600×760. Debe conservar destinos reconocibles, orden espacial y controles HTML legibles; si el encuadre no lo consigue se ajusta/deriva el terreno y se documenta.

`clearance` representa radio corporal y holgura combinados. `isWalkable` exige coordenadas finitas, separación del borde y exclusión de obstáculos inflados. No usar márgenes transparentes del PNG como colisión. Spawn, entradas y suelo admitido pertenecen a un componente conectado.

`findPath` acepta extremos libres arbitrarios; devuelve from y to incluidos, `[from]` si coinciden, o null si no hay camino/extremos inválidos. Cada segmento completo debe ser transitable con holgura: prohibido cortar esquinas con diagonales. Estrategia prevista: A* en malla pequeña y conexión comprobada de extremos, con suavizado solo por segmentos libres. La red de diez nodos del dossier es orientación, no encierra al movimiento libre.

`moveSafely` parte de posición válida, subdivide el desplazamiento y frena en el último punto válido, incluso con un delta grande; no atraviesa obstáculos por salto de frame. La entrada diagonal se normaliza a la misma rapidez. `nearbySection` solo considera posición válida y llegada alcanzable dentro de proximidad; menor distancia, desempate fijo projects/about/journey/contact. No abre contenido.

El controlador usa `requestAnimationFrame`, distancia/velocidad y delta acotado, no timeout de apertura. Comprobar zona al avanzar; al llegar orienta/reposo y despacha arrive con token capturado. La nueva intención deja obsoleto el cálculo anterior. Orden de profundidad por apoyo Y; cuadros y anclajes individuales del atlas. No dividirlo en celdas uniformes.

## Historial, foco y permisos de entrada

Hashes previstos: `#campamento`, `#proyectos`, `#sobre-mi`, `#trayectoria`, `#contacto`, `#proyectos/foxmind`, `#proyectos/flower`. Carga inicial/deep-link restaura directamente, normaliza hash inválido a camp sin caminata. La URL solo cambia al abrir contenido real; no al empezar/sustituir/cancelar rutas, abrir menú o cambiar preferencias.

El adaptador guarda `{view, scrollY, focusId}` antes de la primera ruta y para lista→detalle. Redirigir conserva ese contexto; cancelar lo restaura con foco visible o emblema Campamento. Abrir contenido enfoca su título `tabindex=-1`. Volver a Proyectos restaura tarjeta y scroll. Regresos usan historial previo válido si corresponde; si no existe, reemplazan por destino seguro, sin crear ciclos. `popstate/hashchange` cancela ruta y restaura la vista histórica directamente; jamás crea otra entrada. No interceptar Atrás para impedir salir.

Escena es un control enfocable accesible solo durante camp listo y movimiento habilitado; teclado de movimiento se escucha allí. Blur, Tab, ocultación de pestaña, lectura y reducción limpian teclas. La autoruta continúa al perder foco de escena. Escena inactiva durante lectura también sale del orden Tab. No reconstruir cabecera/escena completa en cada frame.

Escape consume una sola acción: edición/composición/control propio; después Menú; después cancelar ruta; después detalle→lista/sección→camp cuando foco está en lectura; en escena sale del control manual al emblema. Un paisaje clicado no cierra ficha. Menú móvil se despliega en flujo, conserva Tab normal, informa aria-expanded; elegir sección lo cierra y lleva el foco a Abrir ahora si el disparador quedó oculto. Cambiar ajustes lo mantiene abierto.

## Audio, fallos y publicación

Un solo ambiente reutilizable por visita. Entrada siempre silenciosa; activar solo por gesto. Pausar en pestaña oculta; al volver solo puede reanudar si preferencia voluntaria sigue activa. Si play() falla, control indica inactivo, conserva UI y permite reintentar. Lectura no reinicia audio. Movimiento reducido respeta sistema y ajuste visible, detiene desplazamientos/efectos/cámara y oculta ayuda/exploración por teclado.

Fallos decorativos no bloquean contenido. Fallo principal o ruta inviable resuelve última sección con aviso breve y cancela tokens; suelo fallido no abre nada. Reintentar no altera vista/foco/preferencias. Captura ausente mantiene texto y reserva solo en revisión; archivo/enlace conocido ausente se oculta antes de publicar.

No copiar directorios del dossier al directorio público. Recursos previstos: `/assets/world-backdrop.webp`, `camp-ground.webp`, `poi-{projects,about,journey,contact}.webp`, `portrait.webp`, `emblem.webp`, `avatar/{frame.name}.webp` y `avatar/frames.json`; fuentes/audio bajo `/assets/`. Mapear explícitamente el PDF aportado a una ruta pública y comprobarlo. Una proyección pública de FoxMind omite stack y enlaces históricos; Flower conserva su stack confirmado. No confundir el enlace del cliente/proyecto con el stack del portfolio.

## DoR, DoT y DoD

DoR cumplido: reglas de datos, estados, fallos, concurrencia, permisos y GRASP auditadas. No hay escrituras remotas ni atomicidad DB. Único escritor del estado en main thread; token monotónico protege la última intención. Los faltantes editoriales conocidos siguen en [Charter](01-CHARTER-AND-BACKLOG.md), sin bloquear E1/E2.

| Prueba significativa (test_runner) | Debe demostrar |
|---|---|
| Navegación unitaria | Última sección gana; llegada vieja/repetida/pausada ignorada; origin conservado al sustituir; cancelación restaura vista y posición; manual borra apertura. |
| Estados y alternativas | Pausa/reanudación explícita; reducción activa en sección/suelo; fallo/carga sin apertura tardía; misma sección no-op; visita única solo al abrir; regresos inmediatos. |
| Geometría unitaria | Spawn/4 entradas libres; caminos entre entradas y muestras libres; todos los segmentos respetan clearance; esquinas y delta grande sin atravesar; diagonales normalizadas; suelo inválido rechazado. |
| Contenido/build | Bundle sin metadatos/notas internas ni enlaces/stack históricos de FoxMind; Flower correcto; tercero vacío omitido; enlace PDF existe y archivo empieza con firma PDF; tipos y build sin errores. |
| Integración navegador | UI→intención→ruta→llegada→contenido; redirección rápida; cancel desde detalle con scroll/foco; historial sin cola; fallo imagen/ruta y reintento; mailto/asuntos y PDF reales. |
| ego(lite), escritorio | Space dedicado, snapshot y capturas; hero/cabecera/ficha según v2; rutas a los cuatro destinos, teclado contextual, Enter/E, Tab/Escape, audio y pestaña oculta. |
| ego(lite), móvil | 390 px y ancho menor, ficha con franja, Contacto/CV/Menú visibles, destinos y suelo al toque, scroll/zoom, controles de ruta, texto ampliado y movimiento reducido. |

No se requieren pruebas Docker `_test`: el sistema no utiliza base de datos. Añadirlas solo si cambia el alcance. Test runner crea pruebas RED primero; implementador no las edita. Tras dos fallos consecutivos del mismo error, escalar causa al arquitecto.

Comandos previstos, confirmar contra package.json real: `npm install`, `npm run dev -- --host 127.0.0.1`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run preview -- --host 127.0.0.1`. Documentar puertos/dependencias efectivamente usados al entregar. El build produce `dist/`; no requiere servicio de aplicación ni Docker. Validar fronteras con eslint-plugin-boundaries y revisar plantilla local antes de integrar configuración.

DoD técnico: tests significativos verdes, tipos/linter/build sin errores, revisión de diff y entorno, evidencias UI reales, docs/Engram sincronizados y `gitleaks protect --staged` antes de commit. Registrar una herramienta ausente como limitación; nunca afirmar una ejecución no realizada. Commit local autorizado; push/PR/publicación requieren el encargo correspondiente. AC-18/19/20 pueden seguir pendientes por contenido y AC-25 hasta URL pública. La entrega siempre distingue estructura terminada, comportamiento comprobado y material pendiente.

## Supuestos y ajustes registrados

2026-10-29: perfil `solo` provisional; Vite/TS/DOM y proyección editorial manual; hash routing por hosting estático; geometría única alineada al terreno frente al marco móvil abstracto. Estas decisiones son reversibles y preservan DEC-13/14/15/16/26/28. Objetivos de tiempo siguen pendientes de medición. No se registra aprobación individual de recomendaciones ni pruebas ejecutadas desde este documento.
