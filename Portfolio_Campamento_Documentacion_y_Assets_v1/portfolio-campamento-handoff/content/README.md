# Contenido editorial de trabajo

[portfolio.es.json](portfolio.es.json) es el **borrador estructurado actualizado y preferente**, revisión editorial 1.8 y esquema 1.8.0, para preparar el contenido del portfolio. Conserva DEC-26 en el Hito 09 —caminata manual y selección de sección con desplazamiento automático y apertura al llegar— e incorpora la distribución base del Hito 10 de mapa jugable adoptada mediante DEC-28. Conserva las confirmaciones profesionales, los casos y sus límites de publicación. El [JSON del kit original](../../portfolio-campamento/content/portfolio.es.json) se conserva como fuente histórica, sin cambios.

Este archivo contiene datos, textos propuestos y pendientes para el agente de desarrollo. No es una implementación, una publicación ni una validación funcional de los proyectos descritos.

## Uso en el Dossier 1.0

La entrega consolidada permite iniciar **E1 · Navegación profesional** con estos datos de trabajo. Las confirmaciones conservan su alcance; los textos editoriales y detalles de interacción todavía propuestos sirven como base de la versión de revisión, sin convertirse en aprobaciones globales. El [encargo del agente](../06_INSTRUCCIONES_PARA_AGENTE.md) y las [entregas y criterios](../05_ENTREGAS_Y_ACEPTACION.md) organizan ese trabajo. No se requiere otro hito de planificación para comenzar.

La [matriz CT-01 a CT-10](../04_CONTENIDO_Y_PENDIENTES.md) asigna responsable, momento y tratamiento de los materiales restantes. Capturas, pies y revisión de cada caso se completan en paralelo y antes de publicarlo. El mínimo de `project_publication_policy` es **un caso completo entre los priorizados**: FoxMind tiene prioridad editorial, pero Flower puede ser el primero si se completa antes. Los casos incompletos, las marcas opcionales no aportadas y los enlaces no confirmados se omiten de la versión pública; no bloquean la construcción de la versión de revisión.

La jerarquía editorial del hero y el parecido individual del avatar se revisan sobre E1/E2 con los materiales existentes. El CV, los datos temporales y los canales que se publiquen conservan su revisión específica. Esta consolidación documental no cambia los hechos ni los estados del JSON, cuya revisión editorial permanece en **1.8**.

## Mapa jugable: distribución base adoptada

**DEC-27** registra el avance a la preparación del [Hito 10 · Mapa jugable](../10_HITO_MAPA_JUGABLE.md). **DEC-28** registra la respuesta posterior de Alejo —«Si me cierra bien»— a la pregunta sobre adoptar la distribución como mapa base. Se adoptan el claro central, la posición central del personaje, el protagonismo del taller y la organización relativa de los cuatro destinos en las referencias de escritorio y celular. La confirmación queda en `user-map-adoption-2026-10-29`; el antecedente de preparación se conserva en `user-map-advance-2026-10-29` y `editorial-map-2026-10-29`.

`map_specification` contiene únicamente metadatos y referencias. Su estado es `base_layout_adopted_geometry_reference`: la distribución base está adoptada; las coordenadas, huellas y radios son referencias ajustables para la integración. El [mapa geométrico](../maps/world-navigation-proposal.json) mantiene un marco propio del área jugable de **1000 × 650 unidades lógicas en escritorio y 600 × 760 en móvil**, excluyendo cabecera, presentación y paisaje lejano. No son píxeles CSS ni posiciones deducidas de las maquetas. El [README del mapa](../maps/README.md) conserva las reglas de interpretación y el [registro geométrico](../maps/geometric-review.json) identifica las comprobaciones estáticas realizadas sobre la geometría que permanece sin cambios.

La base adoptada organiza un claro central con cuatro ramales: taller arriba a la derecha, carpa a la izquierda, bitácora abajo a la izquierda y radio abajo a la derecha. El personaje comienza en el cruce; Contacto tiene acceso desde tierra firme en el mismo margen accesible del río y no exige cruzar un puente. La red orienta recorridos automáticos; el movimiento libre utiliza el suelo válido.

El terreno es una sola ilustración. Las huellas y corredores deben ajustarse a sus claros y senderos, especialmente en móvil; el esquema no permite reordenar las plataformas del PNG por separado. Si una selección inicia una ruta con el mapa fuera de vista, se propone llevar ese bloque al área visible una sola vez, conservando scroll y zoom normales y sin seguimiento continuo de cámara. Con movimiento reducido se abre el contenido directamente. Rótulos y controles mantienen su escala de interfaz.

La comprobación geométrica no acredita alineación con el arte, tiempos reales, jugabilidad, colisiones de una aplicación ni funcionamiento táctil. Esas verificaciones siguen a cargo de la implementación.

Las láminas conservan el rótulo **Propuesta 0.1** para identificar la referencia ahora adoptada. DEC-28 no fija cada medida ni aprueba globalmente los controles de 09. Ajustar las huellas, las llegadas, el encuadre y la escala al terreno pertenece a la integración; solo un cambio material de la organización adoptada requiere volver a diseño. No se solicita una nueva aprobación de la distribución ni de cada coordenada.

## Experiencia e interacciones de referencia

La base general del [Hito 08 · Contenido profesional](../08_HITO_CONTENIDO_PROFESIONAL.md) fue aceptada para continuar. Se mantienen sus confirmaciones y la evidencia gráfica pendiente: avanzar al siguiente hito no equivale a tener las fichas publicables ni ratifica cada redacción propuesta.

**DEC-26 confirma el núcleo de navegación:** Alejo quiere caminar como en un juego y que un clic en una sección haga caminar al personaje hasta ella, abriéndola recién al llegar. Esta dirección reemplaza la propuesta anterior de apertura inmediata como comportamiento normal. La fuente `user-navigation-2026-10-29` conserva el alcance exacto de esa decisión.

El [Hito 09 · Experiencia e interacciones](../09_HITO_EXPERIENCIA_E_INTERACCIONES.md) detalla la propuesta que desarrolla ese núcleo. `interaction_specification.status` utiliza **`core_direction_confirmed_details_proposed`**; la fuente `editorial-interactions-2026-10-29` conserva **`prepared_recommended_proposal`** para los detalles. Las teclas exactas, el control táctil manual, los tiempos, la omisión y cancelación, el cambio de sección desde una ficha y las alternativas ante fallos o movimiento reducido siguen siendo recomendaciones. La jerarquía de CTA del hero permanece como propuesta editorial. Nada de esto acredita implementación o pruebas.

El JSON guarda referencias y un resumen de reglas; 09 y [02 · Experiencia y pantallas](../02_EXPERIENCIA_Y_PANTALLAS.md) contienen los comportamientos completos.

| Aspecto | Propuesta registrada a partir del núcleo confirmado |
|---|---|
| Selección de sección | Objeto, rótulo, menú, navegación y acción de sección seleccionan el destino. El personaje recorre un camino válido y el contenido se abre una sola vez al llegar. Si ya está en el punto de llegada, no se agrega una caminata artificial. |
| Exploración manual | En escritorio, «Explorar el campamento» da foco a la escena; flechas o WASD mueven al avatar solo con foco y movimiento habilitado. Cerca de un destino, Enter o E abre; acercarse por sí solo no abre. |
| Suelo y móvil | Se propone clic o toque breve sobre terreno transitable para caminar al punto y detenerse sin abrir contenido. Tocar un destino realiza el recorrido hasta su sección. Primera versión sin joystick; scroll y zoom no disparan movimiento. Estos controles táctiles todavía no fueron aprobados específicamente. |
| Duración | Objetivo de diseño inicial de 1–2 segundos para rutas automáticas habituales y hasta 3 para las más largas. Se valida con el prototipo y se prioriza un mapa compacto; no son tiempos medidos ni una regla universal. |
| Redirección y omisión | Un destino nuevo reemplaza al anterior desde la posición actual. «Abrir ahora» cancela la ruta y abre el último destino solicitado; «Cancelar recorrido» restaura la vista de origen y conserva la posición actual del avatar. La entrada manual con foco toma el control y cancela la apertura pendiente. |
| Foco y pausa | El movimiento manual necesita foco de escena; el automático puede continuar con el foco en la navegación o sus acciones. Ocultar la pestaña pausa la ruta; al volver se ofrecen «Continuar recorrido», «Abrir ahora» y «Cancelar recorrido». |
| Lectura y cambios de sección | Escena y avatar quedan quietos durante la lectura. Se propone que elegir otra sección muestre el campamento, realice el recorrido y abra el nuevo contenido. Elegir la misma sección conserva la lectura. Abrir un caso y usar los regresos, Atrás, CV, correo o enlaces externos no agrega una caminata. |
| Movimiento reducido y fallos | La escena queda estática y los destinos abren directamente. Si se activa el modo reducido durante una ruta, se resuelve la sección seleccionada. Durante carga, fallo o ruta inviable, el contenido sigue accesible sin esperar al escenario. |
| Menú y ambiente | Menú móvil despliega los cuatro enlaces y después los controles de sonido y movimiento, dentro del flujo y sin agregar otra fila a la cabecera. Elegir sección lo cierra; el foco va al contenido cuando abre. En escritorio, los ajustes permanecen en la interfaz común durante la lectura. |
| Sonido | Apagado al llegar, activación voluntaria y preferencia limitada a la visita. No se pausa por cambiar de sección; sí al ocultarse la pestaña. |
| Historial y visitas | El historial registra vistas de contenido, no cada paso ni rutas canceladas. «Visitado» es una señal cosmética durante la visita y se marca cuando el contenido se abre; no desbloquea nada. |

`ui_copy` incorpora `route_status`, `open_now`, `cancel_route`, `resume_route`, `route_paused`, `route_unavailable` y `ground_walk_status`, y ajusta `explore_hint`. Sus notas distinguen las rutas a una sección de los desplazamientos hacia suelo vacío. Son datos y metadatos de documentación: **no son comportamiento ejecutable ni rutas públicas**.

## Confirmaciones incorporadas

- **Foco profesional:** desarrollo full stack, análisis funcional y automatización/IA.
- **Oferta general:** desarrollo a medida y servicios relacionados. Los cuatro grupos de servicios son una redacción editorial derivada de esa oferta; sus alcances concretos se definen por proyecto.
- **Intereses adicionales:** Tech Lead y Product Owner. Se guardan separados de la experiencia: no acreditan seniority, un cargo ejercido ni dirección de equipos.
- **FoxMind:** mantiene su etapa previa a pruebas piloto. Alejo confirmó que se encargó del **desarrollo completo hasta esta etapa, incluida la integración de IA**. El proyecto no es abierto y puede compartir algunas capturas: la ficha se limitará al resumen general, rol, estado y las imágenes que seleccione. El aporte general está resuelto; quedan las capturas, su contexto breve al aportarlas y la revisión editorial final.
- **Segundo caso:** sistema realizado para la **librería Flower**, sin nombre propio. Alejo trabajó solo y desarrolló el sistema completo con **React, Node.js y PostgreSQL**. Confirmó que está **en producción y funcionando**, y que la conexión con ARCA factura automáticamente las ventas de la librería. La respuesta sobre uso y entorno registra ARCA en producción. El título editorial es **Sistema de stock y facturación para Flower**. Su base editorial está completa; quedan evidencia real y revisión editorial final para publicarlo. Período, contexto adicional, decisiones, aprendizajes y enlaces pueden enriquecer el caso si se aportan; se conservan en `optional_enrichment_fields`.
- **Tercer caso:** opcional y sin seleccionar. Una primera publicación puede incluir un solo caso completo, con prioridad para FoxMind.

Los hechos del CV que no fueron actualizados se conservan con su procedencia y pendientes. La nueva respuesta no confirma ubicación, disponibilidad, progreso académico, continuidad de todos los roles ni funcionamiento de enlaces.

## Interpretar los estados

`confirmed_by_user` identifica una confirmación de Alejo. `reported_by_user` registra una descripción aportada por él. Ambos estados son distintos de una comprobación funcional independiente: `functionally_verified` sigue en `false`. Este valor no anula su confirmación de que Flower está en producción y funcionando ni la de su aporte de desarrollo completo e integración de IA en FoxMind.

El campo general `current_facts_verified` permanece en `false` porque solo hay confirmaciones parciales, identificadas por dato y fuente. No debe usarse ese booleano global para borrar las confirmaciones específicas de FoxMind, Flower o del foco profesional.

En servicios, `general_offer_confirmed: true` registra la oferta general. `service_offerings_confirmed: false` indica que la agrupación editorial y los alcances concretos aún requieren definición; no contradice la oferta general confirmada.

En Flower, el alcance funcional declarado de la conexión con ARCA es **facturar automáticamente las ventas de la librería**. `scope_status: reported_by_user` y su fuente específica conservan esa confirmación. El entorno queda registrado como `production`, con `environment_status: confirmed_by_user`, a partir de la respuesta de Alejo a la consulta sobre uso y entorno. El estado `current_stage: En producción` y el uso real están confirmados y ya no son pendientes. No ampliar esa descripción con operaciones, condiciones o resultados no aportados.

En Flower, `technologies` contiene exactamente React, Node.js y PostgreSQL, con `technologies_status: confirmed_by_user`. `current_technologies_verified: false` solo significa que no se revisó una implementación para comprobarlos de forma independiente. La fuente `user-flower-production-2026-10-29` registra las confirmaciones de tecnologías y producción.

`official_name: null`, junto con `name_status: confirmed_no_proper_name`, significa que el sistema **no tiene nombre propio**, según Alejo. No es un faltante que deba volver a preguntarse. También están resueltos el cliente, el tipo de negocio, el desarrollo integral individual, las tecnologías, el uso actual, el estado en producción y la función y el entorno de la conexión con ARCA.

La fuente `user-foxmind-scope-2026-10-29` registra el desarrollo completo de FoxMind hasta la etapa actual, incluida la integración de IA, y el límite de exhibición. No confirma que Alejo trabajara solo, otros roles o módulos ni funcionamiento en producción. El rol de cofundador conserva la procedencia del CV y el estado sigue siendo previo a pruebas piloto.

En FoxMind, `technologies_from_cv` y `links.website_from_cv` se conservan como referencias históricas internas. No se trasladan las confirmaciones de Flower a FoxMind ni se publican automáticamente esas tecnologías o ese enlace. La política específica del caso prevalece sobre las reglas generales de publicación.

La jerarquía **Ver proyectos / Contactar** sigue como propuesta editorial. El emblema y la cabecera móvil con Contacto, CV y Menú están adoptados como referencia visual; los estados del menú y los tamaños adaptables se implementan y comprueban según [02 · Experiencia y pantallas](../02_EXPERIENCIA_Y_PANTALLAS.md).

## Rutas y bases de referencia

Todas las bases de `meta.path_bases` se resuelven **desde la carpeta que contiene este JSON**. Son referencias a archivos del paquete, no URLs públicas.

| Base | Valor | Significado |
|---|---|---|
| `this_directory` | `.` | Esta carpeta `portfolio-campamento-handoff/content/`. |
| `original_kit` | `../../portfolio-campamento` | Kit original, carpeta hermana del dossier. |
| `handoff` | `..` | Raíz de `portfolio-campamento-handoff/`. |

Las rutas heredadas de retrato, avatar, monograma, destinos y CV siguen referidas a la raíz del kit original. Se declararon sus bases sin cambiar los valores de esos recursos. Por ejemplo, el CV conserva `content/cv-alejo-palavecino-es.pdf` con `path_base: original_kit`.

El nuevo emblema utiliza `assets/brand/camp-emblem-master.png` con `path_base: handoff`. Una base explícita dentro de un objeto prevalece sobre la base general de su sección. Por eso el emblema no se busca en el kit original, aunque otros recursos de identidad sí provengan de allí.

El antiguo nombre de base `package_root` se identifica en los metadatos como alias de `original_kit`; el registro del CV ya utiliza el nombre explícito. El agente resolverá estas referencias y mapeará los derivados a las rutas públicas que adopte. Los destinos `#campamento`, `#proyectos`, `#sobre-mi`, `#trayectoria` y `#contacto` son identificadores de intención de navegación, pendientes de conectar en la implementación.

## Reglas de uso del contenido

El nombre completo se representa una vez en la presentación inicial, usando `hero.name`. `hero.eyebrow` está vacío y desactivado para evitar su repetición; la cabecera utiliza el emblema y no una marca textual con el nombre.

No renderizar notas internas, fuentes, estados internos de revisión, listas de pendientes, valores `null` ni campos vacíos como texto del sitio. Los casos incompletos pueden revisarse en documentación o en una vista interna identificada, pero se excluyen de la versión pública. Las reservas de capturas de las maquetas no son evidencia real.

### Texto propuesto de FoxMind

La ficha breve utiliza los campos incluidos en `editorial_copy_fields`. El rol conserva su fuente en el CV; el aporte y la etapa tienen sus confirmaciones específicas.

| Campo | Texto propuesto |
|---|---|
| `title` | FoxMind |
| `category` | Tecnología educativa |
| `summary` | Plataforma educativa orientada a personalizar el aprendizaje y apoyar el trabajo docente. Actualmente se encuentra en la etapa previa a pruebas piloto. |
| `role` | Cofundador y responsable del desarrollo |
| `problem`, presentado como «Objetivo del proyecto» | El proyecto busca acompañar distintos ritmos de aprendizaje y abordar parte de la carga operativa del trabajo docente. |
| `my_contribution` | Me encargué del desarrollo completo de FoxMind hasta esta etapa, incluida la integración de IA. |
| `current_stage` | Etapa previa a pruebas piloto |

### Material y notas de trabajo de FoxMind

`publication_policy` limita la ficha al contenido general anterior y las capturas seleccionadas por Alejo. `evidence_policy.mode: screenshots_only` admite esas imágenes como evidencia del caso, con un pie breve y contexto de la versión cuando las aporte. Si se utiliza una portada, se toma de esa misma selección.

El sitio histórico del CV no se convierte en un enlace público de la ficha. No se requieren repositorio, código, demo, arquitectura ni detalles de modelos, y no se buscan materiales externos para ampliar lo que Alejo decidió mostrar. Tampoco se vuelve a pedir el aporte general o la confirmación del stack como requisito para preparar el caso.

`editorial_base_status: prepared` y `confirmed_scope_status: confirmed_by_user` reflejan que la base editorial está preparada y el alcance confirmado. `public_ready` permanece en `false` mientras se reciben las capturas. Los únicos pendientes son **capturas seleccionadas**, **sus pies y contexto de versión al aportarlas** y **revisión editorial final**. Las notas, fuentes y estados internos no se muestran en la ficha.

### Texto propuesto del caso Flower

Los campos incluidos en `editorial_copy_fields` son la redacción destinada a revisión para el portfolio:

| Campo | Texto propuesto |
|---|---|
| `title` | Sistema de stock y facturación para Flower |
| `summary` | Sistema de control de stock y facturación para la librería Flower, desarrollado de forma individual con React, Node.js y PostgreSQL. Está en producción y la conexión con ARCA factura automáticamente las ventas de la librería. |
| `role` | Desarrollo integral individual |
| `problem`, presentado como «Objetivo del sistema» | Control de stock y facturación de ventas para la librería Flower |
| `my_contribution` | Desarrollé el sistema completo de forma individual. |
| `technologies` | React, Node.js, PostgreSQL |
| `current_stage` | En producción |

El estado público del proyecto (`current_stage`) sí forma parte de la ficha y puede mostrarse como la etiqueta «En producción».

### Notas de trabajo del caso Flower

`internal_notes`, `pending_fields`, las fuentes y los estados internos de revisión son documentación para el agente. No forman parte de los textos anteriores. La información confirmada puede incorporarse a la redacción sin presentar la verificación funcional independiente como realizada.

`editorial_base_status: complete` y `core_facts_status: confirmed_by_user` indican que la base del caso está resuelta. `public_ready` continúa en `false` hasta incorporar **evidencia real** y realizar la **revisión editorial final**; esos son los únicos elementos de `pending_fields`. Los enriquecimientos opcionales no vuelven a abrir los datos esenciales ya confirmados.

El campo heredado `problem` contiene un objetivo editorial del alcance confirmado y se presenta con `problem_display_label: Objetivo del sistema`. No describe un dolor previo ni presupone que la librería trabajaba manualmente.

### Otras reglas de presentación

`close_panel` es un campo heredado: no reemplaza los regresos de las fichas. Para el desplegable móvil se define `close_mobile_menu`; las fichas utilizan los regresos explícitos a Proyectos o al campamento. Las prioridades de teclado se consultan en 02.

Para completar y adoptar la redacción, usar [04 · Contenido y pendientes](../04_CONTENIDO_Y_PENDIENTES.md) y [08 · Hito de contenido profesional](../08_HITO_CONTENIDO_PROFESIONAL.md). La transcripción de una competencia del [CV aportado](../../portfolio-campamento/content/cv-alejo-palavecino-es.pdf) no convierte esa competencia en dominio experto ni en un resultado demostrado.

### Alcance de FoxMind en Trayectoria

El límite de presentación también se aplica a `experience[id=experience-foxmind]`. Usar `organization`, `role` y `public_summary` para el texto público. `responsibilities_from_cv` y `role_from_cv` conservan el antecedente histórico interno: no se publican automáticamente módulos, arquitectura, herramientas ni cargos adicionales desde esos campos. Las fechas se revisarán junto con los demás datos profesionales. La política específica del proyecto prevalece en cualquier sección donde se lo describa.

## Revisión realizada

Se comprobó que el JSON se puede leer, que sus identificadores de fuentes existen, que las referencias de recursos se resuelven usando las bases declaradas y que el archivo original permanece sin modificaciones. En esta revisión se preservaron los otros casos y las rutas. Esta comprobación no verifica una aplicación, enlaces públicos o integración con ARCA.
