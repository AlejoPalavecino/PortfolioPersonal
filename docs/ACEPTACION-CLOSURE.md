# Validación retomada — 0.3.1-review.1

Esta acta reemplaza el estado parcial del commit7a3374c. El usuario autorizó retomar las pruebas; Space5 ya no existía y se creó el reemplazo autorizado `closure-acceptance-20261031`, ID12. La matriz principal se ejecutó sobre `index-Bi_GUKpP.js` / `index-CYdIkpLU.css`, bajo `/PortfolioPersonal/`. El último microfix solo afecta el foco después de Continuar: build final `index-lBr5vm9a.js`, misma CSS, con prueba unitaria y de navegador propia. No se presenta cada caso anterior como repetido después de ese delta independiente.

**La validación funcional dirigida quedó completada en el entorno disponible.** No es certificación de accesibilidad, barrido de cada píxel, prueba de teléfono físico ni medición de FPS. Las capturas GREEN de texto ampliado no pudieron obtenerse por timeout del compositor: la evidencia nueva de esos casos son métricas de layout y scripts ejecutados, sin reutilizar capturas anteriores como prueba de la corrección.

## Regresiones encontradas y corregidas al retomar

| Reproducción actual | Cambio material | Resultado |
| --- | --- | --- |
| Texto200, Flower320: botón Volver al campamento terminaba en x425 fuera del panel; después apareció h2/palabra larga con panel281/363. | Navegación envuelve controles; título/contenido y elementos de grid pueden contraerse y dividir palabras largas. No se oculta overflow para tapar contenido. | Panel281/281 y ningún descendiente con exceso horizontal. |
| Texto200, inicio844: nombre invadía columna de acciones. | Hijos del grid con mínimos0 y wrapping; enlaces de inicio envuelven. | Título320/320; termina x402.4, acciones comienzan x426.4; sin solapamiento horizontal. |
| Texto200, menú320: client265/scroll321. | Columna minmax(0,1fr), mínimos0 en controles y sus textos. |265/265; botones ajustados; lectura vertical480/775. |
| Suelo este850,390 transitable: A* con celda8 devolvía null y el clic no movía. | Un único reintento con celda4 si falla la búsqueda habitual; obstáculos y margen5 intactos. |3 regresiones pasan tras2 fallos RED iniciales; llegada real849.9,389.5 y retorno caminando a Proyectos650,345. |
| Helper QA no podía pulsar Flower fuera de viewport bajo. | Scroll real del control antes de pulsarlo. Es código de prueba, no una espera artificial en producción. | Wrapper portable ejecutado completo, dos escenarios de carga aprobados. |
| Continuar ocultaba el botón y dejaba foco en BODY. | Despachar reanudación y enfocar el mundo con preventScroll. | RED/GREEN unitario y navegador final: foco world inmediato; flecha recupera control manual sin abrir ficha. |

## Método de texto ampliado

No se presenta como zoom nativo. El harness toma todos los tamaños de texto **antes** de aplicar cambios y luego duplica font-size en lote, evitando multiplicaciones por herencia. Duplica line-height computado; si es normal usa1.2×font como referencia. No altera la aplicación de producción ni se activa con un parámetro oculto. Cada caso recarga antes de medir para no acumular2× sobre2×. El viewport real se comprueba en la misma invocación; se descartaron medidas de otras rondas que habían vuelto a256×455.

## Matriz final

| Escenario | Esperado | Observado | Estado | Evidencia actual |
| --- | --- | --- | --- | --- |
| Recorrido sin ratón | Entrar, elegir destino/caso, volver, abrir/cerrar menú y salir del mundo por Tab | Tab→Enter desde inicio, Tab→cartel Proyectos→Enter y caminata, Tab×2→Flower→Enter, Escape×2 a lista/camp; Tab×5→menú→Enter→Escape. Foco y hash correctos; sin click ni focus helper. | Aprobado | Scripts keyboard-01/02/03 y repetición final del ejecutor. |
| Flechas durante lectura/menú | No mover al avatar | ArrowLeft no cambió650,345; Escape realiza una acción y recupera foco del menú. | Aprobado | Recorrido de teclado actual. |
| Pausa→cerrar menú→Continuar | Mantener pausa al cerrar, reanudar con foco útil |116.5,295.8 se conserva al cerrar menú; Continuar avanza a120,304. El microfix posterior devuelve foco al mundo en la build final, y una flecha cancela ruta para control manual. | Aprobado | pause-resume-last.test.mjs.txt, resume-focus-green.test.mjs.txt y closure-resume-focus.test.ts. |
| Foco/scroll al restaurar | Mantener lectura desplazada con foco visible | Proyectos con foco en panel-scroll y scroll278.39999→Contacto→Atrás: mismos scroll y foco visible en contenedor. | Aprobado | focus-restore.test.mjs.txt. |
| Transparencias de cuatro objetos y suelo500,260 | Caminar por suelo, sin seleccionar sección | Alfa0 del archivo real, fuera de polígonos, punto transitable; clic real inicia Caminando/routing y hash vacío. Cancelación entre casos. | Aprobado | transparent-last.test.mjs.txt; puntos795,257;305,316;415,344;675,374 y500,260. |
| Llegadas, pausa/cambio/cancelar/Abrir ahora | Intenciones y controles coherentes, sin apertura abandonada | Cuatro llegadas comprobadas en esta iteración; teclado actual llega a Proyectos/Flower; cambio y cancelación con recuperación manual, pausa/reanudar explícitos y Abrir ahora comprobados en las rondas actuales. | Aprobado para escenarios dirigidos | Registros de esta iteración y scripts preservados; no se acreditan con el informe de quality. |
| Extremo este y vuelta | Atravesar el paso legítimo y volver a contenido |510,350→849.9,389.5; menú Proyectos desde este muestra ruta y llega650,345/#proyectos. Sin teletransporte ni Abrir ahora. | Aprobado | radio-complete-return.test.mjs.txt; closure-narrow-path.test.ts. |
| Contornos y esquinas transitables | Aproximarse a sólidos por pasos existentes, sin atravesarlos | Muestras reales de los cuatro destinos y puntos listados abajo; las zonas fuera del polígono no se fuerzan como caminables. | Aprobado dirigido | Scripts edges/tent-corners/table-west y registros de llegada. No barrido pixel a pixel. |
| Reconocimientos e historial | Colección sin borradores, Atrás/Adelante coherentes | Los3 IDs draft normalizan a colección; Recorrido→Atrás→Adelante conserva rutas/títulos esperados. | Aprobado | credentials.test.mjs.txt y tests de publicación. |
| Cambios rápidos/cierre | No resucitar panel ni enfocar superficie oculta | Proyectos→Flower→Escape×2 durante apertura: después350ms hash vacío, panel hidden/inert, mundo activo y foco world. | Aprobado | rapid.test.mjs.txt. |
| Contacto | Superficie ajustada al contenido | Panel620×556 en1366×768 con acciones esperadas; no ocupa toda la altura de ficha extensa. | Aprobado puntual | Registro rapid.test.mjs.txt. |
| Preparación retenida→Flower→listo | Mantener URL/vista/foco visible/scroll/personaje/ruta e intro oculta | Wrapper actual:7/28→28/28 sin cambios de estado, enlace visible y scroll280.7999878. | Aprobado | tools/qa/closure-load.mjs ejecutado en build final. |
| Fallo503→reintento retenido→listo | Igual conservación tras recuperación | Dos fases con recursos reales;6/28 o7/28→28/28, sin cambios de lectura. | Aprobado | Wrapper portable y current-late.test.mjs.txt. |
| Preferencias | Manual persistente, sistema OR manual, almacenamiento opcional | Persistencia/reload y0 animaciones; sistema mantiene reducción al desactivar manual y responde al retirarlo; bloqueo real y valores inválidos automatizados no impiden uso. | Aprobado según tipo de prueba | Pruebas unitarias/montaje y rondas reales de esta iteración; política no cambió en este delta. |
| Flower1×, cuatro viewports | Sin desborde horizontal, título completo y header sin scroll propio | Viewport real1366×768/390×844/320×568/844×390: documento1366/390/320/844, panel1077/351/281/736, header123/186/213/66 con client=scroll y overflow visible. JS final verificado. | Aprobado geométrico | flower-viewports-last.test.mjs.txt. |
| Texto200, Flower320 y844 | Controles/texto completos y lectura desplazable |320×568 panel281/281;844×390 panel736/736; ningún descendiente desborda horizontalmente. | Aprobado geométrico | text320-last.test.mjs.txt y text844-last.test.mjs.txt. |
| Texto200, menú320 e inicio844 | Controles accesibles sin invadir columnas | Menú265/265 con scroll vertical; inicio con nombre y CTA separados. Cambios posteriores solo fueron CSS de lectura. | Aprobado geométrico | text-menu-green.test.mjs.txt y text-intro-green.test.mjs.txt. |
| Capturas GREEN200 | Imagen actual como evidencia visual complementaria | Captura normal y dos variantes CDP fallan por timeout pese a ventana normal; no se genera una captura ficticia ni se usa una antigua para probar el cambio. | Bloqueado por herramienta | capture-limit.txt y scripts de diagnóstico. |
| Teléfono/audio/FPS/video | Afirmarlos solo si se prueban | No hay teléfono físico, escucha de audio ni benchmark. Recorder no documentado en la interfaz usada. | No ejecutado | Límite conservado, no criterio sustituido con mocks. |

## Puntos reales de contorno

Llegadas observadas, tolerancia aproximada2 unidades. Son trayectos del juego mediante clic/teclado y no posiciones inyectadas:

| Área | Muestras observadas |
| --- | --- |
| Taller |515.4,261.4;783.3,261.5;515.4,329.8;649.3,328.7 y paso posterior578.4,229.2. |
| Mesa |250.4,382.8;431.9,382.7;431.9,477.4;341.1,477.3 y aproximación al sólido331.7,461.9. |
| Carpa |304.4,317.2;109.7,319.1;306.7,328.6;306.7,288.4;112.7,287.1 más entrada220,335. |
| Radio |674.3,373.5;677.9,344.8;849.9,389.5; retorno a650,345 y entrada680,405. |

Los candidatos de fondo de carpa en y248 y esquinas fuera del límite no se presentan como recorridos posibles; lo mismo para sur de radio en y432. Las cinco coordenadas de auditoría siguen cubiertas numéricamente y las caminatas añaden evidencia de oclusión y sólidos. No se certifica cada píxel del contorno. El rAF del entorno fue lento y hubo esperas agotadas que luego completaron: se cuentan llegadas observadas, no tiempos de rendimiento ni destinos aún en curso.

## Resultado técnico y materiales

76/76 pruebas en16 archivos, lint, tipos/build y ambas auditorías0. Dos jueces aprobaron el delta inmutable36987e87b1530a3b8adf82b17dc517c8e976f00f sin hallazgos; el microfix L1 de foco posterior se revisó aparte en9d6c6b1c379412b93909fe3b4b2ae13f6d2768ec, LGTM sin hallazgos, con RED/GREEN unitario y navegador. Los logs retested-* conservan las ejecuciones; CI remoto sigue preparado, no ejecutado. No se hizo push ni publicación.

Pendientes editoriales de Alejo: capturas autorizadas, originales y atribución de credenciales, CV/canales definitivos. No hay credenciales publicadas que permitan afirmar una inspección visual de documentos originales todavía ausentes. Los avisos y hechos autorizados de FoxMind/Flower permanecen.
