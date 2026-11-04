# Introducción interactiva del campamento

Revisión del 3 de noviembre de 2026 · [PR #3](https://github.com/AlejoPalavecino/PortfolioPersonal/pull/3) · rama `feat/interactive-camp-intro`.

## Análisis de la base

Se revisaron el montaje, los estados de experiencia y sesión, el renderizado, la navegación, los estilos, el loader, el audio, los assets existentes y las pruebas. Base: `319a480b773eecf7e4e74e697ecf281440526560`.

El proyecto usa TypeScript + Vite, sin framework de UI. Separa dominio, presentación y recursos; ya cuenta con un bus audiovisual y un único loop compartido. Conviene conservarlos, así como el mapa, sus rutas y las salas.

La introducción anterior consumía una secuencia de 6,8 segundos y llamaba a `skipIntro()` al terminar. El banner estaba separado del personaje y dentro de un contenedor `aria-hidden`; no permitía responder. La pausa frenaba el reloj JavaScript pero no las animaciones CSS. Además, mantenía una viñeta canvas oculta detrás de la presentación completa. El sonido ambiental existía, pero no había señales propias de la conversación.

## Experiencia implementada

1. El paisaje aparece con una aproximación suave. Alejo recorre el tramo inicial del sendero, con pasos y polvo. Los recursos críticos se preparan por separado, con progreso real.
2. A los 2,8 segundos aparece una burbuja vinculada al personaje: «¡Ey, llegaste!». También se puede saludar pulsando el personaje para adelantar su llegada.
3. El texto se escribe progresivamente y permanece hasta que el visitante decida. Pulsar el personaje revela la frase completa.
4. «Mostrame el campamento» y «¿Qué construís?» generan respuestas distintas, una reacción del personaje y un pequeño sonido de confirmación.
5. «¡Vamos al campamento!» solicita la entrada. Si los recursos siguen cargando, se espera su disponibilidad real; no se impone otro tiempo mínimo. Entrar, omitir, Escape y los accesos directos siguen usando la sesión existente.

La presentación no expulsa al visitante de un diálogo por tiempo. No hay captura de respuestas, servicios nuevos ni cambios en el contenido profesional.

## Imagen y sonido

Se conserva el arte original de montaña y avatar. La composición da más espacio al personaje y a su burbuja, con una tarjeta profesional lateral en escritorio y secciones apiladas con scroll en móvil. Se añadieron motas luminosas, polvo, emotes y una reacción breve al responder. Los efectos no capturan clics sobre los controles.

El sonido empieza apagado y tiene un control visible en la barra superior. Las señales de pasos, saludo, escritura, respuesta y salida usan el sintetizador existente: no agregan archivos de audio ni dependencias de producción. Los osciladores liberan sus conexiones al terminar. Si falla la reproducción ambiental, se suspende también el sintetizador para no dejar sonido activo con un control que indica fallo.

## Accesibilidad y ciclo de vida

- Respuestas y personaje son botones nativos con nombres accesibles. Al elegir una respuesta, el foco pasa al siguiente paso.
- Un canal accesible recibe cada frase completa una sola vez; la escritura visual no genera anuncios carácter a carácter.
- La pausa detiene llegada, escritura y efectos CSS. El ambiente conserva su control de sonido independiente.
- Ocultar la pestaña pausa la presentación; volver no la reanuda automáticamente. El sistema de audio existente también requiere reanudación explícita.
- Movimiento reducido muestra al personaje y el diálogo completos, sin animaciones ni escritura progresiva.
- Omitir durante la carga conserva acceso directo. Al finalizar la preparación, la entrada encolada emite su evento y entrega el foco al mundo.
- Al abandonar la introducción se libera su suscripción al loop. El desmontaje elimina observadores y listeners.
- La miniviñeta oculta ya no se monta ni ejecuta en esta presentación.

## Mantenimiento

| Parte | Archivo |
|---|---|
| Textos, respuestas y helpers temporales | `src/core/experience/intro-dialogue.ts` |
| Coordinación de llegada, escritura y diálogo | `src/app/fx/intro-fx.ts` |
| Marcado accesible y botones | `src/app/shell.ts` |
| Composición, efectos y adaptación | `src/styles/intro-interactive.css` |
| Contrato de señales y síntesis | `src/core/fx/cues.ts`, `src/app/audio.ts` |
| Entrada diferida y foco | `src/app/session.ts` |
| Pruebas de integración de la intro | `tests/intro-interactive.test.ts` |

Se reutilizan los primeros 2,8 segundos del sampler existente en `src/core/experience/index.ts`; su tramo histórico posterior ya no gobierna la entrada automática. `happy-dom` se agrega únicamente como dependencia de desarrollo para verificar eventos, foco y estados con el marcado real.

## Validación ejecutada

Entorno: Node.js 24.22.1, npm 11.9.0, Linux.

- `npm test`: **108 pruebas aprobadas en 19 archivos**, incluidas 10 nuevas de llegada, respuestas, pausa, movimiento reducido, visibilidad, carga, foco, desmontaje y audio voluntario.
- `npm run lint`: aprobado.
- `npm run build -- --base=/PortfolioPersonal/`: aprobado; conserva la subruta de GitHub Pages.
- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- `git diff --check`: aprobado.

Las pruebas DOM y de audio usan un entorno simulado; no acreditan composición visual, tacto, lector de pantalla ni calidad percibida del sonido. Se intentó abrir Vite en los navegadores disponibles, pero ambos devolvieron `ERR_CONNECTION_REFUSED` al servidor local. No se presentan capturas ni una revisión visual/auditiva como realizadas.

## Recorrido de revisión visual pendiente

```sh
git switch feat/interactive-camp-intro
npm ci
npm run dev
```

Abrir una pestaña nueva sin hash para ver la introducción (la sesión recuerda si ya se entró al mundo). Probar escritorio 1440×900 y 1024×768, móvil 390×844 y 320×568, y horizontal 844×390:

- Activar sonido; observar llegada, pasos, saludo y escritura; silenciar.
- Saludar al personaje y elegir cada respuesta en sesiones nuevas; comprobar la burbuja, los emotes y la lectura sin avance automático.
- Pausar durante caminata/escritura y volver a continuar; ocultar y volver a la pestaña.
- Activar movimiento reducido; recorrer controles con Tab/Enter y comprobar foco al entrar.
- Entrar/omitir con red lenta; usar el acceso directo sin esperar; comprobar fallo y reintento.
- Confirmar ausencia de solapamientos y de scroll horizontal en todos los tamaños; ajustar la mezcla de sonido mediante escucha real.

La PR se mantiene en borrador para esa revisión. No se integró a `main` ni se publicó en GitHub Pages.
