# 02 · Experiencia y pantallas

**Proyecto:** portfolio personal de Alejo Palavecino · **Concepto:** Campamento creativo  
**Versión:** 0.11 · **Fecha:** 29 de octubre de 2026 · **Estado:** incorporado al Dossier 1.0 consolidado para una implementación de revisión; dirección de navegación y distribución base adoptadas, detalles recomendados e implementación pendientes de comprobación.

Este documento describe la experiencia que debe construir el agente de desarrollo. No contiene código ni acredita pruebas realizadas sobre una web. Su alcance es una primera versión con una escena, cuatro destinos y contenido profesional legible.

## 1. Decisiones y nivel de confirmación

### CONFIRMADO

- El concepto elegido es **Campamento creativo**, con estética pixel art e inspiración andina.
- El portfolio debe servir para oportunidades de **empleo y clientes**.
- Hay cuatro destinos: **Proyectos, Sobre mí, Trayectoria y Contacto**.
- El mundo incluye un avatar de Alejo; existe arte preparado para integrarlo.
- **DEC-13:** Alejo eligió la **ficha de proyecto integrada en el campamento**. Su dirección visual se concreta en las cuatro maquetas de la revisión 2 adoptadas como referencia.
- **DEC-14:** Alejo aprobó la **proporción general de la ficha** respecto del campamento. Se conservan sus anchos y la distribución vertical de referencia; la aprobación no fija medidas CSS exactas.
- **DEC-15:** La corrección de la repetición del nombre quedó adoptada: **emblema de carpa y montaña en la cabecera** y **Alejo Palavecino una sola vez en la presentación**.
- **DEC-16:** Alejo aceptó la composición móvil de la revisión 2, con cabecera compacta de **emblema · Contacto · CV · Menú**, como referencia visual. Los estados y la adaptación funcional se especifican abajo y todavía no se han comprobado.
- **DEC-17:** Registró el inicio del [hito 08 de contenido profesional y casos](08_HITO_CONTENIDO_PROFESIONAL.md). Sus bases narrativas están preparadas; imágenes, datos profesionales restantes y revisión editorial mantienen sus pendientes.
- **Avance de preparación:** Alejo expresó conformidad con el enfoque de presentación de los casos y pidió avanzar. El [hito 09 de experiencia e interacciones](09_HITO_EXPERIENCIA_E_INTERACCIONES.md) consolida esta propuesta para el traspaso; ese avance no confirma por extensión todos sus controles.

- **DEC-26:** Alejo quiere poder caminar como en un juego y, al seleccionar una sección, que el personaje vaya caminando y la abra recién al llegar. Esta dirección sustituye la apertura inmediata propuesta en DEC-08. Las duraciones, los controles táctiles, las alternativas para omitir el recorrido y los casos de interrupción que siguen son recomendaciones de desarrollo de esa idea, pendientes de revisión específica.

- **DEC-27:** Alejo pidió avanzar al siguiente hito, el mapa jugable; ese pedido inició su preparación.
- **DEC-28:** después de revisar el [hito 10](10_HITO_MAPA_JUGABLE.md), Alejo adoptó su distribución como mapa base: claro central, personaje en el centro, taller protagonista y cuatro destinos alrededor. Las coordenadas y huellas se ajustarán al arte durante la integración; los controles de 09 conservan su condición de propuesta cuando no tengan confirmación propia.

### DIRECCIÓN ADOPTADA Y DETALLES PROPUESTOS

Las confirmaciones anteriores cierran la dirección visual de la revisión 2: ficha, proporción general, emblema, nombre una vez y distribución de cabecera y móvil. Los comportamientos concretos de las secciones siguientes son una especificación propuesta para revisar, implementar y comprobar. El hito 09 organiza sus decisiones y recorridos dentro de P4, retomando los pendientes de experiencia de P1 y de jerarquía de acciones de P2; este documento conserva el detalle de comportamiento. La aceptación visual no aprueba por extensión la exactitud de los textos profesionales, el parecido individual del avatar, todos los controles ni las medidas orientativas, y no acredita QA.

El **Dossier 1.0** utiliza estas reglas como base recomendada para iniciar E1 y concretar E2. El agente puede implementarlas y presentarlas para revisión sin pedir aprobación individual de cada control; siguen identificadas como propuestas cuando no existe una confirmación propia. Los ajustes rutinarios de integración corresponden al agente. Un cambio material en la caminata elegida, la organización adoptada o el acceso profesional se explica y registra para revisión de producto.

**El clic selecciona un destino: el avatar camina hasta su entrada y la sección se abre al llegar.** El visitante también puede caminar libremente y activar un destino cercano. No necesita controlar manualmente el personaje para consultar el portfolio. Se propone aplicar la misma selección con recorrido a los objetos, sus rótulos, la navegación y las acciones del inicio que lleven a una sección.

Durante el desplazamiento se propone mostrar **Yendo a {sección}…**, **Abrir ahora** y **Cancelar recorrido**. Abrir ahora omite el resto de la caminata y muestra el último destino seleccionado. Con movimiento reducido o escena no disponible, el contenido se abre directamente. Estas alternativas mantienen útil el acceso profesional y no sustituyen el recorrido normal que Alejo eligió.

No hay desbloqueos obligatorios, tiempo límite, puntuación, pérdida de progreso ni requisitos de exploración para acceder a proyectos, CV o contacto.

## 2. Llegada y navegación permanente

La primera vista presenta **Alejo Palavecino** una sola vez en el bloque de presentación, una descripción breve de su trabajo y el campamento. DEC-15 adopta el pequeño emblema de montaña y carpa para la cabecera; se especifica su acción y nombre accesible como **Volver al campamento**. La identidad no se repite como «ALEJO» en esa cabecera. Los textos del [JSON editorial del handoff](content/portfolio.es.json) incorporan las confirmaciones recientes de Alejo y los pendientes que se revisan en el hito 08.

La propuesta editorial de las maquetas utiliza **Ver proyectos** como acción principal y **Contactar** como secundaria. Ambas seleccionan sus secciones y, con la escena disponible y movimiento habilitado, inician el recorrido hasta su entrada; se abren al llegar. **Explorar el campamento** se propone como acción contextual de la escena en escritorio; no añade una tercera acción principal a la presentación. Al activarla, si el recorrido está habilitado, el foco pasa a la escena y aparece la ayuda de movimiento y salida. En móvil y con movimiento reducido se omite este control por teclado; permanecen las acciones de los destinos, con apertura directa en la modalidad reducida. Esta jerarquía se presentó como propuesta y no tiene aprobación explícita; reemplaza el orden anterior del borrador y se refleja como propuesta en el JSON editorial actualizado. El JSON original del kit se conserva como antecedente. La llegada no exige pulsar una pantalla de inicio, aceptar un tutorial ni activar sonido.

La navegación global permanece disponible y operable en la escena, las secciones y el detalle de proyecto. En escritorio conserva el emblema de regreso al campamento, los cuatro enlaces visibles y el CV. El destino activo tiene una señal perceptible además del color. Los controles de sonido y movimiento reducido permanecen disponibles, con nombres comprensibles. Se propone ubicarlos en una zona común de la interfaz en escritorio, fuera del contenido de la escena que se desactiva durante la lectura. Así pueden utilizarse también al consultar una ficha. En móvil se accede a esos ajustes desde el desplegable Menú, debajo de los cuatro enlaces de sección.

### Cabecera móvil adoptada y comportamiento del menú · DEC-16

La composición móvil adoptada muestra **una fila**: emblema a la izquierda y **Contacto · CV · Menú** a la derecha. Contacto y CV permanecen visibles también al leer una ficha. El inicio conserva además la acción Contactar de la presentación y los cuatro destinos identificados en el mundo. Esta referencia sustituye la banda de cuatro enlaces siempre visibles de la revisión anterior. Los estados del menú que siguen son requisitos de implementación; la maqueta muestra el estado cerrado y no demuestra su funcionamiento.

**Menú** despliega los enlaces **Proyectos, Sobre mí, Trayectoria y Contacto** bajo la cabecera, dentro del flujo normal de la página. Debajo de esos enlaces, la propuesta del hito 09 coloca los controles de sonido y movimiento reducido. Esos ajustes no añaden elementos a la fila de la cabecera cerrada; cambiar una preferencia mantiene abierto el menú y normalmente conserva la vista. La excepción es reducir el movimiento durante una ruta a una sección: se omite la caminata y se abre el destino solicitado, según la sección 8. Al abrirse desplaza el contenido; no es un diálogo modal ni un panel que lo cubra. El control muestra **Cerrar** mientras está abierto e informa su estado. Abrirlo conserva el foco en ese control; Tab permite recorrer sus enlaces y continuar por la página, sin retener el foco ni bloquear el desplazamiento.

Cerrar desde el control mantiene el foco allí. Si el menú está abierto, Escape lo cierra y devuelve el foco al disparador, aunque el foco haya pasado al contenido mediante Tab. Esa pulsación no ejecuta también el regreso de la ficha o de la sección. Se respeta previamente la edición de campos, la composición de texto y el cierre propio de otro control abierto, según la prioridad de la sección 4. Elegir un enlace cierra el desplegable y selecciona el destino: muestra el campamento e inicia la caminata cuando corresponde. Durante el recorrido, el foco permanece en el acceso que siga visible; si el origen desaparece al cerrar el menú o al retirar la lectura, pasa a Abrir ahora, sin quedar oculto. El foco llega al inicio del contenido al abrirlo. Abrir o cerrar el menú no reinicia el caso ni la posición del avatar. Estos accesos no exigen controlar al personaje manualmente. Si se elige la misma sección que ya está abierta, se conserva la lectura y su posición.

La cabecera no debe tapar títulos, controles enfocados ni contenido al desplazarse. Las proporciones siguientes orientan la revisión a **390 píxeles CSS de ancho**; no son alturas fijas, límites al contenido ni medidas ya verificadas:

| Elemento | Orientación para la composición móvil |
|---|---|
| Cabecera cerrada | Entre 56 y 64 píxeles CSS de alto. |
| Controles compactos | Superficie de activación de al menos 44 × 44 píxeles CSS. |
| Márgenes del contenido | Aproximadamente 20 píxeles CSS a cada lado. |
| Nombre en la presentación | Entre 32 y 36 píxeles CSS, en dos líneas cuando sea necesario. |
| Texto principal | Entre 16 y 18 píxeles CSS, con espacio suficiente entre líneas. |
| Acciones de la presentación | Entre 44 y 48 píxeles CSS de alto, ampliables según el texto. |

En anchos menores o con texto ampliado, los elementos se reorganizan y los bloques crecen según su contenido. Se mantienen visibles Contacto, CV y el control del menú, sin reducirlos para forzar una sola fila ni ocultar acciones esenciales. Se conservan el nombre completo, la propuesta profesional y las acciones del inicio. El espacio recuperado se destina a una presentación más equilibrada y a mostrar el paisaje, sin comprimir sus rótulos ni imponer que todos los destinos entren en un solo encuadre. Estas orientaciones no acreditan cumplimiento de accesibilidad ni pruebas sobre una web.

El orden de lectura prioriza identidad, navegación y contenido. Debe existir un acceso para saltar directamente al contenido, sin recorrer todos los objetos del mundo mediante teclado.

## 3. Inventario de vistas

| Vista | Contenido y acciones principales | Condición observable |
|---|---|---|
| **Llegada y campamento** | Presentación, menú, cuatro destinos identificados, avatar e instrucciones breves. | Se entiende quién es Alejo y se puede abrir Proyectos o Contacto desde el inicio. |
| **Recorrido a un destino** | Campamento visible, destino señalado, avatar caminando y acciones Abrir ahora / Cancelar recorrido. | Solo la última selección puede abrir una sección; se puede interrumpir sin perder la vista de origen. |
| **Proyectos** | FoxMind como caso destacado y el sistema para Flower como segundo caso seleccionado; acceso a cada detalle cuando cuente con material suficiente. | Cada tarjeta corresponde a un proyecto real. Los espacios pendientes no aparecen como casos publicados. |
| **Detalle de proyecto** | Ficha integrada según DEC-13; contexto, problema u objetivo documentado, contribución de Alejo, estado y evidencia real. Decisiones, herramientas y enlaces solo cuando estén documentados y dentro del alcance público del caso, conforme a 04/08. | Se lee sobre una superficie estable con paisaje de contexto y navegación disponible; se vuelve a la lista sin perder el punto de lectura. |
| **Sobre mí** | Presentación personal, retrato pixel y descripción profesional. | El texto se puede leer, seleccionar y ampliar sin depender de la escena. |
| **Trayectoria** | Estudios, experiencia y reconocimientos confirmados para publicación. | Las fechas y los estados mantienen las distinciones entre hechos, estimaciones y datos pendientes. |
| **Contacto** | Entradas diferenciadas para una oportunidad laboral y una consulta por un proyecto; correo visible, enlaces profesionales y CV. | Cada acción tiene un destino real y comunica qué ocurrirá al activarla. |
| **Contenido con escena no disponible** | Presentación y secciones HTML conservadas, con un aviso breve sobre el mundo visual. | Se puede conocer el trabajo y contactar aunque falle la carga del escenario. |

### Relación entre objetos y secciones

| Destino | Objeto del mundo | Acción equivalente en el menú |
|---|---|---|
| Proyectos | Taller | Abrir Proyectos |
| Sobre mí | Carpa y fogón | Abrir Sobre mí |
| Trayectoria | Mesa de bitácora | Abrir Trayectoria |
| Contacto | Puesto de comunicación o radio | Abrir Contacto |

Mapa y menú utilizan una sola versión de cada contenido. No deben existir una biografía resumida accesible solo jugando y otra diferente en la navegación directa.

Como solución inicial de Contacto, ambas entradas preparan un correo en la aplicación de correo del visitante, con un asunto distinto según se trate de empleo o de un proyecto. El correo también se muestra como texto. Esta acción no envía un mensaje automáticamente y no debe producir una confirmación de envío dentro del portfolio. El acceso al CV utiliza el PDF incluido en el kit y conserva una etiqueta coherente con su acción.

## 4. Apertura, lectura y regreso

### Selección, llegada y lectura

Al seleccionar una sección desde el campamento, la cabecera, Menú o una acción de sección, se señala su entrada y se muestra la caminata hasta ella. Esto también se propone al cambiar a otra sección desde una lectura abierta: se conserva la vista de origen con su desplazamiento y foco, se muestra el campamento y se inicia el recorrido. La misma sección que ya está abierta conserva su lectura, sin viaje artificial.

Al llegar a la zona de entrada del destino vigente, el avatar se detiene y se orienta hacia él; se abre el contenido una sola vez, sin pedir Enter o E adicional. Si ya está dentro de esa zona, no necesita dar una vuelta para volver a entrar. Solo se confirma la llegada del destino actualmente elegido: una selección anterior cancelada nunca abre después.

Como precisión de la regla propuesta de cancelación, reemplazar el destino durante el mismo recorrido conserva el contexto de lectura guardado al iniciarlo. Cancelar recorrido recupera esa vista, su desplazamiento y un foco válido; una vista intermedia de animación no sustituye el origen. El avatar conserva la posición física válida que haya alcanzado.

Elegir una tarjeta de proyecto, **Volver a Proyectos**, **Volver al campamento**, Atrás del navegador y utilizar CV, correo o enlaces externos mantienen su función directa. No disparan caminatas adicionales. Los recorridos cancelados o sustituidos no crean entradas de historial; se registra el contenido efectivamente abierto.

### Ficha integrada y secciones HTML

Al abrir una sección, aparece una superficie principal de lectura bajo la navegación persistente. Para el detalle de proyecto, DEC-13 fija su pertenencia visual al campamento: una ficha crema con detalles pixel conserva el paisaje como contexto.

DEC-14 aprueba la proporción general de la ficha presentada: amplia en escritorio y casi todo el ancho disponible en móvil. Se mantienen esos anchos y el paisaje de contexto. La referencia aproximada del 80 % del ancho útil en escritorio es orientativa, sin convertir el PNG en una medida CSS obligatoria. La revisión 2 adopta una cabecera móvil más compacta para dar espacio a la lectura. Su distribución vertical es la referencia visual; las alturas concretas de cabecera y franja se adaptan al contenido y al texto ampliado durante la implementación.

El fondo de lectura es estable y permite distinguir texto, imágenes y acciones. Menú, CV y Contacto permanecen disponibles; en móvil estos tres accesos siguen visibles en la cabecera cerrada. La ficha se integra visualmente en el mundo sin encerrar al visitante en un diálogo que vuelva inaccesible esa navegación. Mientras una sección está abierta, la escena y sus animaciones ambientales quedan en reposo y dejan de recibir desplazamiento o selección de objetos. Los elementos ocultos o inactivos de la escena tampoco deben seguir recibiendo el foco. El audio conserva la preferencia voluntaria del visitante, según la sección 8.

**Alcance público de FoxMind:** la ficha utiliza una descripción general, el aporte confirmado de Alejo, su estado previo a pilotos y las capturas que él seleccione. Las capturas pueden presentarse con pies breves y contexto de la vista mostrada. Se omiten acciones de demo, repositorio o acceso al producto: no forman parte del caso. Las referencias históricas del CV no amplían automáticamente este alcance. La navegación de regreso y los accesos de contacto del portfolio se mantienen.

**Presentación de Flower:** la ficha identifica la librería cliente, el desarrollo completo individual, React, Node.js y PostgreSQL y el estado En producción, confirmados por Alejo. Las capturas siguen pendientes. Esas confirmaciones no se trasladan a FoxMind; cada caso utiliza su contenido y su alcance de presentación.

Nombre, títulos, rótulos, enlaces y descripciones son texto HTML. Las capturas reales se muestran como imágenes con una descripción pertinente. Los controles usan texto o un nombre accesible que comunique la acción; un icono de cierre aislado no reemplaza esa información.

Como objetivos iniciales del proyecto, se propone texto principal de al menos 16 píxeles CSS y superficies de activación de al menos 44 por 44 píxeles CSS cuando se trate de botones compactos. Son valores de partida para revisar en la implementación, no afirmaciones de cumplimiento de un estándar ni límites para impedir que el usuario amplíe la interfaz.

### Foco y posición de lectura

Una vez abierta la sección —por llegada, Abrir ahora o una alternativa directa—, el foco pasa a su título principal o a un inicio de contenido identificable. Se conserva qué control originó la apertura. El menú continúa disponible mediante la navegación normal por teclado.

Al abrir un proyecto, el foco pasa al título del caso. Se conserva el punto de desplazamiento de la lista y la tarjeta elegida. **Volver a Proyectos** recupera ambos. **Volver al campamento** regresa a la escena y restaura el foco en el origen que siga disponible; si ese control ya no existe o está oculto por un cambio de tamaño, utiliza el enlace Campamento como alternativa.

En las secciones, la acción de salida se llama **Volver al campamento**. En el detalle, la salida principal es **Volver a Proyectos**; la navegación global permite ir al campamento o a otro destino. Evitar una acción llamada únicamente Cerrar si su destino no es evidente.

Escape respeta primero la edición de un campo, la composición de texto y el cierre propio de otro control que esté abierto. A continuación, si el menú móvil está abierto, lo cierra y devuelve el foco al disparador, con independencia de que Tab haya llevado el foco al contenido; esa misma pulsación no produce ningún regreso adicional. Con esas prioridades resueltas, Escape cancela primero un recorrido activo o pausado y restaura la vista de origen con su posición de lectura y foco, sin devolver físicamente al avatar al punto inicial. Esa pulsación no provoca otro regreso. Sin recorrido pendiente y con el menú cerrado, Escape realiza un nivel de regreso cuando el foco está dentro del contenido: detalle a lista; sección a campamento. Un clic en el paisaje visible no cierra accidentalmente la lectura.

El botón Atrás del navegador debe permitir regresar a la vista anterior sin quedar bloqueado por la experiencia. Abrir y cerrar contenido no debe producir un ciclo que obligue a recorrer estados repetidos para abandonar el sitio.

## 5. Clic, toque y teclado

Los comportamientos de esta sección desarrollan DEC-26 como propuesta concreta. La dirección general está elegida; estos detalles no se presentan como controles ya aprobados ni probados.

| Entrada | Comportamiento propuesto | Límite |
|---|---|---|
| Clic o toque en un destino o su rótulo | Selecciona ese destino, hace caminar al avatar y abre al llegar. | No exige control manual ni Enter adicional; Abrir ahora permite omitir la caminata. |
| Activar un enlace de sección del menú o una acción del inicio | Inicia el mismo recorrido que el objeto del mapa; en móvil cierra el desplegable. | Con movimiento reducido o escena no disponible, abre directamente. |
| Seleccionar otra sección durante la lectura | Conserva la vista de origen, muestra el campamento e inicia el recorrido a la nueva sección. | Si se elige la misma sección ya abierta, conserva la lectura; las tarjetas y regresos no añaden viajes. |
| Elegir otro destino mientras camina | Sustituye la ruta desde la posición actual. | La selección anterior queda cancelada; no hay cola de aperturas. |
| Abrir ahora | Detiene el recorrido y abre el último destino solicitado. | Solo corresponde a una ruta hacia una sección; no se inventa una sección para un punto de suelo. |
| Cancelar recorrido o Escape según prioridades | Detiene la ruta y restaura vista de origen, desplazamiento y foco válido. | Conserva la posición actual del avatar; no añade una entrada al historial. |
| Activar Menú o Cerrar en la cabecera móvil | Despliega o repliega enlaces y ajustes en el flujo normal. | Abrirlo o cerrarlo no cancela por sí solo una ruta automática ni cambia de sección. |
| Activar Explorar el campamento en escritorio | Da foco a la escena y muestra instrucciones de recorrido y salida. | Solo con escena lista, sin lectura abierta y movimiento habilitado; por sí solo no mueve al avatar. |
| Cambiar sonido o movimiento reducido | Actualiza esa preferencia. | El sonido conserva la vista; reducir movimiento durante una ruta de sección abre su destino directamente. |
| Activar un control HTML enfocado | Ejecuta la acción propia del control. | Tiene prioridad sobre una interacción por proximidad; las teclas no se capturan globalmente. |
| Flechas o WASD con la escena enfocada | Mueve al avatar libremente; si existía una ruta automática, la cancela y entrega el control manual. | Solo con escena activa, movimiento habilitado y sin lectura abierta; el destino cancelado no se abre. |
| Enter o E con escena enfocada, sin ruta automática y un destino cercano | Abre el destino señalado. | La proximidad sola no abre contenido; fuera de alcance no hay apertura. |
| Tab o Mayús+Tab | Recorre la interfaz normal y permite salir de la escena. | Detiene el movimiento manual, pero una ruta automática puede continuar sin foco en la escena. |
| Clic o toque breve en suelo transitable | Ordena caminar al punto y quedar en reposo. | No abre una sección al llegar; rechaza puntos no transitables. |
| Arrastrar, desplazar o ampliar la página en móvil | Conserva scroll y zoom normales. | Un gesto de lectura no se interpreta como una orden de caminar. |

La caminata manual requiere foco en la escena. La automática se inicia mediante una acción explícita de navegación y puede continuar mientras el foco está en el menú, en Abrir ahora o en otro control visible; no necesita capturar el teclado. El foco visible y el acceso a las acciones se conservan durante todo el trayecto.

Las instrucciones de teclado aparecen solo en escritorio, con la escena enfocada y el movimiento habilitado. Tab permite salir del recorrido. Escape respeta primero campos y controles que gestionan su cierre, luego Menú y después la cancelación de ruta; sin ruta pendiente, permite abandonar el control manual y volver al acceso Campamento. La ayuda desaparece durante la lectura y con movimiento reducido.

Al perder foco de la escena se detiene la caminata manual y se liberan las teclas retenidas. Ocultar la pestaña detiene el movimiento manual y **pausa** la ruta automática; regresar no la reanuda ni abre contenido de sorpresa. Se ofrecen **Continuar recorrido** y **Cancelar recorrido**; una ruta a una sección permite además **Abrir ahora**. Continuar usa el destino todavía vigente. El sonido conserva su política independiente de la sección 8.

### Experiencia táctil propuesta

En móvil se propone tocar un destino o elegirlo en Menú para ver caminar al avatar y abrir su sección al llegar. Un toque breve en suelo transitable permite recorrer libremente el campamento sin abrir contenido; una nueva orden sustituye la anterior. No se incorpora joystick en la primera versión propuesta. Scroll y zoom siguen disponibles: iniciar un gesto de desplazamiento invalida ese toque como orden de caminar.

El campamento y el estado de la ruta deben quedar visibles mientras se realiza el recorrido, conservando la cabecera y las acciones de interrupción accesibles. Su composición se revisa en la integración móvil, sin imponer una pantalla de tamaño fijo ni reducir el texto para que entre. Durante la lectura, la escena queda en reposo. Con movimiento reducido se omite la caminata y los destinos se abren directamente. Esta adaptación aún no está implementada ni comprobada.

### Proximidad y señales

Al caminar libremente y acercarse a un destino aparece una acción breve, por ejemplo **Abrir Proyectos · Enter / E** en escritorio; en móvil se conserva el rótulo táctil. La proximidad no abre nada por sí sola. Una ruta automática a una sección sí contiene la intención de abrirla y lo hace al llegar, sin confirmar de nuevo. Caminar a un punto de suelo próximo a una entrada no equivale a haber elegido esa sección.

Si dos zonas se solapan, se destaca un candidato estable y coherente con la distancia a sus entradas. Los rótulos permiten seleccionar otro destino y permanecen identificables sin hover. Durante una ruta a una sección se muestra **Yendo a {sección}…** junto a **Abrir ahora** y **Cancelar recorrido**. Para suelo libre se propone **Caminando…** y **Cancelar recorrido**; una ruta pausada se identifica como **Recorrido en pausa.** y ofrece Continuar recorrido. Los anuncios se producen ante cambios de destino o estado, no en cada cuadro de animación.

## 6. Movimiento, límites y adaptación de la escena

El avatar se mueve sobre suelo y senderos definidos para la versión final. Sus pies determinan el punto de apoyo visual. Las construcciones, el mobiliario grande, el agua no transitable y los bordes del terreno actúan como obstáculos cuando corresponda a la escena.

Al intentar atravesar un obstáculo, el avatar se detiene en el límite; no entra en su silueta ni desaparece. Deben existir zonas de aproximación utilizables junto a los cuatro destinos. El visitante no necesita resolver un laberinto: la selección automática debe alcanzar cada entrada por suelo válido. Si no hay una ruta utilizable, se cancela esa animación y se abre la sección solicitada con un aviso breve, sin dejar una espera indefinida. Una orden a suelo libre no transitable se rechaza y conserva la posición, sin abrir contenido.

**Objetivo de diseño propuesto:** recorridos automáticos a secciones de aproximadamente **1–2 segundos**, con **3 segundos como límite excepcional de la composición inicial**. Estas cifras son un presupuesto para ajustar el mapa y revisar un prototipo, no mediciones realizadas ni un estándar. Se favorecen entradas próximas y caminos claros; no se acelera de forma desproporcionada al personaje para compensar un mapa demasiado grande. Los trayectos elegidos libremente por el visitante pueden durar lo que requiera su exploración.

La velocidad debe sentirse estable. Pulsar dos direcciones a la vez no duplica la velocidad. El personaje vuelve al reposo al detenerse, y la duración de su caminata se ajusta durante la integración para evitar un deslizamiento evidente de los pies.

La profundidad se resuelve de acuerdo con el apoyo del avatar y los objetos. Un árbol puede ocultar parte de la figura al pasar por detrás, pero los rótulos y controles de los destinos permanecen accesibles. La capa de primer plano puede ocultarse o recolocarse si obstruye una acción.

La propuesta inicial utiliza una cámara estable. No necesita zoom obligatorio, arrastre del mapa ni seguimiento continuo del avatar. En móvil se permite el desplazamiento vertical normal de la página. Si una selección desde Menú inicia una ruta con el campamento fuera de vista, se propone llevar una sola vez ese bloque al área visible, conservando la cabecera y los controles de recorrido. Después, la página permanece bajo control del visitante; no se vuelve a desplazar para perseguir al personaje. Con movimiento reducido se abre directamente el contenido, sin este recorrido visual. Los rótulos, el estado y las acciones mantienen tamaño de interfaz legible; no se reducen junto con toda la ilustración.

### Marco de planificación del hito 10

El [hito 10 · Mapa jugable](10_HITO_MAPA_JUGABLE.md) adopta mediante DEC-28 la distribución de un claro central con cuatro ramales. El personaje parte del cruce, orientado hacia el taller. Proyectos queda arriba a la derecha; Sobre mí, a la izquierda; Trayectoria, abajo a la izquierda; Contacto, abajo a la derecha, con llegada desde tierra firme en el mismo margen accesible del río. Alcanzar Contacto no exige cruzar un puente ni crear otra isla.

La [propuesta de navegación](maps/world-navigation-proposal.json) utiliza un marco propio del área jugable: **1000 × 650 unidades lógicas en escritorio y 600 × 760 en móvil**, con origen arriba a la izquierda. Excluye cabecera, presentación y paisaje lejano. Estas cifras organizan la propuesta geométrica: no son píxeles CSS, tamaños obligatorios de dispositivo ni coordenadas trasladables directamente a las imágenes. El [README del mapa](maps/README.md) explica su lectura y sus límites.

El archivo heredado `config/world-layout.json` conserva sus composiciones de referencia de 1536 × 1152 y 768 × 1152 unidades lógicas. Esos lienzos son antecedentes visuales y no definen colisiones, recorridos validados ni puntos de llegada. El nuevo esquema tampoco sustituye la comprobación sobre el arte real: `camp-ground.png` es una ilustración única, no un conjunto de plataformas independientes. La recomposición móvil debe conservar o adaptar sus claros y senderos; no permite mover libremente una plataforma sin ajustar el terreno que la sostiene.

Las huellas y entradas propuestas se ajustarán sobre la composición final. El [registro geométrico](maps/geometric-review.json) documenta únicamente las comprobaciones estáticas del esquema que efectivamente se hayan realizado. No demuestra alineación con el terreno ilustrado, transitabilidad de una web, duración de caminatas, cadencia ni experiencia táctil. La red de ramales orienta las rutas automáticas; el movimiento libre puede utilizar todo suelo válido y no queda encerrado en sus líneas.

Al cambiar el tamaño o la orientación, se conserva la vista de contenido abierta. Si el avatar queda fuera del terreno válido de la nueva distribución, se reubica en un punto seguro de esa escena, sin reproducir un recorrido largo ni perder los destinos visitados. Una ruta activa se adapta desde la posición válida al mismo destino vigente; si no puede completarse, aplica la alternativa directa de apertura. Una ruta a suelo libre que deja de ser válida se cancela sin abrir contenido.

## 7. Estados y eventos

### Estados de navegación

| Estado | Qué permanece activo | Transiciones principales |
|---|---|---|
| **Campamento disponible** | Menú, destinos y controles de la escena. | Elegir destino inicia recorrido; caminar libremente no abre contenido. |
| **Recorrido activo** | Campamento visible, destino o punto vigente y controles de interrupción. | Llegar a sección la abre; llegar a suelo deja reposo; nueva selección sustituye; ocultar pestaña pausa. |
| **Recorrido pausado** | Continuar recorrido, Cancelar recorrido y, para una sección, Abrir ahora. | Solo una acción explícita reanuda o abre; un nuevo destino reemplaza la ruta. |
| **Sección abierta** | Menú y contenido HTML; escena en reposo. | Otra sección inicia su recorrido; la misma conserva lectura; volver recupera campamento. |
| **Detalle de proyecto abierto** | Menú y caso; escena en reposo. | Volver a Proyectos recupera lista sin caminar; otro destino inicia su recorrido. |

La llegada no es una pantalla de bloqueo. Menú móvil puede estar abierto o cerrado sobre cualquiera de estos estados. Abrirlo no añade una entrada al historial ni cancela la ruta. Los estados transitorios de recorrido tampoco se añaden al historial; solo el contenido abierto se registra como navegación. Atrás del navegador cancela cualquier ruta pendiente antes de recuperar la vista anterior de su historial, sin apertura tardía del destino abandonado.

### Estados de la escena y destinos

La carga visual es independiente del contenido: **cargando**, **lista** o **degradada/no disponible**. Una escena que termina de cargar no interrumpe la lectura ni cambia el foco. Mientras no esté lista, la selección abre el contenido directamente; no deja una caminata pendiente para reproducir después.

Cada destino puede estar en reposo, enfocado, señalado por proximidad, elegido como destino de ruta o abierto. **Visitado** es una marca adicional, puesta al abrir su sección desde cualquier entrada. La propuesta la conserva durante la visita actual, sin cuentas ni persistencia entre sesiones. Elegir un destino y cancelar antes de abrirlo no lo marca como visitado.

### Eventos relevantes

| Evento | Resultado esperado |
|---|---|
| Elegir una sección distinta | Conserva contexto de origen y comienza una ruta válida; con movimiento reducido o escena no disponible, abre directamente. |
| Llegar a la entrada elegida | Detiene y orienta al avatar, abre una sola vez y enfoca el contenido. |
| Elegir otro destino durante una ruta | Reemplaza la intención previa desde la posición actual; no guarda una cola. |
| Iniciar movimiento manual con foco | Cancela autoruta y apertura pendiente, conserva campamento y da control manual. |
| Abrir ahora | Cancela la ruta y abre únicamente la sección vigente. |
| Cancelar recorrido | Restaura vista de origen, scroll y foco válido; conserva posición física actual del avatar. |
| Elegir proyecto o Volver a Proyectos | Abre el detalle o recupera lista y contexto, sin caminata. |
| Volver al campamento | Cancela cualquier ruta pendiente y recupera escena con posición válida y foco de regreso. |
| Perder solo foco de escena | Detiene movimiento manual; la ruta automática puede continuar. |
| Ocultar pestaña | Detiene manual, pausa autoruta y audio; la autoruta requiere una acción explícita al volver. |
| Reducir movimiento durante ruta a sección | Detiene la animación y abre el destino vigente; no inicia otra caminata. |
| Reducir movimiento durante ruta a suelo | Cancela el desplazamiento y conserva el campamento en reposo. |
| Terminar carga visual | Habilita la escena sin alterar contenido, foco o sonido ni ejecutar rutas antiguas. |
| Fallar escena o ruta a sección | Cancela ruta pendiente y abre la sección solicitada con aviso breve; el contenido sigue usable. |

## 8. Sonido, movimiento reducido y fallos

### Sonido

La ubicación propuesta de los ajustes es la interfaz común de escritorio y, en móvil, el área bajo los cuatro enlaces del menú desplegable. Ambos controles siguen accesibles desde una ficha sin reactivar la escena.

Cada llegada comienza con el sonido desactivado. Solo una acción explícita permite activarlo. El control informa su estado y permite silenciarlo inmediatamente. El audio no comunica por sí solo una acción necesaria.

Al ocultar la pestaña se pausa el audio. Al regresar, puede reanudarse únicamente si el visitante lo había activado durante esa visita y no lo había silenciado; la pausa no cambia esa preferencia. Abrir otra sección no crea una segunda instancia del ambiente. Una nueva llegada al sitio vuelve a comenzar en silencio.

Si el navegador impide reproducirlo o falla un archivo, el sitio sigue siendo utilizable y el control no afirma que hay sonido activo. Se muestra una indicación discreta y se permite volver a intentar la activación. La mezcla y los niveles perceptuales se revisan al integrar el sitio; los controles previos de los WAV no sustituyen esa escucha.

### Movimiento reducido

Respetar la preferencia de movimiento reducido del dispositivo y ofrecer un ajuste visible. En ese modo, desactivar el movimiento ambiental continuo, los desplazamientos automáticos y las transiciones de cámara o zoom. Los cambios de contenido ocurren de manera directa.

En esta propuesta base, el avatar permanece quieto mientras está activa la modalidad reducida; sus controles de movimiento no se anuncian ni se activan. Se omiten la acción contextual Explorar el campamento y la ayuda de teclado. Si se activa la modalidad durante un recorrido a una sección, se cancela el desplazamiento y se abre la sección vigente, con el foco en su inicio. Si el recorrido era a suelo libre, se detiene sin abrir contenido. Sin recorrido pendiente, el cambio conserva la vista y su foco. **Activar movimiento** restablece la ambientación y los controles disponibles, pero no reanuda ninguna ruta ni tecla antigua; el avatar espera una acción nueva. El menú y el clic o toque en los destinos mantienen todas las funciones. La modalidad reducida no elimina contenido ni exige volver a cargar la página.

### Carga y fallo visual

La presentación, el menú y las secciones deben estar disponibles sin esperar la descarga completa del mundo. Mientras carga la escena puede mostrarse un fondo ligero y el texto **Cargando el campamento…**. No se inventa un porcentaje de avance ni se retiene al visitante en una pantalla de carga.

Si falla un elemento decorativo no esencial, se omite y el recorrido continúa. Si falla la ruta a una sección o su destino queda inaccesible, se detiene el avatar y se abre el contenido solicitado con el aviso propuesto **No pudimos completar el recorrido. Abrimos la sección para que puedas continuar.** El fallo no dispara después una segunda apertura. Una ruta de suelo libre fallida se cancela con una indicación breve y no abre contenido. Si no se puede mostrar la escena principal, se ofrece una composición estática o una vista HTML con los mismos destinos y el aviso **No pudimos cargar el campamento. Podés seguir explorando el portfolio desde el menú.** La acción **Reintentar escena** no recarga el contenido abierto ni reproduce audio por sorpresa.

Si falla una captura de proyecto, conservar el texto del caso y comunicar que la imagen no está disponible. Si un archivo o enlace ya se sabe ausente antes de publicar, se oculta su acción en lugar de presentar un botón que no puede funcionar.

## 9. Condiciones de cierre de esta definición

El agente de desarrollo puede utilizar esta propuesta base sin reabrir la dirección visual ni solicitar una aprobación individual de los detalles recomendados. Antes de publicar, debe poder observarse que una visita breve permite abrir al menos un caso completo entre FoxMind y Flower, regresar y contactar; que la exploración por teclado nunca captura la edición o el scroll fuera de la escena; y que móvil, movimiento reducido o fallo del mundo permiten consultar el mismo contenido. FoxMind conserva su prioridad editorial, pero no es un requisito exclusivo para publicar: si falta su material, se omite el caso hasta completarlo.

La referencia visual comprende las cuatro maquetas de la revisión 2: inicio de escritorio, ficha integrada de FoxMind de escritorio, inicio móvil y ficha integrada móvil. Su alcance, las piezas vigentes y las revisiones se registran en [07_HITO_PANTALLAS_PRINCIPALES.md](07_HITO_PANTALLAS_PRINCIPALES.md), con las imágenes en `mockups/`. Alejo aceptó la dirección visual de esa revisión, incluido el emblema y la cabecera móvil, y pidió avanzar. La aprobación del contenido profesional, la confirmación individual del parecido del avatar y las pruebas de la web siguen siendo comprobaciones diferentes.

El [hito 10 · Mapa jugable](10_HITO_MAPA_JUGABLE.md) tiene su distribución base adoptada mediante DEC-28, dentro de P4. El [hito 09](09_HITO_EXPERIENCIA_E_INTERACCIONES.md) conserva el núcleo de caminata elegido y las reglas complementarias propuestas. El **Dossier 1.0** consolida la referencia de traspaso y sus pendientes; el siguiente trabajo del agente es E1, con navegación y contenido de revisión antes de integrar la caminata en E2. El [hito 08](08_HITO_CONTENIDO_PROFESIONAL.md) conserva materiales y revisión editorial, que pueden resolverse en paralelo sin bloquear ese arranque. La integración del mapa y las comprobaciones de la web corresponden al agente de desarrollo.

Las bases narrativas de FoxMind y Flower están preparadas. Quedan las capturas seleccionadas, la revisión editorial de los textos y los datos profesionales restantes; un tercer caso es opcional. Los originales oficiales de FoxMind y Foxy solo se incorporan si forman parte del material que Alejo quiera mostrar. Se conserva el alcance limitado de FoxMind, sin pedir acceso al producto ni ampliar su ficha con datos internos del CV.

## 10. Fuentes del traspaso

Se revisaron los siguientes archivos del kit `portfolio-campamento`:

- `docs/ALCANCE_Y_USO.md`: propósito, estructura y límites del kit.
- `docs/GUIA_DE_ARTE.md`: identidad, cuatro destinos, capas, escala e interfaz.
- `content/portfolio.es.json` del kit original: textos iniciales, contenido, enlaces y campos pendientes como fuente de partida.
- `config/world-layout.json`: posiciones de referencia para escritorio y móvil; marcado como referencia, sin navegación ni colisiones validadas.

La ficha integrada, su proporción general y la solución de cabecera adoptada se registran como DEC-13 a DEC-16 en [01_PRODUCTO_Y_DECISIONES.md](01_PRODUCTO_Y_DECISIONES.md); DEC-17 registra el avance al contenido profesional. La dirección visual está adoptada como referencia. DEC-26 añade la caminata manual y la selección con recorrido y apertura al llegar como dirección de interacción. Los estados detallados, el foco, las alternativas, los controles táctiles y las medidas siguen siendo propuesta para la futura implementación, sin QA ejecutada.

La referencia de datos de trabajo actual es [content/portfolio.es.json del handoff](content/portfolio.es.json), con bases de rutas y estados descritos en su [README](content/README.md). No son rutas públicas de una web ya implementada.

## Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 0.11 | 29/10/2026 | Integración al Dossier 1.0 como base recomendada utilizable para E1/E2, conservando el estado propuesto de los detalles y sin reabrir la distribución adoptada. Se precisa el contexto de origen al redirigir, el problema u objetivo documentado dentro del alcance público de cada caso y la publicación con al menos un caso completo entre los priorizados. Sin implementación ni pruebas de web. |
| 0.10 | 29/10/2026 | DEC-28 adopta la distribución base del mapa. Se cierra su revisión espacial y se conservan geometría ajustable, reglas complementarias e implementación pendientes. |
| 0.9 | 29/10/2026 | DEC-27 abre el hito 10 de mapa jugable. Se vinculan el marco geométrico propuesto, los cuatro ramales, la llegada a Contacto desde tierra y la presentación móvil con cámara estable. Se distingue el esquema del terreno ilustrado y de toda comprobación de implementación. |
| 0.8 | 29/10/2026 | DEC-26 sustituye la apertura inmediata por caminata manual y selección con recorrido hasta abrir al llegar. Se proponen rutas breves, omisión/cancelación, cambio de destino, movimiento táctil, foco independiente para autoruta, estados de pausa y alternativas ante carga o fallos. Sin implementación ni QA. |
| 0.7 | 29/10/2026 | Inicio del hito 09 para consolidar la propuesta de interacción: Explorar el campamento contextual en escritorio, experiencia móvil táctil con avatar ambiental y ajustes bajo los enlaces del menú. Se conserva la dirección visual, el alcance de los casos y toda verificación pendiente. |
| 0.6 | 29/10/2026 | Alcance de FoxMind: descripción general y capturas seleccionadas; no se requieren ni muestran acciones de demo, repositorio o acceso al producto. Se conserva la experiencia del portfolio. |
| 0.5 | 29/10/2026 | Referencia al JSON editorial actualizado del handoff. Se conservan las interacciones y la dirección visual; sin implementación ni nuevas pruebas. |
| 0.4 | 29/10/2026 | Dirección visual de la revisión 2 adoptada: emblema, nombre una vez y cabecera móvil compacta. Separación explícita entre referencia visual y estados, foco, medidas y controles por implementar. Avance al hito 08; contenido, parecido individual del avatar y QA mantienen pendientes propios. |
| 0.3 | 29/10/2026 | Registro del alcance de DEC-14/15. Propuesta DEC-16: emblema, cabecera móvil compacta con Contacto/CV/Menú, cuatro enlaces desplegables en flujo y reglas de foco. Orientaciones de composición adaptables a texto ampliado. Se conserva la proporción general de ficha aprobada; sin QA de aplicación. |
| 0.2 | 29/10/2026 | Registro de DEC-13 y de la ficha integrada para escritorio y móvil; actualización de los accesos del inicio como propuesta; separación entre aceptación del concepto y revisión de cuatro maquetas. Sin cierre de pantallas ni QA ejecutada. |

