# Entregas y criterios de aceptación

**Portfolio Campamento creativo · Alejo Palavecino**  
**Versión 0.10 · 29 de octubre de 2026 · Estado: Dossier 1.0 consolidado para iniciar una implementación de revisión; 30 verificaciones pendientes**

## 1. Propósito y estado de las comprobaciones

Este documento define qué deberá entregar el agente de código de Alejo y cómo comprobar el resultado. La documentación y la planificación se preparan en esta conversación; la implementación, sus pruebas y la publicación corresponden al agente que Alejo eligió para programar.

El objetivo confirmado es presentar el trabajo de Alejo para conseguir empleo y atraer clientes mediante un campamento en pixel art, con un avatar y cuatro destinos. Alejo aprobó el **formato de ficha integrada (DEC-13)**: una superficie amplia de color crema con el campamento parcialmente visible en escritorio; en móvil, una ficha de casi todo el ancho con una franja ilustrada. La navegación permanece disponible. En **DEC-26**, Alejo eligió caminar como en un juego y seleccionar una sección para que el avatar camine y la abra al llegar; esta dirección reemplaza la apertura inmediata de DEC-08. Los controles específicos, duraciones, interrupciones, adaptación táctil y secuencia de entregas de este documento siguen siendo una **propuesta de base**, no una aprobación extendida a cada detalle.

**Todos los criterios de la sección 5 están pendientes de ejecución.** Existe un kit de recursos y un visor local. La revisión registrada de imágenes, atlas, fuentes y audio no comprueba la futura web, su accesibilidad, rendimiento o jugabilidad. Las composiciones de escritorio y móvil son referencias que deben resolverse durante el diseño y la integración.

La dirección visual de las cuatro maquetas de revisión 2 está adoptada, según [07_HITO_PANTALLAS_PRINCIPALES.md](07_HITO_PANTALLAS_PRINCIPALES.md). DOC-07 queda completado y DOC-08 conserva los pendientes puntuales de identidad y edición. El [hito 08 de contenido](08_HITO_CONTENIDO_PROFESIONAL.md) tiene preparadas las bases narrativas de FoxMind y Flower; quedan imágenes, datos profesionales restantes y revisión editorial. El [hito 09 de experiencia e interacciones](09_HITO_EXPERIENCIA_E_INTERACCIONES.md) conserva el núcleo de navegación elegido y sus reglas complementarias propuestas. El [hito 10 · Mapa jugable](10_HITO_MAPA_JUGABLE.md), iniciado mediante DEC-27, tiene su distribución base adoptada en DEC-28. Su revisión espacial queda resuelta; posición exacta, huellas y entradas de escritorio y móvil se ajustan en la integración. El **Dossier 1.0** consolida la referencia para iniciar E1 con esos pendientes identificados. La revisión de los datos de `maps/` no acredita pruebas sobre una aplicación. La conformidad de Alejo con la presentación de los casos y su pedido de avanzar no aprueban por extensión los nuevos controles ni permiten dar por ejecutadas estas pruebas.

## 2. Responsabilidades

| Responsable | Trabajo esperado |
|---|---|
| Alejo | Confirmar contenido profesional, revisar identidad y decisiones de producto, aportar o localizar material real y decidir cuándo publicar. |
| Asistente de documentación | Mantener alcance, experiencia, contenido, referencias de assets, pendientes y criterios de aceptación coherentes. |
| Agente de código de Alejo | Elegir y documentar la solución técnica, implementar, optimizar recursos derivados, comprobar el funcionamiento y entregar evidencias. |

La documentación expresa resultados esperados y restricciones de producto. La elección de frameworks, estructura interna, alojamiento y herramientas de prueba queda a cargo del agente de código, dentro de las instrucciones de Alejo. Si una limitación técnica exige cambiar una función o un comportamiento, deberá explicarse y actualizarse la especificación.

## 3. Condiciones de preparación

### Listo para implementar

El **Dossier 1.0** es la referencia consolidada para iniciar una primera implementación de revisión. Las reglas complementarias de 02/09 constituyen la base recomendada de trabajo para E1 y E2: pueden implementarse y evaluarse sin solicitar aprobación individual de cada control, manteniendo su condición de propuesta. Los cambios materiales que alteren la experiencia elegida se explican y registran; los ajustes rutinarios de integración corresponden al agente. Esta preparación documental no equivale a aprobación global de los detalles ni a comprobación de la web.

La entrega permite comenzar porque:

- Está identificada la versión de documentación que se tomará como referencia.
- Están identificadas las decisiones elegidas sobre la caminata y la apertura al llegar, junto con una propuesta operativa de entrada, regreso, controles de escena y adaptación móvil.
- El agente dispone del kit y entiende qué imágenes son originales maestros, qué exportaciones debe derivar y qué referencias aún no son diseños finales.
- Está identificada la distribución base de 10 adoptada en DEC-28; su marco de coordenadas, huellas y cuatro entradas sirven como referencia ajustable para la integración y se distinguen de las colisiones finales.
- El contenido distingue hechos confirmados, borradores y campos pendientes; está definido qué se ocultará cuando no haya material suficiente.
- Están documentados el alcance de trabajo de la primera versión y los criterios que deberá demostrar dentro de esa base recomendada, sin confundirlos con pruebas ya ejecutadas.

El agente puede iniciar E1 con contenido provisional identificado en el entorno de revisión. La falta de un logo oficial, un proyecto secundario o una captura no impide organizar componentes y navegación. Sí impide dar por completo el contenido que dependa de esos materiales. Los pendientes editoriales se resuelven en paralelo y se conservan visibles hasta su revisión.

### Listo para publicar

Requiere una implementación revisada, AC-01 a AC-23 y AC-26 a AC-30 aprobados, la entrega técnica de AC-24 y contenido vigente confirmado por Alejo, con **al menos un caso completo entre los priorizados, FoxMind o Flower**. FoxMind conserva su prioridad editorial, pero no es un requisito exclusivo: si sigue incompleto, se omite de la versión pública y puede incorporarse después. También requiere enlaces y CV comprobados y recursos preparados para la web, sobre la versión que se desplegará. AC-25 se ejecuta después de publicar y no es un requisito circular para poder hacerlo. La existencia de documentación completa, una compilación exitosa o una imagen del diseño no sustituye estas comprobaciones.

La publicación se realiza cuando Alejo la indique. Un dominio propio y los demás casos pueden incorporarse después si no están disponibles; los espacios incompletos se omiten de la versión pública.

## 4. Entregas para el agente de código

### E1. Navegación profesional completa

Implementar presentación, navegación, Proyectos, Sobre mí, Trayectoria, Contacto, detalle de proyecto y descarga de CV. Las fichas respetan el formato integrado aprobado en DEC-13 y la composición que resulte de revisar las cuatro maquetas. Como base de trabajo anterior a integrar la caminata, los destinos de una escena estática deben abrir el mismo contenido que el menú. Esa apertura provisional no es el comportamiento final de DEC-26: la selección con recorrido se integra y comprueba en E2. Deben existir apertura, regreso y gestión del foco desde E1.

**Evidencia esperada:** una versión navegable de revisión y un registro del recorrido desde la llegada hasta leer un caso, descargar el CV y abrir contacto. Los datos provisionales se identifican en la entrega al revisor; no se inventan resultados para completar tarjetas.

**Cierre de E1:** revisar AC-02, AC-03, AC-05 a AC-08 y AC-16 sobre la estructura implementada. AC-01 se verifica parcialmente en cuanto a presentación y accesos iniciales; su caminata automática y Abrir ahora se comprueban en E2. AC-04 y cualquier parte de otros criterios que dependa de la escena en movimiento permanecen pendientes. AC-18 sigue pendiente mientras el contenido destinado a publicación sea provisional; AC-19 y AC-20 también permanecen pendientes si faltan los canales definitivos o el CV elegido, aunque sus controles se puedan revisar. E1 puede aceptarse como estructura con estos resultados parciales identificados. Un criterio solo se marca aprobado cuando se comprobó completo; este cierre intermedio no habilita publicación.

### E2. Escena y avatar

Integrar las capas, los destinos, el personaje, sus secuencias, zonas transitables y profundidad. Usar el hito 10 y la [guía de mapas](maps/README.md) como distribución base adoptada; ajustar coordenadas, huellas y holguras al terreno real y al apoyo del avatar, conservando la organización elegida. Conservar el acceso a Contacto por el mismo margen y la conectividad de las cuatro entradas en ambas composiciones. Añadir caminata libre por teclado en escritorio y selección de sección con recorrido automático hasta su entrada y apertura al llegar, según DEC-26. Proponer en móvil rutas al tocar destinos y caminata a un punto de suelo transitable, sin joystick. Incorporar señales, acciones Abrir ahora / Cancelar recorrido / Continuar recorrido, sustitución de destino y apertura directa con movimiento reducido o escena no disponible. Los detalles de 02 y 09 conservan su condición de propuesta cuando no tengan confirmación específica.

**Evidencia esperada:** recorridos manuales y automáticos por los cuatro destinos, bordes y obstáculos; llegada y apertura única; cambio y cancelación de destino; transición desde una lectura; pausa al ocultar pestaña; acceso táctil y apertura directa al reducir movimiento. Registrar la duración observada de rutas automáticas y revisar el presupuesto de composición propuesto, sin declararlo medido antes de hacerlo.

**Cierre:** completar AC-01 y comprobar AC-04, AC-09 a AC-15, AC-17 y AC-26 a AC-30, manteniendo y revisando con la escena activa los resultados de E1. Las partes que dependían de caminata, foco o interrupciones solo se cierran al verificarse en esta integración. Cualquier ajuste pendiente de silueta o cadencia se registra con la secuencia y el tamaño donde ocurre. Los pendientes de contenido, contacto o CV conservan su estado hasta resolverse.

### E3. Adaptación y calidad final

Resolver escritorio y celular, exportaciones optimizadas, favicon, carga, alternativa ante fallo de escena, lectura, teclado, audio y presentación al compartir. Reemplazar los borradores destinados a publicación por contenido revisado.

**Evidencia esperada:** matriz de dispositivos y navegadores realmente utilizados; resultados de los criterios; medidas de carga con condiciones registradas; lista de incidencias y su resolución. Las capturas acreditan composición; la interacción requiere una comprobación funcional adicional.

**Cierre:** AC-01 a AC-23 y AC-26 a AC-30 aprobados en la versión presentada y sin incidencias que impidan leer, navegar, descargar el CV o contactar. AC-24 corresponde a la entrega técnica de E4 y AC-25 a la comprobación posterior a la publicación.

### E4. Entrega técnica y publicación

Entregar el proyecto, instrucciones para ejecutarlo y actualizar contenido, decisiones técnicas relevantes y revisión final de Alejo. Si Alejo indica publicar, realizar la publicación y comprobar la URL final.

**Evidencia esperada:** referencia inequívoca de la versión entregada, instrucciones reproducibles, ubicación del contenido editable y comprobación posterior en la URL pública cuando corresponda.

**Cierre:** AC-24 y AC-25. La comprobación de la URL queda pendiente hasta que exista una publicación autorizada; no se marca como aprobada usando una captura local.

## 5. Criterios de aceptación de la primera versión propuesta

Los identificadores permiten comunicar fallos sin reinterpretar el alcance. El registro del agente deberá indicar resultado, versión comprobada, entorno y evidencia por criterio. El estado inicial de todos es **pendiente**.

### Presentación, navegación y lectura

- [ ] **AC-01 · Acciones principales desde el inicio.** Nombre y presentación profesional están disponibles al entrar. Proyectos y Contacto pueden seleccionarse sin conducir manualmente al avatar: la ruta automática abre al llegar y Abrir ahora permite omitirla. El CV conserva su acción directa; no hay visitas o progresos previos obligatorios. Comprobar el recorrido en escritorio y celular.
- [ ] **AC-02 · Cuatro destinos coherentes.** Taller abre Proyectos; carpa/fogón, Sobre mí; mesa/cuaderno, Trayectoria; radio, Contacto. Las etiquetas son legibles y cada destino tiene una forma de acceso identificable.
- [ ] **AC-03 · Una misma información.** Abrir una sección desde el mapa o desde el menú presenta el mismo contenido vigente. Comprobar los cuatro pares de acceso y evitar copias divergentes de un caso.
- [ ] **AC-04 · Seleccionar, caminar y abrir.** Con escena lista y movimiento habilitado, seleccionar una sección desde un objeto, su rótulo, la navegación o una acción de sección señala el destino, muestra el campamento y hace caminar al avatar por una ruta válida. Solo al llegar se detiene y orienta hacia la entrada y abre el contenido una vez, sin Enter adicional. La selección funciona aunque el foco esté en la interfaz común. Si el avatar ya está en la zona de llegada, abre sin recorrido artificial; elegir la sección ya abierta conserva su lectura. Comprobar también la selección de otra sección desde una ficha y las alternativas directas de AC-15, AC-21 y AC-27.
- [ ] **AC-05 · Texto utilizable.** Nombre, rótulos, botones, biografía y casos se implementan como contenido web legible y seleccionable. No quedan incrustados exclusivamente en una imagen del campamento. La ampliación del texto conserva las acciones y el contenido.
- [ ] **AC-06 · Ficha integrada y menú.** La vista de lectura respeta DEC-13: en escritorio presenta una superficie amplia de color crema y conserva parte del campamento visible; en móvil ocupa casi todo el ancho y mantiene una franja ilustrada. En ambas distribuciones, texto y acciones permanecen legibles y la navegación persistente sigue accesible. El foco no queda encerrado en una interacción que impida cambiar de sección. Mientras se lee, las teclas no desplazan al avatar. La revisión de una maqueta acredita únicamente la propuesta visual; este criterio se aprueba después de comprobar composición, lectura, foco y navegación en la implementación.
- [ ] **AC-07 · Regreso previsible.** Al abrir contenido, el foco llega a un punto que permita entender lo abierto. Volver al campamento devuelve el foco al control de origen si sigue disponible o al acceso Campamento. Volver de un detalle a Proyectos conserva una posición útil de la lista y su foco. Registrar ambos recorridos con teclado.
- [ ] **AC-08 · Cierre sin capturas globales.** Existe un control visible de regreso. Escape regresa un nivel cuando corresponde a la vista de contenido y no interfiere con campos editables ni con otros controles. Tab permite seguir navegando. Atrás del navegador permite recuperar la vista anterior sin un bucle de estados que impida salir.

### Exploración y estado del campamento

- [ ] **AC-09 · Teclado limitado a la escena.** En escritorio, Explorar el campamento da foco a la escena lista y habilitada y presenta ayuda de recorrido y salida. Flechas y WASD mueven al personaje cuando la escena tiene foco y está activa. Fuera de ella conservan su función normal. Tab permite salir del recorrido y Escape aplica las prioridades de 02. Al abrir lectura, perder el foco de la escena o dejar la ventana, el movimiento manual se detiene y libera las teclas; no reaparece movimiento retenido al regresar. Esto no impide la autoruta mientras el foco está en otro control de la página visible; su pausa se comprueba en AC-28.
- [ ] **AC-10 · Activación por proximidad.** Al caminar libremente con la escena activa, acercarse muestra una indicación, sin abrir contenido por proximidad sola. Con foco en la escena y sin autoruta, Enter o E abre el destino indicado. Fuera de alcance no abre otra sección. La selección por clic/toque conserva su recorrido y apertura al llegar, sin una segunda confirmación. Llegar a suelo libre cercano a una entrada no se confunde con seleccionar esa sección.
- [ ] **AC-11 · Límites y profundidad.** El avatar permanece en áreas transitables, alcanza las cuatro entradas y no atraviesa obstáculos definidos. Al pasar delante o detrás de un objeto, el orden visual corresponde al apoyo de sus pies. Comprobar especialmente esquinas y pasajes estrechos.
- [ ] **AC-12 · Animación consistente.** Reposo y caminata corresponden a la dirección activa, mantienen escala común y no producen saltos de posición por anclajes distintos. El apoyo de los pies y la velocidad se revisan en la escena final; la existencia del atlas no basta para aprobar este criterio.
- [ ] **AC-13 · Visitas informativas.** Marcar un destino como visitado modifica únicamente su señal visual. Un visitante nuevo y uno que recorrió todo acceden a la misma información profesional. No existe un requisito de progreso para ver CV, proyectos o contacto. La marca se conserva durante la visita actual, sin requerir cuentas ni persistencia entre sesiones.

### Celular, movimiento y audio

- [ ] **AC-14 · Acceso táctil completo.** En celular se pueden seleccionar los cuatro destinos mediante toque y menú, ver la caminata y abrir al llegar; la propuesta también permite tocar suelo transitable para caminar hasta un punto sin abrir contenido. No incorpora joystick. El avatar y la escena quedan en reposo durante lectura o con movimiento reducido. Según la dirección de cabecera adoptada en DEC-16 y el comportamiento especificado en 02, Contacto y CV permanecen visibles y Menú despliega los cuatro enlaces y, debajo, los ajustes de sonido y movimiento reducido sin ampliar la cabecera cerrada. Elegir un enlace cierra el desplegable e inicia la selección; el foco se conserva en un control visible durante la ruta y pasa al contenido cuando se abre. Cambiar un ajuste mantiene el menú abierto; reducir movimiento durante ruta a una sección abre su destino directamente, mientras que los demás cambios conservan la vista. Cerrar o Escape devuelve el foco al disparador sin cerrar simultáneamente la ficha. Scroll y zoom mantienen su comportamiento esperado. El recorrido y sus controles de interrupción quedan visibles mientras el personaje camina. Los paneles no dejan acciones fuera del área accesible y los controles no dependen de pasar el cursor. Comprobar anchos menores y texto ampliado sin forzar una fila que corte controles.
- [ ] **AC-15 · Movimiento reducido y pausa.** Al activar movimiento reducido, se detienen la ambientación continua y el desplazamiento del avatar; no se anuncian ni activan sus controles de movimiento, la acción Explorar el campamento ni la ayuda de teclado. Se evitan transiciones de cámara y los cambios de contenido son directos. El menú y los destinos conservan todas las funciones. Activar la modalidad durante una ruta a una sección cancela el movimiento y abre su destino vigente; durante ruta a suelo, solo la detiene. Activar movimiento después no reanuda una ruta antigua ni captura teclas retenidas. El ajuste se ofrece en la interfaz común de escritorio y dentro del menú móvil, también desde una ficha, sin reiniciar la visita ni trasladar el foco a la escena.
- [ ] **AC-16 · Foco y lectura visibles.** Los controles muestran foco distinguible y tienen nombres comprensibles. El orden de navegación permite completar las acciones principales; texto y controles se distinguen del paisaje. Registrar revisión con teclado y ampliación de texto, sin afirmar certificación de accesibilidad.
- [ ] **AC-17 · Sonido voluntario.** Cada llegada comienza en silencio. Un control explícito, disponible en la interfaz común de escritorio y dentro del menú móvil también durante la lectura, permite activar y desactivar audio; su estado coincide con lo que se oye. El sonido no contiene información imprescindible. Al ocultar la pestaña se pausa; solo puede reanudarse si el visitante lo había activado durante esa visita y no lo había silenciado. Verificar la mezcla dentro de la web, los fallos de reproducción y la ausencia de ambientes duplicados.

### Contenido, contacto y funcionamiento

- [ ] **AC-18 · Contenido profesional vigente y casos completos.** Perfil, estudios, fechas, experiencia y disponibilidad publicados corresponden a la revisión de Alejo; las estimaciones conservan ese carácter. Cada caso publicado incluye nombre y resumen, problema u objetivo documentado, aporte de Alejo, estado y evidencia real. Decisiones, herramientas, aprendizajes, métricas y enlaces se agregan cuando existe material suficiente y pertenecen al alcance público de ese caso. Capturas, marcas y resultados tienen procedencia real. En FoxMind, la descripción general y las capturas seleccionadas por Alejo cubren la presentación acordada; código, demo, repositorio, arquitectura y acceso al producto no son requisitos. Para la primera publicación debe existir al menos un caso completo entre FoxMind y Flower; el otro se omite mientras siga incompleto. No aparecen valores vacíos, instrucciones internas, métricas inventadas ni proyectos pendientes como si estuvieran terminados.
- [ ] **AC-19 · Contacto operativo.** Los motivos empleo y proyecto abren el canal definido con su asunto correspondiente. La dirección de correo es visible para poder utilizarla aun sin una aplicación de correo configurada. Los enlaces profesionales llevan al destino revisado; no se muestra una confirmación de mensaje enviado por abrir un enlace.
- [ ] **AC-20 · CV correcto.** El enlace obtiene el PDF elegido por Alejo desde la ruta pública correspondiente. Comprobar el archivo real y su versión, no solamente la apariencia del botón.
- [ ] **AC-21 · Carga y fallo de escena.** Presentación y accesos profesionales no dependen de terminar de cargar toda la decoración o el audio. Mientras la escena carga, la selección abre el contenido directamente y no deja un recorrido para ejecutarlo al terminar la carga. Si una imagen o la escena falla, permanece una alternativa legible con las secciones y contacto; una ruta hacia una sección se cancela y muestra el contenido solicitado con aviso breve. No queda una espera indefinida ni una segunda apertura tardía. Reintentar escena conserva la vista, el foco y la preferencia de sonido.
- [ ] **AC-22 · Recursos preparados para la web.** Las exportaciones conservan transparencia cuando corresponde y los maestros originales. El agente informa tamaños finales y condiciones de su medición de carga. Revisa interacción durante la carga y evita bloqueos observables. Los objetivos adicionales de rendimiento deben acordarse y medirse, no declararse cumplidos por intuición.
- [ ] **AC-23 · Identidad al compartir.** Título, descripción, favicon y portada corresponden a Alejo y al portfolio. Verificar legibilidad del monograma a tamaño pequeño y encuadre de la portada. Las licencias de recursos de terceros siguen disponibles en el proyecto.

### Entrega y publicación

- [ ] **AC-24 · Proyecto mantenible.** La entrega identifica cómo ejecutar la versión, dónde editar textos, proyectos y CV, cómo generar la salida y qué pendientes permanecen. Las decisiones técnicas registradas corresponden al proyecto realmente entregado.
- [ ] **AC-25 · Verificación pública.** Tras la instrucción de publicar, se comprueban en la URL final inicio, destinos, detalle de proyecto, CV, contacto y recursos. Se registra la versión publicada y cualquier diferencia respecto de la revisada.

### Recorridos automáticos e interrupciones

- [ ] **AC-26 · Prevalece la última selección.** Elegir otro destino durante la caminata reemplaza la ruta desde la posición actual. La anterior no se completa ni abre después, incluso con clics rápidos o repetidos. No se acumulan rutas. Iniciar flechas/WASD con foco en la escena cancela la autoruta y entrega el control manual sin conservar una apertura pendiente.
- [ ] **AC-27 · Omitir y cancelar sin perder contexto.** Abrir ahora cancela la caminata y abre solo la última sección elegida. Cancelar recorrido restaura la vista de origen, su desplazamiento y un foco válido, conservando la posición física alcanzada por el avatar. Escape sigue la prioridad de campo/control, Menú y recorrido; una pulsación no cancela y además regresa otra vista. Sustituir o cancelar rutas no llena el historial; Atrás cancela la ruta pendiente y recupera su vista anterior sin aperturas tardías. Tarjetas de proyecto, Volver a Proyectos, Volver al campamento, CV, correo y enlaces externos no añaden paseos.
- [ ] **AC-28 · Autoruta y foco independientes.** La caminata automática puede avanzar mientras el foco está en un enlace o en Abrir ahora, sin capturar el teclado ni dejar foco oculto. Al ocultar la pestaña, la autoruta queda pausada y no abre su sección. Regresar muestra Recorrido en pausa y permite Continuar recorrido, Cancelar recorrido y —si va a una sección— Abrir ahora. No se reanuda por el mero regreso de visibilidad. Una elección nueva sustituye también una ruta pausada.
- [ ] **AC-29 · Caminar a suelo libre.** Clic en escritorio o toque breve en móvil sobre terreno transitable ordena ir al punto y quedar en reposo; no abre una sección por terminar cerca de una entrada. La nueva orden sustituye la anterior. Los obstáculos y el suelo inválido no reciben al avatar; se conserva una posición válida y se da respuesta visible. Scroll, arrastre y zoom táctiles no se interpretan como órdenes. La acción Abrir ahora solo aparece para rutas a secciones.
- [ ] **AC-30 · Rutas utilizables y llegada comprobable.** Tomar [10 · Mapa jugable](10_HITO_MAPA_JUGABLE.md) y `maps/README.md` como distribución base adoptada en DEC-28, y verificar que los ajustes geométricos de integración conserven esa organización y su alineación con la escena real. La posición inicial, todo el suelo libre admitido y las cuatro zonas de llegada pertenecen a una misma área conectada en escritorio y móvil, incluidas posiciones posteriores a caminar libremente o cambiar tamaño/orientación. Las entradas quedan fuera de las huellas, con espacio de paso para el avatar; no se atraviesa agua ni se exige un puente para Contacto. Los marcos de 1000 × 650 y 600 × 760 son unidades de propuesta, no píxeles CSS ni colisiones ya implementadas. Los resultados de `geometric-review.json` no sustituyen esta comprobación de la web. Si una ruta de sección no puede completarse, se detiene y se abre la sección vigente con un aviso breve; una ruta fallida a suelo no abre contenido. La llegada respeta la zona de entrada y no depende solo de que termine una animación de duración fija. Registrar trayectos y duración: objetivo de diseño de 1–2 segundos, con 3 segundos como límite excepcional propuesto para la composición inicial. Ajustar caminos y distribución antes de acelerar de forma poco natural; cualquier desviación material de este presupuesto se documenta como ajuste de diseño, sin inventar mediciones.

## 6. Ampliaciones y manejo de pendientes

Quedan para una decisión posterior la versión en inglés, logros o secretos, nuevas zonas, ciclo día/noche, formulario conectado y analítica. El audio se incluye en la implementación propuesta de la primera versión y AC-17 es obligatorio dentro de ese alcance. Escucharlo es voluntario para el visitante y comienza desactivado.

Un criterio obligatorio que falle permanece pendiente. No se cierra sustituyéndolo por una captura, omitiendo la función o marcándolo «no aplica» sin cambiar expresamente el alcance. Las incidencias deben indicar qué sucede, en qué contexto, qué criterio afecta y qué solución o decisión falta. Las diferencias cosméticas se pueden priorizar después de los problemas que bloqueen información, navegación o contacto.

## Referencias

- [Alcance original del kit](../portfolio-campamento/docs/ALCANCE_Y_USO.md).
- [Guía de uso y limitaciones de los recursos](../portfolio-campamento/README.md).
- [Experiencia y pantallas propuestas](02_EXPERIENCIA_Y_PANTALLAS.md).
- [Dirección visual y assets](03_DIRECCION_VISUAL_Y_ASSETS.md).
- [Hito de pantallas principales](07_HITO_PANTALLAS_PRINCIPALES.md).
- [Hito de contenido profesional y casos](08_HITO_CONTENIDO_PROFESIONAL.md).
- [Hito de experiencia e interacciones](09_HITO_EXPERIENCIA_E_INTERACCIONES.md).
- [Hito de mapa jugable con distribución adoptada](10_HITO_MAPA_JUGABLE.md) y [guía de los esquemas y datos](maps/README.md).

El plan anterior sirvió como antecedente. Ante diferencias sobre responsabilidades, prevalece la instrucción actual de Alejo: esta colaboración prepara documentación y planeación; su agente desarrolla el código.

Los criterios anteriores comprueban la web del portfolio. La evidencia seleccionada para los casos descritos se ajusta a su alcance público; en particular, no se solicita acceso al código o al funcionamiento interno de FoxMind para aceptar su ficha.

## Historial de cambios

**0.10 · 29/10/2026:** Dossier 1.0 consolidado como base recomendada utilizable para iniciar E1 y preparar E2, sin aprobación individual de cada detalle. Se distingue la revisión parcial de AC-01 en E1 de su cierre en E2 y se conservan los pendientes de contenido, contacto y CV. La publicación requiere al menos un caso completo entre FoxMind y Flower, con problema u objetivo documentado y dentro de su alcance público. Los 30 criterios permanecen pendientes; no se ejecutaron pruebas de web.

**0.1 · 29/10/2026:** propuesta de entregas y 25 criterios de aceptación; comprobaciones de aplicación pendientes.  
**0.2 · 29/10/2026:** incorporación de DEC-13 como formato de ficha integrado aprobado, actualización visual de AC-06 y referencia al hito de cuatro maquetas generadas para revisión. Se mantiene pendiente la ejecución de AC-01 a AC-25: aprobación del formato y renders no equivalen a validación funcional.

**0.3 · 29/10/2026:** registro de la proporción general aprobada y revisión de cabecera/móvil. AC-14 incorpora la comprobación del menú desplegable propuesto, sus accesos y el foco. Todos los criterios continúan pendientes de ejecución.

**0.4 · 29/10/2026:** dirección visual de revisión 2 adoptada e inicio del hito de contenido. La cabecera móvil queda como referencia de la verificación futura; AC-01 a AC-25 siguen pendientes.

**0.5 · 29/10/2026:** AC-18 precisa el alcance de presentación de FoxMind con descripción general y capturas seleccionadas. La aceptación del caso no requiere código, demo, repositorio o acceso al producto. Las 25 comprobaciones de la web del portfolio continúan pendientes.

**0.6 · 29/10/2026:** hito 09 activo para preparar el recorrido y el traspaso P4. Se precisan Explorar el campamento en escritorio, acceso táctil con avatar ambiental, ajustes de ambiente en el menú móvil, movimiento reducido y audio voluntario. Los 25 criterios conservan sus identificadores y siguen pendientes de ejecución.

**0.7 · 29/10/2026:** DEC-26 incorpora caminata manual y selección con recorrido y apertura al llegar. Se revisan navegación, foco, móvil, movimiento reducido y etapas E1/E2; se añaden AC-26 a AC-30 para rutas e interrupciones. Las 30 comprobaciones siguen pendientes.

**0.8 · 29/10/2026:** hito 10 activo y referencia espacial incorporada a condiciones de preparación, E2 y AC-30. Se comprueban alineación con assets, conectividad desde suelo libre y cuatro entradas en escritorio y móvil; la revisión geométrica documental no aprueba una implementación. Se conservan 30 criterios, todos pendientes.

**0.9 · 29/10/2026:** DEC-28 adopta la distribución base de 10. E2 y AC-30 utilizan esa referencia y reservan los ajustes de coordenadas, huellas y holguras para integración. La aprobación de distribución no acredita ninguna de las 30 verificaciones ni autoriza publicación.
