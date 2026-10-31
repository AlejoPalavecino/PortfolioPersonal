# Geometría de destinos

Coordenadas del mundo de 1000 × 650, origen arriba a la izquierda. Los sprites conservan su escala y anclaje; el avatar conserva los anclajes propios de cada frame. Las huellas y áreas de selección son polígonos definidos en `destinations.ts`; sus rangos a continuación son envolventes, no rectángulos de colisión.

| Destino | Envolvente huella | Entrada exterior | Profundidad Y | Selección: envolvente |
| --- | --- | --- | --- | --- |
| Taller | 528,274–772,317 | 650,345 | 317 | 520,132–785,315 |
| Carpa | 125,260–295,317 | 220,335 | 317 | 112,155–300,315 |
| Mesa | 263,395–420,466 | 365,477 | 466 | 260,325–420,457 |
| Radio | 690,357–844,420 | 680,405 | 420 | 690,275–840,420 |

La entrada de radio queda al costado frontal: delante de la plataforma no hay una franja suficiente entre sus escalones y el límite del terreno. Las cuatro entradas son transitables y están conectadas entre sí por `findPath`. Los polígonos de selección excluyen el suelo transparente (500,260) y no usan la caja completa de los archivos. La silueta semitransparente indica un personaje detrás de una estructura en áreas conservadoras de oclusión; no altera la profundidad normal.

Anclajes de imagen: taller (490,117), ancho 320; carpa (100,110.5), ancho 220; mesa (250,299), ancho 190; radio (660,234), ancho 200. `camp-hillside.webp` ocupa 1000 × 650 unidades. La tablilla del taller y la de radio reciben señales accesibles; la mesa lleva una placa y la carpa una señal con poste.

La calibración numérica usa las proporciones del arte y la captura de referencia. Se contrastaron los cinco puntos auditados y capturas de aproximación representativas de los cuatro destinos sobre la composición final. Taller usa silueta en sus pasos posteriores y los dos puntos de mesa son sólidos. Hay 14 muestras transitables laterales/frente/fondo comprobadas mediante renderer y `moveSafely`; dos lados no tuvieron candidato transitable en la muestra. Las pruebas de conectividad no sustituyen esta revisión visual, ni las muestras constituyen un barrido continuo de cada píxel del contorno.
