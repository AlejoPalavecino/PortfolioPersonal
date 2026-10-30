# 07 · Hito de pantallas principales

**Proyecto:** Portfolio de Alejo Palavecino · Campamento creativo  
**Versión:** 0.3 · **Fecha:** 29 de octubre de 2026 · **Estado:** dirección visual de revisión 2 adoptada; avance al hito de contenido profesional.

## 1. Propósito del hito

Revisar la llegada al portfolio y la lectura de un caso de proyecto mediante cuatro vistas del mismo concepto, tanto en escritorio como en celular. La revisión 2 responde al pedido de evitar la repetición del nombre y mejorar las proporciones móviles, conservando la proporción general de ficha que Alejo aprobó.

El hito termina con una referencia visual revisada y sus ajustes documentados. La generación de imágenes, por sí sola, no cierra el diseño ni acredita que exista una web funcional.

## 2. Decisión aprobada y propuestas que se revisan

**DEC-13 aprobada:** la ficha de proyecto se integra visualmente en el campamento. El caso se lee sobre una superficie propia y estable, mientras el paisaje conserva el contexto del mundo. La elección está registrada en [01_PRODUCTO_Y_DECISIONES.md](01_PRODUCTO_Y_DECISIONES.md).

**DEC-14 aprobada:** la proporción general de la ficha presentada resulta adecuada para Alejo. Se conservan la superficie crema y el ancho de lectura de referencia, con paisaje alrededor en escritorio y casi todo el ancho en móvil. La referencia del 80 % del ancho útil en escritorio sigue siendo orientativa. La aprobación no fija dimensiones CSS ni cierra la distribución de cabecera y franja móvil, que se está refinando.

**DEC-15 adoptada:** la cabecera utiliza un emblema pequeño de carpa y montaña para volver al campamento. El nombre completo aparece una vez en la presentación. Alejo aprobó esta solución tras revisar la segunda versión.

**DEC-16 adoptada como referencia visual:** una fila de cabecera con emblema, Contacto, CV y Menú. Contacto y CV siguen visibles en inicio y ficha. Las imágenes muestran el estado cerrado. El despliegue de los cuatro enlaces en el flujo de la página, la selección, el cierre y el foco siguen especificados en 02 para implementar y comprobar.

**Propuesta editorial del inicio:** **Ver proyectos** como acción principal y **Contactar** como secundaria. **Explorar** acompaña el mapa como ayuda o acceso al recorrido opcional. Esta jerarquía continúa pendiente de revisión; DEC-13 no la aprueba de manera implícita.

Los controles y estados siguen la propuesta de [02_EXPERIENCIA_Y_PANTALLAS.md](02_EXPERIENCIA_Y_PANTALLAS.md). Los textos fuente y su estado editorial están en [04_CONTENIDO_Y_PENDIENTES.md](04_CONTENIDO_Y_PENDIENTES.md). Si una maqueta muestra texto deformado, omitido o distinto, prevalece la documentación escrita.

## 3. Las cuatro vistas

Los marcos de trabajo son **1440 × 1024 para escritorio** y **390 × 844 para móvil**. Se utilizan como referencias de composición. Las imágenes generadas tienen otras dimensiones; el tamaño real de cada archivo se registra en [mockups/manifest.json](mockups/manifest.json). No se debe deducir una resolución exacta, un punto de corte o una medida de interfaz a partir del marco solicitado.

| Vista | Qué permite revisar | Archivo |
|---|---|---|
| **S01 · Inicio de escritorio** | Nombre completo una vez en la presentación, emblema en navbar y cuatro destinos. | [01-inicio-escritorio-v2.png](mockups/01-inicio-escritorio-v2.png) |
| **S02 · Ficha integrada de escritorio** | Proporción de ficha conservada y emblema de navegación coherente con el inicio. | [02-ficha-escritorio-v2.png](mockups/02-ficha-escritorio-v2.png) |
| **S03 · Inicio móvil** | Cabecera de una fila, presentación equilibrada y campamento visible antes. | [03-inicio-movil-v2.png](mockups/03-inicio-movil-v2.png) |
| **S04 · Ficha integrada móvil** | Misma cabecera compacta, ancho de lectura conservado y comienzo de lectura más arriba. | [04-ficha-movil-v2.png](mockups/04-ficha-movil-v2.png) |

### S01 · Inicio de escritorio

Debe identificar a Alejo y su área de trabajo antes de pedir una interacción. La presentación utiliza como base «Desarrollo software. Transformo ideas en productos.» y la descripción editorial de 04. El campamento conserva su protagonismo sin competir con el texto.

Los cuatro destinos se reconocen por objeto y rótulo: taller/Proyectos, carpa y fogón/Sobre mí, bitácora/Trayectoria y radio/Contacto. El avatar aparece como parte del mundo. La navegación ofrece esas mismas secciones, acceso al campamento y CV. Los controles ambientales tienen presencia discreta y comprensible.

### S02 · Ficha integrada de FoxMind en escritorio

La superficie crema se presenta bajo la navegación, con paisaje visible alrededor. Debe sentirse parte del mismo portfolio y permitir leer sin interferencia del escenario. La ficha prioriza título, resumen y participación de Alejo; los bloques restantes siguen el orden editorial de 04.

La acción de regreso principal es **Volver a Proyectos**. Campamento, contacto y CV siguen disponibles. El paisaje visible no funciona como un área accidental de cierre. La imagen representa un estado de lectura; el comportamiento previsto mantiene el fondo en reposo mientras el contenido está abierto.

### S03 · Inicio móvil

La identidad, las acciones del inicio y el acceso a los cuatro destinos conservan una jerarquía clara en formato vertical. La cabecera adoptada utiliza una sola fila: emblema, Contacto, CV y Menú. La cuadrícula fija de cuatro enlaces de la revisión 1 deja de ser la referencia vigente; los cuatro enlaces aparecen en el desplegable y los cuatro destinos continúan presentes en el mundo.

Para un marco lógico de 390 px, la orientación de diseño es cabecera de 56–64 px, márgenes de unos 20 px, nombre de 32–36 px en dos líneas, cuerpo de 16–18 px y botones de 44–48 px. La cabecera y la presentación deberían dejar visible parte del campamento aproximadamente dentro de los primeros 260–300 px. Son objetivos de composición, no mediciones garantizadas del PNG ni alturas rígidas. Con texto ampliado o menos ancho, se permite reorganizar y crecer; no se recorta contenido para cumplir estas cifras.

La escena se recompone para el celular. No se trata de reducir toda la pantalla de escritorio hasta que los textos y objetos resulten diminutos. Esta vista no exige joystick, teclado físico, zoom ni arrastre para encontrar información. El desplazamiento vertical normal permite recorrer la página.

### S04 · Ficha integrada de FoxMind en móvil

La ficha conserva casi todo el ancho disponible, con texto en una columna. Adopta la misma cabecera compacta que S03 y una franja de paisaje orientativa de 80–100 px lógicos, para que la lectura comience antes. Se ajusta la altura del conjunto superior, conservando el ancho de ficha aprobado. La captura reservada se adapta al ancho de lectura. La navegación y el regreso siguen identificables sin cubrir títulos o texto.

La maqueta muestra una porción representativa de la ficha. No implica que todo el caso deba entrar en una sola pantalla ni que el contenido se recorte para imitar la imagen. Los bloques restantes continúan mediante desplazamiento vertical.

## 4. Navegación y regreso que deben comunicar

**Ver proyectos** abre la sección Proyectos; elegir FoxMind abre su ficha. **Volver a Proyectos** recupera la lista y el punto desde el que se abrió el caso. **Volver al campamento** regresa a la escena. **Contactar** abre Contacto. El menú puede cambiar de sección sin recorrer el mapa.

Clic o toque sobre un destino abre inmediatamente la sección correspondiente. La caminata es una interacción opcional y no demora ese acceso. La maqueta puede sugerir esta relación con rótulos y ayudas, pero no demuestra que los enlaces, el foco, el teclado o el historial del navegador funcionen. Esos detalles se especifican en 02 y se comprueban sobre la implementación.

## 5. Material profesional y límites de la representación

Las capturas reales de FoxMind siguen pendientes. Las fichas de este hito utilizan un **espacio reservado explícitamente identificado** para ese material. No debe generarse una pantalla ficticia de FoxMind ni presentarse un dibujo como evidencia del producto. Los logos oficiales, resultados, métricas y estado actual tampoco se deducen del arte.

Las maquetas son ilustraciones conceptuales del resultado deseado. Los edificios o detalles representados pueden variar respecto de las piezas independientes. El desarrollo debe partir de los assets separados y de sus metadatos, según [03_DIRECCION_VISUAL_Y_ASSETS.md](03_DIRECCION_VISUAL_Y_ASSETS.md), y reconstruir los textos y controles como interfaz web.

No se utiliza una maqueta rasterizada como página completa. Tampoco se interpreta su apariencia como prueba de contraste, resolución final, carga, accesibilidad o adaptación a todos los dispositivos.

## 6. Revisión visual y cierre

Las comprobaciones de esta lista se refieren a las maquetas y al registro de decisiones. No son pruebas de funcionamiento de la web.

- [x] Alejo aprueba la proporción general de la ficha presentada en la revisión 1; DEC-14 conserva esa decisión.
- [x] Se registra el pedido de evitar la repetición del nombre y mejorar la distribución móvil.
- [x] Alejo adopta el emblema y la nueva cabecera de escritorio y móvil como referencia visual.
- [x] S01 y S03 identifican a Alejo, su propuesta profesional y las acciones principales con claridad.
- [x] Los cuatro destinos mantienen nombre, correspondencia y protagonismo coherentes en las dos composiciones.
- [x] S02 y S04 se reconocen como fichas del mismo campamento y ofrecen una superficie estable de lectura.
- [x] Menú, CV, contacto y acciones de regreso se localizan sin depender del recorrido del avatar.
- [ ] La jerarquía Ver proyectos / Contactar queda aceptada o se registra su ajuste.
- [ ] La escala del avatar y la distribución de los objetos se revisan respecto del espacio disponible.
- [x] El material pendiente de FoxMind está señalado como reserva de maqueta y no se confunde con evidencia real.
- [x] Las correcciones de texto o composición se incorporan al dossier y al registro de las piezas.
- [x] Se registra la adopción de la dirección visual de la revisión 2 y el avance al siguiente hito; los pendientes puntuales permanecen identificados.

**Estado de cierre:** dirección visual adoptada. Los detalles editoriales, la revisión puntual del parecido del avatar y la implementación conservan sus pendientes específicos. Se avanza a [08 · Contenido profesional y casos](08_HITO_CONTENIDO_PROFESIONAL.md). El agente de código recibirá las cuatro imágenes vigentes junto con su manifiesto, los textos de 04 y el contrato de comportamiento de 02. Las pruebas de la futura web siguen perteneciendo a [05_ENTREGAS_Y_ACEPTACION.md](05_ENTREGAS_Y_ACEPTACION.md).

## 7. Resultado de generación y revisión

Las cuatro maquetas de la **revisión 2** están generadas y fueron inspeccionadas visualmente. La cabecera presenta el emblema adoptado, sin repetir el nombre; las dos vistas móviles comparten Contacto, CV y Menú en una fila. Alejo confirmó esta dirección y pidió avanzar al siguiente hito.

| Vista vigente | Dimensiones reales del PNG | Observación |
|---|---|---|
| S01 · Inicio de escritorio | 1485 × 1059 px | Emblema en el navbar, nombre completo en la presentación y enlaces de escritorio visibles. Conserva los cuatro destinos y el avatar. |
| S02 · Ficha de escritorio | 1487 × 1058 px | Emblema coherente con S01; proporción general de ficha y disposición de lectura conservadas. |
| S03 · Inicio móvil | 853 × 1844 px | Cabecera de una fila y presentación más compacta. El campamento aparece antes y conserva sus cuatro destinos. |
| S04 · Ficha móvil | 853 × 1844 px | Misma cabecera que S03; la ficha comienza más arriba y conserva casi todo el ancho de lectura. |

Los archivos con sufijo `-v2` son las referencias actuales. Los cuatro PNG anteriores se conservan para comparación, junto con `manifest-v1.json` y `generation-prompts-v1.json`; su navbar ya no representa la propuesta vigente.

**Observaciones para el traspaso:**

- Se conserva el ancho general de la ficha aprobado. La revisión móvil recupera espacio principalmente al compactar la cabecera y eliminar la cuadrícula permanente de enlaces.
- Las medidas del apartado 3 son orientaciones para la interfaz futura. El PNG no reproduce con exactitud todos esos valores; en particular, la altura de la franja ilustrada y las áreas de interacción se ajustan con el contenido real y el texto ampliado.
- El símbolo de carpa y montaña está adoptado. Su pieza independiente se documenta en 03 como complemento del inventario original de 35 assets; los archivos maestros del kit se conservan.
- Menú aparece cerrado en S03 y S04. La imagen no elimina los cuatro enlaces: su desplegable y sus estados se especifican en 02. Contacto y CV continúan visibles también durante la lectura de la ficha.
- Las pequeñas variaciones de paisaje entre imágenes no definen cambios de escenario. La implementación conserva la misma escena y su estado al abrir o cerrar contenido.
- Los textos, rótulos y controles se reconstruyen como interfaz web. Los símbolos ambientales tienen nombres y estados explícitos según 02.
- Las fichas muestran una porción del caso. Su contenido completo continúa mediante desplazamiento vertical; el encuadre de la imagen no elimina bloques editoriales.
- La reserva de captura de FoxMind sigue identificada como material pendiente. Se sustituye por evidencia real antes de publicar el caso; la vigencia de los textos profesionales sigue pendiente de confirmación.

La referencia re-adjuntada por Alejo se conserva en `mockups/references/selected-concept-received.png`. Contiene los mismos píxeles que el concepto del kit, con una codificación de archivo distinta. La fotografía personal original no se incluye.

**Alcance de la comprobación:** contenido y composición visual, presencia de los cuatro destinos, ausencia del nombre duplicado en las cabeceras, continuidad general de la identidad y señalización del material pendiente. No se han ejecutado pruebas de aplicación, interacción, adaptación funcional, contraste o accesibilidad. AC-01 a AC-25 continúan pendientes.

## Registro de revisión

| Revisión | Resultado |
|---|---|
| 1 | Cuatro maquetas iniciales generadas. Alejo aprueba la proporción general de ficha y señala la repetición del nombre y el ajuste móvil. |
| 2 | Cuatro vistas refinadas con emblema, nombre una vez en la presentación y cabecera móvil compacta. Dirección adoptada por Alejo; avance a contenido profesional. |
