# Versión local de revisión 0.1.0

Portfolio de Alejo Palavecino a partir del Dossier 1.0. Se conserva el campamento, la ficha crema integrada, la cabecera con emblema y el mapa adoptado. La salida estática se genera en `dist/`; el arranque y mantenimiento se explican en el [README](../README.md).

## Recorrido de revisión

1. Abrir el inicio, elegir Ver proyectos y observar la caminata hasta el taller.
2. Abrir FoxMind, leer la ficha y volver a Proyectos. Flower utiliza el mismo formato con su información confirmada.
3. Cambiar a Trayectoria o Contacto; durante la ruta probar Abrir ahora y Cancelar recorrido.
4. En escritorio, enfocar Explorar el campamento, caminar con flechas/WASD y usar Enter/E junto a una entrada.
5. En móvil, abrir Menú: cuatro destinos y ajustes. Activar movimiento reducido para abrir contenido directamente.
6. Descargar el PDF aportado y comprobar los dos motivos de correo. Los enlaces de correo preparan un mensaje en la aplicación del visitante; no lo envían.

## Estado E1–E4

| Entrega | Estado de esta revisión |
|---|---|
| E1 | Navegación profesional y fichas implementadas. Contenido de trabajo identificado. |
| E2 | Caminata, rutas, colisiones, interrupciones y controles implementados; evidencias funcionales detalladas en este documento al cerrar QA. |
| E3 | Adaptación, teclado, audio voluntario, recuperación de escena y exportaciones implementados. Contenido final y evaluación humana de identidad/mezcla pendientes. No se declara aceptación global. |
| E4 | Fuentes, dependencias fijadas en lockfile, salida estática y guía de mantenimiento entregadas. Publicación no encargada. |

## Ajustes materiales y elecciones técnicas

| Ajuste | Motivo y efecto |
|---|---|
| Vite + TypeScript estricto y HTML/DOM modular | Sitio estático sin cuentas, mensajes almacenados ni backend. No necesita infraestructura permanente ni secretos. React/Next agregarían runtime y convenciones que este alcance no exige; Go/.NET/Rust/Python de servidor tampoco aportan una función requerida. |
| Geometría única de 1000 × 650 | Los marcos del dossier son referencias, no colisiones finales. Se conserva el terreno indivisible, el orden relativo de los destinos y el acceso terrestre a radio. El móvil adapta el encuadre sin reordenar plataformas. |
| Colisiones poligonales y A* con segmentos comprobados | Permite caminar en suelo admitido y encontrar rutas desde posiciones libres, sin limitar el avatar a cuatro animaciones predefinidas. La llegada se emite tras consumir el recorrido físico. |
| Escala y posición de objetos ajustadas al suelo real | Las huellas y entradas se separan del rectángulo transparente del arte. Se preservan los cuatro claros y el taller protagonista. |
| Derivados WebP y recortes por frame | Se conservan maestros. Los 20 frames usan recortes/anclajes individuales del atlas, sin asumir celdas uniformes. |
| Perfil documental `solo` provisional | Permite mantener dos documentos esenciales sin abrir otra entrevista que el handoff indica innecesaria para empezar. No se atribuye una elección adicional a Alejo. |
| Sin enlaces sociales históricos | Los enlaces del CV no se presentan como canales revisados. El correo y PDF aportados se utilizan identificados como material de revisión. |
| Audio pausado requiere acción explícita para continuar | Regla conservadora de la propuesta complementaria: volver a una pestaña no produce sonido inesperado. La preferencia voluntaria se mantiene en la visita. |
| `noindex` durante la revisión | Evita indexar reservas y datos aún no aprobados si la salida se comparte por accidente. Antes de publicar se revisan metadatos y URL absoluta de portada. |

No se eliminó la caminata ni se sustituyó el mapa por una captura plana. Las reglas complementarias se mantienen como base implementada para revisión; este registro no las convierte en decisiones previamente aprobadas.

## Recursos y condiciones

Las once imágenes WebP principales suman 1.517.246 bytes; sus dimensiones y tamaños individuales están en `public/assets/export-report.json`. El directorio web completo de recursos suma 4.833.070 bytes (42 archivos, antes de compresión HTTP). No se declara un presupuesto de carga cumplido sin una medición de red. Los archivos maestros y las licencias del kit permanecen en el paquete original; las fuentes incluyen copias de sus licencias en la salida web.

Las pruebas geométricas cubren todas las parejas de inicio/entradas, obstáculos, margen corporal y pasos largos. El muestreo adicional de 2.658 puntos libres encontró conexión al inicio para todos ellos; es un muestreo finito, no una demostración exhaustiva de continuidad geométrica ni de alineación artística.

## Pendientes con responsable

| Pendiente | Responsable | Efecto |
|---|---|---|
| CT-01/02: revisión profesional y agrupación de servicios | Alejo revisa; colaboración editorial ajusta | No afirmar disponibilidad, modalidad o cargos no acreditados. |
| CT-03/04: capturas elegidas y pies de FoxMind | Alejo selecciona; colaboración redacta; agente integra | Caso de revisión; excluir de publicación mientras esté incompleto. No se requiere código/demo/repositorio. |
| CT-06: evidencia real de Flower y revisión final | Alejo aporta; colaboración redacta; agente integra | Caso de revisión. Sus tecnologías, aporte individual, producción y ARCA ya están confirmados. |
| CT-08: estudios, continuidad, fechas y PDF final | Alejo confirma | Se omiten fechas/estudios no confirmados; el PDF aportado no se declara definitivo. |
| CT-09: canales elegidos | Alejo confirma; agente comprueba | Correo de trabajo identificado; enlaces sociales omitidos. |
| Parecido individual del avatar y revisión visual final | Alejo | Aceptación artística pendiente sobre esta versión concreta. |
| Mezcla de audio en dispositivo real y pruebas táctiles físicas | Agente + Alejo | La emulación de navegador no acredita escucha ni gestos en hardware real. |
| Publicación y AC-25 | Alejo encarga; agente ejecuta después | No hay URL pública ni despliegue en este encargo. |

CT-05/07/10 son opcionales: marcas oficiales, tercer caso y evidencia de reconocimiento se omiten. Para publicar debe existir al menos un caso completo entre FoxMind y Flower; no basta la compilación.

## Memoria y operación

Engram identificó `portfolioalejo` pero la búsqueda acotada devolvió `unknown_project`; no se confirma persistencia de claves ni se mezclan memorias de FoxMind con este proyecto. El estado verificable se conserva en estos documentos y en Git local. No hay migraciones, base de datos, Docker, variables de entorno ni integración de terceros que preparar.

El intento final de guardar el resumen fue bloqueado por el hook de Engram: `Codex host session resolution could not be confirmed`. No se inventó una identidad de sesión ni se eludió el control. El registro local queda completo aunque la persistencia externa no esté disponible.

Git local usa la rama `feat/portfolio-review`. La importación inicial conserva el dossier original y derivados; el lockfile y esos materiales suministrados/generados se distinguen del código escrito. Las siguientes unidades tienen entre 186 y 375 líneas authored por commit. Antes de cada commit se ejecutó Gitleaks staged sin hallazgos. No se configuró un remoto ni se creó un PR.

## Evidencias de ejecución

Entorno: Windows, Node.js 24.20.0, npm 12.0.2 y Chromium de ego(lite). QA de producción en `http://127.0.0.1:4173`, escritorio 1440 × 1000 y móvil emulado 390 × 844. Las últimas pruebas usaron la salida estática sin HMR. No se utilizó un teléfono físico.

| Comprobación | Resultado observado |
|---|---|
| `npm test` | 2 suites, 15 pruebas aprobadas: estados, interrupciones, colisiones y rutas. RED inicial y tres RED adicionales registrados por test_runner antes del GREEN. |
| `npm run lint` | Sin errores, incluidos los límites de capas. Un import adversarial dominio→app fue rechazado por `boundaries/element-types`. |
| `npm run build` | TypeScript y Vite aprobados. HTML 2,55 kB, CSS 8,69 kB y JS 25,75 kB; gzip calculado por Vite: 1,14 / 2,73 / 9,32 kB. Los recursos estáticos se contabilizan aparte. |
| Cuatro autorutas desde inicio | Proyectos 1963 ms, Sobre mí 1715 ms, Trayectoria 1192 ms, Contacto 1494 ms, hasta título visible. Una medición por destino; no son percentiles ni un SLA. |
| Sustitución y omisión | Proyectos→Contacto conserva el último destino; Abrir ahora abrió Contacto. |
| Cancelación | Desde Contacto, seleccionar Sobre mí y cancelar restaura Contacto. `history.length` quedó estable (29→29) al iniciar/cancelar. |
| Historial y enlace directo | FoxMind utiliza `#proyectos/foxmind`; recargar recuperó la ficha. Regresos de ficha/lista y Escape revisados. |
| Teclado | Enter en rótulo inicia autoruta. ArrowRight sostenida cambió x de 51% a 57,25% y mostró walk-right; soltar conserva posición y muestra idle-right. Perder foco detuvo el control; reducción impidió moverse. |
| Salto al contenido | Desde FoxMind conserva su hash y enfoca el título, sin cerrar la ficha. |
| Pestaña oculta | Ruta queda en pausa; volver mostró Continuar recorrido y no la reanudó solo. Continuar abrió Proyectos. |
| Fallo y reintento | Bloqueo de camp-ground.webp mostró aviso; Contacto abrió directo. Desbloquear y Reintentar conservó Contacto y recuperó escena. |
| Móvil | Cuatro rótulos visibles, menú en flujo con ajustes legibles, ancho documental 390 sin desborde; seleccionar la sección actual mantiene lectura y devuelve foco a Menú. |
| CV | Respuesta 200 `application/pdf`, descarga real obtenida. SHA-256 de la descarga y del archivo servido: `fd1aecc7c8c5d4d0a4f5ab7e12402961bd4c4b176d9cc697b0783e2b15e9c330`. Sigue pendiente elegir versión definitiva. |
| Contacto | Correo visible; asuntos diferenciados Oportunidad laboral y Proyecto de desarrollo. No se envió correo. |
| Audio | Inicio apagado y toggle aria-pressed false→true con nombre accesible Activar→Desactivar; después se apagó. Escucha y mezcla no verificadas. |

Capturas finales: [escritorio](evidence/desktop.png), [móvil](evidence/mobile.png), [menú móvil](evidence/mobile-menu.png). Las capturas `initial-*` conservan la evidencia anterior a los arreglos. Los guiones de QA en `tools/qa/` registran pasos de esta sesión; sus identificadores de Space y referencias de snapshot no son fixtures reutilizables entre sesiones. Las pruebas repetibles del dominio están en `tests/`.

## Cobertura de aceptación sin sobreafirmaciones

No se declara aprobada automáticamente la totalidad de los 30 criterios. Esta matriz distingue evidencia ejecutada de cierre completo:

| Criterio | Estado en esta entrega |
|---|---|
| AC-01–04 | Recorridos principales y equivalencia de contenido implementados, cuatro autorutas verificadas. La matriz exhaustiva de cada objeto/rótulo/menú en ambas condiciones queda parcial. |
| AC-05/06 | HTML seleccionable, ficha crema y paisaje verificados visualmente. Ampliación de texto/zoom exhaustivos pendientes. |
| AC-07/08 | Regresos, enlace directo, Escape, foco de lectura y cancelación comprobados; revisión completa de orden Tab y scroll en todos los casos parcial. |
| AC-09/10 | Teclado acotado, sostenido y liberación comprobados; Enter en rótulo comprobado. La matriz manual de proximidad a las cuatro entradas queda parcial. |
| AC-11/12 | Geometría y segmentos probados, caminata visible y anclajes aplicados. Inspección artística exhaustiva de cada giro/objeto queda parcial. |
| AC-13 | Visitas cosméticas implementadas sin bloqueos; no se ejecutó comparativa exhaustiva visitante nuevo/completo. |
| AC-14–16 | Móvil emulado, ajustes y reducción comprobados. Dispositivos físicos, 320 px, zoom y auditoría de accesibilidad completa pendientes. |
| AC-17 | Controles e inicio silencioso comprobados; escucha/mezcla y todos los fallos de reproducción pendientes. |
| AC-18 | Pendiente de Alejo: evidencia real y revisión editorial de los casos. |
| AC-19/20 | Enlaces y descarga funcionan; canales y PDF definitivos pendientes de Alejo. |
| AC-21 | Fallo, apertura directa y reintento conservando lectura comprobados. Red lenta prolongada y todos los recursos individualmente quedan parciales. |
| AC-22/23 | Derivados, bytes, fuentes, favicon, título, descripción y portada preparados. Rendimiento de red y preview social en URL pública no comprobados. |
| AC-24 | Guía reproducible, fuentes, versión, decisiones y pendientes entregados. |
| AC-25 | No ejecutado: no hay encargo de publicación. |
| AC-26–28 | Sustitución, Abrir ahora, cancelar/historial y pausa explícita comprobados. Matriz completa de combinaciones queda parcial. |
| AC-29/30 | Suelo y rutas implementados y dominio probado. Duraciones de las cuatro rutas y organización visual comprobadas; gestos táctiles físicos y todas las posiciones/orientaciones quedan parciales. |

No se realizó una auditoría exhaustiva de consola/recursos ni certificación de accesibilidad. Estas limitaciones permanecen visibles y no se convierten en criterios aprobados por la existencia del código.
