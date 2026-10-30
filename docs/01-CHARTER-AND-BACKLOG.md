# Portfolio Campamento creativo — alcance y entregas

Construir una versión local navegable del portfolio de Alejo Palavecino para empleo y clientes, con las entregas E1–E4 del Dossier 1.0. El encargo permite empezar y resolver detalles reversibles sin otra entrevista. Perfil documental `solo` provisional: dos documentos; no se atribuye al usuario una elección adicional.

## Referencias vigentes

La autoridad de producto es [06 · Instrucciones](../Portfolio_Campamento_Documentacion_y_Assets_v1/portfolio-campamento-handoff/06_INSTRUCCIONES_PARA_AGENTE.md), seguida de 01, 02, 03 y 05 en esa misma carpeta. `content/portfolio.es.json` del handoff es la fuente editorial; contiene también datos internos y nunca se publica íntegro. Las cuatro maquetas `mockups/*-v2.png` son referencias de composición. El kit hermano conserva los originales de arte y CV.

DEC-13/14 fijan ficha crema integrada, amplia en escritorio y casi de ancho completo en móvil. DEC-15/16 fijan emblema, nombre una vez en hero y cabecera móvil Contacto · CV · Menú. DEC-26 fija caminar manualmente y seleccionar una sección para caminar y abrir al llegar. DEC-28 fija taller arriba a la derecha, carpa izquierda, bitácora abajo a la izquierda y radio abajo a la derecha, alrededor del claro inicial. DEC-08 está sustituida.

## Frontera del producto

| Incluido | Resultado observable |
|---|---|
| Presentación y cuatro secciones | Proyectos, Sobre mí, Trayectoria y Contacto, compartidos entre mapa y menú; texto HTML seleccionable. |
| Campamento y avatar | Un mismo mundo persistente; caminata manual, autoruta, colisiones, cuatro entradas, profundidad y animación. |
| Interrupciones | Último destino prevalece; Abrir ahora, Cancelar y Continuar; pausa por pestaña oculta; historial y foco previsibles. |
| Lectura integrada | Escena quieta e inactiva detrás del contenido; navegación, CV y preferencias disponibles. |
| Contacto y CV | Correo visible y `mailto:` con asuntos empleo/proyecto; PDF real. Abrir correo no confirma envío. |
| Adaptación y ambiente | Escritorio/móvil, teclado acotado a escena, movimiento reducido, audio voluntario inicialmente apagado, alternativa ante fallo. |
| Entrega mantenible | Fuentes, build estático, instrucciones reales, inventario de pendientes y evidencias. |

Fuera de este encargo: cuentas, backend, base de datos, pagos, chat IA, formulario conectado, analítica, otro idioma, misiones, nuevas zonas y día/noche. Publicar, subir al remoto y crear PR requieren la instrucción correspondiente. No se necesita infraestructura Docker para el producto estático.

## Requisitos que gobiernan la implementación

1. Navegación profesional disponible durante carga o fallo del mundo; nunca exigir jugar ni activar sonido.
2. Elegir sección con escena lista y movimiento habilitado inicia una ruta; abre una sola vez al llegar. La selección desde menú y objeto es equivalente. La misma sección abierta conserva la lectura.
3. Redirigir conserva el origen de la primera ruta; cancelar recupera su vista, scroll y foco, pero mantiene la posición física alcanzada. No existen aperturas atrasadas.
4. Tarjetas, regresos, Atrás, CV, correo y enlaces externos son inmediatos. Movimiento reducido o escena no disponible abren contenido directamente.
5. Manual solo con foco en escena activa. Perder foco libera teclas; autoruta no necesita foco y se pausa al ocultar la pestaña hasta reanudación explícita.
6. El terreno ilustrado es una pieza única: geometría, objetos y entradas se alinean con sus claros reales. Contacto no requiere cruzar agua ni puente. Marcos del dossier son referencia, no colisiones aprobadas.
7. Rótulos y controles conservan tamaño HTML legible; no escalan como texto dentro del bitmap. Scroll y zoom táctiles siguen disponibles.
8. Objetivo inicial de autorutas: 1–2 s, excepcionalmente hasta 3 s. Son objetivos pendientes de medición; no justifican atravesar obstáculos o acelerar de forma antinatural.

## Contenido de revisión y condición de publicación

La revisión local puede mostrar FoxMind y Flower con reservas claramente identificadas. Una reserva no es una captura real ni evidencia de producto. Antes de una publicación se exige al menos un caso completo entre ambos y se omite el incompleto.

| Elemento | Contenido permitido | Pendiente y responsable |
|---|---|---|
| FoxMind | Resumen educativo general, cofundación, desarrollo completo hasta etapa actual incluida IA, estado previo a pilotos y capturas elegidas por Alejo. | Alejo: capturas y revisión final. Agente: integración y pies/contexto. No pedir código, demo, repositorio, arquitectura o acceso. No publicar stack/enlace históricos del CV. |
| Flower | Sistema de stock y facturación para la librería Flower; desarrollo integral individual; React, Node.js, PostgreSQL; producción y facturación automática de ventas mediante ARCA. | Alejo: evidencia real y revisión final. Agente: integrar sin inventar métricas, detalles de ARCA ni problema previo. |
| Perfil y trayectoria | Foco confirmado en full stack, análisis y automatización/IA. Tech Lead/Product Owner son intereses. | Alejo: vigencia de estudios, fechas, continuidad de roles y disponibilidad. Omitir datos no revisados en público. |
| Contacto y CV | Correo y PDF aportados; canales históricos disponibles para revisión local. | Alejo: elegir versión final y confirmar canales. Agente: verificar enlaces/archivo. |
| Identidad | Retrato y avatar ilustrados; emblema adoptado. | Alejo: parecido individual. Agente: ajustar escala/anclajes sin alterar maestros. |

Solo se exportan campos públicos elegidos de forma explícita. Fuentes, notas internas, estados editoriales, proyectos vacíos y datos históricos quedan fuera del bundle. El tercer caso, logos, métricas y enlaces opcionales se omiten si no existen.

## Mapa único de historias

`[ ]` Backlog · `[~]` WIP · `[x]` comprobada. El estado de una entrega no implica aprobar criterios que todavía dependen de contenido o revisión humana.

| Estado | Entrega / slice | Resultado | Criterios del dossier |
|---|---|---|---|
| [~] | E1 / navegación profesional | Implementada y navegada en escritorio/móvil. Casos y canales conservan revisión editorial. | Cobertura y límites en ENTREGA-0.1.0.md. |
| [~] | E2 / campamento | Cuatro rutas, manual, sustitución, cancelación, pausa y reducción comprobados. Matriz exhaustiva de geometría/gestos pendiente. | Rutas desde inicio: 1,19–1,96 segundos observados. |
| [~] | E3 / calidad y contenido | Teclado, carga/fallos, derivados y metadatos implementados. Evidencia real, escucha y hardware/zoom pendientes. | AC-18/19/20 siguen pendientes de contenido final. |
| [x] | E4 / entrega técnica | Versión local identificada, ejecución/build y actualización documentadas; ZIP estático preparado. | AC-24. AC-25 no encargado. |

## Cierre y registro

Cada evidencia indica versión, entorno, acción, resultado y limitación; capturas prueban composición, no caminata, teclado ni historial. Ningún AC se marca aprobado solo por compilar o por existir una prueba unitaria.

Inicio de diseño: `ESTADO_DISENO: LISTO_PARA_TDD_RED`. La falta de capturas y confirmaciones finales limita publicación/AC-18, no el arranque ni la navegación. Operación y contrato exacto: [02 · Playbook](02-PLAYBOOK-AND-OPS.md).
