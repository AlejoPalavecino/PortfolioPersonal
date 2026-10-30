# Alcance y uso del kit

El kit prepara el portfolio personal **Campamento creativo** para presentar a Alejo Palavecino ante posibles empleadores y clientes. El mundo visual organiza cuatro destinos: Proyectos, Sobre mí, Trayectoria y Contacto. FoxMind encabeza la selección de proyectos.

## Qué se define aquí

`GUIA_DE_ARTE.md` fija las reglas comunes de escenario, piezas separables, personajes, estados e interfaz. `CONTENIDO_PENDIENTE.md` identifica el material real y las confirmaciones que faltan. `content/portfolio.es.json` organiza los textos iniciales y los datos del CV para que una implementación posterior pueda utilizarlos.

El JSON contiene una propuesta de presentación, los accesos de navegación, un perfil profesional, antecedentes de proyectos, experiencia, formación y contacto. Sus dos proyectos adicionales están vacíos hasta seleccionar los casos. La información tomada del CV conserva su fuente y sus pendientes de actualización.

El CV original aportado está incluido en `content/cv-alejo-palavecino-es.pdf`. La ruta declarada en el JSON se interpreta desde la raíz del paquete y podrá ajustarse al organizar los archivos públicos del sitio.

## Cómo se usará en la web

El paisaje y los objetos construyen la experiencia visual. Los nombres de lugares, botones, enlaces, biografía y casos se implementan como contenido HTML. Cada destino del mapa y su enlace de navegación abren la misma ficha, de modo que una persona pueda explorar o ir directamente a la información.

La navegación propuesta permite hacer clic o tocar un destino; el avatar puede acompañar el movimiento como respuesta visual. La versión de escritorio puede admitir desplazamiento por teclado. El contenido principal está disponible desde el comienzo, y visitar un lugar solo añade una señal de progreso visual.

Las fichas de proyecto deben explicar el problema, la contribución de Alejo, las decisiones, el estado y la evidencia disponible. El contacto ofrece dos entradas: una oportunidad laboral y una consulta por un proyecto. Ambas pueden usar el correo aportado mientras no se defina otro canal.

## Estado de esta entrega

Esta documentación y el arte del kit son insumos para construir el sitio. No representan una web implementada, un motor de juego, un formulario conectado ni un despliegue. Los comportamientos descritos son especificaciones para esa etapa posterior.

Una hoja de poses o una ilustración de personaje necesita dimensiones, anclajes y secuencias revisadas antes de utilizarse como sprite animado. Las zonas de clic, el movimiento, la profundidad, las colisiones y la adaptación móvil se resuelven durante la integración.

Los logos y personajes oficiales de FoxMind, las capturas reales y los resultados comprobables continúan pendientes cuando no se dispone de los originales o la evidencia correspondiente. Las consultas realizadas para obtener los recursos oficiales están registradas en `assets/brand/official/README.md`; no se incluyen imitaciones como sustitutos. La fotografía personal utilizada como referencia del avatar no se incluye en el paquete.

## Orden recomendado para continuar

1. Revisar la escena compuesta y la coherencia del avatar con sus destinos.
2. Completar el caso FoxMind y seleccionar los otros dos proyectos.
3. Implementar presentación, navegación, fichas y contacto con los assets estáticos.
4. Incorporar movimiento, estados de visita y animaciones ambientales.
5. Comprobar uso con mouse, teclado y pantalla táctil, lectura en móvil y funcionamiento con movimiento reducido.

La experiencia central queda definida con una escena, cuatro destinos y sus fichas. Las ampliaciones del mundo pueden evaluarse después de que ese recorrido esté funcionando.

