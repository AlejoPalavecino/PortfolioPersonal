# Cierre técnico 0.3.1-review.1 — aceptación interactiva parcial

Se corrigieron dependencias, persistencia de movimiento y dos problemas visuales reproducidos. La auditoría completa pasó de 17 alertas a cero, con instalación reproducible y 72 pruebas correctas. **La aceptación interactiva completa aún no está cerrada**: faltan teclado de principio a fin, texto ampliado, selección transparente de los cuatro destinos y el barrido de sus bordes/esquinas. Se solicitó autorización para retomar el Space 5, que se finalizó prematuramente; no se infiere consentimiento del tiempo transcurrido.

Esta entrega está en `codex/portfolio-closure`, sobre `22c2ca33c736f6648c39e142f775bb8938a6015b`. Al comenzar, `main` y `origin/main` coincidían con la referencia del usuario y el árbol estaba limpio; fetch confirmó divergencia0/0. No había commits posteriores ni cambios locales ajenos. No se hace push, merge, PR ni publicación. La autorización de la iteración anterior no se reutiliza.

## Revisar localmente

La preview local es `http://127.0.0.1:4194/PortfolioPersonal/` mientras permanezca ejecutándose su proceso. **No es una preview remota accesible desde otra computadora.** Para reproducirla y controlar recursos reales, seguir [QA-CLOSURE](QA-CLOSURE.md). El [brief aportado](briefs/2026-10-31-closure.md) y el [contrato](PLAN-CLOSURE.md) conservan alcance y decisiones.

Paquete estático local: `artifacts/portfolio-closure-0.3.1-review.1.zip`,4.672.090 bytes, ignorado por Git. Incluye la build bajo PortfolioPersonal/ y un README para servirla por HTTP. No contiene el servidor/gate de prueba y conserva la condición de aceptación parcial.

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
| Riesgo de código | Después de mover header al scroll, restaurar foco no guardado como botón/enlace podía apuntar al título fuera de pantalla. | Fallback al contenedor visible en lectura previa; apertura nueva conserva foco en título. Revisado por código y suite; reproducción de navegador pendiente. |
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
| Unitarias e integración | npm test | 14 archivos,72 pruebas aprobadas. |
| Lint y fronteras | npm run lint; fixture negativa por stdin | Exit0 en código; exit1 esperado para dominio→app prohibido. |
| Tipos/build | npm run build -- --base=/PortfolioPersonal/ | Exit0;37 módulos, CSS16,84kB y JS46,09kB. Build final tras fallback de foco: index-VfVlbKeH.js. |
| Auditorías | npm audit --json; npm audit --omit=dev --json | Ambas exit0 y cero, con JSON completos. |
| Outdated | npm outdated | Registro respondió; quedan majors opcionales TS/Vite, no equivalen a alertas pendientes. |
| Transporte QA | HTTP real contra tools/qa/closure-server.mjs | Subruta200, retención, JSON de20 frames al liberar,503 y recuperación200. |
| Revisión de código | Dos jueces ciegos + delta de foco | Ver [dictamen](JUDGMENT-CLOSURE.md); no acredita por sí sola los escenarios visuales pendientes. |

RED previo: adaptador de persistencia ausente y prueba de navegador de header con doble scroll. Las regresiones de sesión/cambio del sistema/montaje se escribieron después de existir el comportamiento o implementación: no se declara RED ficticio. `closure-loading.test.ts` usa dobles de DOM/controlador; los dos escenarios siguientes de carga son interacciones separadas de navegador con recursos reales.

## Matriz de aceptación de navegador

Estado: **aprobado** se limita al escenario observado; **parcial** identifica alcance faltante. No se usa el total de tests como aceptación global.

| Escenario | Esperado | Observado en esta sesión | Estado | Evidencia |
| --- | --- | --- | --- | --- |
| Inicio/mundo/menú/Flower en1366×768,390×844,320×568,844×390 | Controles y contenido legibles; sin scroll horizontal | Capturas actuales, documento scrollWidth=clientWidth en los cuatro; Flower320/844 revisadas visualmente | Aprobado para muestras; parcial para todas las superficies | after/intro-*,world-*,menu-*,flower-final-* |
| Header320 con fallo | Un único scroll y reintento accesible | RED218/283 auto; GREEN299/299 visible y cuerpo único488/1379 | Aprobado | before/flower-320x568.png; browser/header{-red,}.test.mjs.txt |
| Cuatro destinos desde menú | Caminar desde posición actual y abrir sección | Cuatro rutas reales sucesivas llegan a hash/título correctos | Aprobado | browser/routes.test.mjs.txt y observaciones del ejecutor |
| Taller: paso posterior | Avatar legible sin ghost en aire | Caminata real510,350→510,229.2→578.4,229.2; cabeza normal arriba del techo, silueta recortada en objeto | Aprobado puntual | before/manual-taller.png; after/manual-taller-target.png |
| Mesa: aproximación al sólido | No atravesar mesa ni pintar ghost en huecos | Caminata real por abajo hasta331.7,480.2; arriba detiene331.7,461.9; espacio entre patas sin ghost pálido | Aprobado puntual | before/manual-mesa-edge.png; after/manual-mesa.png |
| Barrido de lados/esquinas y cinco coordenadas anteriores | Revisar todos los accesos transitables y muestras dirigidas | Solo muestras anteriores y cuatro llegadas; no se completó barrido | Parcial | Recorridos citados; resto pendiente |
| Objeto/cartel/menú y cuatro transparencias, incluido500,260 | Seleccionar solo zonas explícitas y caminar en suelo | Menú y cartel Proyectos comprobados en baseline actual; cuatro transparencias no ejecutadas en esta sesión | Parcial | Registro de baseline y scripts; completar en Space5 |
| Pausa/cambio/cancelación/Abrir ahora | Control recuperable sin apertura tardía | Baseline actual: Contacto pausado→Sobre mí→cancelar; Abrir ahora abre Contacto;5s tras cancelar sin ficha tardía | Aprobado en baseline actual | Observaciones de rondas actuales; no se atribuye cambio nuevo |
| Proyectos→Contacto→menú→Home→reload | URL campamento y ruta cancelada | Baseline actual hash vacío/explore, recarga no abre ficha | Aprobado en baseline actual | Ronda actual de historial |
| Historial y reconocimientos | URLs correctas y borradores inaccesibles | Colección vacía coherente; pruebas de restauración/IDs no publicables pasan; Atrás/Adelante final no repetidos | Parcial | Tests y snapshot de reconocimientos actual |
| Teclado de principio a fin | Sin ratón; Tab entra/sale; Escape único | Movimiento con mundo enfocado, Tab a cartel, flechas sin movimiento fuera del mundo/menú y Escape comprobados; inicio completo sin ratón pendiente | Parcial | Observaciones actuales; no se declara prueba completa |
| Proximidad sin tutorial | Instrucción junto a entrada | Aviso Cerca de Trayectoria visible durante aproximación manual | Aprobado puntual | after/manual-mesa.png |
| Preferencia manual y recarga | Persistencia y cero animaciones | true persiste/reduced tras reload;0 animaciones | Aprobado | browser/motion*.test.mjs.txt |
| Sistema/manual y cambios live | Sistema OR manual, nunca escribir sistema como manual | Manual false con sistema activo sigue reducido; al quitar sistema pasa a full con espera de evento | Aprobado | browser/motion*.test.mjs.txt |
| Storage bloqueado/valor inválido/montaje temprano | Uso disponible, fallback seguro antes de DOM | Getter SecurityError en navegador permite28/28/explore/full; valores inválidos y orden temprano en tests | Aprobado según tipo de prueba | browser/storage-block.test.mjs.txt; tests/closure-*.test.ts |
| Carga retenida→directo→Flower→scroll/control visible→ready | Sin cambio de URL/vista/foco/scroll/ruta/intro | Recurso frames.json retenido:7/28→28/28, scroll280.7999878, enlace visible, hash/phase/reading/posición510,350/intro oculto idénticos | Aprobado | browser/late.test.mjs.txt |
| Fallo→directo→retry retenido→scroll/control→ready | Igual conservación después del reintento | 503 real; retención posterior y7/28→28/28 con mismos valores y foco visible | Aprobado | browser/retry.test.mjs.txt |
| Texto ampliado | Lectura y controles accesibles | Control+Plus rechazado por herramienta; Control+= sin efecto medible. No se sustituyó por un resultado supuesto | No ejecutado | Falta prueba explícita de texto ampliado |
| Foco al volver a lectura desplazada | Contenedor visible si no hay control guardado | Ajuste por inspección y checks; prueba interactiva pendiente | Parcial | CJD-01 y src/app/views.ts |
| Contacto compacto/cambios rápidos/cerrar apertura | Una superficie coherente y sin resurrección | Conservado por código; no se ejecutó matriz final completa de estas variantes | Parcial | Source revisado; ampliar prueba interactiva |

Las capturas marcadas flower-* transitorias y flower-stable-* incorrectas fueron descartadas: se usan solo flower-final-* comprobadas por el ejecutor. Las imágenes de before/after se produjeron en esta sesión; no son las capturas históricas de quality. Se revisaron antes/después de intro, taller y mesa y la ficha320. La ampliación de texto, recorrido íntegro de teclado y transparencias siguen pendientes de retomar el Space finalizado, con autorización solicitada al usuario.

## Materiales de Alejo y límites separados

Materiales editoriales: capturas autorizadas de FoxMind y Flower; originales de ILAN/FoxMind, Egg y UCM con atribución/fecha; confirmación de CV y canales. Los tres candidatos siguen draft, sin diplomas ni menciones inventados. Los avisos de revisión y hechos autorizados de Flower/FoxMind no se retiraron; el exportador de gráficos sigue sin reemplazar el CV.

Limitaciones de ejecución: sin teléfono físico, audio escuchado ni rendimiento/FPS medido. La versión de ego-browser usada no documenta grabación de video; no se afirma recorrido grabado. CI remoto y preview remota no ejecutados por alcance de autorización. La última compilación incluye el fallback de foco posterior a las capturas: ese único caso exige comprobación interactiva adicional. Se publicará solo si un encargo posterior lo autoriza.

## Commits locales y frontera de revisión

| Commit | Unidad |
| --- | --- |
| 1176443 | Dependencias corregidas, migración de reglas sin relajarlas, gate CI y auditorías antes/después. El lockfile y los informes/logs son generados; se mantienen completos aunque superen el presupuesto de código escrito. |
| a5aeec8 | Preferencia manual persistente, integración temprana y regresiones. |
| b5b7022 | Máscara alfa de oclusión, separación de estilos y capturas de caminatas actuales. |
| c71eeda | Lectura única, restauración de foco y viñeta con evidencia visual actual. |
| 4e7992b | Regresión de preparación diferida, servidor HTTP QA aislado e instrucciones reproducibles. |
| faa18a6 | Fuente original del encargo,380 líneas aportadas. |

El commit documental posterior registra matriz, contratos, capturas y estado parcial. Todas las unidades de código/documentación escrita están por debajo de400 líneas; los informes automáticos, lockfile y binarios se distinguen. Gitleaks staged se ejecutó antes de cada commit sin filtraciones. El código final coincide, salvo finales de línea, con el árbol8bc83139ea3d857596011358103a73ff41636c75 revisado por ambos jueces. No hay publicación ni integración remota.
