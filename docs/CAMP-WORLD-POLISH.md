# Pulido del campamento exterior

[PR #9](https://github.com/AlejoPalavecino/PortfolioPersonal/pull/9) · rama `feat/camp-world-polish`.

## Alcance

Primera etapa del pulido: sólidos, caminos, carteles, contexto móvil y coherencia tipográfica. Se conserva el mapa, sus cuatro destinos y el flujo de caminar para entrar. El rediseño estructural de las salas queda para la siguiente etapa; aquí se unifica únicamente su familia tipográfica.

## Geometría

- Se amplían los polígonos del taller, la carpa, la mesa/silla de trayectoria y la radio para bloquear áreas visuales que antes solo quedaban cubiertas por la oclusión del avatar. Es una decisión conservadora para no permitir caminar dentro de objetos ni esconderse detrás de ellos en zonas ambiguas del dibujo.
- Se agregan sólidos circulares al fogón, dos troncos, el poste del cartel de Sobre mí y la roca junto al acceso a la radio.
- El margen de los pies pasa de 5 a 8 unidades lógicas. El cuerpo dibujado no se usa como rectángulo de colisión: todas las rutas y movimientos manuales siguen comprobando segmentos y esquinas con el mismo modelo.
- Se recalibra el límite de tierra al sur de la radio (y=445) para conservar el paso al extremo este con el margen nuevo. La prueba preexistente de ese paso se conserva y pasa en ambos sentidos.
- Las cuatro entradas conservan sus coordenadas, sus confirmaciones de proximidad y su conexión con el inicio.

La revisión se hizo sobre una reconstrucción de 1000×650 con los sprites originales en sus posiciones CSS y una superposición de polígonos, círculos, perímetro y entradas. No equivale a una prueba de movimiento renderizado en navegador.

## Presentación y móvil

- Soportes de cartel de 128×58 en lugar de 160×72: menos superficie sobre el arte, con blancos de interacción de al menos 44 unidades lógicas. Posiciones ajustadas por destino y estados de cercanía/visita conservados.
- Lexend en carteles, controles y salas; tamaños existentes de lectura conservados.
- En retrato 390 px, la escala pasa de 1,08 a 0,78: se ven 500 unidades horizontales en lugar de unas 361. El toque sigue convirtiéndose con la cámara realmente pintada.
- Barra inferior móvil con los cuatro destinos, usando el mismo controlador de rutas y sus estados visitado/seleccionado. No depende de que un cartel esté dentro de la cámara.
- Carteles parcialmente fuera del encuadre se ocultan en móvil; ayuda, estados de recorrido y acciones se colocan sobre la barra inferior. La barra se oculta en introducción y lectura.

Se reutiliza el arte existente. No se generan fondos nuevos para esta etapa: cambiar el dibujo durante la calibración volvería a invalidar las coordenadas de colisión.

## Validación

- 121 pruebas aprobadas en 21 archivos.
- Se conservan pruebas de todas las conexiones entre entradas, paso este, colisiones, deslizamiento y conversiones de cámara.
- Nuevas pruebas: puntos sólidos de fachadas/objetos, conexión entre entradas, puntos transitables muestreados y movimientos largos sin atravesar sólidos.
- `npm run lint`, `npm run build -- --base=/PortfolioPersonal/` y `git diff --check`: aprobados.

Pendiente: revisión de la rama en navegador real, especialmente caminar por bordes, tamaño y superposición de carteles a distintas resoluciones, toque de móvil, barra inferior, cambios de orientación y lectura con Lexend. No se declara realizada esa validación ni una comprobación exhaustiva de todos los puntos del mapa.

## Recorrido manual sugerido

En escritorio: ir a los cuatro destinos desde el centro y desde cada entrada; cancelar y cambiar rutas; aproximarse manualmente a paredes, silla, troncos, fogón y roca; comprobar que el personaje no se mete en sólidos. En móvil: 320×568, 390×844 y horizontal; seleccionar cada destino desde la barra, revisar ayuda/recorrido y entrar/salir de salas. Usar teclado y movimiento reducido.

PR sin fusionar ni publicar.
