# Guía de arte — Campamento creativo

**Versión:** 1.0 · **Fecha:** 29 de octubre de 2026 · **Estado:** dirección de arte para el kit inicial.

## Identidad del mundo

El portfolio representa un campamento creativo inspirado en el paisaje mendocino: cordillera, vegetación, agua, senderos y construcciones de madera. Debe transmitir curiosidad, cercanía y capacidad de construir productos. El destino principal es el taller de proyectos, con FoxMind como primer caso.

La referencia elegida fija la composición y el ambiente: luz diurna cálida, montañas azules al fondo, caminos claros, vegetación verde y techos de tonos terracota. Los rótulos y textos de aquella referencia sirven para explicar la idea; en el sitio se reemplazan por texto HTML.

## Perspectiva, luz y composición

Mantener una vista de tres cuartos elevada en los objetos del campamento: se ven sus frentes y una porción de sus superficies superiores. El paisaje lejano puede usar una composición panorámica. Las piezas que comparten el terreno deben conservar el mismo ángulo de observación y la misma relación entre sus ejes.

La iluminación es diurna y cálida. Las caras superiores y las superficies orientadas hacia la luz reciben tonos crema o dorados; las zonas de sombra usan colores más fríos. La dirección de las sombras debe coincidir al colocar las piezas sobre el escenario. Evitar mezclar una construcción nocturna con vegetación de mediodía.

Reservar espacio tranquilo para la presentación y la navegación. El taller debe destacar por tamaño, ubicación y luz. Los senderos conectan cuatro destinos y dejan una zona visible para el avatar; no necesitan cubrir cada rincón del paisaje.

## Los cuatro destinos

| Identificador | Pieza visual | Función del portfolio | Rótulo en HTML |
|---|---|---|---|
| `projects` | Taller de madera con elementos de trabajo | Casos de proyecto; FoxMind primero | Proyectos |
| `about` | Carpa y fogón | Presentación personal | Sobre mí |
| `journey` | Mesa con bitácora, mapas y cuaderno | Estudios, experiencia y reconocimientos | Trayectoria |
| `contact` | Pequeño puesto de comunicación o radio | Contacto por empleo y por proyectos | Contacto |

La mesa de bitácora es el cuarto destino del kit. Se entrega como pieza separada para incorporarla a la escena, aunque no aparezca con rótulo propio en la referencia inicial.

## Paleta de trabajo

Estos valores son una propuesta compatible con la referencia. No son mediciones de sus píxeles ni colores oficiales de una marca.

| Uso | Color propuesto |
|---|---|
| Tinta e interfaz oscura | `#102E3C` |
| Cielo | `#91CFF0` |
| Montañas distantes | `#5F8DB8` |
| Agua | `#287C98` |
| Vegetación en sombra | `#315747` |
| Vegetación iluminada | `#789451` |
| Sendero y tierra clara | `#E6CB97` |
| Madera | `#A36B41` |
| Techo terracota | `#B85C45` |
| Luz cálida | `#F2C47C` |
| Fondo claro de lectura | `#FFF4DF` |
| Acento de acción | `#EB654F` |

Usar la paleta como familia de colores, con variaciones limitadas para sombras y profundidad. Los colores de las ilustraciones no sustituyen la revisión de contraste de la interfaz. Para textos extensos, usar tinta oscura sobre fondos claros y estables.

## Escala y lenguaje pixel

Conservar el mismo tamaño visual de píxel dentro de cada plano. El personaje, las puertas, los muebles y los objetos deben parecer parte del mismo mundo. La altura del avatar sirve como unidad de comparación: debe poder cruzar los senderos y relacionarse de forma creíble con una silla o una puerta.

La resolución de una imagen maestra y la resolución lógica del juego son decisiones diferentes. No reducir automáticamente todo el arte a sprites de 32 píxeles. Definir el tamaño final de representación durante la integración y comprobar que caras, iconos y objetos principales sigan siendo reconocibles.

Mantener los originales. Cuando una pieza ya tenga una cuadrícula pixel definida, favorecer escalas enteras y comprobar su representación sin suavizado. Una imagen generada con apariencia pixel no debe declararse un sprite técnicamente normalizado sin revisar su cuadrícula y sus bordes.

## Capas y transparencia

El escenario base contiene paisaje, suelo y senderos. Los destinos, el avatar, los personajes secundarios y los elementos que deban moverse se conservan como assets independientes. Separar también los elementos de primer plano que deban ocultar parcialmente al avatar.

Las piezas recortables se exportan en PNG con canal alfa real. Un fondo ajedrezado dibujado no es transparencia. Revisar el recorte sobre un fondo claro y otro oscuro para detectar halos, bordes cortados o fondos residuales.

Definir un punto de anclaje por pieza. En el avatar se ubica en el suelo, entre los pies; en edificios y objetos, en su base. Las sombras deben coincidir con la iluminación general y conservarse separadas cuando se necesite reubicar el objeto sin arrastrar una porción de terreno.

## Personajes y animaciones

El avatar principal mantiene la misma ropa, proporciones, colores y rasgos reconocibles en todas las poses. La fotografía aportada se utiliza como referencia de elaboración; no forma parte del paquete de assets.

Para caminar, conservar dimensiones de cuadro, punto de apoyo y posición relativa del cuerpo. Definir el orden de direcciones y cuadros antes de integrar una secuencia. Comparar los extremos del ciclo para que el paso se repita sin saltos. Las poses ilustradas o las hojas de referencia requieren revisión de alineación antes de tratarlas como animaciones listas para un motor.

Las animaciones ambientales son breves y discretas: llama del fogón, movimiento del agua, luces o un saludo. La navegación y la lectura deben seguir funcionando cuando se reduzcan o desactiven.

No atribuir a una ilustración generada la condición de logo oficial de FoxMind o de diseño oficial de Foxy. Esos materiales siguen pendientes de aporte o confirmación y no se reemplazan por imitaciones. El registro de las fuentes consultadas está en `assets/brand/official/README.md`.

## Estados de los elementos

Los destinos comparten cuatro estados: reposo, foco o señal de interacción, contenido abierto y visitado. El estado visitado puede encender una luz o añadir un sello a la bitácora; no bloquea contenido ni habilita requisitos adicionales.

La interfaz implementa foco visible, rótulos y señales de selección con HTML y CSS. No hace falta generar una imagen distinta para cada combinación de estado. Una luz ilustrada o un detalle animado puede superponerse como asset independiente.

## Texto, interfaz y móvil

Usar una tipografía pixel legible en títulos cortos y detalles del mundo. Para biografía, proyectos, navegación y formularios, utilizar Lexend o una sans serif de lectura equivalente. Mantener los textos editables y seleccionables.

Los rótulos, los botones, el nombre de Alejo, los enlaces y los textos de proyectos se renderizan en HTML. Los carteles ilustrados deben dejar espacio vacío para esos textos. Los iconos de contacto acompañan una etiqueta explícita.

En móvil se reutilizan los mismos assets y se recompone la escena para que los cuatro destinos sean localizables. El acceso directo mediante menú abre el mismo contenido que el mapa. Las fichas se adaptan a la pantalla y permiten leer capturas y párrafos sin depender del tamaño del paisaje.

## Revisión al integrar

Comprobar coherencia de perspectiva y escala en una escena compuesta; transparencia y bordes de cada recorte; estabilidad de los cuadros animados; correspondencia entre objetos visibles y zonas de interacción; y legibilidad de rótulos y fichas en escritorio y móvil. Estas comprobaciones describen el trabajo de integración: la presencia de un PNG en el kit no certifica por sí sola movimiento, colisiones o accesibilidad.

