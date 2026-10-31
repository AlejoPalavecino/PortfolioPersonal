# Campamento creativo · portfolio para explorar

La versión **0.2.0-review.1**, integrada en `main`, transforma el portfolio de Alejo Palavecino en una experiencia de exploración: pantalla inicial, campamento persistente a pantalla completa, cámara móvil y fichas HTML con lectura interna.

La integración y publicación de esta evolución fueron autorizadas después de la entrega de revisión. `main` es la única rama y alimenta la [publicación de GitHub Pages](https://alejopalavecino.github.io/PortfolioPersonal/). El contenido editorial mantiene su condición de revisión; los documentos de entrega conservan el estado histórico anterior al merge.

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

Abrir `/PortfolioPersonal/` en la dirección que imprime Vite. La preview de trabajo de esta entrega usa `http://127.0.0.1:4175/PortfolioPersonal/` mientras el servidor permanezca activo.

## Recorrido

1. La presentación permanece visible al terminar de cargar. Entrar al campamento se habilita con sus recursos críticos listos.
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

El loader prepara 28 operaciones reales: metadatos, validación de navegación, seis imágenes del mundo y veinte sprites. Audio, PDF y evidencias de proyectos no bloquean la entrada. A los ocho segundos ofrece una alternativa clara, sin una espera mínima artificial. Fallo y reintento conservan el acceso profesional.

El PDF aportado está en `public/assets/cv-alejo-palavecino-es.pdf`. Reemplazarlo por el definitivo y comprobar su descarga. El exportador `npm run assets` requiere Python/Pillow y vuelve a copiar el CV original del dossier; los originales se conservan en `Portfolio_Campamento_Documentacion_y_Assets_v1/`.

## Contenido y publicación

FoxMind y Flower son casos de revisión hasta integrar capturas reales elegidas y cerrar su edición. FoxMind conserva únicamente el alcance público autorizado; no se agregan demo, repositorio, arquitectura ni detalles internos. Flower utiliza sus datos confirmados y describe la automatización de la **facturación** de las ventas mediante ARCA.

La dirección vigente y sus contratos están en [PLAN-GAME-FIRST](docs/PLAN-GAME-FIRST.md), el [charter](docs/01-CHARTER-AND-BACKLOG.md) y el [playbook](docs/02-PLAYBOOK-AND-OPS.md). La instrucción de cambio completa se conserva en [el brief](docs/briefs/2026-10-30-game-first.md). Los documentos de 0.1.0 y el dossier son antecedentes históricos donde contradigan esta dirección.

Cada push a `main` publica mediante `.github/workflows/pages.yml`, después de pruebas, linter y build. La evolución game-first ya fue integrada por instrucción de Alejo. Mantener `noindex` y los faltantes identificados hasta la revisión editorial correspondiente.
