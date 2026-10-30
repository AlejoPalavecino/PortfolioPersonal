# Mapa jugable · Datos de planificación

**Hito 10 · Distribución base adoptada · Geometría de referencia 0.1 · Revisión documental 0.2 · 29 de octubre de 2026**

Esta carpeta documenta la distribución base adoptada por Alejo mediante **DEC-28** para la caminata elegida en DEC-26. El taller queda arriba a la derecha y conserva protagonismo; carpa y fogón, a la izquierda; bitácora, abajo a la izquierda; radio, abajo a la derecha. El personaje comienza en el claro central que conecta sus cuatro entradas. Las referencias de escritorio y celular se adoptan como base espacial. Las medidas, huellas y radios se conservan como referencias ajustables al terreno y al tamaño del avatar durante la integración; todavía no hay una implementación comprobada.

Las láminas mantienen el rótulo **Propuesta 0.1** como identificación de la revisión que Alejo adoptó. No se regeneró arte ni cambió la geometría. `document_revision: 0.2` y los metadatos de aprobación registran la adopción; `proposal_version: 0.1` identifica los datos geométricos y las láminas originales.

Los ajustes rutinarios de encuadre, escala, huellas y llegadas corresponden al agente de desarrollo. Solo una alteración material de la organización adoptada requiere volver a diseño; no se exige revisar cada coordenada con Alejo. Las reglas complementarias de 09, los tiempos y las pruebas conservan sus estados propios.

## Archivos

- [world-navigation-proposal.json](world-navigation-proposal.json): dos composiciones, suelo, obstáculos, posición inicial, zonas de llegada y una red orientativa de recorridos.
- [geometric-review.json](geometric-review.json): comprobación de esa geometría abstracta, con distancias y resultados por composición. Incluye la huella SHA-256 del JSON comprobado.

El comportamiento se mantiene en [02 · Experiencia y pantallas](../02_EXPERIENCIA_Y_PANTALLAS.md) y [09 · Experiencia e interacciones](../09_HITO_EXPERIENCIA_E_INTERACCIONES.md). Los criterios de la aplicación siguen pendientes en [05 · Entregas y aceptación](../05_ENTREGAS_Y_ACEPTACION.md).

## Marco de coordenadas

Las coordenadas describen **solo el área jugable**. La cabecera, la presentación y el paisaje lejano quedan fuera del marco. El origen está arriba a la izquierda; X crece hacia la derecha y Y hacia abajo.

| Composición | Marco lógico | Huella del avatar | Margen adicional | Radio de llegada | Proximidad manual |
|---|---:|---:|---:|---:|---:|
| Escritorio | 1000 × 650 | Radio 10 | 6 | 16 | 36 |
| Celular | 600 × 760 | Radio 8 | 6 | 14 | 30 |

Son **unidades de planificación**, no píxeles CSS, coordenadas del PNG original ni tamaños de pantalla obligatorios. Los radios se proponen para probar el espacio; no fijan las superficies de activación de los rótulos y controles de la web. Estas últimas se diseñan como interfaz legible y operable, de forma independiente.

El radio de llegada evita exigir una posición exacta de un píxel. La proximidad manual solo destaca un candidato cuando el personaje está sobre suelo válido y puede llegar a él; no abre contenido por sí sola. La selección automática sí expresa la intención de abrir al alcanzar la zona, siempre que ese destino siga vigente.

## Posición inicial y destinos

Las coordenadas son el **apoyo de los pies** y los centros de las zonas de llegada, no el centro del edificio ni el origen de su imagen.

| Elemento | Escritorio (X, Y) | Celular (X, Y) |
|---|---:|---:|
| Inicio del personaje | 500, 400 | 306, 441 |
| Proyectos | 610, 247 | 390, 266 |
| Sobre mí | 280, 312 | 168, 327 |
| Trayectoria | 350, 488 | 180, 547 |
| Contacto | 760, 455 | 438, 570 |

El personaje empieza quieto y orientado hacia arriba. Ninguna zona de interacción contiene el inicio. Las llegadas se sitúan fuera de las huellas del taller, la carpa, la mesa y la radio; la zona de Sobre mí también queda fuera del fogón.

## Suelo, obstáculos y recorridos

El suelo permitido se obtiene del polígono exterior, descontando las huellas de obstáculos y el espacio que ocupa el personaje. Las huellas rectangulares y circulares reservan espacio físico para la propuesta: **no son recortes del arte ni límites obtenidos del canal de transparencia**. Se ajustarán a las bases visibles al integrar las piezas.

Cada composición tiene diez nodos y diez conexiones bidireccionales. El claro central se conecta con cuatro ramales y una conexión lateral que evita volver siempre al punto inicial. Las líneas centrales y sus corredores de reserva sirven para revisar recorridos automáticos. La exploración manual utiliza el suelo disponible; no queda encerrada sobre esas líneas.

La red no implementa la búsqueda de caminos. El agente de desarrollo debe conectar una posición válida alcanzada libremente con el destino elegido sin atravesar obstáculos ni trasladar al personaje de forma instantánea. También debe resolver sustitución de destino, interrupciones y adaptación al cambio de tamaño según 02/09.

El agua queda en la periferia y fuera del terreno transitable principal. **Contacto se alcanza por el suelo del campamento; no depende de cruzar un puente ni de crear otra isla.** La guía de puente representa un elemento del contexto existente. Su caminabilidad no se resuelve ni se verifica en este modelo: debe encajar en el suelo real antes de habilitar un paseo por él. No constituye un quinto destino ni una conexión necesaria.

## Relación con el arte existente

Las [maquetas de escritorio](../mockups/01-inicio-escritorio-v2.png) y [celular](../mockups/03-inicio-movil-v2.png) conservan su función de referencia visual adoptada. El [terreno original](../../portfolio-campamento/assets/world/camp-ground.png) es una ilustración única con claros, senderos, escalones y un puente; no es un conjunto de plataformas separables. El [world-layout original](../../portfolio-campamento/config/world-layout.json) mantiene sus posiciones visuales de referencia y permanece intacto.

Este mapa conserva las relaciones espaciales adoptadas para jugar. **No está registrado píxel por píxel sobre ese terreno.** La implementación debe ajustar encuadre, escala uniforme de las piezas y huellas a los apoyos visibles. Si el encuadre móvil no permite esa correspondencia, deberá prepararse y revisarse un derivado del terreno, conservando el maestro. No se promete reordenar sus plataformas manteniendo sin cambios la imagen completa.

Los 35 recursos principales originales permanecen intactos. El mapa no exige una isla, un edificio ni un personaje nuevos. Tampoco acredita que las animaciones ya estén ajustadas a una velocidad final.

## Adaptación a celular

La composición conserva las relaciones de los cuatro destinos alrededor de un paso central. La cámara se propone estable; el desplazamiento normal de la página permanece disponible. Elegir una sección desde la navegación puede llevar una vez el bloque del campamento al área visible, sin seguir al personaje cuadro a cuadro ni retener el scroll.

Los rótulos y los controles del recorrido conservan un tamaño legible independiente del fondo. En pantallas bajas se mantiene el acceso al estado del recorrido y a **Abrir ahora**, con desplazamiento normal de la página. Las dimensiones de este JSON no obligan a comprimir toda la escena en cualquier altura disponible.

Al cambiar de composición, se conserva el destino semántico y se resuelve una posición válida. Una copia proporcional de X/Y entre los dos marcos puede colocar al personaje sobre un obstáculo; no se considera una adaptación suficiente.

## Qué se comprobó

La adopción de DEC-28 solo actualiza metadatos: las composiciones, coordenadas, huellas, corredores y resultados calculados permanecen idénticos. El registro actualiza la huella SHA-256 del documento fuente y deja constancia de esa continuidad; no se ejecutaron nuevas comprobaciones ni pruebas de aplicación.

El registro contiene **27 comprobaciones estáticas por composición, 54 en total**, todas superadas para estas coordenadas. Se comprobaron los diez nodos, las cuatro zonas de llegada con margen corporal, los diez corredores, la separación del inicio respecto de las zonas de interacción y la conectividad de la red. La matriz de terminales incluye 20 trayectos dirigidos entre puntos distintos y cinco casos de distancia cero por composición.

Las comprobaciones de corredores usan distancia entre segmentos y límites físicos; las de nodos y llegadas usan pertenencia al suelo y separación respecto de obstáculos. Los corredores reservan un semiancho de 22 unidades en escritorio y 18 en celular, mayor que huella y margen corporal combinados. La matriz informa caminos mínimos dentro de esta red orientativa.

Las distancias son **longitudes lógicas**, sin velocidad asignada ni conversión a segundos. El objetivo de recorridos breves de 02/09 se revisará sobre el prototipo. Este control no demuestra transitabilidad de cada píxel del terreno real, conexión desde toda posición libre, adaptación visual, accesibilidad, cadencia, rendimiento ni funcionamiento de una web. Todos los campos de verificación de ejecución permanecen en falso.
