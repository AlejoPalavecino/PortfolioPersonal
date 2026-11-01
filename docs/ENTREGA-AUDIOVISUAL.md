# Entrega de mejora audiovisual — Campamento creativo (`feat/audiovisual-camp`)

Esta iteración transforma la experiencia de **PortfolioAlejo** en un juego de exploración tranquilo y coherente en pixel art andino, articulado alrededor de cinco momentos conectados:

1. **Llegar a la pantalla inicial** (viñeta en pixel art junto al fogón y progreso real por tareas).
2. **Entrar al campamento** (descubrimiento del mundo, acomodo suave de cámara y gesto de orientación interrumpible).
3. **Caminar y explorar** (locomoción con cadencia por distancia recorrida, sombra de contacto, anillo al tocar suelo, polvo exclusivo en tierra y ambiente localizado).
4. **Llegar a un destino** (orientación coherente del personaje y respuesta propia en Taller, Carpa, Bitácora y Radio).
5. **Abrir, recorrer y cerrar el contenido profesional** (superficies estilo cuaderno de campo, microinteracciones medidas y atenuación del entorno durante la lectura).

---

## 1. Matriz de eventos audiovisuales

| Momento | Evento (`CueName`) | Respuesta visual | Sonido opcional (si fue activado) | Duración orientativa | Interrupción / cancelación | Alternativa con movimiento reducido (`minimal`) |
| --- | --- | --- | --- | --- | --- | --- |
| **1. Pantalla inicial** | `prepare-start` / `prepare-progress` | Viñeta pixel art (`160 × 72 px`): Alejo se acerca al fogón; la llama crece según `completed / total` real; barra de progreso y tarea activa (`Trazando los caminos`, `Cargando el paisaje`, `Preparando los movimientos de Alejo`). | Silencio (el sitio inicia siempre en silencio). | Duración real de descarga/decodificación de los 28 pasos críticos. | Si la persona abre `Ver portfolio sin recorrer`, `Contacto` o `CV`, la lectura queda activa sin perder foco ni scroll cuando termina la carga. | Viñeta estática con Alejo junto al fogón; barra y estado actualizados sin bucle de partículas. |
| **1. Pantalla inicial** | `prepare-slow` / `prepare-failed` / `prepare-ready` | Aviso claro a los 8 s si demora; botón de reintento si falla; al completar, Alejo gira al frente (`idle-down`), la barra pasa a verde bosque y se habilita `Entrar al campamento`. | Silencio. | Inmediato al cumplirse la condición real. | `Reintentar carga` descarta generaciones previas; enlaces directos conservan su vista. | Estado estático directo y anuncio accesible en región `role="status"` separada del contador por frame. |
| **2. Entrada al mundo** | `enter` | Retiro de la tarjeta inicial, acomodo suave de cámara (`scale` `1.07 → 1.0`), aparición del HUD y gesto breve de orientación (`idle-right → idle-down`). | Silencio (entrar no activa audio por sí solo). | `460–560 ms`. | Cualquier clic en destino, toque en suelo o tecla de movimiento cancela inmediatamente el acomodo (`finishSettle()`) y ejecuta la orden. | Cambio directo al campamento sin zoom ni giro decorativo. |
| **3. Explorar** | `ground-tap` | Anillo pixelado cálido (`#ffe6a3`) sobre el punto caminable tocado. | Pulso cálido breve (`360 → 300 Hz`, `70 ms`, cooldown `90 ms`). | `420 ms` (`240 ms` en reducido). | Reemplazado o limpiado de inmediato al elegir otro punto, destino o cancelar (`Escape`). | Marca estática breve (`240 ms`) sin expansión animada. |
| **3. Explorar** | `destination-selected` | Anillo indicador en la entrada del destino, realce del cartel (`[data-selected]`) y puntos de paso temporales sobre el sendero que se desvanecen al avanzar. | Intervalo cálido de madera (`392 → 523 Hz`, `150 ms`; en Radio añade sintonía breve). | Puntos de ruta: hasta `1600 ms` o hasta pasar por ellos. | `route-cancel` limpia al instante marcadores y puntos del sendero anterior sin dejar residuos. | Destino abierto de forma directa sin caminata obligatoria; indicador estático claro. |
| **3. Explorar** | `step` | 2 partículas de polvo cálido junto al pie de apoyo **solo sobre tierra** (`surface === 'dirt'`); sin polvo en pasto ni sobre el puente de madera (`'wood'`). | Paso ligado a la zancada real (`15 px` primer apoyo, luego cada `30 px`) con variación L/R y timbre según superficie (`dirt`, `grass`, `wood`). | Partículas: `320 ms`; sonido: `55–65 ms` (cooldown `110 ms`). | Se detiene en el acto al parar (`move-stop`), pausar o abrir una superficie. | Sin emisión de partículas de polvo. |
| **4. Llegada** | `arrive` | El personaje se detiene con desaceleración suave, mira hacia la entrada (`idle-up`) y el destino ejecuta su respuesta propia: **Taller** (luz interior en puerta/ventanas y farol), **Carpa** (farol, interior cálido y avivado del fogón), **Bitácora** (brillo en páginas, marcador rojo y brújula), **Radio** (LED activo y ondas pixeladas en la antena). | Acorde cálido de llegada (`440 + 659 Hz`, `180 ms`) o pulso de transceptor en Radio (`660 → 880 Hz`). | Respuesta del destino: `680 ms` (y presencia suave al estar cerca). | Si la ruta fue cancelada o reemplazada antes de llegar, `arrive` no se emite nunca. | Respuesta estática sin pulsación continua ni ondas en bucle. |
| **5. Lectura** | `surface-open` / `page-change` / `surface-close` | Apertura y cierre del panel como cuaderno de campo (`200 ms`), transición al cambiar entre lista y caso o entre páginas de Bitácora, y atenuación del campamento de fondo (`brightness(.86)`). | Apertura (`310 → 440 Hz`), paso de página (`480 → 560 Hz`), cierre (`410 → 270 Hz`); el ambiente baja suavemente a `30%` durante la lectura. | `200 ms` (controles: `110 ms`). | `closeTimer` y `transition` cancelan animaciones previas; prevalece siempre la última intención válida. | Apertura y cambio instantáneos (`0 ms`), sin desplazamientos ni transiciones CSS. |
| **Ciclo de vida** | `pause` / `resume` (`visibilitychange`) | Pausa de ruta activa, suspensión del bucle único `requestAnimationFrame` y congelamiento de partículas/ambiente al ocultar la pestaña. | `audio.pause()` suspende el contexto y el bucle; el botón cambia a `Continuar sonido` (reanudación explícita). | Inmediato. | Al volver a la pestaña, la reanudación de ruta y de sonido es explícita. | Mismo comportamiento determinista. |

---

## 2. Inventario de recursos y especificaciones técnicas

### 2.1 Sprites del personaje (`public/assets/avatar/`)

- **Cantidad y orden de frames**: 20 archivos WebP lossless (`idle-down`, `idle-left`, `idle-right`, `idle-up` y `walk-{down,left,right,up}-{1..4}`) + metadatos en `public/assets/avatar/frames.json`.
- **Dimensiones y puntos de anclaje (`anchorX`, `anchorY` sobre la línea de apoyo de los pies)**:
  - `idle-down`: `131 × 255 px`, anclaje `(64, 252)`
  - `walk-down-1..4`: `134 × 258` `(64, 254)`, `132 × 260` `(67, 257)`, `139 × 256` `(69, 254)`, `133 × 261` `(69, 256)`
  - `idle-left`: `125 × 266 px`, anclaje `(59, 259)`
  - `walk-left-1..4`: `138 × 262` `(66, 257)`, `125 × 263` `(59, 258)`, `138 × 263` `(61, 258)`, `129 × 263` `(57, 258)`
  - `idle-right`: `129 × 266 px`, anclaje `(70, 259)`
  - `walk-right-1..4`: `142 × 259` `(84, 256)`, `129 × 263` `(70, 257)`, `141 × 259` `(82, 256)`, `132 × 261` `(74, 258)`
  - `idle-up`: `130 × 251 px`, anclaje `(66, 248)`
  - `walk-up-1..4`: `135 × 252` `(68, 249)`, `130 × 260` `(66, 257)`, `140 × 257` `(70, 254)`, `134 × 259` `(68, 256)`
- **Escala en el mundo**: `0.28` (`~36.7 × 71.4 px` en coordenadas del mundo `1000 × 650`); en la viñeta inicial: `0.135` sobre lienzo `160 × 72 px`.
- **Cadencia por distancia**: `WALK_SPEED = 140 px/s`, `STRIDE_PER_FRAME = 15 px` (`~107 ms` por cuadro a velocidad plena; los pies nunca patinan ni avanzan de cuadro estando quieto).
- **Separación de capas**:
  - Posición lógica y colisiones: `src/core/domain/` + `src/app/controller.ts`.
  - Sombra de contacto en suelo: `.avatar-shadow` (`24 × 9 px`, `z-index = floor(y) - 1`).
  - Representación visual: `.avatar` (`z-index = floor(y)`) + máscara de oclusión `.avatar-occlusion` (`z-index = 900`).
  - Efectos de suelo y ambiente: `.world-fx-ground` (`z-index = 160`) y `.world-fx-props` (`z-index = 480`).

### 2.2 Capas de terreno, máscara de superficie y efectos (`src/core/fx/`, `src/app/fx/`)

- **Máscara de superficie (`src/core/fx/surface-mask.ts`, generada con `tools/surface_mask.py` desde `camp-hillside.webp`)**: grilla `100 × 65` (`10 × 10 px` por celda) que clasifica tierra (`dirt`), pasto (`grass`) y el polígono del puente de madera (`wood`).
- **Viñeta inicial (`src/app/fx/vignette.ts`)**: escena pixel art en canvas `160 × 72 px` con paleta del campamento, fogón con piedras/leños/humo y Alejo acercándose al fuego.

### 2.3 Sistema sonoro (`src/app/audio.ts`, `src/core/fx/mix.ts`)

- **Origen y licencia**:
  - Base ambiental: `public/assets/camp-ambience-loop.wav` (`12 s`, estéreo, PCM 16-bit 44.1 kHz, sintetizado original del kit con Python/NumPy según `public/assets/README-LICENSES.txt`, sin muestras de terceros).
  - Capas espaciales (agua en `x=945, y=430` y fogón en `x=248, y=272`) y efectos puntuales (pasos en tierra/pasto/madera, confirmación, llegada, radio, apertura/cierre y cambio de página de Bitácora): síntesis procedural en tiempo real mediante un único `AudioContext` de Web Audio API creado perezosamente al activar sonido.
- **Niveles y límites**:
  - Tres canales organizados (`master = 0.85`, `ambient = 0.75`, `sfx = 0.80`), con atenuación automática del ambiente al `30%` durante la lectura y transiciones suaves (`setTargetAtTime`).
  - Límites de repetición (cooldowns): pasos `110 ms`, toque en suelo `90 ms`, selección de destino `100 ms`, llegada `140 ms`, ventanas `100 ms`, páginas `90 ms`.

---

## 3. Preferencias, accesibilidad y presupuestos de rendimiento

- **Preferencia de movimiento (`camp:motion:v1` + `prefers-reduced-motion: reduce`)**:
  - Se evalúa antes de montar el DOM (`src/app/index.ts`).
  - En modo reducido (`data-motion="reduced"` / `data-fx-level="minimal"`), no hay desplazamientos de cámara decorativos, ni partículas continuas, ni parpadeos de faroles/agua, y elegir un destino abre su ficha directamente.
- **Presupuestos (`src/core/fx/budget.ts`)**:
  - `full` (escritorio): `dust: 14`, `smoke: 7`, `glints: 9`, `ambientFps: 20`.
  - `lite` (móvil / puntero táctil / pantallas `< 700 px`): `dust: 7`, `smoke: 4`, `glints: 4`, `ambientFps: 12`.
  - `minimal` (movimiento reducido o degradación): `dust: 0`, `smoke: 0`, `glints: 0`, `ambientFps: 0`, indicadores estáticos activos.
  - `createFrameMonitor` mide el tiempo de frame real y degrada automáticamente `full → lite → minimal` si el promedio supera el presupuesto, preservando siempre la respuesta del personaje.
- **Bucle único (`src/app/loop.ts`)**: un solo `requestAnimationFrame` compartido por toda la aplicación que se detiene por completo cuando `document.hidden === true` o no hay suscriptores activos.

---

## 4. Cómo ejecutar y revisar la entrega

```sh
npm ci
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/ --port 4173
```

Abrir `http://127.0.0.1:4173/PortfolioPersonal/` en el navegador.

---

## 5. Limitaciones reales y notas de verificación

- **Comprobación de audio**: las pruebas automatizadas en navegador headless verifican que el sitio inicia en silencio (`aria-pressed="false"`), que entrar al campamento no activa el audio, que la activación explícita inicia el `AudioContext` y `camp-ambience-loop.wav`, y que ocultar la pestaña pausa el sonido y muestra `Continuar sonido`. La valoración estética fina del timbre y equilibrio acústico requiere escucha directa en parlantes o auriculares físicos. Additionally, las grabaciones `.webm` generadas por Playwright headless capturan el flujo visual completo pero el contenedor de video de Chromium headless no incluye pista de salida de altavoz del sistema.
- **Contenido editorial**: se conservan intactos los textos profesionales, el CV vigente (`public/assets/cv-alejo-palavecino-es.pdf`) y los estados editoriales de capturas y credenciales pendientes de selección.
