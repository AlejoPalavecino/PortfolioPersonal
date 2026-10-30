# Dirección visual e integración de assets

**Versión:** 0.7 · **Fecha:** 29 de octubre de 2026 · **Estado:** dirección visual de revisión 2 y distribución base de 10 adoptadas; geometría de referencia y derivados web pendientes de integración.

Este documento orienta al agente de desarrollo para utilizar el kit existente. Registra qué piezas hay, qué función cumple cada una y qué debe comprobarse al integrarlas. No prescribe un framework ni contiene una implementación.

Las rutas parten de esta carpeta y suponen que `portfolio-campamento-handoff` y `portfolio-campamento` se conservan como carpetas hermanas al descomprimir el paquete.

## 1. Referencia y jerarquía de decisiones

**Confirmado:** la dirección elegida es Campamento creativo, un portfolio de apariencia pixel art inspirado en Mendoza y los Andes. Su propósito es mostrar el trabajo de Alejo a empleadores y clientes. El taller representa Proyectos; la carpa y el fogón, Sobre mí; la mesa de bitácora, Trayectoria; y la radio, Contacto.

La [referencia visual seleccionada](../portfolio-campamento/source/selected-concept.png) fija el ambiente: luz diurna cálida, cordillera azul, vegetación verde, madera, terracota y senderos claros. El taller tiene protagonismo. La referencia también contiene textos y objetos ilustrativos que no constituyen una lista adicional de recursos por construir.

La mesa de Trayectoria se incorporó como cuarto destino del kit aunque no tenga un rótulo propio en esa imagen inicial. La interfaz del sitio debe mostrar los cuatro destinos definidos en el alcance.

**Documentado, pendiente de revisión en contexto:** las distribuciones de [world-layout.json](../portfolio-campamento/config/world-layout.json) y los valores de [design-tokens.json](../portfolio-campamento/config/design-tokens.json) son propuestas de trabajo. No equivalen a pantallas finales aprobadas, puntos de corte para móvil ni un mapa transitable.

Ante diferencias, usar las dimensiones y coordenadas observadas del inventario y los atlas. Las dimensiones solicitadas en los prompts de generación no son la autoridad sobre el archivo obtenido. Para apariencia y composición, tomar la referencia seleccionada y la [guía de arte](../portfolio-campamento/docs/GUIA_DE_ARTE.md); para comportamiento, consultar la especificación de experiencia del dossier.

## 2. Inventario principal de imágenes

El [manifiesto](../portfolio-campamento/assets-manifest.json) registra 35 recursos principales: **14 PNG, 14 SVG, 2 fuentes y 5 WAV**. Los metadatos, licencias, CV y documentación acompañan esos recursos. La imagen de concepto elegida es una referencia adicional, no un fondo de la web que deba mostrarse como captura plana.

| Archivo | Dimensiones originales | Transparencia real | Función |
|---|---:|:---:|---|
| [world-backdrop.png](../portfolio-campamento/assets/world/world-backdrop.png) | 1536 × 1024 | No | Cielo, cordillera y paisaje lejano; detrás del terreno. |
| [camp-ground.png](../portfolio-campamento/assets/world/camp-ground.png) | 1536 × 1024 | Sí | Suelo, senderos, río y zonas donde ubicar destinos. |
| [camp-foreground.png](../portfolio-campamento/assets/world/camp-foreground.png) | 1536 × 1024 | Sí | Vegetación y rocas de primer plano; uso opcional según composición. |
| [poi-projects.png](../portfolio-campamento/assets/destinations/poi-projects.png) | 1536 × 1024 | Sí | Taller de Proyectos; cartel vacío para rótulo web. |
| [poi-about.png](../portfolio-campamento/assets/destinations/poi-about.png) | 1254 × 1254 | Sí | Carpa y fogón de Sobre mí; fuego agregado como efecto independiente. |
| [poi-journey.png](../portfolio-campamento/assets/destinations/poi-journey.png) | 1254 × 1254 | Sí | Mesa y bitácora de Trayectoria. |
| [poi-contact.png](../portfolio-campamento/assets/destinations/poi-contact.png) | 1254 × 1254 | Sí | Estación de radio de Contacto. |
| [avatar-master.png](../portfolio-campamento/assets/character/avatar-master.png) | 1254 × 1254 | Sí | Referencia de identidad y proporciones del personaje. |
| [avatar-movement-atlas.png](../portfolio-campamento/assets/character/avatar-movement-atlas.png) | 1402 × 1122 | Sí | Veinte cuadros para reposo y caminata en cuatro direcciones. |
| [alejo-portrait.png](../portfolio-campamento/assets/character/alejo-portrait.png) | 1254 × 1254 | Sí | Retrato estilizado para presentación personal y panel Sobre mí. |
| [camp-props-atlas.png](../portfolio-campamento/assets/decoration/camp-props-atlas.png) | 1536 × 1024 | Sí | Ocho objetos decorativos reutilizables. |
| [camp-effects-atlas.png](../portfolio-campamento/assets/effects/camp-effects-atlas.png) | 1448 × 1086 | Sí | Doce cuadros: fuego, humo y brillo del agua. |
| [favicon-master.png](../portfolio-campamento/assets/brand/favicon-master.png) | 1254 × 1254 | Sí | Monograma AP maestro; requiere exportaciones pequeñas. |
| [portfolio-share-cover.png](../portfolio-campamento/assets/brand/portfolio-share-cover.png) | 1672 × 941 | No | Portada ilustrada para compartir; no es una captura de una web implementada. |

La fotografía de Alejo se utilizó como referencia de elaboración y **no se incluye en el kit ni debe incorporarse automáticamente al repositorio público**. Para el sitio se entregan las versiones ilustradas.

## 3. Composición, capas y escala

La perspectiva del campamento es elevada de tres cuartos: los objetos muestran frente y parte de sus superficies superiores. Mantener iluminación cálida y sombras compatibles. Usar altura del avatar, puertas y mobiliario como referencias de escala; conservar las proporciones de cada imagen.

Orden conceptual: paisaje lejano, terreno, destinos y objetos sobre el suelo, avatar según profundidad, detalles de primer plano e interfaz. El orden concreto debe permitir que el personaje pase por delante o detrás de los elementos de forma coherente con sus pies. Las zonas de interacción y colisión se definen aparte: el rectángulo completo de un PNG contiene márgenes transparentes y no representa su huella física.

`world-layout.json` contiene escenas de referencia de **1536 × 1152** y **768 × 1152** unidades lógicas. Estas cifras describen composiciones de muestra; no son tamaños de dispositivo exigidos. El paisaje mantiene su proporción y admite recorte. En móvil se recompone la escena para conservar destinos reconocibles y controles legibles.

El primer plano está oculto inicialmente en ambas referencias porque puede tapar destinos. Activarlo solo después de comprobar la visibilidad de la carpa, el avatar y los accesos. La decoración debe ayudar a leer el espacio; no todas las piezas tienen que mostrarse simultáneamente.

Los originales son ilustraciones de **apariencia pixel art con densidad de píxel variable**. No constituyen un tileset normalizado a una cuadrícula única. El agente debe comparar el resultado al tamaño real, elegir escala y muestreo por tipo de pieza y registrar los ajustes. No reducir todo automáticamente a sprites de 32 píxeles ni estirar ancho y alto por separado.

### Mapa transitable y puntos de llegada · DEC-26/28 / Hito 10

Alejo eligió poder caminar manualmente y seleccionar una sección para que el personaje vaya y la abra al llegar. La distribución base elegida en DEC-28 concreta esa experiencia; durante la integración se ajustan las áreas transitables, las huellas y un punto de llegada reconocible para cada destino al terreno ilustrado. La entrada de cada objeto debe quedar al alcance del personaje sin apoyarse en un margen transparente ni atravesar mobiliario.

El [hito 10 · Mapa jugable](10_HITO_MAPA_JUGABLE.md) registra el mapa base adoptado: claro central con cuatro ramales y posición inicial central, acompañado por huellas y cuatro zonas de llegada de referencia. Conserva taller arriba a la derecha, carpa a la izquierda, bitácora abajo a la izquierda y radio abajo a la derecha. La radio se ubica en el claro derecho del mismo margen accesible; Contacto no exige un puente nuevo ni cruzar agua. El avatar aparece en el cruce central orientado hacia el taller. Esta organización queda adoptada en DEC-28 con las láminas 0.1 de escritorio y móvil como referencia. Las coordenadas y huellas no se deducen como exactas de las maquetas: el agente puede ajustarlas para integrar el terreno y el personaje, conservando la distribución. Solo una alteración material de esa organización vuelve a diseño.

La [carpeta de mapas](maps/README.md) reúne esquemas, `world-navigation-proposal.json` y `geometric-review.json`. Sus marcos propios son **1000 × 650** para escritorio y **600 × 760** para móvil, relativos al área jugable. No representan píxeles CSS ni sustituyen silenciosamente los lienzos históricos de `world-layout.json`. Los datos son documentación de intención espacial, no configuración lista para un motor ni código de navegación.

El terreno existente es una sola ilustración con claros, senderos, escalones y río; no es un tileset de plataformas separables. Los polígonos propuestos deben alinearse con su suelo visible durante la integración. En móvil se pueden ajustar encuadre, escala y posición de objetos, conservando su proporción; reordenar libremente plataformas requeriría adaptar el fondo y revisar esa decisión. Los rótulos y controles conservan tamaño y legibilidad de interfaz: no se reducen junto con todo el bitmap.

El suelo libre debe permanecer conectado con las cuatro entradas, incluida la posición inicial y las posiciones válidas obtenidas durante exploración. Las huellas representan apoyos físicos y obstáculos, sin usar el rectángulo transparente de los archivos. Se conserva margen de paso para el cuerpo del avatar, con entradas fuera de las huellas y límites claros junto al agua. La revisión geométrica del esquema comprueba únicamente sus datos declarados; el agente todavía debe comprobar las colisiones reales, la alineación con la ilustración, la profundidad, la animación y los tiempos de recorrido.

En móvil se propone llevar el bloque del campamento al área visible una vez al iniciar una ruta, sin seguimiento continuo de cámara y conservando el scroll de la página. Esta regla complementa 02/09 como propuesta de composición; no impone un alto fijo ni obliga a encajar hero y mapa completos en una sola pantalla.

Este hito concreta el espacio mediante documentación y esquemas; no requiere crear nuevas ilustraciones ni reemplazar los 35 recursos principales. La representación técnica del mapa y el mecanismo de recorrido corresponden al agente de desarrollo. Las duraciones de 1–2 segundos y hasta 3 en trayectos más largos siguen como objetivos de diseño pendientes de medición en contexto.

## 4. Cómo leer los atlas

Los JSON contiguos son la referencia para recortes y secuencias. `x` e `y` indican la esquina superior izquierda en la imagen original; `w` y `h`, el tamaño del recorte; `anchorX` y `anchorY`, el apoyo relativo dentro de ese recorte. Aplicar la misma escala a una secuencia completa, incluidos sus anclajes. No igualar cada cuadro a un ancho fijo.

### Personaje

El [atlas del avatar](../portfolio-campamento/assets/character/avatar-movement-atlas.json) contiene cuatro filas en orden abajo, izquierda, derecha y arriba. En cada fila hay reposo y cuatro fases de caminata. Las secuencias se llaman `idleDown`, `walkDown`, `idleLeft`, `walkLeft`, `idleRight`, `walkRight`, `idleUp` y `walkUp`.

Los recortes tienen tamaños variables: aunque hay cuatro filas y cinco columnas, no dividir el PNG en veinte celdas iguales. Usar las coordenadas individuales. La cadencia inicial registrada es 6 cuadros por segundo y debe ajustarse a la velocidad real de movimiento. Los anclajes se calcularon con referencia a la cabeza y la base sólida de los zapatos; la comprobación visual del apoyo de los pies sigue pendiente.

Existen variaciones menores de contorno, proporción y volumen entre poses. Revisar especialmente el retorno del último al primer cuadro y cualquier deslizamiento aparente del personaje. El atlas es una base animable, no una animación depurada manualmente.

Las secuencias existentes cubren la caminata de DEC-26. Deben comprobarse tanto durante el control manual como en recorridos automáticos, especialmente al cambiar de dirección, detenerse, cancelar una ruta y llegar a una entrada. El apoyo de los pies, la cadencia y el regreso a reposo se revisarán en la escena; el cambio de flujo no acredita esa validación ni exige producir arte adicional.

### Decoración

El [atlas de objetos](../portfolio-campamento/assets/decoration/camp-props-atlas.json) contiene `pine`, `leafy-tree`, `bush`, `rocks`, `lantern`, `plant`, `sign` y `bench`. La separación real entre las dos filas está en **y = 602**, no en la mitad del archivo. Usar cada recorte y su anclaje; los ocho objetos tienen tamaños distintos y sombras de apoyo integradas.

### Efectos

El [atlas de efectos](../portfolio-campamento/assets/effects/camp-effects-atlas.json) contiene tres filas de cuatro celdas de **362 × 362**: `fire`, `smoke` y `waterSparkle`. La cadencia inicial es 6 cuadros por segundo. Se conservan las celdas completas para incluir chispas y fragmentos separados.

Apoyar el fuego en el fogón, el humo por su emisor inferior y el brillo por su reflejo central. El brillo es un detalle localizado; no constituye una animación completa del río. Revisar cambios de masa, en particular del humo, y el empalme del bucle. La lectura y navegación deben funcionar al pausar estos efectos.

## 5. Transparencia y exportación

La [auditoría registrada](../portfolio-campamento/docs/QA_ASSETS.json) informa 14 PNG válidos, 12 con transparencia real. Algunos visores muestran colores RGB ocultos en píxeles de alpha cero; esto no demuestra un halo visible en la web. Hay píxeles marginales de opacidad muy baja que requieren revisión sobre fondos claros y oscuros al tamaño final.

Conservar los maestros intactos. Preparar derivados web con sus propias dimensiones y mantener correspondencia con la fuente. Si se cambia físicamente el tamaño o recorte de un atlas, actualizar sus metadatos; si solo se representa a otra escala, conservar las coordenadas originales y escalar su visualización de forma uniforme.

Pendientes del agente de desarrollo: exportaciones optimizadas, tamaños de carga apropiados, variantes pequeñas de favicon y ajuste de encuadre de la portada para el destino de publicación. Las fuentes se entregan en TTF; no hay WOFF2 en el kit. No aplanar la transparencia de los elementos recortables.

## 6. Interfaz, color y tipografías

Nombre, presentación, rótulos, navegación, botones, enlaces, fichas y textos extensos deben ser elementos web editables y seleccionables. Los carteles ilustrados están vacíos para incorporar esos rótulos. Las capturas de proyectos deberán mostrar productos reales; la decoración del campamento no sustituye esa evidencia.

La paleta propuesta utiliza tinta `#102E3C`, papel `#FFF4DF`, acento `#EB654F`, cielo `#91CFF0`, vegetación `#315747` / `#789451` y terracota `#B85C45`. Los demás valores están en `design-tokens.json`. Son colores de interfaz propuestos, no una extracción exacta de la ilustración ni colores oficiales de FoxMind. Comprobar cada combinación final de texto y fondo.

Las fuentes locales son [Lexend](../portfolio-campamento/assets/fonts/Lexend-Variable.ttf), pesos 100–900, para lectura, botones y navegación; y [Pixelify Sans](../portfolio-campamento/assets/fonts/PixelifySans-Variable.ttf), pesos 400–700, para títulos breves. La propuesta inicial de lectura es 1 rem, interlineado 1,6 y ancho de párrafo de hasta 65 caracteres; requiere revisión con el contenido real. Los caracteres españoles fueron comprobados en el registro del kit. Conservar [Lexend-OFL.txt](../portfolio-campamento/assets/fonts/Lexend-OFL.txt) y [PixelifySans-OFL.txt](../portfolio-campamento/assets/fonts/PixelifySans-OFL.txt).

Los catorce SVG de [icons.json](../portfolio-campamento/assets/icons/icons.json) cubren mapa, bitácora, proyectos, correo, descarga, cierre, sonido, flechas, enlace externo y menú. Conservar [LICENSE-lucide.txt](../portfolio-campamento/assets/icons/LICENSE-lucide.txt) y el registro de procedencia. Los iconos acompañan etiquetas o nombres accesibles. GitHub y LinkedIn pueden mostrarse con texto y enlace externo: no hay logotipos de esas marcas incluidos.

### Ajuste de identidad de la cabecera · revisión 2

Alejo adoptó la solución visual de la revisión 2: un emblema pequeño de carpa coral y montañas oscuras para volver al campamento, sin letras junto al símbolo. El nombre completo queda una vez en la presentación del inicio. La cabecera de escritorio conserva enlaces visibles; en móvil se utiliza una fila con emblema, Contacto, CV y Menú, según 02 y las maquetas vigentes del hito 07.

El [maestro independiente del emblema](assets/brand/camp-emblem-master.png) está preparado como PNG RGBA de **1774 × 887 px**, con transparencia real. Su [manifiesto](assets/brand/manifest.json) registra procedencia, dimensiones y observaciones. Es un recurso complementario a los 35 del kit original, cuyos maestros se conservan. El [README de integración](assets/brand/README.md) explica su uso y la preparación del derivado web.

La primera variante generada tenía un halo amplio y fue descartada. El maestro entregado retira ese halo; conserva píxeles marginales de alpha bajo que requieren revisión al tamaño final sobre fondos claros y oscuros. No se presenta como un SVG ni como una exportación web ya optimizada. Los SVG de menú y cierre disponibles acompañan sus etiquetas. El monograma AP y el favicon del kit se conservan; la aprobación del emblema de navbar no los reemplaza automáticamente.

## 7. Audio e identidad pendiente

Los cinco archivos de [audio](../portfolio-campamento/assets/audio/README.md) son `ui-open.wav`, `ui-close.wav`, `discovery.wav`, `step-soft.wav` y `camp-ambience-loop.wav`. Son síntesis original; el último es un ambiente de doce segundos, no una grabación de Mendoza. Los registros verifican formato y ausencia de clipping. La mezcla y la escucha en la escena final siguen pendientes.

El sonido comienza desactivado. Habilitarlo mediante una acción explícita del visitante y mantener una sola instancia del ambiente. Ajustar efectos y transiciones para que no dominen la lectura. Todo el contenido debe seguir disponible en silencio.

Los [originales oficiales de FoxMind y Foxy](../portfolio-campamento/assets/brand/official/README.md) siguen pendientes. Las consultas previas registradas no recuperaron esos archivos; este documento no hace una nueva comprobación de los servicios. No presentar un zorro generado ni el monograma AP como identidad oficial de FoxMind. Incorporar los originales únicamente si Alejo decide mostrar esas marcas y aporta los archivos o indica una fuente accesible. Son opcionales: su ausencia no bloquea el caso ni el inicio del desarrollo; puede identificarse FoxMind mediante texto y sus capturas seleccionadas.

## 8. Criterios de cierre de la integración visual

- [ ] Los cuatro destinos son identificables y corresponden a su sección; sus rótulos no están incrustados en las imágenes.
- [ ] Avatar, puertas y mobiliario conservan proporciones compatibles y una perspectiva coherente.
- [ ] La propuesta espacial de 10 está alineada con el terreno y las piezas reales; la posición inicial, el suelo libre y las cuatro zonas de llegada permanecen conectados, sin atravesar huellas ni agua, en escritorio y móvil. La comprobación se realiza en la escena integrada.
- [ ] Las secuencias existentes del avatar se revisaron en caminata manual y automática, incluidos giros, detención, cancelación y llegada.
- [ ] La ubicación, escala y orden de las piezas se revisaron en escritorio y móvil; ninguna capa tapa un acceso esencial.
- [ ] Los recortes se ven correctamente sobre superficies claras y oscuras, sin fondos residuales ni deformación.
- [ ] Las animaciones conservan apoyo, escala y rasgos; sus bucles se revisaron al tamaño final.
- [ ] Los paneles mantienen lectura y contraste con el contenido real, independientemente de la escena y sus efectos.
- [ ] Los derivados web y favicon se verificaron, con originales, metadatos y licencias conservados.
- [ ] El sonido fue escuchado y ajustado en contexto; permanece desactivado al iniciar.
- [ ] Las capturas y marcas profesionales utilizadas son las reales disponibles y están identificadas correctamente.

**Límite de la evidencia actual:** la auditoría del kit comprueba archivos y geometría. No certifica el parecido final del personaje, la coherencia de la composición, la calidad de la animación, la accesibilidad, el rendimiento ni la jugabilidad de la futura web. Esas comprobaciones corresponden a la integración y revisión posterior.

## Registro de cambios

**0.7 · 29/10/2026:** integración incluida en Dossier 1.0; se explicita el carácter opcional de las marcas oficiales de FoxMind/Foxy. Los assets y sus metadatos permanecen intactos.

**0.6 · 29/10/2026:** distribución base adoptada mediante DEC-28. Se resuelve la revisión espacial y se asignan a integración las coordenadas, huellas y holguras; se conservan pendientes la correspondencia con el terreno, escala, animación y pruebas.

**0.5 · 29/10/2026:** propuesta del mapa jugable en 10 y `maps/`, con marcos propios, posición inicial, huellas y entradas. Se explicitan límites del terreno como ilustración única, adaptación móvil y separación entre revisión geométrica documental e integración. Los 35 recursos se conservan; no se crea arte adicional.

**0.4 · 29/10/2026:** se agrega el pendiente de mapa transitable, puntos de llegada y rutas válidas derivado de DEC-26, junto con la validación contextual del atlas de caminata existente. No se modifica el inventario de 35 recursos ni se crea arte nuevo.
