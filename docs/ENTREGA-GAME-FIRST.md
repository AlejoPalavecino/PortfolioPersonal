# Campamento explorable — revisión 0.2.0-review.1

La nueva experiencia se entrega en `feat/game-first-camp`, sobre el commit de referencia `57e2ed8dfaf53ef4da779f7fed28c782ba417404`. El relevamiento y `git fetch origin` no encontraron avances posteriores que integrar. `main` y la publicación existente se conservan: esta evolución no se publicó.

## Abrir y probar

Preview local: <http://127.0.0.1:4175/PortfolioPersonal/> mientras el servidor esté activo. Para reconstruirla: comandos del [README](../README.md). La salida estática está en `dist/`; se entrega también un ZIP en `artifacts/`.

Recorrido comprobado: **inicio → Entrar al campamento → menú/destino → caminata → ficha → volver**. Probar también Ver portfolio sin recorrer, enlace directo `#proyectos/foxmind`, menú durante una ruta, Abrir ahora, Cancelar y movimiento reducido. El CV y Contacto permanecen accesibles sin progreso obligatorio.

## Cambios y decisiones

| Tema | Implementación |
|---|---|
| Arranque | Presentación breve a pantalla completa sobre el mismo campamento. No se retira automáticamente al estar listo. Entrada explícita y acceso directo inmediato. Recuerdo de entrada en sessionStorage, con alternativa si el almacenamiento falla. |
| Carga real | 28 operaciones: JSON, validación de navegación, seis imágenes y veinte sprites decodificados. 27 archivos críticos suman 1.971.139 bytes antes de compresión HTTP; la validación de navegación no es un archivo. Audio, CV y capturas no bloquean. |
| Recuperación | A los ocho segundos se explica la demora y se mantiene el acceso directo. No hay duración mínima artificial. Fallos y reintentos usan generaciones para ignorar callbacks viejos; reintentar durante lectura conserva vista y foco útil. |
| Juego y cámara | Mundo lógico 1000 × 650 separado del viewport y de la cámara. Móvil usa escala 1,08, con personaje de unos 77 px de altura en las vistas verticales probadas. Es un ajuste de integración respecto de 1,15 propuesto en el plan, suficiente para conservar legibilidad. |
| Encuadre | Seguimiento suave de 120 ms, límites y letterbox donde corresponde; queda quieto durante lectura, menú y reducción. ResizeObserver adapta el viewport y barras móviles sin reiniciar el personaje. |
| HUD | Controles de campamento, Contacto y CV en esquinas, ayuda contextual y menú superpuesto. Indicadores visitados reservan espacio. Abrir/cerrar menú no empuja el escenario; una ruta pausada requiere Continuar explícitamente. |
| Lectura | Panel no modal con encabezado y scroll propio; el mundo queda inactivo y el HUD sigue disponible. Se conservan scroll y foco de lista/detalle. No se usa scroll de ventana para abrir fichas o recorrer. |
| Input | Flechas/WASD solo con foco de escena activa; Enter/E junto a entrada. Toque en destino o suelo, sin joystick; el arrastre se distingue del toque. La conversión pantalla↔mundo usa la cámara. |
| Render | Posición/transformación y frames separados de la actualización del HUD mediante firma de estado. Los sprites cambian de URL solo cuando cambia el frame; todos están preparados antes de habilitar entrada. |
| Estilo | Marcos crema/madera y tipografía pixel en títulos/controles, Lexend en lectura. Transiciones de superficie de 260 ms, omitidas con movimiento reducido. HUD y ayudas se ajustan a texto grande. |
| Contenido | Flower dice que ARCA automatiza la facturación de las ventas. Servicios claros en Sobre mí: software a medida, análisis funcional, integraciones, automatización e IA. Mismas fuentes en fichas y modo directo; no se inventan evidencias ni datos. |
| Mantenimiento | Vite/TypeScript y navegación/colisiones existentes; sin motor nuevo ni dependencias nuevas. Estilos antiguos del navbar/hero se retiraron para evitar cascadas contradictorias. `assetUrl` y la base `/PortfolioPersonal/` se conservan. |

La dirección vigente está en [el brief](briefs/2026-10-30-game-first.md), [charter](01-CHARTER-AND-BACKLOG.md), [playbook](02-PLAYBOOK-AND-OPS.md) y [plan técnico](PLAN-GAME-FIRST.md). El dossier, las maquetas y las entregas anteriores son históricos cuando contradicen esta dirección.

## Comprobaciones automáticas

- `npm test`: **40/40** en siete suites. Se preservaron 22 pruebas previas y se añadieron 18 de cámara, experiencia, loader e historial. Las cuatro suites nuevas se ejecutaron RED por ausencia de implementación antes de GREEN.
- `npm run lint`: sin errores, con fronteras mecánicas también para cámara y experiencia.
- `npm run build -- --base=/PortfolioPersonal/`: TypeScript y Vite aprobados. Sin publicación ni cambios de configuración de Pages en esta rama.
- `git diff --check`: limpio tras normalizar finales de línea de los archivos editados. No se modificaron los maestros del dossier.
- Revisión de código y control de secretos: resultados registrados en `REVIEW-GAME-FIRST.md` y en los commits locales.

La revisión dual final está [aprobada](JUDGMENT-GAME-FIRST.md): detectó y corrigió el scroll del menú en horizontal bajo y la restauración de entrada al usar Atrás desde lectura directa. Estos últimos fixes tienen inspección focalizada y regresión automatizada; no se presentan como un segundo pase visual posterior a las capturas.

## Evidencia funcional y visual

Entorno: Windows, Node.js 24, Chromium de ego(lite), preview de producción bajo `/PortfolioPersonal/`. Space dedicado `qa-game-first`. No se usó un teléfono físico.

| Condición | Resultado observado |
|---|---|
| 1366×768 y 1280×720 | Intro y juego sin desborde del documento. Flujo de entrada, destino, ficha y regreso ejecutado. |
| 390×844, 360×640, 320×568 | Documento igual al viewport, avatar de 77 px aproximadamente, menú y paneles internos. No se exige mostrar todas las entradas simultáneamente. |
| Horizontal 844×390 | Intro compacta en dos columnas; avatar de aproximadamente 53,5 px. |
| Menú en ruta | Se observó Recorrido en pausa, incluso 2,5 s después de cerrarlo. Solo Continuar abrió la sección. |
| Cancelación | Conservó la posición alcanzada; no apareció contenido tardío dos segundos después. `history.length` permaneció 16→16. |
| Ficha Flower y lista | Panel interno desplazado 423 px hasta el final; volver a Proyectos restauró 187 px de scroll y el foco en la tarjeta Flower. |
| Enlace directo y sesión | Recarga de `#proyectos/foxmind` abrió FoxMind sin intro. Regreso a lista correcto; una entrada posterior en la misma sesión recuperó mundo sin repetir presentación. |
| Fallo crítico | Se bloqueó frames.json: fallo explícito, reintento y acceso directo. Proyectos abrió; al desbloquear y reintentar desde su encabezado se conservó la lectura y un foco válido. |
| Red lenta real | Con caché deshabilitada y latencia CDP de 10.000 ms apareció la alternativa tras el umbral de ocho segundos. Restablecer la red completó carga sin sacar de Proyectos ni cambiar su foco. |
| Texto 200% simulado | Se duplicó font-size computado de textos/controles. Se corrigieron superposiciones de HUD y ayuda en 320 px. El párrafo de ayuda se desplaza con teclado sin mover al avatar y Escape lo cierra. No equivale a certificación WCAG ni a zoom nativo de todos los navegadores. |

Capturas de composición: [inicio escritorio](evidence/game-first/desktop-intro.png), [exploración escritorio](evidence/game-first/desktop-world.png), [recorrido escritorio](evidence/game-first/desktop-route.png), [ficha escritorio](evidence/game-first/desktop-panel.png), [inicio móvil](evidence/game-first/mobile-intro.png), [exploración móvil](evidence/game-first/mobile-world.png), [recorrido móvil](evidence/game-first/mobile-route.png), [ficha móvil](evidence/game-first/mobile-panel.png). Se conservaron además referencias de tamaños pequeños y texto ampliado. Las capturas acreditan composición; las operaciones anteriores son la evidencia funcional.

## Criterios A–M

| Criterio | Estado de revisión |
|---|---|
| A · Primera pantalla | Comprobado: identidad, propuesta, acceso de juego y directo. |
| B · Juego sin scroll de documento | Comprobado en seis tamaños. |
| C · Personaje y móvil | Comprobado en emulación; teléfono físico pendiente. |
| D · Menú estable | Comprobado: superpuesto, documento estable y ruta pausada. |
| E · Cuatro destinos | Implementados en mundo/menú; cobertura integrada parcial de todas las combinaciones de origen y encuadre. |
| F · Seleccionar/caminar/abrir | Flujo comprobado. El objetivo de 1–2 s no se certifica como presupuesto de esta revisión por las limitaciones de temporización del entorno. |
| G · Interrupciones | Cancelación, sustitución, omisión y pausa por menú implementadas y cubiertas por pruebas de estado; cancelación/pausa por menú comprobadas en navegador. Pausa real al ocultar pestaña sin confirmar en esta ronda. |
| H · Lectura y contexto | Lectura completa de Flower, scroll de lista y foco comprobados. Combinaciones exhaustivas de cámara/foco pendientes. |
| I · Contacto y CV | Accesos permanentes y base preservados; archivo y canales siguen pendientes de revisión editorial final. |
| J · Carga y recuperación | Caché/loader automatizado; red lenta, fallo, reintento y carga tardía con lectura comprobados en navegador. |
| K · Directo y reducción | Acceso directo, lectura y apertura sin recorrido comprobados; todas las funciones profesionales siguen compartidas. |
| L · Enlaces e historial | Enlace directo/recarga, regreso de ficha/lista y cancelación sin nueva entrada comprobados. Atrás/Adelante desde directo corregidos y probados con sesión real y DOM simulado; matriz completa de navegador pendiente. |
| M · Subruta publicada | Build y preview reales bajo `/PortfolioPersonal/` comprobados; nueva experiencia todavía no publicada online. |

## Límites y pendientes

La medición inicial de rAF, con ArrowRight durante 5,03 s, dio 137 intervalos (unos 27,3 fps, máximo 50,3 ms). Las repeticiones dieron solo 5 frames/5 s quieto y 49/5,6 s moviendo, incluso con pestaña visible, con intervalos de unos 1.005 ms. El entorno presenta throttling y las muestras no son comparables: no se atribuye una causa al producto ni se afirma 60 fps, fluidez universal o tiempos de ruta garantizados.

La pausa al ocultar pestaña está implementada y el reducer tiene pruebas, pero los intentos interactivos terminaron la ruta antes del cambio de pestaña; no acreditan ese criterio. Quedan pendientes teléfono físico, zoom nativo entre navegadores, escucha/mezcla de audio, matriz completa de historial/cámara y una medición de rendimiento fiable.

Alejo conserva la selección de capturas reales de FoxMind/Flower y la confirmación editorial, canales, datos vigentes y PDF definitivo. El parecido del avatar sigue sujeto a su revisión. Esta entrega no convierte reservas visuales en casos completos ni publica métricas, cargos o disponibilidad sin confirmar.

Los scripts históricos de QA usan IDs de Space/referencias locales y no son suites repetibles entre sesiones. Las pruebas reproducibles están en `tests/`. La memoria externa no se confirma: Engram detectó el proyecto, pero no recuperó contexto propio; la continuidad verificable queda en Git y estos documentos.
