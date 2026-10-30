# Maquetas del hito de pantallas principales

## Revisión vigente · 2

Alejo aprobó el formato y la proporción general de la ficha integrada. Pidió evitar la repetición del nombre entre navbar y presentación y mejorar la distribución móvil. Esta revisión fue adoptada como referencia visual: emblema de campamento en la cabecera y una fila móvil con Contacto, CV y Menú. El nombre completo aparece una sola vez en el inicio, dentro de la presentación.

Las cuatro referencias actuales son:

1. [01-inicio-escritorio-v2.png](01-inicio-escritorio-v2.png): emblema discreto, nombre en la presentación y navegación de escritorio visible.
2. [02-ficha-escritorio-v2.png](02-ficha-escritorio-v2.png): mismo emblema y proporción general de ficha conservada.
3. [03-inicio-movil-v2.png](03-inicio-movil-v2.png): cabecera de una fila, presentación equilibrada y cuatro destinos.
4. [04-ficha-movil-v2.png](04-ficha-movil-v2.png): cabecera compartida, franja ilustrada breve y ancho de lectura conservado.

El estado y las observaciones de cada imagen están en [manifest.json](manifest.json). [generation-prompts.json](generation-prompts.json) conserva las instrucciones de edición y sus referencias. El marco solicitado orienta la composición y no fija la resolución ni los puntos de corte de la futura web.

## Versiones anteriores

Los cuatro PNG sin sufijo `-v2` son la revisión 1 y se conservan para comparar. No representan la cabecera vigente. Su registro está en [manifest-v1.json](manifest-v1.json) y sus instrucciones en [generation-prompts-v1.json](generation-prompts-v1.json).

## Cómo utilizarlas

Revisar junto con [07_HITO_PANTALLAS_PRINCIPALES.md](../07_HITO_PANTALLAS_PRINCIPALES.md). El agente de desarrollo debe reconstruir las pantallas con los assets independientes del kit y texto web. Los PNG son referencias visuales; las dimensiones aparentes de botones y emblemas no sustituyen sus áreas de interacción. La versión web adapta controles y textos al ancho disponible y a la ampliación de texto.

Las maquetas móviles muestran Menú cerrado. Su apertura despliega los cuatro enlaces dentro del flujo de la página; Contacto y CV permanecen disponibles. Los estados y el foco se definen en [02_EXPERIENCIA_Y_PANTALLAS.md](../02_EXPERIENCIA_Y_PANTALLAS.md).

El emblema mostrado está adoptado. Su pieza independiente se documenta en 03; los SVG de menú y cierre ya existen en el kit. Las reservas de captura de FoxMind se sustituyen por evidencia real antes de publicar ese caso. Los textos se revisan contra [04_CONTENIDO_Y_PENDIENTES.md](../04_CONTENIDO_Y_PENDIENTES.md).

La referencia recibida está en `references/selected-concept-received.png`. Se conserva la dirección artística, el avatar y los cuatro destinos. La fotografía personal original no está incluida. Alejo aprobó la dirección de la nueva cabecera y pidió avanzar al [hito de contenido profesional](../08_HITO_CONTENIDO_PROFESIONAL.md). El parecido individual del avatar y el contenido conservan sus revisiones específicas. No se han ejecutado pruebas de una aplicación.
