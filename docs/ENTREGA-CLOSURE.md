# Cierre técnico 0.3.1-review.1 — validación dirigida realizada

Se completó la validación funcional dirigida después de retomar el navegador con autorización. Se corrigieron dependencias, persistencia, lectura y oclusión, y la reanudación encontró y corrigió recortes de texto200, un paso estrecho que A* no encontraba y pérdida de foco al reanudar. Auditoría completa17→0;76 pruebas, lint y build correctos. La matriz definitiva, método, resultados y límites están en [ACEPTACION-CLOSURE](ACEPTACION-CLOSURE.md). Las capturas GREEN200 están bloqueadas por timeout del compositor; se entregan métricas y scripts reales, sin presentarlas como capturas obtenidas.

Esta entrega está en `codex/portfolio-closure`, sobre `22c2ca33c736f6648c39e142f775bb8938a6015b`. Al comenzar, `main` y `origin/main` coincidían con la referencia del usuario y el árbol estaba limpio; fetch confirmó divergencia0/0. No había commits posteriores ni cambios locales ajenos. No se hace push, merge, PR ni publicación. La autorización de la iteración anterior no se reutiliza.

## Revisar localmente

La preview local es `http://127.0.0.1:4194/PortfolioPersonal/` mientras permanezca ejecutándose su proceso. **No es una preview remota accesible desde otra computadora.** Para reproducirla y controlar recursos reales, seguir [QA-CLOSURE](QA-CLOSURE.md). El [brief aportado](briefs/2026-10-31-closure.md) y el [contrato](PLAN-CLOSURE.md) conservan alcance y decisiones.

Paquete estático local: `artifacts/portfolio-closure-0.3.1-review.1.zip`, ignorado por Git. Incluye la build bajo PortfolioPersonal/ y un README para servirla por HTTP. No contiene el servidor/gate de prueba y corresponde a la compilación final; los límites de evidencia están en el acta.

```powershell
npm ci
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/ --port 4194
```

Node24.20.0, npm12.0.2. Baseline ejecutada en esta sesión: 66/66 pruebas, lint y build correctos; no se copiaron resultados ni capturas de la entrega previa para acreditarla.

## Clasificación y cambios materiales

| Clase | Hallazgo actual | Acción |
| --- | --- | --- |
| Problema reproducido | Auditoría completa17: 3critical, 2high, 12moderate; producción0. No fue un fallo de red. | Actualizaciones controladas y override acotado; ambas auditorías finales0. |
| Problema reproducido | Ajuste manual de movimiento solo duraba el montaje. | Clave `camp:motion:v1`, validación y errores tolerados; aplicación antes de insertar DOM, sistema OR manual, escritura exclusivamente manual. |
| Problema reproducido | Flower320×568 con fallo de carga tenía header218/283 con overflow:auto, además del cuerpo desplazable. | Encabezado dentro de `.panel-scroll` único; en GREEN header299/299 y overflow:visible, cuerpo488/1379. Contenido y controles completos. |
| Problema reproducido | Caminando legítimamente al taller y mesa, el ghost rectangular cubría aire/espacio entre patas. | Máscara alfa del sprite real en espacio del mundo. La cabeza normal permanece visible fuera del objeto y el ghost solo se dibuja donde hay arte opaco. No se cambian huellas ni entradas. |
| Riesgo de código | Después de mover header al scroll, restaurar foco no guardado como botón/enlace podía apuntar al título fuera de pantalla. | Fallback al contenedor visible en lectura previa; apertura nueva conserva foco en título. Comprobado también en navegador: Proyectos278.39999→Contacto→Atrás mantiene scroll y foco visible en contenedor. |
| Mejora visual propuesta | Viñeta de inicio tenía un rectángulo luminoso poco reconocible como farol. | Asa/base y luz local CSS, micro movimiento1px del avatar; mismo anclaje100×58, sin descargas nuevas ni espera mínima, estática con reducción. |
| Ya resuelto, verificado de nuevo | Carga tardía y fallo/reintento preservan lectura directa. | No se inventa una corrección del loader: se añaden regresión y evidencia actual con recurso real retenido/liberado. |
| Ya resuelto, conservado | Cuatro áreas, cámara/terreno, rutas, contenido autorizado y borradores. | Se reutilizan; no se regenera terreno ni se introduce motor/stack nuevo. |

Los carteles conservan reglas y orden en `world-signs.css`, extraídos para que `scene.css` no supere200 líneas. No hubo cambios de dimensiones ni anclajes de terreno o sprites. La máscara utiliza las dimensiones y offsets del propio POI y comparte la transformación de cámara.

## Dependencias y seguridad

El [informe antes/después](DEPENDENCIES-CLOSURE.md) contiene los17 paquetes, versiones iniciales, cadenas, avisos originales, exposición, condiciones, versiones corregidas y acciones. Sus JSON/códigos/logs están en `evidence/closure/dependencies/`.

- Vitest3.2.7→4.1.12 elimina tinypool; mocker queda corregido.
- ESLint9.39.5 fuera de soporte→10.14.0, `@eslint/js`10.0.1; boundaries5.4→7.4 incorpora Handlebars4.7.10. Se conserva la matriz de fronteras y una importación prohibida dominio→app se rechaza.
- `minimatch@^10`→11.0.3 mediante override limitado: 484 combinaciones comparadas, árbol válido y checks completos. El cruce de major debe reevaluarse al actualizar consumidores; no se afirma equivalencia universal.
- TypeScript5.9, Vite7 y typescript-eslint8 se conservan. No se ejecutó audit fix --force ni se borró el lockfile ni se relajaron reglas para obtener verde.
- CI queda preparado para auditoría completa en PR/main y gate de Pages con umbral moderate; errores de registro también detienen el paso. **Los workflows nuevos no se ejecutaron en GitHub**, dado que no hay publicación autorizada.

No quedan alertas reportadas en las dos consultas finales. Esto describe el registro y grafo consultados, no una garantía de ausencia absoluta de vulnerabilidades. Las herramientas dev fueron evaluadas como exposición de desarrollo/compilación/CI, sin confundirlas con código servido al visitante.

## Comprobaciones automatizadas

| Tipo | Ejecución real | Resultado |
| --- | --- | --- |
| Instalación | npm ci después de actualizar y otra vez al integrar | Exit0;163 paquetes auditados, cero vulnerabilidades. |
| Unitarias e integración | npm test | 16 archivos,76 pruebas aprobadas. |
| Lint y fronteras | npm run lint; fixture negativa por stdin | Exit0 en código; exit1 esperado para dominio→app prohibido. |
| Tipos/build | npm run build -- --base=/PortfolioPersonal/ | Exit0;37 módulos, CSS17,41kB y JS46,25kB; build final index-lBr5vm9a.js / index-CYdIkpLU.css. Logs retested-* actualizados. |
| Auditorías | npm audit --json; npm audit --omit=dev --json | Ambas exit0 y cero, con JSON completos. |
| Outdated | npm outdated | Registro respondió; quedan majors opcionales TS/Vite, no equivalen a alertas pendientes. |
| Transporte QA | HTTP real contra tools/qa/closure-server.mjs | Subruta200, retención, JSON de20 frames al liberar,503 y recuperación200. |
| Revisión de código | Dos jueces ciegos + revisión L1 de foco | Ver [dictamen](JUDGMENT-CLOSURE.md); la revisión estática no sustituye las interacciones del acta. |

RED previo: adaptador de persistencia ausente y prueba de navegador de header con doble scroll. Las regresiones de sesión/cambio del sistema/montaje se escribieron después de existir el comportamiento o implementación: no se declara RED ficticio. `closure-loading.test.ts` usa dobles de DOM/controlador; los dos escenarios siguientes de carga son interacciones separadas de navegador con recursos reales.

## Matriz final de navegador

La [matriz definitiva](ACEPTACION-CLOSURE.md) registra esperado, observado, estado y evidencia: recorrido enteramente por teclado, cuatro transparencias y suelo500,260, foco/scroll, cambios rápidos, reconocimientos, preparación tardía con y sin reintento, texto200, cuatro viewports y muestras reales de contorno de los cuatro destinos. Incluye posiciones alcanzadas y las exclusiones de zonas no transitables; no equivale a inspeccionar cada píxel.

Las capturas normales before/after fueron tomadas en esta iteración. Los recortes200 se reprodujeron y corrigieron con métricas del navegador; captura normal y dos variantes CDP agotaron timeout. No se usaron imágenes anteriores para acreditar esas correcciones. Los scripts de las rondas retomadas están en evidence/closure/acceptance/.

## Materiales de Alejo y límites separados

Materiales editoriales: capturas autorizadas de FoxMind y Flower; originales de ILAN/FoxMind, Egg y UCM con atribución/fecha; confirmación de CV y canales. Los tres candidatos siguen draft, sin diplomas ni menciones inventados. Los avisos de revisión y hechos autorizados de Flower/FoxMind no se retiraron; el exportador de gráficos sigue sin reemplazar el CV.

Limitaciones de ejecución: sin teléfono físico, audio escuchado ni rendimiento/FPS medido. La versión de ego-browser usada no documenta grabación de video; no se afirma recorrido grabado. CI remoto y preview remota no ejecutados por alcance de autorización. El fallback de foco ya se comprobó en navegador; la última compilación añade además foco en el mundo después de Continuar, con RED/GREEN unitario y prueba interactiva. La ampliación fue simulación explícita de texto200, no zoom nativo; su reflow se comprobó geométricamente y la captura final quedó bloqueada por la herramienta. Se publicará solo si un encargo posterior lo autoriza.

## Commits locales y frontera de revisión

| Commit | Unidad |
| --- | --- |
| 1176443 | Dependencias corregidas, migración de reglas sin relajarlas, gate CI y auditorías antes/después. El lockfile y los informes/logs son generados; se mantienen completos aunque superen el presupuesto de código escrito. |
| a5aeec8 | Preferencia manual persistente, integración temprana y regresiones. |
| b5b7022 | Máscara alfa de oclusión, separación de estilos y capturas de caminatas actuales. |
| c71eeda | Lectura única, restauración de foco y viñeta con evidencia visual actual. |
| 4e7992b | Regresión de preparación diferida, servidor HTTP QA aislado e instrucciones reproducibles. |
| faa18a6 | Fuente original del encargo,380 líneas aportadas. |

El commit documental7a3374c registró el estado parcial original; la reanudación y su acta lo reemplazan como resultado vigente. Todas las unidades de código/documentación escrita están por debajo de400 líneas; los informes automáticos, lockfile y binarios se distinguen. Gitleaks staged se ejecutó antes de cada commit sin filtraciones. El código final coincide, salvo finales de línea, con el árbol36987e87b1530a3b8adf82b17dc517c8e976f00f revisado por ambos jueces, más el microfix L1 de foco en9d6c6b1c379412b93909fe3b4b2ae13f6d2768ec con revisión ordinaria y verificación propia. No hay publicación ni integración remota.

Reanudación autorizada y cierre del estado parcial:

| Commit | Unidad |
| --- | --- |
| 7a3374c | Entrega inicial parcial, conservada como registro previo. |
| 21672e6 | Reintento acotado del paso estrecho y3 regresiones. |
| 5fd959a | Texto ampliado con reflow de título, controles y menú. |
| 0746ed5 | Foco útil al reanudar, regresión y acta final de aceptación dirigida. |
| ae8f408 | Helper ejecutado y evidencia real de las pruebas retomadas, con límites de captura. |

El commit documental final actualiza este resultado y la matriz a76 pruebas. Los estados parciales del registro7a3374c no son el resultado vigente.
