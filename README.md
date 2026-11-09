# Campamento creativo · portfolio para explorar

El portfolio reúne un campamento jugable y una bienvenida conversada con Alejo. La presentación integra identidad, personaje, diálogo y acciones en una sola escena, con sonido voluntario, pausa, repetición, omisión y acceso directo a proyectos. El diálogo no obliga a entrar por tiempo.

La bienvenida interactiva se incorporó en la [PR #3](https://github.com/AlejoPalavecino/PortfolioPersonal/pull/3) y el diseño unificado se desarrolló en la [PR #4](https://github.com/AlejoPalavecino/PortfolioPersonal/pull/4). La propuesta de prólogo lineal anterior de la PR #2 fue sustituida por la experiencia conversada. Ver [dirección visual](docs/INTRO-ESCENA-UNIFICADA.md) y [decisiones de consolidación](docs/CONSOLIDACION-PRS-2026-11-04.md). La validación automatizada no sustituye la inspección visual en dispositivos físicos.

Versión web: [GitHub Pages](https://alejopalavecino.github.io/PortfolioPersonal/).

Antecedentes: [entrega audiovisual](docs/ENTREGA-AUDIOVISUAL.md), [cierre](docs/ENTREGA-CLOSURE.md) y [reproducción local](docs/QA-CLOSURE.md).

## Abrir la revisión

Requiere Node.js 22.12 o posterior y npm. No necesita backend, cuentas, base de datos ni claves.

```sh
npm ci
npm run dev
```

Para revisar exactamente la subruta de GitHub Pages:

```sh
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/
```

Abrir `/PortfolioPersonal/` en la dirección que imprime Vite. La dirección de la preview final se registra en la entrega de calidad.

## Recorrido

1. Alejo llega y conversa mediante burbujas con respuestas elegibles. La presentación permanece visible al terminar de cargar. Entrar al campamento se habilita con sus recursos críticos listos.
2. Elegir un destino desde el mundo o el menú inicia el recorrido y abre su contenido al llegar. WASD/flechas permiten explorar con foco en el mundo; Enter/E abre una entrada cercana.
3. El menú superpuesto pausa una ruta. Reanudar es explícito; también se puede cambiar de destino, cancelar o abrir ahora.
4. Las fichas conservan el paisaje, usan scroll propio y recuperan contexto al regresar. El acceso directo y los enlaces de sección no obligan a caminar ni a repetir la introducción.

## Actualizar el proyecto

| Responsabilidad | Ubicación |
|---|---|
| Navegación, colisiones y rutas | `src/core/domain/` |
| Cámara y conversión de coordenadas | `src/core/camera/` y `src/app/camera.ts` |
| Estados de inicio, lectura y acceso directo | `src/core/experience/` y `src/app/session.ts` |
| Preparación crítica y reintentos | `src/shared/scene-loader/` y `src/app/load-scene.ts` |
| HUD, controles y presentación | `src/app/shell.ts`, `actions.ts`, `events.ts`, `keyboard.ts` |
| Paneles, historial y foco | `src/app/views.ts` |
| Textos, proyectos y servicios | `src/entities/index.ts`; presentación compartida en `src/widgets/index.ts` |
| Estilos actuales | `src/styles/main.css`: escena, HUD/intro, controles, lectura y adaptación |
| URL de recursos | `assetUrl` en `src/shared/index.ts`; conservar base de Vite |

La bienvenida y el acceso a Proyectos están disponibles mientras se prepara el campamento. La entrada jugable requiere cinco operaciones: verificar el punto de partida y las entradas, leer los movimientos del avatar y decodificar el terreno, el fondo y el avatar en reposo. Si elegís entrar antes, el recorrido empieza apenas terminan. La pantalla de espera muestra el progreso real, permite abrir Proyectos y ofrece un reintento si falla la carga.

En celular se sirven versiones compactas del paisaje y los interiores. Los edificios y los movimientos restantes del avatar se cargan al entrar al mapa. Un enlace directo a una sección o a un caso abre su contenido primero y prepara el mapa cuando volvés al campamento. Las fuentes se sirven en WOFF2, y el ambiente en MP3 (145 kB) se descarga cuando activás el sonido.

El CV público en español e inglés se encuentra en `public/assets/cv-alejo-palavecino-*.pdf`, sin número telefónico ni documento de identidad. Verificar su descarga y mantener los datos personales fuera del build. El exportador `npm run assets` requiere Python con Pillow y FontTools con soporte WOFF2 (Brotli), además de FFmpeg con libmp3lame y no reemplaza automáticamente el CV; su importación se gestiona por separado. Los archivos originales se conservan en `Portfolio_Campamento_Documentacion_y_Assets_v1/`.

## Contenido y publicación

FoxMind, Chuli, Portfolio interactivo, Flower, Agrotech, aforo, Herbario Digital y automatización ART son casos públicos con relato centrado en problema, contribución y estado. El portfolio interactivo es un proyecto de código abierto y enlaza tanto al repositorio como a la versión publicada. FoxMind conserva únicamente el alcance público autorizado; no se agregan demo, repositorio, arquitectura ni detalles internos. Flower utiliza sus datos confirmados y describe la automatización de la **facturación** de las ventas mediante ARCA.

La dirección vigente y sus contratos están en [PLAN-GAME-FIRST](docs/PLAN-GAME-FIRST.md), el [charter](docs/01-CHARTER-AND-BACKLOG.md) y el [playbook](docs/02-PLAYBOOK-AND-OPS.md). La instrucción de cambio completa se conserva en [el brief](docs/briefs/2026-10-30-game-first.md). Los documentos de 0.1.0 y el dossier son antecedentes históricos donde contradigan esta dirección.

Cada push a `main` publica mediante `.github/workflows/pages.yml`, después de pruebas, linter y build. La evolución game-first ya fue integrada por instrucción de Alejo. La primera versión pública habilita indexación, mantiene privados los documentos sensibles y muestra ocho casos de proyectos. Se agregaron selector ES/EN, LinkedIn y dos CV sin teléfono. Ver `tests/public-safety.test.ts`.
