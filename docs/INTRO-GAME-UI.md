# Interfaz de entrada de juego

## Resultado

- Fondo gráfico generado compartido por las dos acciones. Texto HTML seleccionable y accesible sobre la imagen; variante secundaria por tratamiento de color. Aparición al habilitarse, elevación al pasar el cursor y presión al pulsar. Animaciones desactivadas por movimiento reducido.
- Parlante con ondas al reproducir y línea diagonal en silencio. Caminante animado con atenuación y tachado al reducir movimiento. Ayudas visibles en hover y foco, además de nombre accesible y título nativo.
- Pantalla inicial con estado real del loader: caminos, paisaje y movimientos del personaje; barra y contador ligados a operaciones completadas. No hay porcentaje simulado ni tiempo mínimo de carga.
- La llegada comienza al terminar los recursos críticos. Usa los sprites WebP ya preparados por el loader, con pies en una altura fija, sin superponer el bob CSS anterior.
- Al elegir explorar se muestra el destino durante la transición; no se afirma recargar información que ya está disponible. Al elegir proyectos se precarga realmente el interior del taller. Si falla o excede ocho segundos, se entrega al contenido y a su alternativa de fondo existente.
- Fallo inicial permite acceso directo; reintentar vuelve al loader. Movimiento reducido conserva la preparación real y omite la animación de llegada.

## Asset generado

Herramienta integrada de generación de imágenes; una generación compartida para ambas acciones. Archivo consumido: `public/assets/camp-rooms-v1/ui/adventure-button.webp` (con alfa). El PNG fuente se conserva en la salida de generación de la conversación.

Prompt: reusable videogame UI button background, no text; carved wooden adventure button, warm honey amber empty center for HTML text, dark teal engraved rim, tiny brass fasteners, pixel-art-inspired campsite style; orthographic horizontal silhouette; transparent outer background, no letters or logos.

Los iconos se amplían desde los SVG existentes para mantener estados precisos y escalabilidad.

## Verificación

- 103 pruebas aprobadas en 19 archivos, incluyendo preparación real, fallo/reintento, habilitación y entrega diferida.
- Lint y compilación con `/PortfolioPersonal/` aprobados.
- `git diff --check` aprobado.

Se inspeccionó el asset generado. La revisión visual/interactiva de la aplicación de esta rama en navegador sigue pendiente: tamaños estrechos, textura y legibilidad de botones, hover/foco, llegada y transición. Las pruebas DOM no acreditan geometría ni reproducción de animación real.

No se fusionó ni publicó esta PR.
