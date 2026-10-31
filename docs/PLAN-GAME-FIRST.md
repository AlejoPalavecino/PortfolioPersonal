# Game-first — contrato de implementación y revisión

`ESTADO_DISENO: LISTO_PARA_TDD_RED`. Encargo del 30/10/2026 sobre baseline `57e2ed8dfaf53ef4da779f7fed28c782ba417404`; no había commits posteriores al iniciar. Rama de revisión `feat/game-first-camp`. Las reglas nuevas sustituyen composición navbar/hero/página vertical y cámara móvil de isla completa; las fuentes originales quedan históricas.

## Plan corto y ownership

| Slice | Responsable exclusivo | Archivos / resultado |
|---|---|---|
| GF-1 núcleo | core worker | `src/core/camera/**`, `src/core/experience/**`, `src/shared/scene-loader/**`; cámara/lifecycle puros, loader con IO fakeable. |
| GF-2/3 experiencia | UI worker | `src/app/**`, `src/styles/**`; intro, loader browser adapter, HUD, cámara/input, lectura/historial y RAF. |
| Integración | root | `src/entities/**`, `src/widgets/**`, config, README, publicación/evidencias. Flower: facturación automática de ventas mediante ARCA. |
| RED/QA | test_runner | `tests/**` únicamente; escribir RED primero; navegador/preview/capturas luego. |
| Contrato | architect | Charter/playbook/este plan, sin código. |

Core y UI se comunican por barriles, usando este microcontrato antes de implementar; root adapta ESLint boundaries para nuevos núcleos. No editar archivos de otro dueño ni revertir sus cambios. Archivos <200 líneas y funciones <40 cuando sea realista; dividir responsabilidades, no introducir helpers sin propósito. Unidades de revisión/commit <=400 líneas authored; no push a main ni publicación de esta rama sin autorización posterior.

## Cámara pura — `src/core/camera/index.ts`

```ts
import type { Point } from '../domain';
type Size = { width: number; height: number };
type Camera = { x: number; y: number; scale: number };
declare function createCamera(world: Size, viewport: Size,
  focus: Point, scale: number): Camera;
declare function worldToScreen(point: Point, camera: Camera): Point;
declare function screenToWorld(point: Point, camera: Camera): Point;
declare function followCamera(camera: Camera, focus: Point,
  world: Size, viewport: Size, deltaMs: number,
  options?: { locked?: boolean; reducedMotion?: boolean }): Camera;
```

Todos los tipos y funciones anteriores se exportan. `Point` viene del dominio existente. Tamaños/scale finitos positivos; app ignora ResizeObserver con área cero. Camera x/y es esquina superior izquierda **lógica**, no traslación en píxeles. Pantalla local `(point - camera.xy) * scale`; la inversa divide y suma cámara. El adaptador resta primero rect.left/top del viewport útil.

Por eje: visible = viewport/scale. Si visible >= world, origen `(world-visible)/2` centra el mundo; en otro caso clamp(focus-visible/2, 0, world-visible). `createCamera` usa esa regla en ambos ejes. `followCamera` conserva scale; locked, reducedMotion o delta<=0 devuelven cámara sin cambio. En otro caso interpola hacia el centro clamped con alpha = `1-exp(-min(deltaMs,100)/120)` y respeta límites. No overshoot ni movimiento con foco/cámara estables.

App calcula escala de cobertura `max(vw/ww,vh/wh)` y mínimo móvil inicial 1.15, afinable tras inspección. El viewport útil excluye bandas reservadas al HUD/safe areas; el transform de mundo y conversión de input usan el mismo rectángulo. Terreno, POIs, avatar y entradas comparten transformación; HUD y lectura quedan fuera. Texto/rótulos mantienen escala legible. Resize conserva posición, ruta, visitas y contenido; reencuadra/clampa sin reiniciar visita. Lectura/overlay/reducción congelan follow.

## Lifecycle puro — `src/core/experience/index.ts`

```ts
type ExperiencePhase = 'intro' | 'loading' | 'ready'
  | 'explore' | 'read' | 'direct';
type PreparationStatus = 'idle' | 'loading' | 'ready' | 'failed';
type Overlay = 'none' | 'menu' | 'help' | 'settings';
type ExperienceState = {
  phase: ExperiencePhase; preparation: PreparationStatus;
  generation: number; slow: boolean; entered: boolean;
  direct: boolean; overlay: Overlay;
};
type ExperienceEvent =
  | { type: 'load-start'; generation: number }
  | { type: 'load-ready'; generation: number }
  | { type: 'load-failed'; generation: number }
  | { type: 'load-slow'; generation: number }
  | { type: 'enter' } | { type: 'direct' }
  | { type: 'read' } | { type: 'camp' }
  | { type: 'overlay'; overlay: Overlay };
declare function createExperience(options?: {
  direct?: boolean; entered?: boolean
}): ExperienceState;
declare function reduceExperience(state: ExperienceState,
  event: ExperienceEvent): ExperienceState;
```

Exports de todos los tipos/funciones anteriores. Inicial: intro, idle, generación0, slowfalse, enteredfalse, directfalse, overlaynone; opciones direct:true inicia direct, entered conserva aceptación previa de intro. Sin mutar entrada ni usar DOM/storage.

| Evento | Semántica |
|---|---|
| load-start | Solo generación mayor que vigente. preparation=loading, slow=false; fase loading si era intro/loading/ready. No retira direct/read/explore. |
| load-ready | Solo generación vigente mientras loading. preparation=ready. Si estaba intro/loading/ready: ready primera vez, explore si entered=true y direct=false. Nunca autoentrar en primera visita ni abandonar direct/read. |
| load-slow | Solo generación vigente/loading: slow=true; no éxito ni cambio de vista. |
| load-failed | Solo vigente/loading: preparation=failed. Desde explore pasa direct/direct=true; desde read conserva lectura con direct=true; desde direct no abandona vista; desde intro/loading/ready vuelve intro con error. |
| enter | Solo preparation=ready: explore, entered=true, direct=false, overlay=none. |
| direct | phase=direct, direct=true, overlay=none. App abre Proyectos o sección seleccionada sin recorrido. |
| read | phase=direct si direct=true; de otro modo read. |
| camp | Explore si ready+entered+!direct. Direct si direct=true o preparación failed. Si no: ready/loading/intro según preparación. |
| overlay | Actualiza overlay; no inventa ruta ni navega. App pausa ruta/manual al abrir; cerrar no reanuda. |

`entered` se persiste por adaptador en sessionStorage solo tras Enter explícito; catch/memoria si storage no está disponible. Deep-link inicia modo directo y abre contenido sin esperar preparación. Completar carga no retira ese contenido. La fase no duplica posición/ruta/vista del dominio; lifecycle y navegación se sincronizan desde un controlador de aplicación.

## Loader con IO — `src/shared/scene-loader/index.ts`

```ts
type SpriteFrame = { name: string; w: number; h: number;
  anchorX: number; anchorY: number };
type ScenePreparation = {
  generation: number; status: 'idle' | 'loading' | 'ready' | 'failed';
  completed: number; total: number; timedOut: boolean;
  error: string | null; frames: readonly SpriteFrame[];
};
type SceneLoaderPorts = {
  metadata(): Promise<unknown>;
  image(file: string): Promise<void>;
  navigation(): Promise<void>;
};
declare function createSceneLoader(ports: SceneLoaderPorts,
  onChange: (state: ScenePreparation) => void, timeoutMs?: number): {
    start(): void; retry(): void; dispose(): void;
    readonly state: ScenePreparation;
  };
```

Todos exportados. Inicial idle/gen0/completed0/total28/timedOutfalse/errornull/frames[]. `start` explícito y no-op fuera idle. `retry` incrementa generación, limpia timer y empieza operaciones reales; `dispose` invalida callbacks y limpia timer. Default timeout=8000 ms.

28 operaciones: JSON metadata validado1, navegación validada1, seis imágenes1 cada una, veinte frames1 cada uno. Las seis rutas relativas assets son `world-backdrop.webp`, `camp-ground.webp`, `poi-projects.webp`, `poi-about.webp`, `poi-journey.webp`, `poi-contact.webp`. Frames: `avatar/{name}.webp`. Idle inicial ya está entre esos20, no cuenta dos veces.

Metadata exige exactamente cuatro idle-{down,left,right,up} y cuatro walk-{direction}-{1..4} por dirección, sin duplicados/nombres externos; dimensiones finitas positivas y anclajes finitos dentro de su cuadro. Solo tras validar JSON se solicitan sus20 sprites. Cada éxito incrementa completed una vez; ready únicamente al completar28. Fallo crítico marca failed inmediatamente y no puede terminar ready esa generación. Rechazos/callbacks antiguos no alteran la nueva generación ni producen unhandled rejection.

A los8 s pendientes: status sigue loading, timedOut=true; UI ofrece/enfatiza continuar directo y reintentar. Nunca es espera mínima. Éxito tardío puede dar ready, sin cambiar direct/read ni foco. El progreso representa operaciones, no bytes ni porcentaje de tiempo. IO browser usa assetUrl, fetch JSON con response.ok, imágenes +decode y caché naturalWidth; conserva referencias preparadas. navigation valida WORLD/spawn/cuatro entradas/caminos. Audio/PDF/retrato/capturas no pertenecen al gate.

## Integración de navegación, contexto y render

Reusar eventos y tokens existentes. Un único escritor de estado; `generation` de recursos es distinto a `revision` de intención. Select-section desde modo directo o con reducción/escena no lista abre directamente (`arrived:true` en adapter), sin habilitar movimiento ni modificar preferencia del visitante. En juego listo conserva autoruta normal. No emitir arrive por timeout: solo al consumir recorrido y alcanzar entrada vigente.

Input habilitado solo en explore+ready+overlaynone+navcamp+!reduced. Overlay abre pause; su cierre conserva ruta pausada con Continuar/Abrir ahora/Cancelar. Nuevo destino reemplaza intención y cierra overlay. Pestaña oculta pausa manual/autoruta/audio y limpia teclas. Una pulsación Escape consume solo la capa más prioritaria.

Contexto `{view, camera, panelScrollTop, focusId}` guardado al empezar primera ruta/abrir ficha; sustitución conserva origen. Cancelar mantiene posición alcanzada y restaura lectura/foco; cámara debe contener esa posición o ajustarse mínimamente. Lista→detalle→lista conserva scrollTop/tarjeta. Panel no modal, mundo inert, HUD disponible; no window.scrollTo/scrollIntoView. Menú overlay no cambia dimensiones del juego. Historial solo vistas/modo; deep-link y Atrás restauran sin nueva ruta ni entradas duplicadas.

Separar `renderFrame` (transform/frame/posición/z-index) de render de estado/HUD/panel. No reescribir live regions/foco/historial por frame; proximidad anuncia solo cambio de candidato. DOM persistente evita reinicio de mundo y pérdida de foco. Decoración moderada/transiciones200–350 ms opcionales, omitidas con reducción.

## DoT y criterios de revisión A–M

| Capa / prueba | Resultado que debe demostrar |
|---|---|
| Cámara RED | Inversas con pan/zoom, límites/letterbox, follow sin overshoot, quietud, lock/reducción; input local coincide con terreno visible. |
| Lifecycle RED | Primera carga rápida espera Enter; Enter prematuro no-op; deep-link/directo accesibles; ready tardío no roba vista; generaciones viejas ignoradas; reingreso y overlays coherentes. |
| Loader RED con IO fake |28 operaciones reales; todos20 sprites pendientes impiden ready; fallo/JSON corrupto; cached success inmediato;8 s fallback sin espera mínima; éxito tardío, retry y dispose ignoran callbacks viejos. |
| Regresión | Suites existentes de navegación/geometría/Pages verdes; última ruta, cancelación, pausa, posiciones, assetUrl y subruta preservados. |
| Flujo A/B/E/F/I | Inicio→Entrar→elegir→caminar→leer→volver en escritorio/móvil; cuatro destinos accesibles aunque fuera de cámara, CV/contacto disponibles siempre. |
| Cámara/HUD C/D/G | Avatar reconocible móvil, transform inversa, menú no empuja, pausar/sustituir/cancelar sin aperturas viejas ni pérdida de cámara/foco. |
| Lectura H/K/L | Fichas largas completas con scroll interno, regreso/lista, modo directo, reducción, recarga/deep-link/Atrás/Adelante; sin scroll de documento para jugar. |
| Carga J/M | Caché, red lenta, bloqueo de crítico, metadata/sprite corrupto, reintento y subruta `/PortfolioPersonal/`; controles profesionales utilizables antes de ready. |

QA en ego(lite) con Space dedicado y capturas de intro/exploración/ruta/ficha: 1366×768,1280×720,390×844,360×640,320×568 y móvil horizontal. Añadir teclado y texto ampliado; menú/panel/intro crecen con scroll interno sin perder acciones. Medir tiempos/fluidez solo en entornos realmente usados. Teléfono físico/mezcla audible pendientes si no se prueban. Compilación y captura no acreditan solos recorridos.

No hay migración/DB ni nuevos secretos. Ejecutar tests/lint/build, revisar fronteras y Gitleaks staged antes de commit. Entregar preview de revisión, commit, capturas y matriz comprobado/parcial/pendiente. Faltantes editoriales/identidad permanecen; no declarar casos completos ni aceptación global. Supuestos reversibles: escala móvil inicial propuesta1.15, smoothing120ms, panel no modal y recuerdo de intro por sesión. Integración de revisión: escala móvil1.08 (avatar77px en las vistas verticales probadas); reintento visible en fallo, con acceso directo siempre disponible también al superar8s. El ajuste y su recomendación informativa se registran en JUDGMENT-GAME-FIRST.md.
