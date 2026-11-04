# Inicio como una sola escena

Rama: `feat/unified-intro-scene` · [PR #4](https://github.com/AlejoPalavecino/PortfolioPersonal/pull/4).

## Problema observado

La versión publicada separaba el inicio en tres focos: título a la izquierda, personaje en la parte inferior y una tarjeta profesional independiente a la derecha. Nombre, retrato, especialidades y explicaciones repetían información en superficies distintas. Se inspeccionó la página publicada y su captura antes de rediseñar.

## Dirección implementada

Una sola composición central sobre el paisaje, con esta secuencia:

1. **Identidad:** Alejo Palavecino / Desarrollador de software.
2. **Propuesta:** «Ideas que cobran vida.» y una presentación breve.
3. **Conversación:** la burbuja se centra sobre el personaje, que llega desde el sendero. Los detalles de especialidades y recorrido aparecen en las respuestas.
4. **Entrada:** «Explorar el campamento» como acción principal y «Ir directo a proyectos» como alternativa explícita.
5. **Contacto:** «Conversemos» y descarga del CV, en una línea secundaria.

Se retiran la tarjeta lateral, el retrato duplicado, los chips de especialidades, el título lateral y el listado redundante de destinos. No se cambian los contenidos profesionales de las salas.

## Estilo

El paisaje ocupa toda la escena. La tipografía de título mantiene la identidad pixel art; textos breves y controles usan Lexend. La burbuja adopta una superficie oscura translúcida con acentos arena, bordes finos y una cola centrada que apunta a Alejo. El botón principal usa ámbar y los accesos secundarios bajan de peso visual.

La llegada desplaza al personaje y su sombra dentro de una escena central, sin arrastrar toda la composición. La posición de la burbuja queda reservada antes del saludo; su contenido puede crecer sin solapar al personaje. En móvil, todo mantiene el mismo eje y las pantallas estrechas apilan las opciones. Las vistas bajas permiten scroll y usan medidas más compactas.

## Contratos conservados

Sonido voluntario, pausa, preferencia de movimiento, diálogo ramificado, escritura progresiva, anuncios accesibles de frases completas, progreso real, reintento, acceso directo y entrada diferida siguen usando los mismos controladores. El contenedor de presentación pasa de `.intro-card` a `.intro-content`; el vínculo con `bindIntroFx` se actualiza en el mismo cambio.

## Archivos

- `src/app/shell.ts`: estructura e información inicial.
- `src/styles/intro-interactive.css`: composición central, apariencia y adaptación.
- `src/core/experience/intro-dialogue.ts`: textos de bienvenida y especialidades.
- `src/app/fx/intro-fx.ts`: referencia al nuevo contenedor, sin alterar las reglas del diálogo.
- `tests/interiors-and-cinematics.test.ts`: actualización de los identificadores de estructura que cambiaron intencionalmente.

## Verificación

- 108 pruebas aprobadas, incluidos los recorridos de conversación, pausa, carga, movimiento reducido y foco.
- `npm run lint`: aprobado.
- `npm run build -- --base=/PortfolioPersonal/`: aprobado.
- `git diff --check`: aprobado.
- Sin cambios de dependencias ni assets nuevos.

Se inspeccionó visualmente **la versión publicada anterior**, no este rediseño. La revisión visual del resultado sigue pendiente: los navegadores no alcanzan el servidor de desarrollo de este entorno; la vista temporal de HTML también fue rechazada por la política de navegación del navegador. No se intentó eludir esa restricción. Las pruebas automatizadas no verifican geometría ni composición renderizada.

## Revisión manual

```sh
git switch feat/unified-intro-scene
npm ci
npm run dev
```

Abrir en una pestaña nueva sin hash. Comprobar 1440×900, 1024×768, 390×844, 320×568 y 844×390. Revisar que el título, la burbuja, el personaje y las acciones se perciban como una única escena; verificar textos largos, zoom, ambas respuestas, sonido, pausa, movimiento reducido, foco de teclado y acceso directo. En vistas pequeñas se permite scroll vertical, sin superponer contenido.

La PR no se fusionó ni publicó. La autorización de la PR #3 correspondía a la mejora anterior.
