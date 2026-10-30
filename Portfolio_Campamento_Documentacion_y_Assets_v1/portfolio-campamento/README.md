# Campamento creativo — Kit de assets de Alejo Palavecino

**Versión 1.0 · 29 de octubre de 2026**

Kit de arte y recursos para desarrollar un portfolio personal con exploración de un campamento inspirado en Mendoza. El objetivo del portfolio es presentar el trabajo de Alejo tanto a empleadores como a posibles clientes.

## Empezar por el visor

1. Descomprimí el paquete completo, conservando sus carpetas.
2. Abrí `preview/index.html` en un navegador de escritorio.
3. Usá la galería para revisar originales, transparencia, cuadros y sonidos.
4. En «Composición» podés consultar dos distribuciones de referencia y activar o desactivar capas.

El visor abre los archivos locales y no requiere instalar dependencias. Es una herramienta para inspeccionar el kit; las composiciones son referencias de integración. El portfolio, sus fichas, sus colisiones y el recorrido jugable todavía deben desarrollarse.

## Contenido

| Carpeta | Recursos |
|---|---|
| `assets/world/` | Fondo andino, terreno y primer plano, separados. |
| `assets/destinations/` | Taller de proyectos, carpa/fogón, mesa de trayectoria y radio de contacto. |
| `assets/character/` | Personaje maestro basado en la foto aportada, retrato y atlas de 20 cuadros con metadatos. |
| `assets/decoration/` | Atlas de ocho objetos con recortes y puntos de apoyo. |
| `assets/effects/` | Atlas de doce cuadros: fuego, humo y brillo de agua. |
| `assets/brand/` | Monograma AP y portada para compartir; registro de originales oficiales de FoxMind pendientes. |
| `assets/icons/` | Catorce SVG de Lucide, con licencia y procedencia. |
| `assets/fonts/` | Lexend y Pixelify Sans locales, con licencias OFL y CSS de carga. |
| `assets/audio/` | Cuatro efectos y un ambiente sintetizado de doce segundos, código fuente y metadatos. |
| `content/` | Contenido inicial en español basado en el CV y copia del CV original. |
| `config/` | Tokens de diseño y composiciones de referencia. |
| `docs/` | Guía de arte, alcance, materiales pendientes, atribuciones y auditoría. |
| `source/` | Concepto elegido y registro de instrucciones de generación. |
| `preview/` | Visor local del kit. |
| `tools/` | Scripts para inspección de imágenes y regeneración del catálogo, sin editar los PNG. |

El inventario exacto, las dimensiones, los tamaños y los hashes están en `assets-manifest.json`. Las dimensiones observadas de los originales prevalecen sobre las dimensiones objetivo de los prompts.

## Qué usar para cada sección

- **Proyectos:** `assets/destinations/poi-projects.png`.
- **Sobre mí:** `assets/destinations/poi-about.png` y `assets/character/alejo-portrait.png`.
- **Trayectoria:** `assets/destinations/poi-journey.png`.
- **Contacto:** `assets/destinations/poi-contact.png`.
- **Personaje durante el recorrido:** `assets/character/avatar-movement-atlas.png`, junto a su JSON.

Los carteles se dejaron vacíos para superponer rótulos HTML. Nombre, navegación, botones, descripciones, formularios y enlaces deben seguir siendo texto e interfaz web.

## Integrar los atlas

Cada atlas incluye un JSON contiguo con `sourceSize`, `frames`, `animations`, `fps` y anclajes. Las coordenadas están expresadas en píxeles de la imagen original.

El atlas del personaje contiene cuatro direcciones en el orden abajo, izquierda, derecha y arriba. Cada dirección tiene una pose quieta y cuatro cuadros de caminata. Los recortes son de tamaño variable: aplicá una escala común y respetá `anchorX`/`anchorY`; no ajustes cada cuadro por separado a una anchura fija.

El atlas decorativo contiene pino, árbol de copa, arbusto, rocas, farol, planta, señal vacía y banco. Cada objeto tiene un recorte propio. El atlas de efectos conserva celdas completas para no perder chispas o fragmentos separados de humo.

Los ciclos se entregan como animaciones iniciales generadas, con coordenadas y anclajes revisados. Existen pequeñas variaciones de volumen, silueta y fase entre cuadros. La cadencia y el contacto de los pies deben ajustarse a la velocidad final del personaje durante la integración.

## Transparencia, escala y exportación

Conservá los PNG originales. Las piezas aisladas tienen canal alpha real. Algunas previsualizaciones pueden mostrar colores del fondo oculto; esos colores no son visibles donde alpha es cero. No conviertas los recortes a JPEG ni los aplanes sobre blanco o negro.

Son ilustraciones de apariencia pixel art en resolución maestra, con densidad de píxel variable entre elementos. No equivalen a un tileset dibujado íntegramente sobre una única cuadrícula lógica. Revisá el resultado al tamaño real de juego y elegí el muestreo según la pieza. El visor usa escalado sin suavizado para facilitar la inspección.

El monograma se entrega como PNG maestro. Las variantes pequeñas de favicon y las exportaciones web optimizadas pueden derivarse durante el proceso de build, conservando estos originales. La portada es una pieza de marca; no representa una captura de un sitio ya desarrollado.

## Composición e interacción

`config/world-layout.json` contiene ejemplos de colocación para escritorio y móvil. Sus posiciones y capas son una base de trabajo, no una malla de navegación ni un mapa de colisiones comprobado. Definí al implementar las superficies transitables, las entradas de los destinos y el orden de profundidad por posición de los pies.

La capa de primer plano se entrega separada y puede ocultarse si tapa un destino en una composición concreta. El menú directo debe abrir el mismo contenido que los lugares del campamento. Las acciones principales —proyectos, CV y contacto— permanecen disponibles desde el inicio.

## Audio e interfaz

El sonido comienza desactivado. Los WAV son síntesis original de ambiente y efectos; el ambiente no es una grabación de Mendoza. Se verificaron formato, niveles y ausencia de clipping. Ajustá volumen y mezcla mediante una escucha en el sitio final.

Lexend se destina a lectura y navegación; Pixelify Sans, a títulos breves. Los iconos SVG conservan sus licencias originales. Ver `docs/TERCEROS_Y_AUDIO.md`.

## Material profesional pendiente

El kit incluye una base de contenido derivada del CV, con campos pendientes explícitos. Todavía deben incorporarse las capturas reales, los originales oficiales de logo/Foxy y los materiales de otros dos proyectos seleccionados. Los casos sin contenido deben permanecer ocultos al publicar.

El archivo `assets/brand/official/README.md` registra las fuentes públicas consultadas para FoxMind. No se incluyó una mascota ni una marca inventada como sustituto oficial.

La fotografía personal se utilizó como referencia del personaje y del retrato; no se distribuye dentro de este paquete. El CV conserva los datos de su original aportado.

## Verificación y mantenimiento

- `docs/QA_ASSETS.json`: integridad y transparencia de los PNG.
- `assets/*/*atlas.json`: geometría y secuencias de los atlas.
- `assets/fonts/validation.json`: caracteres españoles de las fuentes.
- `assets/audio/metadataaudio.json`: duraciones y niveles de audio.
- `source/image-generation-prompts.json`: instrucciones y referencias de las generaciones.

Desde la raíz del kit, los scripts de herramientas permiten regenerar el catálogo y la auditoría. Leen los originales sin modificar imágenes. La revisión de assets no certifica el rendimiento, la accesibilidad o la jugabilidad de la futura web.
