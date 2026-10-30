# Instrucciones para el agente de desarrollo

**Alejo Palavecino · Versión 1.0 · 29 de octubre de 2026**  
**Entrega documental:** Dossier 1.0 · Plan 1.13 · **Estado:** preparada para iniciar una implementación de revisión.

Este documento forma parte del [paquete completo de documentación y assets](https://chatgpt.com/library?file_id=libfile_bec2f4c16ed481918c4bee9235c3585a&account_id=personal). Las rutas de archivo citadas se consultan dentro de ese paquete; el [plan actualizado](https://chatgpt.com/library?file_id=libfile_f08f1cc9f3a081919925e6a6fa0c9620&account_id=personal) conserva el seguimiento de tareas.

## 1. Cómo utilizar esta entrega

Adjuntar el paquete completo y conservar `portfolio-campamento-handoff/` y `portfolio-campamento/` como carpetas hermanas. El agente necesita los archivos reales además de esta instrucción. El LEEME (`00_LEEME.md`) identifica las fuentes y el [plan](https://chatgpt.com/library?file_id=libfile_f08f1cc9f3a081919925e6a6fa0c9620&account_id=personal), los estados.

La preparación del traspaso responde al pedido de Alejo registrado en DEC-29. Esta versión reúne decisiones elegidas, recomendaciones operativas y pendientes asignados. La consolidación no convierte todos los detalles en decisiones aprobadas ni cierra contenido o pruebas de la web. Permite empezar E1 y revisar el resultado concreto sin abrir otro hito previo.

### Mensaje breve para acompañar el paquete

> Desarrollá mi portfolio a partir del Dossier 1.0 adjunto. Empezá por `portfolio-campamento-handoff/06_INSTRUCCIONES_PARA_AGENTE.md` y seguí las referencias indicadas allí. Conservá el campamento, la ficha integrada, la cabecera y el mapa elegidos. Usá las reglas complementarias documentadas como base de la versión de revisión y registrá los ajustes materiales. Comenzá por E1 y continuá con las entregas E2–E4. Los pendientes de contenido están asignados y pueden resolverse en paralelo. Devolveme una versión navegable, lo comprobado y lo pendiente; la publicación se resuelve cuando la incluya en el encargo.

## 2. Encargo y alcance de la primera versión

Construí el portfolio personal de **Alejo Palavecino**, con el concepto **Campamento creativo**. Su objetivo es mostrar trabajo profesional para oportunidades de empleo y consultas de clientes.

| Componente | Resultado esperado |
|---|---|
| Presentación | Nombre completo una vez en el hero, perfil enfocado en full stack, análisis y automatización/IA, y accesos a proyectos y contacto. La jerarquía propuesta es Ver proyectos / Contactar. |
| Cabecera | Emblema de campamento para volver al inicio. En escritorio, cuatro enlaces y CV; en móvil, emblema, Contacto, CV y Menú. El menú despliega secciones y ajustes dentro del flujo. |
| Campamento | Una escena con avatar inspirado en Alejo y cuatro destinos: taller → Proyectos; carpa/fogón → Sobre mí; bitácora → Trayectoria; radio → Contacto. |
| Navegación | Caminar manualmente y elegir una sección con clic/toque para que el personaje camine a su entrada y la abra al llegar. Menú y mundo acceden al mismo contenido. |
| Lectura | Ficha integrada de superficie crema: paisaje visible alrededor en escritorio y franja de contexto en móvil. Texto seleccionable, controles legibles y navegación disponible. |
| Proyectos | Estructura para FoxMind y Flower con datos confirmados; publicar solo los casos completos. Un tercero es opcional. |
| Contacto y CV | Correo visible, motivos empleo/proyecto y enlaces elegidos; descarga del PDF definitivo. Abrir el correo no se presenta como un mensaje enviado. |
| Adaptación y ambiente | Escritorio y celular, teclado, movimiento reducido, alternativa si la escena falla, señales de visita sin bloqueos y audio voluntario apagado al inicio. |

La primera versión se prepara en español. Las ampliaciones —otro idioma, misiones, nuevas zonas, día/noche, chat con IA, cuentas, pagos, formulario conectado o analítica— requieren una decisión de alcance posterior. El alcance actual puede resolverse sin cuentas ni almacenamiento de mensajes.

## 3. Decisiones y recomendaciones de trabajo

Leé 01 · Producto y decisiones (`01_PRODUCTO_Y_DECISIONES.md`), 02 · Experiencia y pantallas (`02_EXPERIENCIA_Y_PANTALLAS.md`), [09 · Interacciones](https://chatgpt.com/library?file_id=libfile_9fabc527f06c8191892ea55e843d7e6a&account_id=personal) y [10 · Mapa](https://chatgpt.com/library?file_id=libfile_9251ecc12c548191b0893ddee5f822b6&account_id=personal).

**Conservar como decisiones elegidas:** ficha integrada y proporción general; dirección visual de las cuatro maquetas v2; emblema y cabecera móvil; caminata manual y selección con recorrido y apertura al llegar de DEC-26; organización del mapa adoptada en DEC-28. DEC-08 es un antecedente sustituido.

**Usar como base recomendada para implementar y revisar:** teclas, foco, toque de suelo, cancelación, omisión, pausas, movimiento reducido, audio y orden editorial del hero. Estas recomendaciones son operativas, aunque no tengan aprobación individual. No detengas E1 ni consultes cada tecla o coordenada. Mostrá su comportamiento en E2/E3 y registrá los ajustes materiales que propongas.

**Resolver durante la integración:** framework, estructura, dibujo y animación, representación de colisiones y rutas, exportaciones, escala, coordenadas y holguras. Explicá las elecciones que afecten costos, mantenimiento o experiencia. Las tecnologías de los casos son datos de esos proyectos; la solución del portfolio se elige según este encargo.

Los cambios que alteren el producto elegido se revisan con Alejo: por ejemplo, eliminar la caminata como flujo principal, exigir exploración manual para ver información, reemplazar la estética o reorganizar materialmente el mapa. Los ajustes numéricos y de encuadre que preservan la organización forman parte del trabajo del agente.

### Resumen de comportamiento que debe conservarse

- Elegir una sección desde el mundo, rótulo, menú o acción de sección inicia el recorrido y abre una sola vez al llegar. Elegir otra sección durante lectura muestra el campamento y realiza ese recorrido; la misma sección conserva la lectura. Si el avatar ya llegó, no se agrega movimiento artificial.
- Flechas/WASD solo controlan el avatar con la escena enfocada y activa. Cerca de una entrada, Enter/E confirma la interacción; la proximidad sola no abre. La autoruta permite seguir usando la interfaz y no captura el teclado.
- Una nueva selección sustituye la ruta anterior. **Abrir ahora** resuelve la última sección solicitada; **Cancelar recorrido** restaura el contexto de origen y conserva la posición física alcanzada. No quedan aperturas atrasadas.
- Detalles de proyecto, regresos, Atrás, CV, correo y enlaces externos son acciones inmediatas. Con movimiento reducido, carga o fallo de escena, el contenido sigue accesible directamente. La escena permanece quieta durante la lectura.
- Ocultar la pestaña pausa una ruta. Volver muestra **Continuar recorrido**, **Cancelar recorrido** y, cuando hay una sección pendiente, **Abrir ahora**. No se reanuda solo por recuperar visibilidad.
- En móvil, toque de destino para ir y abrir; se propone toque de suelo para caminar sin abrir contenido, sin joystick. Scroll y zoom conservan su uso normal. El mapa puede alinearse a la vista una vez al comenzar la ruta; no se propone una cámara que persiga continuamente al avatar.
- Sonido apagado al entrar y activación voluntaria; una sola instancia del ambiente. Los controles de sonido y movimiento siguen disponibles durante la lectura.

02 contiene las reglas completas, incluidas prioridades de Escape, foco, historial y fallos. El objetivo propuesto para rutas automáticas es **1–2 segundos**, excepcionalmente hasta **3 segundos** en la composición inicial. Se mide sobre la implementación: la apertura depende de llegar, no de un temporizador, y el objetivo no justifica atravesar obstáculos ni acelerar el avatar de manera poco natural.

## 4. Recursos y mapa

Consultá 03 · Dirección visual y assets (`03_DIRECCION_VISUAL_Y_ASSETS.md`), 07 · Maquetas (`07_HITO_PANTALLAS_PRINCIPALES.md`), maps/README.md (`maps/README.md`) y los metadatos reales del kit.

Las cuatro maquetas v2 son referencias de composición. Reconstruí la experiencia con las piezas separadas, controles y texto web. Conservá una misma escena y estado al abrir o cerrar contenido. Los originales de los 35 recursos y el maestro del emblema permanecen como fuentes; prepará derivados web sin modificarlos destructivamente. El atlas usa recortes y anclajes propios, no una cuadrícula uniforme supuesta.

El mapa adoptado sitúa al personaje en el claro central, taller arriba a la derecha, carpa a la izquierda, bitácora abajo a la izquierda y radio abajo a la derecha. Contacto se alcanza por tierra firme en el mismo margen; no exige un puente.

Los marcos de 1000 × 650 y 600 × 760 son unidades lógicas del área jugable. Ajustá huellas, caminos, llegadas, escala y encuadre al arte real. `camp-ground.png` es una sola ilustración: sus plataformas no pueden reordenarse como tiles independientes. Si hace falta adaptar el fondo, identificá el derivado necesario a partir de una incompatibilidad concreta. Los rótulos y controles conservan su escala legible al cambiar el encuadre.

La revisión de `maps/geometric-review.json` describe geometría de planificación. El agente comprueba colisiones, rutas desde posiciones libres, giros, profundidad, accesos y duración real conforme a AC-30. No hace falta generar nuevos assets por anticipado para empezar.

## 5. Contenido y tratamiento de faltantes

Usá 04 · Contenido y pendientes (`04_CONTENIDO_Y_PENDIENTES.md`), [08 · Borradores profesionales](https://chatgpt.com/library?file_id=libfile_16726808cd308191b585b8adf2e1e6a8&account_id=personal) y content/portfolio.es.json (`content/portfolio.es.json`), con las reglas de su README (`content/README.md`). El JSON del handoff es la fuente editorial de trabajo; el del kit es histórico.

Seleccioná los campos públicos según la política de cada caso. El JSON también contiene fuentes, notas y datos históricos internos: no se publica íntegro ni se trasladan esos campos automáticamente a la web. Las imágenes generadas del campamento no sustituyen capturas reales de los proyectos.

**FoxMind:** presentar descripción general, rol de cofundador y responsable del desarrollo completo hasta ahora, incluida la integración de IA, etapa previa a pruebas piloto y capturas elegidas por Alejo. No pedir ni publicar código, repositorio, demo, arquitectura, detalles internos o acceso al producto. Omitir acciones de demo/repositorio y referencias técnicas históricas del CV fuera del alcance elegido. La misma política se aplica a Trayectoria. El aporte completo no implica trabajo sin equipo ni producto terminado.

**Flower:** título editorial «Sistema de stock y facturación para Flower». Es la librería cliente; el software no tiene nombre propio. Desarrollo integral individual, React + Node.js + PostgreSQL, funcionamiento en producción y facturación automática de ventas mediante ARCA confirmados por Alejo. Esos datos no vuelven a preguntarse. No agregar métricas, operaciones específicas de ARCA, certificaciones ni una situación previa sin fuente. Se puede explicar el objetivo del sistema sin inventar un problema anterior.

**Perfil:** full stack, análisis y automatización/IA como foco. Tech Lead y Product Owner son intereses, no cargos anteriores ni experiencia de liderazgo acreditada. Estudios, fechas, continuidad de roles, disponibilidad y canales se revisan antes de publicarlos.

En la versión de revisión, usá las narrativas actuales y reservas visuales identificadas para el revisor. Los faltantes no bloquean la estructura ni la caminata. Antes de publicar, sustituí cada reserva por evidencia real o excluí el caso incompleto. Se requiere al menos un caso completo entre los priorizados; FoxMind mantiene prioridad cuando esté listo. Marcas oficiales, métricas, enlaces de proyectos y tercer caso son opcionales: si no están disponibles, se omiten.

Los CT de 04 y las tareas del plan asignan cada pendiente. El agente integra y comprueba; Alejo aporta material, confirma datos y revisa el resultado; esta colaboración puede organizar capturas, redactar pies y registrar observaciones a partir del material que Alejo traiga.

## 6. Orden de implementación y entregables

La definición completa de cierre está en 05 · Entregas y aceptación (`05_ENTREGAS_Y_ACEPTACION.md`).

| Entrega | Trabajo | Evidencia que debe devolver el agente |
|---|---|---|
| E1 · Navegación profesional | Presentación, cuatro secciones, ficha integrada, regresos, contacto y CV, con escena estática y adaptación inicial a escritorio/móvil. | Versión navegable para leer un caso, volver, consultar trayectoria, obtener el CV y abrir contacto; lista de datos provisionales. AC-01 se revisa parcialmente porque la caminata corresponde a E2. |
| E2 · Campamento interactivo | Caminata manual y automática, cuatro entradas, rutas, colisiones, profundidad, animación, pausas, cancelación y omisión. | Recorridos por todos los destinos, cambio rápido de selección, cancelación, movimiento reducido y acceso táctil; tiempos realmente observados. Completar AC-01 con el recorrido y AC-04. |
| E3 · Calidad y contenido | Adaptación final, teclado, legibilidad, fallos, exportaciones y carga, mezcla de audio, casos reales y datos finales. | Resultados de criterios aplicables, dispositivos y condiciones utilizados, incidencias resueltas y pendientes. |
| E4 · Entrega técnica | Proyecto mantenible e instrucciones reales. Publicación cuando el encargo de Alejo la incluya. | Versión identificada, cómo ejecutar y actualizar textos/proyectos/CV, decisiones técnicas y comprobación de la URL publicada cuando exista. |

La navegación estática de E1 es una etapa de construcción; el resultado final conserva la caminata de DEC-26. Se puede avanzar con contenido provisional identificado, manteniendo AC-18 pendiente hasta su revisión final. Un criterio solo se marca superado cuando se comprueba completo. AC-25 se ejecuta después de publicar; no genera un requisito circular para publicar.

### Formato de devolución en cada entrega

Informá:

1. Entrega E1–E4, versión y forma de abrirla.
2. Qué puede probar Alejo y qué recorrido seguir.
3. Criterios comprobados, resultado, entorno y evidencia; distinguir verificación parcial y completa.
4. Pendientes con responsable y efecto concreto sobre el siguiente avance o la publicación.
5. Cambios de producto o recomendaciones ajustadas, con motivo.

Las capturas acreditan composición; la caminata, el teclado y los regresos necesitan comprobación funcional. Una compilación correcta no demuestra esos recorridos. No inventes mediciones ni marques los 30 criterios por la sola existencia del paquete.

## 7. Primer avance esperado

Revisá el paquete, elegí una estructura técnica adecuada y empezá E1 con los materiales disponibles. Indicá únicamente las incompatibilidades o faltantes que impidan un resultado concreto; continuá con las tareas no afectadas. No hace falta reconfirmar la distribución adoptada ni esperar las capturas para montar navegación y fichas.

Alejo podrá traer la primera versión y sus evidencias a esta colaboración para revisar coherencia visual, contenido y cumplimiento del encargo. Las observaciones se convertirán en tareas concretas para su agente.

## Registro de cambios

**1.0 · 29/10/2026:** encargo consolidado para la entrega documental 1.0, con secuencia E1–E4, tratamiento de propuestas y faltantes, responsables y formato de evidencia. DEC-29 registra el pedido de preparar este traspaso. No se ejecuta ni se publica la web desde esta colaboración.

**0.12 · 29/10/2026:** mapa base adoptado en DEC-28 y geometría asignada a integración.

**0.11 · 29/10/2026:** incorporación de mapa, marcos lógicos y límites de revisión geométrica.

**0.10 · 29/10/2026:** alineación con caminata manual y selección con apertura al llegar de DEC-26.
