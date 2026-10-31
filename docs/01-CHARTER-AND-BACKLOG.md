# Campamento explorable — alcance vigente

La evolución solicitada el 30/10/2026 convierte el portfolio en una experiencia de exploración desde su primera pantalla. Conserva la finalidad profesional: empleo y clientes en full stack, análisis, automatización e IA. Se implementa en una rama de revisión, sin publicar esta evolución en `main`.

## Autoridad y continuidad

El nuevo encargo prevalece sobre el Dossier 1.0 donde exige otra composición: sustituye navbar convencional, hero antes del mapa, página vertical para jugar y obligación de mostrar toda la isla en móvil. También sustituye el menú móvil en flujo y la cámara siempre estática. No se requiere otra entrevista ni aprobación para empezar: el usuario pidió plan breve e implementación hasta una versión revisable.

Se conservan campamento andino, personaje/assets, cuatro destinos y organización relativa, caminata manual, selección con recorrido y apertura al llegar, fichas integradas HTML, acceso profesional directo, historial, foco y protección contra llegadas obsoletas. Se mantiene Vite/TypeScript, `assetUrl`, rutas y colisiones existentes.

[PLAN-GAME-FIRST](PLAN-GAME-FIRST.md) define el contrato actual. [Dossier original](../Portfolio_Campamento_Documentacion_y_Assets_v1/portfolio-campamento-handoff/06_INSTRUCCIONES_PARA_AGENTE.md), maquetas v2 y [entrega 0.1.0](ENTREGA-0.1.0.md) son antecedentes: acreditan dirección/contenido o evidencias de esa versión, no requisitos vigentes de navbar/hero ni pruebas de esta evolución. La [publicación anterior](PUBLICACION.md) sigue online desde `main`; esta rama no la reemplaza automáticamente.

Perfil documental `solo` existente, con este charter, el playbook y un contrato de cambio acotado. No se atribuye al usuario una nueva elección de perfil.

## Experiencia incluida

| Área | Resultado exigido |
|---|---|
| Inicio | Pantalla del mismo mundo, nombre una vez, “Un portfolio para explorar”, foco profesional breve, Entrar al campamento, Ver portfolio sin recorrer, Contacto y CV. |
| Preparación | Recursos críticos reales listos antes de habilitar Entrar; estado visible en la intro, sin porcentaje ficticio ni espera mínima. Error/reintento y alternativa reforzada a los 8 s. |
| Exploración | Viewport como área de juego, personaje visible, HUD superpuesto, ayuda breve descartable/recuperable y ninguna búsqueda mediante scroll del documento. |
| Cámara | Transformación coherente de mundo/objetos/avatar/entradas; encuadre móvil cercano, seguimiento suave limitado y conversión inversa de toque. |
| HUD | Menú del campamento, Contacto, CV, Cómo jugar y ajustes; nombres/foco claros. Menú superpuesto que pausa juego y no empuja escena. |
| Recorridos | Seleccionar, caminar, llegar y abrir una vez; última intención prevalece; Abrir ahora, cancelar y reanudar explícitamente. |
| Lectura | Panel HTML con scroll interno, título/regreso accesibles, cámara y avatar quietos; conserva contexto, lista, foco e historial. |
| Acceso directo | Misma información y servicios sin caminata, disponible antes de cargar escena y ante fallo. Deep-link omite intro. |
| Adaptación | `dvh`/safe areas, anchos pequeños, horizontal, zoom/texto ampliado, teclado contextual y reducción de movimiento. |
| Entrega | Commit identificable, preview de revisión, capturas, recorrido funcional, checks y criterios comprobados/parciales/pendientes. |

Fuera de alcance: backend, cuentas, mensajes almacenados, pagos, analítica, otro idioma, misiones, nuevas zonas, joystick por defecto, pantalla completa obligatoria y bloqueo de orientación/zoom. Un motor nuevo solo tendría sentido ante una limitación concreta; el cambio actual no lo necesita.

## Invariantes

1. El contenido profesional y el CV no dependen de jugar, visitar destinos, cargar audio ni terminar el mundo.
2. Una primera preparación rápida habilita inmediatamente Entrar; no retira por sí sola la intro. Volver durante la misma sesión puede omitir la presentación ya aceptada.
3. La carga crítica incluye terreno, backdrop, cuatro POIs, metadatos y los 20 frames del avatar, además de la navegación validada. Audio, CV, retrato y capturas no bloquean juego.
4. Avatar y cámara permanecen separados de vista, lectura y foco. Menú/ayuda/ajustes y pestaña oculta pausan control/ruta; cerrar o recuperar visibilidad no reanuda una ruta por sorpresa.
5. Reemplazar ruta conserva su primer contexto de origen. Cancelar mantiene posición física alcanzada y restaura una vista/cámara/foco útiles. Ningún callback antiguo abre contenido.
6. El mundo mantiene 1000 × 650 y se alinea con el terreno indivisible. En móvil puede quedar parcialmente fuera de cámara; los cuatro destinos siguen en el menú. Contacto continúa por tierra firme.
7. Fichas, intro y menús largos desplazan su contenedor: no se recortan textos para ocultar scroll. No hay scroll de ventana para jugar ni abrir lectura.
8. Movimiento reducido detiene caminar, cámara y ambiente continuo; todo destino abre directo. Sonido apagado inicialmente y activado por gesto.
9. Actualizaciones por frame solo afectan representación física; HUD, foco, historial y anuncios cambian por transiciones significativas.
10. Objetivo inicial de rutas habituales: 1–2 s medidos sobre la escena; no abre un timer ni se atraviesan obstáculos para cumplirlo.

## Contenido profesional

Las fuentes públicas seleccionadas siguen en `src/entities` y las fichas en `src/widgets`. No se incluye el JSON editorial íntegro en el bundle.

| Caso / área | Hechos y límites | Pendiente |
|---|---|---|
| FoxMind | Plataforma educativa con IA; cofundación y desarrollo hasta etapa actual, incluida IA; previo a pilotos. Solo descripción general, rol/aporte, estado y capturas seleccionadas. Sin stack/enlace históricos, arquitectura, código, demo ni repositorio. | Alejo: capturas y revisión editorial. |
| Flower | Librería cliente; desarrollo integral individual con React, Node.js y PostgreSQL; producción; ARCA automatiza la **facturación de las ventas**, no las ventas. | Alejo: evidencia real y revisión editorial. |
| Servicios | Software a medida, análisis funcional, integraciones, automatización e IA aplicada. | Redacción comprensible sin inventar paquetes/resultados. |
| Perfil/CV/contacto | Datos y archivos aportados identificados como revisión; sin cargos, disponibilidad o métricas inventados. | Vigencia, canales y PDF definitivo de Alejo. |

Las reservas permanecen identificadas en la preview. La publicación anterior de revisión no acredita casos completos ni aceptación global. Una publicación editorial definitiva conserva sus requisitos de evidencia real; esta nueva experiencia se entrega para revisión sin publicarla en `main`.

## Mapa de trabajo actual

`[ ]` pendiente · `[~]` WIP · `[x]` comprobado en esta evolución. Las evidencias históricas no cambian estos estados.

| Estado | Slice | Cierre observable |
|---|---|---|
| [~] | GF-1 / núcleo y preparación | Cámara pura, lifecycle y loader real con tokens; tests RED antes del GREEN. |
| [ ] | GF-2 / inicio y HUD | Intro, escena de viewport, menú superpuesto, ayuda y ajustes sin desplazar documento. |
| [ ] | GF-3 / exploración y lectura | Cámara/input coherentes, rutas y panel interno con contexto, enlaces directos e historial. |
| [ ] | GF-4 / verificación y entrega | Matriz A–M, viewports, checks, preview, commit y registro de pendientes. |

`ESTADO_DISENO: LISTO_PARA_TDD_RED`. Operación y estrategia: [playbook](02-PLAYBOOK-AND-OPS.md). Contratos y DoT: [plan vigente](PLAN-GAME-FIRST.md).

## Iteración de calidad — 31 de octubre de 2026

El mapa GF anterior describe la preparación histórica de 0.2.0 y queda reemplazado para esta revisión por [PLAN-QUALITY](PLAN-QUALITY.md). No se cambian los cuatro destinos ni el alcance público de contenido.

| Estado | Unidad | Evidencia |
| --- | --- | --- |
| [x] | Geometría, selección y profundidad | Cinco puntos antes/después, muestras sólidas, 16 conexiones entre entradas y 14 aproximaciones instrumentadas. |
| [x] | Historial, foco, ayuda, movimiento y adaptación | Regreso durante ruta, teclado/foco, cuatro tamaños, motion efectivo, Flower horizontal. |
| [x] | Ladera y señalética | Terreno nuevo, cámara compartida, tablillas/placa/poste HTML accesibles. |
| [x] | Superficies y carga | Variantes, transiciones cancelables, prueba rápida/lenta/fallida; finalización tardía de carga lenta no comprobada. |
| [x] | Infraestructura editorial de credenciales | Colección y rutas, originales preservados, borradores excluidos. |
| [ ] | Cierre editorial | Material de Alejo: capturas, CV/canales y originales/atribución de credenciales. |

Entrega local `0.3.0-review.1`, sin integración remota ni publicación. Pruebas66/66, lint/build y dos jueces sin severos; límites y capturas en [ENTREGA-QUALITY](ENTREGA-QUALITY.md).
