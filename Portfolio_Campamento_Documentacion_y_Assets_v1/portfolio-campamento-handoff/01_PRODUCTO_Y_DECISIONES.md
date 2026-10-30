# Producto y decisiones — Campamento creativo

**Versión 0.13 · 29 de octubre de 2026 · Incluido en Dossier 1.0 para iniciar desarrollo de revisión**

## Propósito

Definir qué debe construir el agente de desarrollo de Alejo y con qué criterios se evaluará. Alejo y este espacio de trabajo resuelven documentación, planificación, contenido y revisión de diseño. La elección de herramientas, implementación, pruebas ejecutadas y publicación corresponden al agente de desarrollo que Alejo designe.

La especificación registra la dirección visual adoptada y describe el comportamiento previsto. La aceptación de las maquetas como referencia no acredita una implementación, pruebas ejecutadas ni la exactitud del contenido profesional.

## 1. Decisiones de partida

| ID | Decisión | Estado y fundamento |
|---|---|---|
| DEC-01 | Portfolio personal orientado a empleo y clientes. | Confirmado por Alejo. |
| DEC-02 | Experiencia de campamento en pixel art. | Concepto elegido por Alejo. |
| DEC-03 | Personaje inspirado en la fotografía aportada. | Solicitado por Alejo; imágenes generadas, revisión de parecido pendiente. |
| DEC-04 | Cuatro destinos: Proyectos, Sobre mí, Trayectoria y Contacto. | Base de organización usada en el kit y el plan existente. |
| DEC-05 | FoxMind como caso principal. | Prioridad de la preparación existente; material del caso todavía incompleto. |
| DEC-06 | Código a cargo del agente de Alejo; documentación y planificación en este trabajo. | Instrucción actual de Alejo. |
| DEC-07 | Menú directo y destinos abren el mismo contenido; CV y contacto disponibles desde el inicio. | Requisito de la especificación base, coherente con el objetivo profesional. |
| DEC-08 | Un clic o toque abre una sección inmediatamente. El movimiento manual es opcional. | Antecedente: propuesta base sin aprobación final específica, sustituida por la instrucción de DEC-26. Se conserva para entender la evolución; no define el comportamiento vigente. |
| DEC-09 | Flechas/WASD controlan el avatar solo con el mapa activado y enfocado; Enter/E interactúan cerca de un destino. | Propuesta base; el detalle de foco y estados está en 02. |
| DEC-10 | Contacto inicial mediante correo y enlaces profesionales; dos motivos de consulta. | Propuesta base derivada del contenido preparado. |
| DEC-11 | Sonido inicialmente desactivado, movimiento reducible y señales de visita sin bloqueos. | Requisitos de la especificación base. |
| DEC-12 | Una escena, un idioma inicial y contenido editable separado de la presentación. | Alcance propuesto para la primera versión. |
| DEC-13 | Ficha de proyecto integrada en el campamento, con una superficie de lectura propia y el paisaje como contexto. | Elección explícita de Alejo. Confirma el concepto de la ficha; no equivale a aprobar las cuatro maquetas ni el resto de las propuestas de interacción. |
| DEC-14 | Mantener la proporción general entre ficha y campamento presentada en las maquetas. | Aprobada por Alejo. La aceptación no fija medidas CSS exactas; la revisión 2 aporta la referencia visual adoptada para la distribución móvil. |
| DEC-15 | Emblema de carpa y montaña en la cabecera y nombre completo una sola vez en la presentación. | Solución gráfica adoptada por Alejo al aceptar la revisión 2. Resuelve la repetición señalada; su función de regreso al campamento se especifica en 02. |
| DEC-16 | Cabecera móvil compacta con emblema, Contacto, CV y Menú; presentación y ficha ajustadas al formato vertical. | Composición de la revisión 2 adoptada como referencia visual. El desplegable, el foco, los estados y las medidas adaptables siguen siendo especificaciones de implementación, sin QA ejecutada. |
| DEC-17 | Avanzar al contenido profesional y los casos del portfolio. | Alejo pidió pasar al siguiente hito tras aceptar la revisión visual. El hito 08 continúa el plan de preparación; ese avance no confirma textos, datos actuales ni evidencias de proyectos. |
| DEC-18 | Priorizar desarrollo full stack, análisis y automatización/IA; ofrecer desarrollo a medida y servicios relacionados. | Confirmado por Alejo el 29/10/2026. También expresó interés por Tech Lead, Product Owner y roles afines; se registra como apertura laboral, no como experiencia ni seniority demostrados. La agrupación y los alcances concretos de servicios son redacción editorial para revisar. |
| DEC-19 | FoxMind está actualmente en una etapa previa a pruebas piloto. | Confirmado por Alejo el 29/10/2026. El aporte general y la presentación mediante capturas seleccionadas se precisaron posteriormente en DEC-23/24. |
| DEC-20 | Desarrollar como segundo caso el sistema de control de stock y facturación con conexión a ARCA. | Selección editorial de Alejo el 29/10/2026. La identificación del cliente, el título editorial, la participación y la función general de ARCA se precisaron en el seguimiento registrado en DEC-21. |
| DEC-21 | Presentar el segundo caso como «Sistema de stock y facturación para Flower». | Alejo confirmó en el seguimiento del 29/10/2026 que Flower es la librería cliente, que el sistema no tiene nombre propio, que trabajó solo y desarrolló el proyecto completo, y que la conexión con ARCA realiza la facturación automática de las ventas. Las tecnologías y el funcionamiento en producción quedaron confirmados posteriormente en DEC-22. |
| DEC-22 | Incorporar React, Node.js y PostgreSQL y el estado «En producción» al caso Flower. | Alejo confirmó el 29/10/2026 que utilizó esas tecnologías y que el sistema está funcionando en producción, en respuesta al seguimiento sobre uso y entorno de la conexión con ARCA. Se registra como declaración de uso real, sin pruebas independientes. La base descriptiva del caso está completa; falta evidencia real para montarlo y publicarlo. |
| DEC-23 | Presentar a Alejo como cofundador y responsable del desarrollo de FoxMind, incluida la integración de IA. | Alejo confirmó el 29/10/2026 que, hasta el momento, se encargó del desarrollo completo de FoxMind hasta la integración de IA. El aporte general queda resuelto; se conserva la cofundación declarada en el CV y el estado prepiloto. Esta responsabilidad no implica ausencia de equipo ni producto final sin pendientes. |
| DEC-24 | Mostrar FoxMind mediante algunas capturas elegidas por Alejo y una descripción general. | Alejo indicó el 29/10/2026 que el proyecto no es abierto y que solo puede mostrar algunas capturas. Esa selección constituye la estrategia de presentación y puede cubrir la evidencia mínima del caso. Código, repositorio, demo pública y demostraciones funcionales no se requieren ni se incorporan como próximos pedidos. |
| DEC-25 | Avanzar al hito 09 de experiencia e interacciones para preparar el traspaso. | Alejo dio conformidad al enfoque de presentación de los casos y pidió el siguiente hito el 29/10/2026. Se prepara una propuesta de comportamiento basada en 02; el avance no aprueba por extensión controles nuevos, todos los textos ni pruebas. P3 conserva materiales y revisión final pendientes. |
| DEC-26 | Permitir caminar manualmente como en un juego y, al elegir una sección con clic, hacer que el personaje vaya caminando y la abra recién al llegar. | Instrucción explícita de Alejo del 29/10/2026. Sustituye la apertura inmediata general de DEC-08. Confirma ese núcleo de interacción; duración, reglas de cancelación, excepciones, controles táctiles y demás precisiones de 02/09 siguen siendo propuestas para concretarlo, sin aprobación global ni pruebas ejecutadas. |
| DEC-27 | Avanzar al hito 10 para definir el mapa jugable del campamento. | Alejo pidió el próximo hito el 29/10/2026 después de revisar la caminata y apertura al llegar. Autoriza continuar su preparación; no aprueba por extensión cada regla del hito 09 ni las nuevas posiciones, huellas o rutas de 10. El mapa se presenta como propuesta; implementación y comprobaciones pendientes. |
| DEC-28 | Adoptar la distribución del hito 10 como mapa base del portfolio. | Alejo respondió «Sí, me cierra bien» el 29/10/2026 a la propuesta de claro central con el personaje en el centro, taller protagonista y los otros tres destinos alrededor. Las láminas de escritorio y móvil 0.1 quedan como referencia de esa organización. La revisión de distribución queda resuelta; coordenadas, huellas y holguras se ajustan durante la integración. No confirma por extensión los controles de 09, tiempos medidos, pruebas ni publicación. |
| DEC-29 | Consolidar la entrega para el agente de desarrollo. | Alejo pidió avanzar con ese próximo paso el 29/10/2026, después de adoptar el mapa base. Se prepara el Dossier 1.0, con Plan 1.13, alcance, E1–E4 y pendientes asignados. Registra autorización para completar el traspaso documental, sin atribuir aprobación individual a las recomendaciones, entrega efectiva a un agente, pruebas o publicación. |

Las reglas complementarias de 02/09 son la base recomendada para construir la primera implementación de revisión. Conservan su condición de propuesta y no obligan a consultar cada control antes de empezar. El agente resuelve los ajustes rutinarios y registra cambios materiales que afecten las decisiones elegidas; no debe deducirlos de una ilustración o de una limitación del motor. El encargo operativo está en [06](06_INSTRUCCIONES_PARA_AGENTE.md).

### Alcance de la caminata elegida · DEC-26

La navegación combina exploración manual y elección de destino con recorrido automático. La propuesta detallada de 02/09 aplica el recorrido a la selección de una sección desde objetos, rótulos, menú, navegación y acciones de la presentación. Si se elige otra sección durante la lectura, muestra el campamento, camina al destino y abre al llegar; elegir la misma sección conserva la vista. Abrir una tarjeta de proyecto, volver a la lista, volver al campamento, usar Atrás del navegador, obtener el CV o activar un enlace externo son acciones inmediatas.

Como reglas complementarias propuestas, **Abrir ahora** permite resolver el destino sin esperar y **Cancelar recorrido** recupera la vista de origen. Con movimiento reducido, durante la carga o ante un fallo de escena, se abre directamente el contenido. Se propone un objetivo de recorrido automático de **1–2 segundos**, excepcionalmente hasta **3 segundos**, a revisar con la composición y medir en la implementación; no es una medida ya comprobada ni justifica atravesar obstáculos.

En escritorio, el control manual solo procesa teclas con la escena enfocada. La caminata automática no exige conservar ese foco, de modo que la navegación y sus controles siguen disponibles. En móvil se propone tocar destinos para ir y abrir al llegar, y tocar suelo transitable para caminar a un punto sin abrir contenido, sin joystick. Al ocultarse la pestaña, un recorrido automático se pausa y requiere **Continuar recorrido** para reanudarse. Estas reglas concretan la dirección elegida; tiempos y control táctil se mantienen como propuesta utilizable. La distribución base está adoptada en DEC-28; su geometría se ajusta y comprueba durante la integración.

### Distribución base adoptada · Hito 10 / DEC-28

El [hito 10](10_HITO_MAPA_JUGABLE.md) concreta un claro central con cuatro ramales: taller arriba a la derecha, carpa a la izquierda, bitácora abajo a la izquierda y radio abajo a la derecha. El avatar comienza en el cruce central, orientado hacia el taller. Contacto queda en el claro derecho del mismo margen accesible; no requiere añadir ni cruzar un puente. Alejo adoptó esta organización como mapa base mediante DEC-28. Las láminas 0.1 de escritorio y móvil identifican la distribución elegida; sus medidas y huellas son referencias de integración.

Los [esquemas y datos de mapa](maps/README.md) usan marcos propios del área jugable: 1000 × 650 para escritorio y 600 × 760 para móvil. No son píxeles CSS, medidas de dispositivo ni los lienzos históricos de `world-layout.json`. La geometría expresa intención de composición y conectividad; debe alinearse con el terreno ilustrado, las huellas de los objetos y el apoyo del avatar en la integración. La revisión geométrica documental no prueba las colisiones ni los tiempos de una aplicación. Ajustar coordenadas, separación entre objetos y puntos de llegada para encajar el terreno y la escala del avatar corresponde al agente, conservando esta organización. Solo una alteración material de la distribución requiere volver a diseño.

### Alcance de la dirección visual adoptada

La ficha conserva el lenguaje del campamento: superficie crema, detalles pixel y paisaje visible alrededor o en una franja de contexto. DEC-14 confirma la proporción general presentada: una superficie amplia en escritorio y casi todo el ancho disponible en móvil. La revisión 2 conserva esos anchos y establece la referencia adoptada para la cabecera y el reparto vertical móvil. La referencia del orden del 80 % del ancho útil en escritorio sigue siendo orientativa; la aprobación visual no convierte una medida deducida del PNG en una dimensión CSS obligatoria.

El menú, el CV y el contacto permanecen disponibles, y el fondo queda en reposo mientras se lee. La cabecera móvil adoptada mantiene Contacto y CV visibles, también al abrir una ficha. La integración visual no exige que el texto se dibuje dentro del mundo: el contenido se presenta en HTML legible. Estos comportamientos se comprobarán en la implementación.

La dirección visual se concreta en cuatro maquetas de la revisión 2: inicio de escritorio, ficha integrada de FoxMind de escritorio, inicio móvil y ficha integrada móvil. El estado de las piezas vigentes y sus revisiones se registra en [07_HITO_PANTALLAS_PRINCIPALES.md](07_HITO_PANTALLAS_PRINCIPALES.md), con las piezas en `mockups/`. Después de pedir la corrección del nombre y de la distribución móvil, Alejo aceptó el emblema y la nueva cabecera y pidió pasar al siguiente hito. Esa dirección queda adoptada como referencia; la confirmación individual del parecido del avatar, la revisión editorial y la comprobación funcional conservan sus estados propios.

La cabecera adoptada utiliza un pequeño emblema de montaña y carpa como acceso al campamento. El nombre completo aparece una sola vez en la presentación inicial. En escritorio se conservan los cuatro enlaces visibles y el CV. En móvil, la referencia muestra una fila con emblema a la izquierda y **Contacto · CV · Menú** a la derecha. Se especifica que Menú despliegue Proyectos, Sobre mí, Trayectoria y Contacto dentro del flujo de la página, con accesos equivalentes a los cuatro destinos del mundo. El detalle de apertura, cierre, foco y adaptación está en [02_EXPERIENCIA_Y_PANTALLAS.md](02_EXPERIENCIA_Y_PANTALLAS.md); la aceptación visual no demuestra que esos estados funcionen.

Para el inicio se presentó una **propuesta editorial** con **Ver proyectos** como acción principal y **Contactar** como secundaria. **Explorar** pasa a una ayuda o acción del mapa. Esa jerarquía sigue como propuesta editorial y se revisa dentro de los recorridos del [hito 09](09_HITO_EXPERIENCIA_E_INTERACCIONES.md), usando los textos preparados en [08](08_HITO_CONTENIDO_PROFESIONAL.md), sin reabrir la dirección visual adoptada.

## 2. Visitantes y recorridos principales

Un reclutador necesita identificar el perfil profesional, ver el trabajo, consultar la trayectoria y obtener el CV o un canal de contacto. Un posible cliente necesita entender qué problemas puede ayudar a resolver Alejo, revisar un caso y consultar por su proyecto. Una persona que disfruta de la propuesta visual puede recorrer el campamento sin que eso sea condición para acceder a la información.

La experiencia debe cubrir tres recorridos de principio a fin:

1. **Empleo:** inicio → proyecto → trayectoria o CV → contacto laboral.
2. **Cliente:** inicio → proyecto → aporte y resultado → consulta por un proyecto.
3. **Exploración:** inicio → mapa → destino → sección → regreso al campamento.

## 3. Alcance de la primera versión

Incluye una escena con cuatro destinos, un avatar, secciones de lectura, fichas de proyecto, descarga del CV, contacto por correo, enlaces profesionales, adaptación a celular, navegación por teclado y ambientación. El audio forma parte de la implementación propuesta de la primera versión; escucharlo es voluntario y comienza desactivado. El idioma inicial es español, con tono cercano y profesional.

El trabajo editorial prioriza FoxMind y, como segundo caso seleccionado, el **Sistema de stock y facturación para Flower**. Flower es la librería cliente; el software no tiene nombre propio. Alejo desarrolló el proyecto completo de manera individual con React, Node.js y PostgreSQL. Confirmó que está funcionando en producción y que la conexión con ARCA automatiza la facturación de las ventas. La base descriptiva de Flower está completa; falta incorporar evidencia real. Un tercer caso es opcional y puede incorporarse después. La cantidad publicada depende de la disponibilidad de casos completos. Una primera publicación puede mostrar un solo caso completo entre los priorizados, con evidencia real. FoxMind conserva prioridad cuando esté listo; su ausencia no impide preparar la publicación de Flower si está completo. No se fabrican tarjetas ni resultados para llegar a una cantidad fija.

La base narrativa de FoxMind recoge el aporte general confirmado: Alejo es cofundador y se ha encargado del desarrollo completo, incluida la integración de IA. El proyecto sigue previo a pruebas piloto. Su ficha combinará una descripción educativa general con las capturas que Alejo elija compartir; basta ese formato para documentar el caso, sin acceso público al código ni al producto. Al recibir las imágenes se preparará un pie breve con el contexto o la versión que representan.

El foco profesional confirmado es desarrollo full stack, análisis y automatización/IA. La oferta general comprende trabajo a medida y servicios relacionados. Para explicarla se proponen cuatro grupos: desarrollo a medida, análisis y definición de producto, automatización e integraciones, e IA aplicada. Las responsabilidades de Tech Lead o Product Owner se presentan como intereses laborales; los casos y la trayectoria deben sustentar cualquier afirmación sobre experiencia de liderazgo o producto.

La primera versión no requiere cuentas, base de datos, pagos, chat con IA, un sistema de misiones ni un formulario que almacene mensajes. Son ampliaciones posibles solo si Alejo las solicita. La decisión del framework, motor gráfico y alojamiento queda al agente de desarrollo, con justificación según este alcance.

## 4. Requisitos de producto

| ID | Requisito previsto | Resultado observable |
|---|---|---|
| R-01 | Presentación profesional visible al entrar, sin duplicar el nombre en la cabecera. | Se identifica a Alejo, su área de trabajo y cómo ver proyectos o contactar; la cabecera conserva un acceso claro al campamento. |
| R-02 | Selección directa de cualquiera de las cuatro secciones, con recorrido automático según DEC-26. | El visitante puede elegir el destino sin controlar manualmente al avatar; este camina y abre al llegar. La propuesta incorpora Abrir ahora y apertura directa con movimiento reducido, carga o fallo de escena. |
| R-03 | Destinos identificables y activables. | Cada objeto tiene rótulo; clic, toque o activación del control correspondiente seleccionan su sección y respetan el flujo de llegada. Una ruta anterior cancelada no abre contenido después. |
| R-04 | Lectura y regreso consistentes, con ficha integrada y proporción general aprobadas en DEC-13/14. | Superficie de lectura con título, regreso visible y paisaje de contexto; menú, Contacto y CV siguen disponibles. La propuesta distingue selección de otra sección con recorrido, subacciones y regresos inmediatos, y cancelación que restaura la vista de origen. |
| R-05 | Casos de proyecto con información real. | Cada caso publicado explica el problema u objetivo documentado, aporte de Alejo, estado y evidencia real. Decisiones, herramientas, aprendizajes y enlaces se agregan cuando existe material suficiente y están dentro del alcance público del caso. |
| R-06 | Perfil y trayectoria revisados. | Estudios, experiencia y reconocimiento se muestran con fechas y estados confirmados. |
| R-07 | Contacto diferenciado. | Empleo y consulta de proyecto tienen acciones claras; correo y enlaces pueden usarse directamente. |
| R-08 | CV descargable. | El enlace entrega el PDF que Alejo haya elegido publicar. |
| R-09 | Avatar con caminata manual y recorrido automático a destinos. | Puede explorarse con controles explícitos y rutas válidas. El teclado manual actúa solo en la escena enfocada; la ruta automática permite usar la interfaz, redirigir, cancelar u omitir el recorrido sin aperturas atrasadas. |
| R-10 | Experiencia usable en celular. | Secciones legibles y destinos accesibles mediante toque o menú, con caminata automática y apertura al llegar. El toque en suelo para caminar sin abrir contenido es una propuesta; conserva scroll y zoom y no exige joystick ni teclado físico. |
| R-11 | Control de sonido y movimiento. | El sonido no se inicia solo; las animaciones se pueden reducir y no condicionan tareas. |
| R-12 | Degradación de la escena. | Si el arte o la animación falla, siguen disponibles presentación, navegación, contenido, contacto y CV. |
| R-13 | Información identificable al compartir. | Título, descripción y portada corresponden al portfolio y no anuncian capacidades inexistentes. |
| R-14 | Actualización editorial sencilla. | Es posible cambiar textos, enlaces, proyectos y CV sin rediseñar el campamento. |

Estos son requisitos de la propuesta de producto. Su verificación futura se detalla en [05_ENTREGAS_Y_ACEPTACION.md](05_ENTREGAS_Y_ACEPTACION.md); no se registran como superados hasta tener evidencia de la web.

### Correspondencia con la aceptación

| Requisitos | Comprobaciones asociadas |
|---|---|
| R-01 a R-04 | AC-01 a AC-08, AC-16 y las comprobaciones de recorrido AC-26 a AC-30. |
| R-05 y R-06 | AC-18. |
| R-07 y R-08 | AC-19 y AC-20. |
| R-09 | AC-09 a AC-13 y AC-26 a AC-30. |
| R-10 | AC-14 y AC-16. |
| R-11 | AC-15 y AC-17. |
| R-12 | AC-21 y AC-22. |
| R-13 | AC-23. |
| R-14 | AC-24. |

AC-25 corresponde a la verificación posterior a la publicación. Su estado permanece pendiente mientras no exista una URL pública para esa versión.

## 5. Reglas de calidad

La presentación y el menú deben estar disponibles sin esperar a que se descarguen todas las imágenes o el audio. El texto principal debe poder leerse, seleccionarse y ampliarse, con una superficie estable detrás de los párrafos. El paisaje aporta contexto; el contenido no depende de reconocer un objeto pequeño o de acertar sobre un píxel.

El agente comprobará carga y fluidez en dispositivos que identifique en su entrega. Este dossier no fija una puntuación o una latencia como si ya estuviera medida. Los pesos de los PNG maestros son datos del kit, no un presupuesto aprobado para la primera carga del sitio. Las exportaciones para web se diseñan y miden durante la implementación.

Las mejoras de ambientación no deben bloquear las tareas profesionales. Los controles conservan el estado previsto al abrir y cerrar una sección. La caminata manual se detiene al perder el foco de la escena; la automática no depende de ese foco y sigue las reglas de pausa, cancelación y omisión de 02. El estado visible informa el destino elegido sin ocultar los accesos profesionales.

## 6. Decisiones técnicas que corresponden al agente de desarrollo

El agente elige la estructura del código, herramientas de construcción, mecanismo de dibujo y animación, representación de colisiones, rutas, exportaciones de imágenes y estrategia de carga. Debe explicar las decisiones que cambien costos, mantenimiento o comportamiento visible.

Un cambio de posición para que un edificio no tape otro es un ajuste de integración. Sustituir la caminata elegida en DEC-26 por apertura inmediata generalizada, exigir exploración manual para ver información, reemplazar el campamento por otra estética o añadir cuentas modifica el producto y debe volver a la planificación. Las excepciones explícitas de 02 permiten acceso inmediato sin eliminar el flujo principal elegido.

## 7. Pendientes para cerrar el producto

| ID | Pendiente | Quién aporta o decide | Qué condiciona |
|---|---|---|---|
| AB-01 | Revisión del parecido del personaje y de su escala en la escena. | Alejo, sobre una propuesta visual. | Cierre visual del avatar; no impide armar la estructura. |
| AB-02 | Implementar y revisar la base recomendada de 02/09: tiempos, control táctil y reglas complementarias. La dirección de DEC-26 y la distribución de DEC-28 se conservan. | Agente de desarrollo; Alejo revisa la versión concreta. | E2/E3: integración y comprobación de la experiencia. No bloquea E1 ni requiere otra aprobación del mapa o de cada coordenada. |
| AB-03 | Modalidad, disponibilidad y alcances concretos de servicios. El foco y la oferta general ya están confirmados en DEC-18. | Alejo. | Ajuste final de presentación y contacto. |
| AB-04 | Incorporar las capturas de FoxMind seleccionadas por Alejo y un pie breve con su contexto o versión. Aporte general y estado prepiloto confirmados en DEC-19/23; presentación acotada definida en DEC-24. | Alejo, cuando disponga de las imágenes elegidas. | Montaje del caso principal. Las capturas seleccionadas pueden cubrir su evidencia; no se requiere código, repositorio ni demo. |
| AB-05 | Incorporar capturas o evidencia real del Sistema de stock y facturación para Flower. Base descriptiva completa, incluidas tecnologías y funcionamiento en producción, según DEC-21/22. Período, decisiones, métricas y enlaces son ampliaciones opcionales. | Alejo, cuando tenga el material. | Montaje y publicación del segundo caso; el tercer caso sigue siendo opcional. |
| AB-06 | Uso opcional de la identidad FoxMind/Foxy, si forma parte del material disponible para la presentación seleccionada. | Material que Alejo comparta. | Decisión de presentación; no requiere archivos adicionales ni bloquea el caso. |
| AB-07 | CV y datos definitivos para publicación. | Alejo. | Revisión editorial final. |
| AB-08 | Dirección pública y alojamiento. | Alejo con propuesta del agente de desarrollo. | Publicación. |
| AB-09 | Revisar Ver proyectos / Contactar como orden editorial propuesto para el inicio. | Alejo sobre E1; esta colaboración registra ajustes. | Revisión durante el desarrollo. Se usa la propuesta actual para iniciar; la cabecera y la distribución móvil adoptadas se conservan. |

El [registro CT de 04](04_CONTENIDO_Y_PENDIENTES.md) precisa responsable, momento y tratamiento de faltantes editoriales; [06](06_INSTRUCCIONES_PARA_AGENTE.md) los conecta con E1–E4. Los pendientes anteriores no forman una lista de requisitos previos para comenzar E1. No se asignan plazos ni costos sin una estimación de implementación.

## Fuentes de esta especificación

El pedido de Alejo de consolidar la entrega para su agente se registra en DEC-29 y da lugar al Dossier 1.0. El pedido anterior de avanzar al próximo hito se registra en DEC-27. Su respuesta «Sí, me cierra bien» a la distribución presentada se registra en DEC-28. El [hito 10](10_HITO_MAPA_JUGABLE.md) y la [documentación de mapas](maps/README.md) identifican la organización adoptada y la geometría de referencia ajustable.

Instrucciones de Alejo en esta conversación, incluidas las confirmaciones profesionales, los **seguimientos sobre Flower y FoxMind del 29/10/2026** y su **elección de caminar y abrir las secciones al llegar del 29/10/2026**; [alcance del kit](../portfolio-campamento/docs/ALCANCE_Y_USO.md); [datos editoriales de trabajo actualizados](content/portfolio.es.json); [borrador histórico del kit](../portfolio-campamento/content/portfolio.es.json); [material pendiente](../portfolio-campamento/docs/CONTENIDO_PENDIENTE.md). DEC-13/14 registran las elecciones sobre ficha y proporción; DEC-15/16, la dirección visual; DEC-17, el avance de hito; DEC-18 a DEC-20, foco profesional, estado de FoxMind y segundo caso; DEC-21/22, los datos descriptivos de Flower; DEC-23/24, desarrollo completo de FoxMind incluida IA y presentación mediante capturas seleccionadas. DEC-25 registra el avance a experiencia; DEC-26, el núcleo de navegación elegido. Los datos de trabajo no constituyen una web implementada ni una verificación independiente de prestaciones técnicas.

## Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 0.13 | 29/10/2026 | DEC-29 registra la consolidación del Dossier 1.0 para iniciar desarrollo de revisión. Se asignan pendientes a las entregas y se distingue la base recomendada de una aprobación individual. Mínimo publicable un caso completo y plantilla de casos limitada al objetivo documentado y al alcance público. |
| 0.12 | 29/10/2026 | DEC-28 adopta la distribución del mapa base. La revisión espacial queda resuelta; coordenadas, huellas y holguras se asignan a integración, sin aprobación global de controles, QA ni publicación. AB-02 conserva solo los detalles y comprobaciones restantes. |
| 0.11 | 29/10/2026 | DEC-27 registra el avance a mapa jugable. Se incorpora la propuesta de distribución y marcos de coordenadas de 10, junto con sus límites y el pendiente AB-02 actualizado. La aceptación de posiciones, integración, reglas de 09 y P3 conservan sus pendientes. |
| 0.10 | 29/10/2026 | DEC-26 incorpora caminata manual y selección de sección con recorrido automático y apertura al llegar; DEC-08 queda como antecedente sustituido. Se actualizan requisitos, AB-02 y referencias de verificación. Tiempos, mapa, control táctil y reglas complementarias siguen como propuesta; contenido y pruebas conservan sus pendientes. |
| 0.9 | 29/10/2026 | DEC-25 registra conformidad con el enfoque de presentación y avance al hito 09. Propuesta de interacción para revisar dentro de P4; AB-02/09 vinculados a los recorridos. Capturas y revisión editorial siguen pendientes. |
| 0.8 | 29/10/2026 | Alejo confirmó su responsabilidad por el desarrollo completo de FoxMind, incluida la integración de IA, y limitó su exhibición a algunas capturas. DEC-23/24 y AB-04 registran el aporte resuelto y la presentación acotada; capturas y pies de contexto pendientes. La base narrativa de ambos casos está preparada y P3 sigue abierto. |
| 0.7 | 29/10/2026 | Alejo confirmó React, Node.js y PostgreSQL y funcionamiento en producción del sistema para Flower. Se incorpora DEC-22, se completa su base descriptiva y se actualiza AB-05: evidencia real pendiente; período, decisiones, métricas y enlaces opcionales. P3 continúa abierto. |
| 0.6 | 29/10/2026 | Seguimiento de Alejo: Flower es la librería cliente y el sistema carece de nombre propio; desarrollo completo individual y facturación automática de las ventas mediante ARCA confirmados. DEC-21 y AB-05 actualizados. Tecnologías, uso, entorno y evidencia pendientes. |
| 0.5 | 29/10/2026 | Foco full stack, análisis y automatización/IA confirmado; apertura a Tech Lead/PO diferenciada de experiencia acreditada. FoxMind prepiloto confirmado y capturas diferidas. Sistema de stock/facturación con conexión a ARCA seleccionado como segundo caso; detalles y evidencia pendientes. |
| 0.4 | 29/10/2026 | Emblema, nombre una vez en la presentación y cabecera móvil de la revisión 2 adoptados como referencia visual. Inicio del hito 08 de contenido profesional. Se mantienen separados los pendientes editoriales, de parecido del avatar y de implementación; sin QA ni autorización de publicación. |
| 0.3 | 29/10/2026 | Registro de DEC-14/15: proporción general de ficha aprobada y corrección de la repetición del nombre solicitada. DEC-16 propone cabecera compacta móvil con Contacto, CV y Menú visibles. La solución concreta y las demás decisiones continúan en revisión; sin QA de aplicación. |
| 0.2 | 29/10/2026 | Incorporación de DEC-13, alcance de la revisión de cuatro maquetas y jerarquía de acciones del inicio como propuesta editorial. Sin cierre de pantallas, aprobación visual final ni QA ejecutada. |
