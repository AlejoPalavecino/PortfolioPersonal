# Entrega · Interiores de sección y llegada cinematográfica (`camp-rooms-v1`)

## 1. Inspección de versión y rama de trabajo
- **Repositorio de referencia**: `https://github.com/AlejoPalavecino/PortfolioPersonal`
- **Commit base inspeccionado (`HEAD` inicial)**: `d08f9c02e0ae3c9a080eb52dd3bdd45346a9c0d3` (`Cierre completo del portfolio interactivo de Alejo Palavecino`). Coincide con `codeReference` de `public/assets/camp-rooms-v1/manifest.json`.
- **Rama de trabajo**: `review/interiores-y-cinematica-v1` (sin push a `main` ni publicación automática).
- **Integración preservada**:
  - Se conservaron el mapa exterior (`WORLD.width = 1600`, `WORLD.height = 900`), obstáculos, puntos de llegada (`[650,345]`, `[360,360]`, `[980,520]`, `[1190,345]`), buscador de caminos (`src/core/navigation`), cámara (`src/core/camera`), controlador (`src/app/controller.ts`), sesión (`src/app/session.ts`), historial/rutas (`src/shared/index.ts`), bus de eventos (`src/core/fx/cues.ts`), audio voluntario (`src/app/audio.ts`) y pruebas de cierre existentes (`tests/closure-*.test.ts`, `tests/quality-*.test.ts`).

---

## 2. Arquitectura e integración implementada

### 2.1 Cuatro interiores completos por sección (sin el campamento detrás de un modal)
- Al entrar a una sección (`#app[data-reading="true"]`), `.landscape` se oculta por completo (`display: none; visibility: hidden`) y `.panel` ocupa el `100% × 100dvh` con la escena interior de la sección (`data-room="projects | about | journey | contact"`, `data-room-theme="workbench | linen | journal | radio"`):
  1. **Proyectos → Taller de soluciones (`workbench`)**: Fondo `rooms/projects-desktop.webp` / `rooms/projects-portrait.webp` (`image-rendering: pixelated`), cabecera `.room-topbar`, escenario `.room-stage` con avatar contextual y placa `01 · Taller de soluciones`, tarjetas de **FoxMind** y **Flower** con estado, rol, stack y acciones claras. Abrir un caso (`#proyectos/foxmind`, `#proyectos/flower`) transforma el contenido dentro del mismo taller sin repetir la transición ni recargar la imagen del taller; volver a la lista restaura el scroll y el foco.
  2. **Sobre mí → Carpa personal (`linen`)**: Fondo `rooms/about-desktop.webp` / `rooms/about-portrait.webp`, perfil profesional verificable, retrato ilustrado, forma de trabajar y los cuatro servicios requeridos (**Software a medida**, **Análisis funcional**, **Integraciones y automatización**, **IA aplicada**), sin porcentajes inventados ni aficiones inferidas del fondo decorativo.
  3. **Trayectoria → Archivo de expedición (`journal`)**: Fondo `rooms/journey-desktop.webp` / `rooms/journey-portrait.webp`, pliego de dos páginas en escritorio (`.archive-spread`) y una columna en móvil, con pestañas internas (`Recorrido` y `Certificados y reconocimientos` incluyendo la categoría `Menciones`) dentro del mismo archivo sin recargar la sala. Los tres registros en estado `draft` (`ilan-foxmind`, `egg-full-stack`, `ucm-mobile`) permanecen fuera de publicación.
  4. **Contacto → Puesto de radio (`radio`)**: Fondo `rooms/contact-desktop.webp` / `rooms/contact-portrait.webp`, hoja de correspondencia con dos intenciones claras (**Tengo una oportunidad laboral** y **Necesito un desarrollo a medida**), aviso explícito de que los botones abren el cliente de correo de la persona visitante (sin simular envío con servidor inexistente), copia de correo con estado real (`[data-action="copy-email"]`) y campo `<input readonly class="copy-fallback">` seleccionable si el navegador bloquea el portapapeles.

### 2.2 Entrada contextual en umbral, precarga de variante única y salida con restauración
- **Precarga deduplicada (`src/shared/room-loader.ts`)**: Al seleccionar un destino (`destination-selected`), `roomLoader.prefetch(section)` descarga y decodifica únicamente la variante activa según el viewport (`desktopAsset` o `portraitAsset`), sin descargar ambas a la vez.
- **Actuación de umbral sin violar colisiones (`src/app/fx/world-fx.ts` + `src/app/views.ts`)**: Al llegar a `WORLD.arrivals[section].point`, el controlador detiene el movimiento en esa coordenada transitable; `.threshold-stage` muestra el gesto breve de entrada (`door-open`, `canvas-open`, `journal-open`, `radio-signal`, `~280 ms`) y `.room-curtain` encadena hacia el interior (`Entrando al taller…`, etc., o `Preparando el interior…` si la imagen aún está descargando).
- **Tolerancia a fallos**: Si el fondo de una sala falla, la sala abre igualmente con su color sólido de tema (`#241b16`, `#1f2a24`, `#261e17`, `#16262f`) y ofrece el aviso no bloqueante `.room-bg-fallback` con botón `Reintentar fondo`.
- **Cancelación por última intención**: Un token incremental (`context.transition`) invalida cualquier transición anterior si la persona usuaria cambia de destino, abre otra ruta o cancela.
- **Restauración al salir**: Al volver al campamento (`Salir al campamento`, `Escape` o botón de marca), se restauran la coordenada exterior previa (o el punto seguro `WORLD.arrivals[room].point` si se ingresó por enlace directo), la cámara y el foco accesible.

### 2.3 Nueva presentación inicial de 6,8 s (`data/intro-timeline.json`)
- Implementada en `sampleIntroTimeline` (`src/core/experience/index.ts`) e `intro-fx.ts` (`src/app/fx/intro-fx.ts`):
  - `0,0–1,2 s`: Paisaje de montaña y sendero (`mountain-arrival.webp` / `mountain-arrival-portrait.webp`).
  - `1,2–2,8 s`: El avatar entra caminando por el sendero (`walk-right-1..4` del atlas normalizado).
  - `2,8–4,8 s`: Se detiene, gira hacia quien visita (`idle-down`) y presenta `Soy Alejo Palavecino.`.
  - `4,8–6,2 s`: `Desarrollo software. Transformo ideas en productos.` y especialidades `Full stack · Análisis · Automatización e IA`.
  - `6,2–6,8 s`: Encadenado hacia el campamento jugable y activación automática cuando los recursos base están listos.
- Controles `Pausar presentación` (`[data-action="intro-pause"]`) y `Omitir presentación →` (`[data-action="skip-intro"]`) visibles desde el primer cuadro, además de `Ver portfolio sin recorrer`, `Contacto`, `CV ↓`, `Sonido` y `Reducir movimiento`.
- Separación estricta entre el guion narrativo de `6,8 s` y el progreso real de recursos (`0..28`). Se pausa automáticamente al ocultarse la pestaña (`visibilitychange`) sin acumular saltos bruscos al regresar.

### 2.4 Cuatro soportes de carteles exteriores con texto HTML
- En `src/app/world-markup.ts` y `src/styles/world-signs.css`:
  - `projects` (`data-mount="fachada-taller"`): Cartel integrado sobre el alero del taller.
  - `about` (`data-mount="poste-suelo"`): Poste clavado junto al acceso de la carpa.
  - `journey` (`data-mount="placa-mesa"`): Placa de lectura frente a la mesa de bitácora.
  - `contact` (`data-mount="tablilla-radio"`): Tablilla técnica junto al puesto de radio.
- Cada señal usa las placas del pack (`signs/sign-*-idle|hover|selected|visited.png`) con texto HTML real (`Proyectos`, `Sobre mí`, `Trayectoria`, `Contacto`), foco visible y dimensiones de caja fijas sin saltos entre estados.

---

## 3. Matriz de aceptación A01–A30

| ID | Criterio | Estado | Evidencia y verificación |
|---|---|---|---|
| **A01** | Se inspeccionó HEAD y se registró qué versión incorpora el paquete. | **comprobado** | `HEAD` inicial `d08f9c02e0ae3c9a080eb52dd3bdd45346a9c0d3` inspeccionado y registrado en sección 1; rama `review/interiores-y-cinematica-v1`. |
| **A02** | Primera entrada muestra la secuencia de 6,8 s; Omitir funciona desde el primer cuadro. | **comprobado** | Verificado en `tests/interiors-and-cinematics.test.ts` y Playwright (`intro-1366x768.png`, `desktop-interiors-walkthrough.webm`): `[data-action="skip-intro"]` visible en `t = 0`. |
| **A03** | Cinemática no se presenta como porcentaje de descarga; progreso de recursos es real. | **comprobado** | `.loading-progress` refleja el conteo real `loaded/total` (`0..28`) de `createSceneLoader`, independiente del reloj narrativo de `6800 ms`. |
| **A04** | Enlace directo y movimiento reducido evitan la intro y dan acceso al contenido. | **comprobado** | `tests/experience.test.ts`, `tests/closure-motion.test.ts` y `src/app/fx/intro-fx.ts` omiten la animación espacial con `reducedMotion` o hash directo. |
| **A05** | Carga que termina mientras se lee no roba foco, URL, escena ni scroll. | **comprobado** | `tests/closure-loading.test.ts` comprueba preservación de foco, scroll y ruta cuando `scene.load()` resuelve durante lectura. |
| **A06** | Proyectos conserva taller y Sobre mí conserva carpa. | **comprobado** | `WORLD.destinations` y `ROOM_META` mantienen `projects → Taller de soluciones` (`[650,345]`) y `about → Carpa personal` (`[360,360]`). |
| **A07** | Al seleccionar un destino se precarga su interior sin bloquear caminar. | **comprobado** | `controller.select()` emite `destination-selected` antes de caminar y dispara `roomLoader.prefetch(section)` de forma asíncrona. |
| **A08** | Personaje llega a una zona válida; entrada visual no atraviesa colisiones del mundo. | **comprobado** | `tests/quality-geometry.test.ts` + `world-fx.ts`: el controlador permanece en `WORLD.arrivals[section].point` (`650px, 345px` en Taller) mientras `.threshold-stage` ejecuta el gesto visual. |
| **A09** | Cambia el fondo completo al interior; no queda el antiguo exterior tras el mismo modal. | **comprobado** | Con `#app[data-reading="true"]`, `.landscape` queda `display: none` (`landscapeHidden: true` en todos los viewports de `verification-report.json`). |
| **A10** | Cuatro secciones usan tratamientos de lectura diferenciados pero coherentes. | **comprobado** | Temas `workbench`, `linen`, `journal` (pliego doble en escritorio) y `radio` (hoja de correspondencia), verificados en capturas `room-*-1366x768.png` y `room-*-390x844.png`. |
| **A11** | No se exige caminar otra vez dentro de un interior para consultar información. | **comprobado** | Toda la navegación interna (casos, pestañas, otras salas, contacto y CV) se opera por clic/teclado directo desde `.room-topbar` y tarjetas. |
| **A12** | Abrir un caso mantiene el taller y no repite carga/entrada. | **comprobado** | En `views.ts`, cambiar entre `projects` y `case` detecta `sameRoom === true`, actualiza `.panel-content` sin transición de umbral ni recarga de `projects-desktop.webp`. |
| **A13** | Recorrido y reconocimientos permanecen en el mismo archivo. | **comprobado** | Cambiar entre `journey`, `recognitions` y `credential` conserva `data-room="journey"` sin reejecutar entrada ni recargar fondo (`room-journey-recognitions-1366x768.png`). |
| **A14** | Salir restaura posición exterior, cámara y foco. | **comprobado** | Comprobado en `verification-report.json` (`afterWorkshopExit`: avatar en `650px, 345px`, `reading: "false"`, foco devuelto a `[data-section="projects"]`). |
| **A15** | Cambio rápido de destino invalida la entrada anterior. | **comprobado** | `cancelPendingTransition()` incrementa `context.transition` en cada nueva intención o cambio de vista, descartando timers previos. |
| **A16** | Atrás/Adelante, recarga y enlaces directos funcionan con las rutas existentes. | **comprobado** | `tests/history.test.ts` + `bindEvents` (`popstate` / `hashchange`) mantienen `#campamento`, `#proyectos`, `#proyectos/foxmind`, `#proyectos/flower`, `#sobre-mi`, `#trayectoria`, `#reconocimientos`, `#contacto`. |
| **A17** | Fallo de un fondo no bloquea leer ni contactar. | **comprobado** | Comprobado en `tests/interiors-and-cinematics.test.ts` y Playwright (`room-about-fallback-390x844.png`): fallo inducido en `about-portrait.webp` muestra el contenido sobre fondo `#1f2a24` con botón `Reintentar fondo` funcional. |
| **A18** | Sonido sigue siendo voluntario y no se duplican loops al cambiar salas. | **comprobado** | `tests/audiovisual.test.ts` comprueba `enabled === false` inicial y única instancia de loop ambiental reutilizada. |
| **A19** | Preferencia de movimiento reducido cubre intro, FX, cámara y transiciones. | **comprobado** | `tests/closure-motion.test.ts` + `#app[data-motion="reduced"]` omiten secuencia de umbral, partículas e intro animada. |
| **A20** | Los carteles tienen soportes, texto HTML y áreas de clic ajustadas. | **comprobado** | Cuatro soportes (`fachada-taller`, `poste-suelo`, `placa-mesa`, `tablilla-radio`) con `.sign-text` HTML y `min-height: 44px`. |
| **A21** | No hay salto de tamaño en hover, seleccionado o visitado. | **comprobado** | `signsCheck` en `verification-report.json`: `widthStable: true` y `heightStable: true` en los 4 carteles en todos los viewports. |
| **A22** | No se incluyeron capturas inventadas, logos falsos, diplomas regenerados o datos de ejemplo. | **comprobado** | `tests/quality-credentials.test.ts` y `tests/interiors-and-cinematics.test.ts`: Flower y FoxMind usan estados honestos; las 3 credenciales en `draft` no se publican. |
| **A23** | No se promete envío desde un formulario sin servicio real. | **comprobado** | Puesto de radio usa enlaces `mailto:` que indican explícitamente `Abrir cliente de correo` + copia de correo con estado real y fallback manual. |
| **A24** | 1366×768 y 1440×900: escena reconocible y contenido legible. | **comprobado** | Capturas `*-1366x768.png` y `*-1440x900.png` en `docs/evidence/interiors/`, sin desbordes ni errores de consola. |
| **A25** | 390×844 y 320×568: un scroll principal, títulos y acciones completos. | **comprobado** | Capturas `*-390x844.png` y `*-320x568.png`; `horizontalOverflow: false` y único contenedor `.panel-scroll`. |
| **A26** | 844×390: altura dedicada a lectura suficiente, sin doble scroll de cabecera. | **comprobado** | Capturas `*-844x390.png`; `.room-topbar` compacto de una línea sin scroll interno y `.panel-scroll` único. |
| **A27** | Teclado y ampliación de texto permiten operar sin jugar. | **comprobado** | Acceso directo desde intro, menú superior en cada sala, `Tab`/`Enter`/`Escape` y `tests/closure-resume-focus.test.ts`. |
| **A28** | La build funciona bajo `/PortfolioPersonal/`, sin URLs rotas. | **comprobado** | `npm run build -- --base=/PortfolioPersonal/` + `tests/pages.test.ts` + verificación Playwright servida bajo `http://127.0.0.1:4173/PortfolioPersonal/` con `0` errores de red/consola. |
| **A29** | Tests, lint y build ejecutados sobre la nueva versión; evidencia diferenciada. | **comprobado** | `18` archivos de test (`91` tests en verde), `npm run lint` (`0` errores), `npm run build` exitoso y evidencias nuevas en `docs/evidence/interiors/`. |
| **A30** | Grabación actual demuestra intro → ruta → interior → caso → salida → contacto. | **comprobado** | Grabaciones actuales `docs/evidence/interiors/desktop-interiors-walkthrough.webm` y `docs/evidence/interiors/mobile-interiors-walkthrough.webm`. |

---

## 4. Inventario de assets (`camp-rooms-v1`)

### 4.1 Assets integrados en runtime (`public/assets/camp-rooms-v1/`)
- **Fondos de salas interiores (`rooms/`)**:
  - `projects-desktop.webp`, `projects-portrait.webp` (`Taller de soluciones`)
  - `about-desktop.webp`, `about-portrait.webp` (`Carpa personal`)
  - `journey-desktop.webp`, `journey-portrait.webp` (`Archivo de expedición`)
  - `contact-desktop.webp`, `contact-portrait.webp` (`Puesto de radio`)
  - *(Nota técnica: se sirven con `image-rendering: pixelated` respetando su estética pixel art derivada de base `256×144`; el cargador descarga únicamente la orientación activa del viewport).*
- **Presentación inicial (`intro/`)**:
  - `mountain-arrival.webp`, `mountain-arrival-portrait.webp`
- **Placas de carteles exteriores (`signs/`)**:
  - `signs/projects-idle|hover|selected|visited.png`
  - `signs/about-idle|hover|selected|visited.png`
  - `signs/journey-idle|hover|selected|visited.png`
  - `signs/contact-idle|hover|selected|visited.png`
  - `signs/signs-atlas.png`, `signs/signs-atlas.json`
- **Efectos de umbral e iconos (`fx/` y `ui/`)**:
  - `fx/door-open.png`, `fx/door-close.png`, `fx/canvas-open.png`, `fx/journal-open.png`, `fx/radio-signal.png`, `fx/fire.png`, `fx/smoke.png`, `fx/spark.png`, `fx/fx-atlas.png`, `fx/fx-atlas.json`
  - `ui/icon-projects@4x.png`, `ui/icon-about@4x.png`, `ui/icon-journey@4x.png`, `ui/icon-contact@4x.png`
  - `ui/frame-workbench-9slice.png`, `ui/frame-linen-9slice.png`, `ui/frame-journal-9slice.png`, `ui/frame-radio-9slice.png`, `ui/plaque-header-9slice.png`, `ui/button-primary-idle|hover|pressed.png`, `ui/tab-active|inactive.png`
- **Atlas de avatar normalizado para cinemática, umbral e interiores (`avatars/`)**:
  - `avatars/idle-down.png`, `idle-up.png`, `idle-left.png`, `idle-right.png`, `walk-*-1..4.png`, `alejo-normalized-atlas.png`, `alejo-normalized-atlas.json`.
  - *(Nota: la locomoción exterior del campamento conserva intactos `public/assets/avatar/*.webp` y `frames.json`).*
- **Datos y contratos (`data/`, `manifest.json`)**:
  - `manifest.json`, `data/intro-timeline.json`, `data/rooms.json`, `data/palette.json`.

### 4.2 Archivos del paquete descartados de runtime (con motivo)
- `Portfolio_Interiores_y_Cinematica_v1/masters/**` y `preview/**` (`00-propuesta-general.jpg`, `01-fondos.png`, `02-senales-y-fx.png`, `03-storyboard.png`, `room-*-mockup.jpg`, `visor.html`): material de referencia y maqueta de dirección visual; excluido del bundle y de git (`.gitignore`) según el contrato (`03_CONTRATO_DE_ASSETS.md` y punto 6 del encargo).
- Variantes PNG de `rooms/*.png` e `intro/*.png` durante la carga normal en navegadores con soporte WebP: permanecen en `public/assets/camp-rooms-v1/` como respaldo del paquete, pero el runtime solicita únicamente el `.webp` de la orientación activa para evitar descargas duplicadas.

### 4.3 Recursos reales pendientes que dependen de Alejo (no inventados)
1. **Capturas reales autorizadas de producto (`FoxMind` y `Flower`)**: actualmente se muestra un aviso honesto de evidencia visual en preparación dentro del Taller de soluciones (sin usar los monitores decorativos pintados en el fondo como si fueran capturas reales).
2. **Originales verificables de credenciales en borrador (`ilan-foxmind`, `egg-full-stack`, `ucm-mobile`)**: se mantienen con `editorial: 'draft'` fuera de publicación hasta contar con PDF/imagen original verificable, fecha exacta y atribución confirmada.
3. **Capas separadas de objetos interiores o arte de mayor resolución nativa**: los fondos actuales son una sola capa plana escalada por vecino más cercano desde base `256×144` (recorte `199×112`). No se deforman ni reescalan con blur simulando HD.

---

## 5. Limitaciones explícitas del entorno de verificación
- Las pruebas automatizadas de navegador y las grabaciones (`.webm`) se ejecutaron en **Chromium headless (Playwright)** sobre Windows en los cinco viewports objetivo (`1366×768`, `1440×900`, `390×844`, `320×568`, `844×390`).
- La salida física de audio en altavoces reales y el tacto en hardware físico iOS/Android requieren validación manual en dispositivo físico, aunque el estado lógico de audio voluntario, preferencias y diseño táctil responsive están verificados por pruebas unitarias y de navegador.

## 6. Comandos de reproducción local
```bash
npm test -- --run
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/ --port 4173 --strictPort
```
