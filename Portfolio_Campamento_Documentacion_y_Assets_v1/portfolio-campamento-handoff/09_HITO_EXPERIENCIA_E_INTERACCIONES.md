# 09 · Hito de experiencia e interacciones

**Proyecto:** Portfolio de Alejo Palavecino · Campamento creativo  
**Versión:** 0.4 · **Fecha:** 29 de octubre de 2026 · **Fase:** P4 · **Estado:** dirección de navegación confirmada; distribución base del mapa adoptada en DEC-28; reglas de detalle e implementación pendientes de revisión y comprobación.

**Continuidad:** el [hito 10 · Mapa jugable](10_HITO_MAPA_JUGABLE.md), iniciado mediante DEC-27, tiene su distribución base adoptada por Alejo en DEC-28. El claro central, el personaje y la relación entre los cuatro destinos quedan elegidos. Las huellas y coordenadas se ajustarán en la integración; esta adopción no confirma automáticamente todos los controles de interacción.

## 1. Qué cambió y qué queda definido

Alejo quiere poder **caminar como en un juego** y que, al elegir una sección con clic, **el personaje camine hasta su destino y la sección se abra recién al llegar**. Esta decisión se registra como **DEC-26** y sustituye la apertura inmediata propuesta en la revisión 0.1 y en DEC-08.

La elección confirma el núcleo de la experiencia: exploración manual y selección de destino con caminata automática. Las teclas, la adaptación táctil, la duración, las cancelaciones y las alternativas para omitir animaciones se desarrollan aquí como **recomendaciones**, sin atribuirles aprobación específica.

El trabajo sigue siendo documental. [02 · Experiencia y pantallas](02_EXPERIENCIA_Y_PANTALLAS.md) conserva el comportamiento detallado y [05 · Entregas y aceptación](05_ENTREGAS_Y_ACEPTACION.md) define las comprobaciones futuras. El hito retoma DOC-04 y DOC-08 del [plan](Plan_Portfolio_Campamento_Alejo.md).

La ficha integrada, sus proporciones, el emblema y la cabecera de la revisión 2 siguen como referencia visual adoptada. Los casos mantienen su alcance editorial y sus imágenes pendientes.

## 2. Experiencia propuesta a partir de DEC-26

### Explorar por cuenta propia

En escritorio, **Explorar el campamento** da foco al mapa. Las flechas o WASD permiten recorrer el terreno transitable. Al acercarse a un destino aparece una indicación para abrirlo con Enter o E. La proximidad por sí sola no abre contenido.

Se propone también hacer clic en un punto transitable para caminar hasta allí y detenerse. Esa acción permite pasear; no lleva asociada la apertura de una sección.

### Elegir adónde ir

Al hacer clic en **Taller / Proyectos**, en su rótulo o en el enlace equivalente de navegación:

1. Se señala el destino elegido y se muestra el campamento.
2. El personaje camina desde su posición actual por una ruta válida. La interfaz indica **Yendo a Proyectos…**.
3. Al llegar al punto de interacción, el personaje se detiene y queda orientado hacia el destino.
4. Se abre Proyectos una sola vez y el foco pasa al inicio del contenido. No hace falta pulsar otra tecla para completar esa apertura.

La misma regla se propone para las cuatro secciones y para las acciones del inicio que llevan a una sección. Si el personaje ya está junto al destino elegido, se abre directamente sin añadir pasos artificiales.

Elegir una sección diferente desde una ficha vuelve a mostrar el campamento, realiza el recorrido y abre el nuevo contenido. Es una propuesta de coherencia con el flujo elegido; el visitante puede usar **Abrir ahora** para omitir cada trayecto. Seleccionar la sección que ya está abierta conserva la vista y su lectura.

Abrir una tarjeta de proyecto, **Volver a Proyectos**, **Volver al campamento**, usar Atrás del navegador, obtener el CV o activar correo y enlaces externos son acciones propias de la interfaz: no añaden otra caminata.

### Tiempo y alternativas durante el recorrido

Como objetivo inicial de diseño, se proponen trayectos automáticos habituales de **1–2 segundos**, y hasta aproximadamente **3 segundos** para los más largos. Son valores orientativos para revisar con el mapa y el prototipo; no son mediciones ni una regla general de usabilidad. La composición compacta y las entradas cercanas deben permitir una marcha natural, sin acelerar de forma brusca ni teletransportar al avatar.

Durante una ruta hacia una sección aparecen **Abrir ahora** y **Cancelar recorrido**. El primero abre el último destino elegido sin completar la animación; el segundo cancela la apertura pendiente y recupera la vista de origen con su posición de lectura y foco. En ambos casos se conserva una posición válida del avatar, sin simular que terminó el recorrido.

Con movimiento reducido, durante la carga, ante un fallo de la escena o cuando no se puede resolver una ruta, los enlaces abren el contenido sin esperar la caminata. Se mantiene la posibilidad de conocer el trabajo, consultar el CV y contactar.

## 3. Correspondencia del mundo con el contenido

| Objeto | Sección | Llegada prevista |
|---|---|---|
| Taller | Proyectos | Punto transitable junto a la entrada del taller. |
| Carpa y fogón | Sobre mí | Punto transitable próximo a la carpa, fuera del fuego. |
| Mesa de bitácora | Trayectoria | Punto transitable junto a la mesa. |
| Radio / puesto de comunicación | Contacto | Punto transitable frente al puesto. |

Los puntos y sus zonas de aproximación están propuestos en el [hito 10](10_HITO_MAPA_JUGABLE.md) y en su [esquema de navegación](maps/world-navigation-proposal.json). Su ajuste sobre el terreno real sigue pendiente: no se deducen coordenadas definitivas de las maquetas ni se exige que el avatar se sitúe sobre el objeto. Contacto queda accesible desde tierra firme, sin exigir cruzar el río. Mapa y menú abren una sola versión de cada contenido.

## 4. Cómo se adapta al celular

La propuesta es tocar un destino para que el personaje camine automáticamente y abra al llegar. El avatar participa en el recorrido; deja de ser únicamente ambiental.

Para explorar libremente se propone **tocar brevemente un punto del suelo transitable**. El personaje camina hasta allí y se queda. Los gestos de desplazamiento de página y zoom conservan su función; no se interpretan como órdenes de caminar. Esta forma de control táctil todavía no fue elegida específicamente por Alejo.

La primera versión no necesita un joystick en pantalla. Las instrucciones de teclado solo aparecen en escritorio cuando corresponde. Al elegir un destino desde Menú, el desplegable se cierra y el recorrido debe quedar visible junto con su estado y las opciones de abrir o cancelar. El hito 10 fija la distribución base adoptada alrededor de un cruce central, respetando la cabecera adoptada: **emblema · Contacto · CV · Menú**. Si el mapa está fuera de vista al iniciar la ruta, se propone llevar el bloque al área visible una sola vez, sin seguimiento permanente de cámara ni bloqueo del scroll. La adaptación al terreno ilustrado y a tamaños reales continúa pendiente.

## 5. Tres recorridos del visitante

### Una persona que evalúa contratarte

Entra y encuentra nombre, enfoque profesional y **Ver proyectos**. Al elegir esa acción, el avatar va al taller y abre Proyectos. Si quiere acceder enseguida, usa Abrir ahora. Abre un caso sin otro paseo, revisa tu responsabilidad y obtiene el CV directamente. Puede elegir Contacto para ir a la radio y acceder a **Conversar sobre una oportunidad**.

### Un posible cliente

Elige Proyectos y llega al taller. Consulta Flower para entender tu desarrollo completo de un sistema de stock y facturación que funciona en producción. Puede recorrer Sobre mí y los servicios o pasar a Contacto y elegir **Consultar por un proyecto**. Las acciones de correo preparan un mensaje en su aplicación; no acreditan un envío desde el portfolio.

### Una persona que quiere explorar

Activa el control del campamento, camina, descubre los cuatro destinos y abre uno al confirmar junto a él. También puede elegir una sección para que el personaje vaya automáticamente. Al volver al campamento recupera su posición válida y puede seguir recorriendo. No hay destinos bloqueados, misiones obligatorias ni progreso exigido para leer.

## 6. Decisiones del hito

| ID | Definición | Estado |
|---|---|---|
| RI-01 | **Ver proyectos** como acción principal y **Contactar** como secundaria; Explorar queda junto al mapa. | Jerarquía editorial propuesta. Las acciones de sección siguen el recorrido descrito. |
| RI-02 | Caminata manual y selección por clic que mueve al personaje y abre al llegar. | **Núcleo confirmado por Alejo mediante DEC-26.** Rutas, tiempos, interrupciones y omisión siguen como propuestas de detalle. |
| RI-03 | En móvil, toque de destino con caminata automática y toque de suelo para pasear, sin joystick inicial. | Adaptación táctil propuesta; no se registra como aprobación del control manual en celular. |
| RI-04 | Lectura estable; ficha crema integrada; escena y avatar en reposo durante la lectura. | Propuesta de comportamiento que conserva la dirección visual adoptada. |
| RI-05 | Regresos explícitos y un nivel por acción; rutas cancelables sin entradas extra en el historial. | Propuesta de comportamiento y restauración de contexto. |
| RI-06 | Sonido voluntario, movimiento ajustable y apertura sin trayecto en modo reducido. | Propuesta de ambiente y alternativa de navegación. |
| RI-07 | Marca discreta de destinos visitados durante la visita actual. | Propuesta cosmética; solo se marca al abrir el contenido, no por elegir o cancelar una ruta. |
| RI-08 | Texto y navegación disponibles durante carga, fallo de escena o ruta no resuelta. | Propuesta de continuidad: el destino solicitado puede abrirse directamente. |

El registro distingue lo que Alejo eligió de las reglas recomendadas para concretarlo. El cambio de navegación no implica aprobación de toda la tabla ni comprobación de una web.

## 7. Estados y situaciones a resolver

| Situación | Respuesta propuesta |
|---|---|
| Se elige un destino desde el campamento | Se inicia la ruta; se informa adónde va el personaje; el contenido abre al llegar. |
| Se elige otro destino durante la marcha | Se sustituye la ruta desde la posición actual. El destino anterior pierde su apertura pendiente; no hay cola de visitas. |
| Se vuelve a elegir el mismo destino durante la marcha | Continúa la ruta actual; no reinicia el trayecto ni duplica la apertura. |
| Se toma el control manual con la escena enfocada | Se cancela la ruta automática y su apertura; el visitante controla al personaje en el campamento. |
| Se toca o hace clic en terreno transitable | Se sustituye la ruta por una caminata a ese punto, sin apertura asociada. En suelo no transitable no se crea una ruta imposible. |
| Se pulsa Abrir ahora | Se cancela la animación y se abre el último destino de sección solicitado. El foco pasa al contenido. |
| Se pulsa Cancelar recorrido | Se detiene el avatar, se elimina la apertura pendiente y se recupera la vista de origen con su lectura y foco. |
| Se activa movimiento reducido durante una ruta de sección | Se detiene la animación y se abre el destino solicitado. Una caminata a suelo libre solo se detiene. |
| Se abre una sección o un caso | Escena y avatar quedan estáticos; se desactiva la entrada de movimiento. La navegación común sigue operable. |
| Se pierde el foco de la escena | Se detiene el control manual. Una ruta automática sigue su curso mientras la página esté visible; puede manejarse desde sus controles sin dar foco al mapa. |
| Se oculta la pestaña durante una ruta | Se pausa el recorrido. Al volver se ofrecen Continuar recorrido, Abrir ahora y Cancelar recorrido; no se abre contenido automáticamente por tiempo transcurrido. |
| Falla la escena o no existe una ruta válida hacia una sección | Se cancela el trayecto y se abre el contenido solicitado con un aviso breve. No queda un estado de espera interminable. |
| Se vuelve de un caso a Proyectos | Se restaura la lista, su desplazamiento y la tarjeta de origen, sin otra caminata. |
| Se vuelve al campamento | Se recupera la posición válida actual del avatar y un control de origen disponible, sin ruta de retorno obligatoria. |

**Abrir ahora** solo tiene sentido cuando existe una sección pendiente. Una caminata al suelo no abre contenido y dispone de cancelación; si se pausa, puede continuarse. Tab permite recorrer los controles sin retener el foco en el juego.

Escape respeta primero campos, composición de texto y controles con cierre propio; luego cierra Menú si está abierto. Una sola pulsación no cierra el menú y cancela la ruta. Con el menú cerrado puede cancelar el recorrido; durante lectura retrocede un nivel según 02.

El historial registra vistas de contenido efectivamente abiertas, no pasos del avatar, destinos sustituidos ni rutas canceladas. Si el visitante usa Atrás durante una ruta, se cancela su apertura pendiente antes de recuperar la vista histórica que corresponda. Las posiciones de lectura se conservan para los regresos.

## 8. Ambientación y texto de interfaz

El sonido empieza apagado y se activa de forma voluntaria. Cambiar de sección mantiene un único ambiente. Ocultar la pestaña pausa el audio; al volver solo puede reanudarse si estaba habilitado por el visitante y no se silenció. Los controles informan su estado real.

Los ajustes de sonido y movimiento permanecen accesibles durante lectura y recorrido. En móvil están debajo de los cuatro enlaces dentro de Menú; cambiar un ajuste conserva el menú abierto. El movimiento reducido mantiene la escena estática y todas las secciones accesibles. Activar movimiento no reanuda órdenes antiguas.

| Uso | Texto propuesto |
|---|---|
| Acciones del inicio | Ver proyectos · Contactar |
| Acceso al mapa con teclado | Explorar el campamento |
| Ayuda general | Elegí un lugar y el personaje caminará hasta allí. |
| Ayuda con el mapa enfocado | Flechas o WASD para moverte. Enter o E junto a un lugar para abrirlo. Escape para salir del recorrido. |
| Destino seleccionado | Yendo a {sección}… |
| Caminata hacia suelo libre | Caminando… |
| Recorrido detenido al ocultarse la pestaña | Recorrido en pausa. |
| Omitir la caminata de sección | Abrir ahora |
| Detener la orden actual | Cancelar recorrido |
| Reanudar una ruta pausada | Continuar recorrido |
| Regresos | Volver a Proyectos · Volver al campamento |
| Ajustes | Activar sonido / Desactivar sonido · Reducir movimiento / Activar movimiento |
| Carga | Cargando el campamento… |
| Fallo de escena | No pudimos cargar el campamento. Podés seguir explorando el portfolio desde el menú. |
| Ruta no resuelta, con acceso al contenido | No pudimos completar el recorrido. Abrimos la sección para que puedas continuar. |
| Recuperación | Reintentar escena |
| Copia de correo completada | Correo copiado |
| Copia de correo fallida | No pudimos copiar el correo. Podés seleccionarlo y copiarlo manualmente. |

El nombre de sección se sustituye por Proyectos, Sobre mí, Trayectoria o Contacto; no se muestra la variable al visitante. La confirmación de copia solo aparece tras completar esa acción. Los textos se mantienen alineados con el [contenido estructurado](content/portfolio.es.json).

## 9. Contenido y recursos que se mantienen

FoxMind se presenta con descripción general, aporte de Alejo —desarrollo completo hasta la etapa actual, incluida la integración de IA—, estado prepiloto y capturas que él seleccione. Este alcance también rige en Trayectoria; no requiere demo, repositorio ni detalles internos.

Flower conserva desarrollo individual, React, Node.js, PostgreSQL y funcionamiento en producción. Las imágenes de ambos casos y la revisión editorial siguen pendientes en [08 · Contenido profesional](08_HITO_CONTENIDO_PROFESIONAL.md). Una reserva visual no se presenta como captura real.

El kit ya incluye un atlas de reposo y caminata en cuatro direcciones. Su integración, continuidad de animación, escala y parecido individual todavía deben revisarse. El [hito 10](10_HITO_MAPA_JUGABLE.md) concreta una propuesta de **suelo transitable, obstáculos, punto inicial y cuatro puntos de llegada**, cuyo ajuste sobre el arte y comprobación en la web siguen pendientes. El terreno es una ilustración única; la recomposición debe respetar sus claros y senderos. El detalle de recursos está en [03 · Dirección visual y assets](03_DIRECCION_VISUAL_Y_ASSETS.md).

## 10. Tareas y siguiente paso

| ID | Tarea | Estado |
|---|---|---|
| HI-01 | Describir recorridos de empleo, cliente y exploración. | Actualizados para caminata manual y automática. |
| HI-02 | Definir inicio, controles y lectura. | Núcleo de RI-02 confirmado; teclas, tiempos, móvil, omisión y reglas de detalle propuestos. |
| HI-03 | Definir ambiente, visitas y continuidad ante fallos. | Propuestas actualizadas para rutas y movimiento reducido. |
| HI-04 | Vincular experiencia, textos, assets y comprobaciones. | Documentación alineada; integración y pruebas pendientes. |
| HI-05 | Registrar la versión de navegación y concretar su mapa. | DEC-26 y DEC-28 incorporadas: núcleo de navegación y distribución base elegidos. Adaptación al arte y reglas complementarias conservan su seguimiento. |
| HI-06 | Comprobar los recorridos en la implementación. | Pendiente del agente de desarrollo; AC-01 a AC-30. |

**Integración del mapa adoptado:** ajustar al terreno existente el punto de aparición, los pasos libres y las cuatro llegadas, conservando la distribución elegida en DEC-28. Las distancias geométricas no equivalen a segundos; la duración y la presentación de una ruta en celular se comprobarán en el prototipo. Esto concreta el flujo elegido sin reabrir la identidad visual ni dar por aprobado todo el hito 09.

E1 puede preparar contenido, secciones y enlaces antes de integrar el juego. E2 incorpora caminata, rutas y apertura al llegar; E3 comprueba la experiencia completa. La navegación inmediata de E1 no se toma como el resultado final de DEC-26. Ningún criterio se marca superado por estar documentado.

## Registro de cambios

**0.4 · 29/10/2026:** DEC-28 adopta la distribución base del hito 10. Se actualiza la continuidad y HI-05 sin cambiar las reglas de interacción, el contenido profesional ni el estado de implementación.

**0.3 · 29/10/2026:** DEC-27 inicia el hito 10 de mapa jugable. Se vinculan la distribución y las zonas de llegada propuestas, manteniendo el núcleo de DEC-26 y los detalles de interacción sin aprobación específica ni QA de aplicación.

**0.2 · 29/10/2026:** DEC-26 sustituye la apertura inmediata del borrador por caminata manual y elección de destino con desplazamiento automático y apertura al llegar. Se proponen duración breve, interrupciones, omisión del recorrido, control táctil y continuidad ante fallos. Núcleo elegido por Alejo; detalles, mapa e implementación pendientes.

**0.1 · 29/10/2026:** propuesta inicial de experiencia e interacciones, con apertura inmediata y caminata opcional de escritorio. La apertura inmediata general de esa revisión queda sustituida por DEC-26; se conserva como antecedente.
