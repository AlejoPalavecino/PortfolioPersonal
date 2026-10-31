# Iteración de calidad — contratos y verificación

`ESTADO_DISENO: IMPLEMENTADO_EN_REVISION` — resultados y límites en `ENTREGA-QUALITY.md`.

Baseline: `main` y `origin/main`, commit `2ec496ef7cb5e003dbae5f5ecade7f6e14a8a15a`, versión `0.2.0-review.1`; árbol limpio y sin commits posteriores al iniciar. Fuente: encargo adjunto y `PLAN-GAME-FIRST.md`. Se conservan TypeScript estricto, Vite, navegación pura, loader real, cámara y frames del avatar. No hay backend, DB ni migraciones; integración Docker `_test` no aplica.

## Supuestos asumidos y frontera

- Ajustes geométricos, composición, duración de transición y organización de componentes son reversibles y quedan autorizados. No se publica ni se hace push remoto en este hito.
- El panel conserva semántica de región no modal: HUD accesible, mundo inerte durante lectura y cámara quieta. No se incorpora un motor de juego.
- Las cuatro áreas siguen siendo Proyectos, Sobre mí, Trayectoria y Contacto. Reconocimientos es una página de Bitácora; abrir su tab no agrega un quinto destino ni otra intención de caminata.
- Los tres antecedentes del CV son borradores editoriales hasta contar con evidencia original y atribución. No se fabrican premios, verificaciones, capturas, instituciones, fechas o resultados.
- La falta de material editorial no bloquea geometría, accesibilidad ni navegación. El entregable debe distinguir implementación comprobada, arte pendiente y contenido pendiente.
- Engram MCP no está registrado en este runtime: este documento es el contrato compartido y no se declararán escrituras de memoria inexistentes.

## Ownership y fronteras

| Unidad | Archivos exclusivos | Interfaz con otros responsables |
|---|---|---|
| Escena | `src/core/domain/destinations.ts`, `world.ts`, geometría; `src/app/world-markup.ts`, `scene-rendering.ts`; `src/styles/scene.css` | Dominio exporta registro, selección y oclusión por barril. App importa `worldMarkup` y `renderScene`. |
| Aplicación | `src/app/**` excepto los dos módulos de escena; estilos de UI excepto `scene.css` | Integra geometría y contenido sin duplicarlos; dueño de `shell.ts` y `rendering.ts` centrales. |
| Contenido | `src/entities/**`, `src/widgets/**`; cambios acordados de `domain/types.ts` y `navigation.ts` | Exporta catálogo editorial y markup; no toca geometría, shell, vistas ni estilos centrales. |
| RED/QA | `tests/**`, scripts/evidencias QA | Escribe regresiones antes de implementar; ningún implementador relaja estos tests. |
| Coordinación | Arte/exportador, documentos, barriles y configuración compartida | Integra exports acordados y verifica unidades; revisa diff antes de cada commit local. |

No revertir cambios ajenos. Consumir entidades/dominio/widgets por barriles. La extracción de escena evita que dos responsables editen shell/rendering. Avisar al coordinador si un cambio requiere salir del ownership. Unidades revisables de hasta 400 líneas; archivos y funciones pequeños según cohesión, sin helpers artificiales. Worktree solo si aparece trabajo externo concurrente que requiera aislamiento; para esta sesión se usan archivos exclusivos.

## Contrato de los cuatro destinos

Agregar y exportar desde `src/core/domain/index.ts`:

```ts
type Destination = Readonly<{
  footprint: readonly Point[]
  interaction: readonly Point[]
  arrival: Arrival
  depthY: number
  sprite: string
  sign: string
  occlusion: readonly Point[]
}>
declare const DESTINATIONS: Readonly<Record<Section, Destination>>
declare function hitDestination(point: Point): Section | null
declare function isOccluded(feet: Point): boolean
```

Coordenadas lógicas, origen arriba/izquierda, mundo 1000×650. `footprint` es suelo sólido; `interaction` es selección deliberada, no el rectángulo del PNG. `arrival` conserva radio 12 y proximidad 45 salvo recalibración visual explícita. `depthY` representa la base física frontal, comparable con los pies del avatar. `WORLD.obstacles` y `WORLD.arrivals` se derivan de este registro y no mantienen copias divergentes.

| Destino | Anclaje de sprite actual | Huella física a calibrar sobre arte | Selección y entrada |
|---|---|---|---|
| Taller / projects | x490, y117, ancho320; alto por proporción original | Cuerpo, plataforma y escalones sólidos; distinguir alero alto de superficie ocupada. Revisar (560,240), (575,245), (730,242). | Polígono sobre taller y tablilla. El suelo (500,260) queda fuera. Entrada frontal alcanzable junto a escalera; punto anterior (650,275) requiere contraste visual. |
| Carpa / about | x100, y110.5, ancho220 | Carpa, mochila, fogón y tocones según suelo real; no bloquear aire entre piezas por el cuadro completo. | Carpa/señal explícitas; entrada inicial (220,335), conservar solo si queda exterior a huella y conectada. |
| Bitácora / journey | x250, y299, ancho190 | Mesa/patas, silla y maceta; revisar (345,400), (360,414). | Tablero/placa explícitos; entrada inicial (345,445), recalibrar si coincide con patas dibujadas. |
| Radio / contact | x660, y234, ancho200 | Plataforma, postes y escalones; alero no convierte todo su rectángulo en suelo sólido. | Estructura/tablilla explícitas; entrada inicial (765,390), contrastar escalera y base. |

El responsable de escena fija los polígonos y líneas numéricas definitivos después de reproducir las cinco posiciones dirigidas, y los deja en el registro legible. No se dan por válidos valores antiguos por pasar conectividad. Cada entrada debe ser `isWalkable` y tener ruta desde spawn y desde las otras tres. Toda nueva huella debe permitir salir de una posición restaurada o proyectar a un punto cercano seguro una sola vez.

`hitDestination` rechaza coordenadas no finitas y retorna null fuera de selección. En borde coincidente usa orden estable `projects, about, journey, contact`; evitar solapamientos en el registro. El arte y overlays decorativos tienen `pointer-events:none`; el controlador convierte pantalla→mundo una sola vez y consulta selección. Carteles son botones semánticos con `data-section`; suelo fuera del polígono conserva la caminata manual.

Oclusión: ordenar avatar por pies y objetos por base física, no ponerlo siempre encima. Si un paso posterior válido produce solapamiento opaco, `isOccluded` permite una silueta discreta localizada; no hace transparente el mundo entero. Se usa una zona conservadora documentada y el ghost copia el frame y su anclaje originales. No se implementó prueba por píxel alfa. Separar capas solo donde este contrato no pueda expresar correctamente suelo/frente/techo. Un recorte conserva su offset y escala originales.

APIs de integración: `worldMarkup(): string` incluye el viewport/mundo y el avatar persistente; `renderScene(root, state): void` actualiza oclusión sin tocar HUD, historial ni foco. La aplicación sigue escogiendo frame/anclaje y profundidad, y llama oclusión después de posicionarlo. Los anclajes de objetos/señales permanecen en CSS y se documentan en `ASSETS-QUALITY.md`.

## Contrato de vistas, historial, foco y movimiento

Extender `View` de dominio con `{ kind: 'recognitions' } | { kind: 'credential'; id: string }`. No extender `Target` ni cambiar la selección de los cuatro destinos. La llegada a journey abre Recorrido; desde allí un tab abre Reconocimientos inmediatamente. `restore` de cualquiera de las dos vistas registra journey visitado y cancela toda ruta, igual que una vista existente. IDs se validan con catálogo publicado antes de restaurar desde URL.

Rutas canónicas: campamento sin hash; `#trayectoria`; `#trayectoria/reconocimientos`; `#trayectoria/reconocimientos/<id>`. Conservar `#proyectos/<id>` y demás secciones. Un ID desconocido/no publicado abre colección sin mostrar el borrador; hash malformado no lanza. Deep-link y popstate nunca inician caminata ni vuelven a mostrar introducción obligatoria. Un único adaptador escribe historial.

Regla de campamento: una orden explícita de volver cancela intención y callbacks pendientes, cierra menú/panel, restaura campamento y limpia hash aunque el estado de vista ya sea campamento por una caminata. La sincronización de URL no puede depender exclusivamente de que `show` detecte una vista diferente. Recargar mantiene lo que representa la URL. Atrás/Adelante restaura sin push duplicado.

Foco se guarda por identidad estable del disparador, no solo índice DOM. Cancelar ruta devuelve foco a su origen visible; si ya no existe, al botón de menú visible y después al mundo si está habilitado. Cerrar ayuda devuelve foco al botón que la abrió, o al mundo/menú según disponibilidad. Ninguna acción deja foco en BODY ni en contenido oculto/inert. Lista→detalle→lista conserva scroll y botón de tarjeta; cerrar lectura conserva posición y cámara del personaje. El título usa foco programático con apariencia de título; controles mantienen `:focus-visible`.

Separar bienvenida descartable y proximidad. Descartar bienvenida no deshabilita la instrucción contextual. Entrar/salir de radio de entrada actualiza “E / Enter para abrir” y anuncio solo al cambiar candidato; móvil muestra acción equivalente. Caminar no elimina esta información permanentemente.

Movimiento efectivo: `systemReduced || userReduced`. La elección interna se mantiene durante el montaje actual y se reinicia al recargar; no se implementó la persistencia propuesta inicialmente. La aplicación escucha cambios de `matchMedia`; una fuente efectiva alimenta navegación, cámara, RAF, `data-motion="reduced|full"` del root y carga. El control describe si el sistema está imponiendo reducción. Con reducción: navegación directa existente, cámara quieta, loader estático y cero animaciones/transiciones de panel/entorno. CSS `prefers-reduced-motion` sigue como respaldo. Activar reducción durante una ruta invalida intención antigua antes de abrir destino.

## Superficies, adaptación y carga

Estados explícitos: `closed → opening → open`, `open → changing → open`, `open/opening/changing → closing → closed`. Cada solicitud incrementa revisión; finalizadores solo actúan si su revisión sigue vigente. Cerrar durante apertura o cambiar rápidamente invalida temporizadores/animationend anteriores. Dispose también invalida. Con reducción, completar sin esperar. Nada de un timeout antiguo puede reenfocar o resucitar contenido cerrado.

Duración inicial 200 ms, opacidad y desplazamiento vertical 8 px; valores ajustables tras captura. No zoom, rebotes ni distorsión. Durante lectura y cierre: mundo/cámara quietos, atenuación suave sin blur fuerte. Contacto se adapta al contenido; Proyectos ofrece ancho de evidencia; Bitácora tiene tabs; documentos muestran originales legibles y enlace al archivo.

Intro a 320px: grid `minmax(0,1fr)`, hijos `min-width:0`, título/padding fluidos y controles que envuelven. Criterio: `scrollWidth <= clientWidth` en intro y documento, sin ocultar el desborde con overflow horizontal. A 844×390 compactar cabecera por altura disponible y mantener una única `.panel-scroll` principal; título completo accesible sin segundo scroll en header. También 1366×768 y 390×844.

CTA de contacto: contraste normal al menos 4.5:1 en reposo/hover; foco visible sobre fondos claros. Se puede oscurecer el coral; medir valores finales y registrar resultado. No basta afirmar que el color parece más oscuro.

Carga conserva operaciones reales y generaciones del loader: sin porcentaje por reloj, espera mínima ni ciclo decorativo obligatorio. Viñeta inicial pequeña con avatar/fogata o farol independiente del mundo pesado, nombre y especialidad; accesible antes de descargar los 28 recursos. Ready habilita entrada inmediatamente; lento/fallo/reintento/directo permanecen funcionales; la viñeta se queda estática al reducir movimiento y sonido sigue apagado sin acción explícita.

## Contrato editorial de credenciales

`src/entities/credentials.ts`, reexportado por entidades:

```ts
type CredentialKind = 'training' | 'certification' | 'award' | 'mention'
type EditorialState = 'draft' | 'published'
type Credential = Readonly<{
  id: string
  kind: CredentialKind
  title: string
  issuer: string | null
  date: { value: string; precision: 'year' | 'month' | 'day' } | null
  recipient: { kind: 'person' | 'team' | 'project'; name: string } | null
  description: string
  evidence: { kind: 'pdf' | 'image' | 'link'; url: string; alt: string } | null
  verification: { url: string; label: string } | null
  editorial: EditorialState
}>
declare const credentials: readonly Credential[]
declare function publishedCredentials(): readonly Credential[]
declare function credentialById(id: string): Credential | undefined
```

`publishedCredentials` y `credentialById` exponen exclusivamente publicados con evidencia, emisor y receptor explícitos; verificación es opcional y no se infiere de un PDF. Links externos solo HTTPS y assets locales resueltos con `assetUrl`; nunca `javascript:` ni HTML sin escapar. Fechas validan precisión disponible; null se muestra como pendiente solo en herramientas/revisión, no como fecha inventada. Exportar discriminantes y tipo para render tipado.

Preparar `ilan-foxmind`, `egg-full-stack`, `ucm-mobile` como draft. Institución y receptor del premio permanecen pendientes donde no se suministró atribución exacta. Los otros dos conservan los nombres dados por el usuario, con evidencia y fecha null. No mostrar diplomas de muestra, logotipos sintéticos ni indicadores de verificación. Colección vacía usa una explicación breve sin filtros, contadores, niveles ni tarjetas ficticias.

Widgets exporta `recognitionsMarkup(): string` y `credentialMarkup(id: string): string`. Un ID no publicado devuelve una ficha neutra sin revelar su borrador; el adaptador normaliza su URL a la colección. La colección agrupa por tipo si hay registros; Menciones es una categoría sin grupo vacío. Detalle incluye título, emisor, receptor, fecha con precisión, descripción, evidencia original, alt y vínculo al original; solo presenta enlace de verificación cuando existe. La aplicación es dueña de tabs/ruta/foco.

Conservar FoxMind previo a pilotos y aporte completo con IA; Flower en producción, desarrollo individual React/Node/PostgreSQL e integración ARCA. Mantener pendientes de capturas/CV/canales. El exportador de arte no vuelve a copiar el CV salvo opción explícita separada. Ningún recurso profesional depende de visitar destinos/logros.

## Contratos DoT y orden de etapas

| Etapa | RED / integración | Inspección visual que la completa |
|---|---|---|
| Q1 Profundidad y geometría | Null en (500,260), hit positivo/negativo por cuatro destinos, entradas transitables y rutas entre ellas; huellas coinciden con `WORLD`; no apertura de llegada antigua. | Captura baseline y posterior de cinco puntos auditados; frente/fondo/laterales de cuatro destinos. Punto inaccesible sólido o avatar legible detrás. No certificar colisión solo por tests de ruta. |
| Q2 Navegación y adaptación | Camp durante ruta elimina hash, route y callbacks; reload/popstate; motion sistema/control; foco cancel/ayuda; bienvenida separada; cambio rápido/cierre. | Teclado completo y scroll 320×568/844×390; estado reducido sin `surface-in`; contraste medido; lista conserva foco/scroll y cámara quieta. |
| Q3 Entorno y señales | Sin duplicar destinos ni cambiar geometría sin recalibrar; signos guardan caja/anclaje en sus estados. | Terraza conectada a ladera, sendero y salida del agua; planos coherentes con cámara; no isla cubierta de niebla/sombra. Cuatro señales legibles e integradas, menú siempre accesible. |
| Q4 Ventanas y carga | Revisiones invalidan callbacks; loader mantiene conteo real, fallos, retry y generación; ninguna espera mínima. | Familias de fichas, Contacto compacto, transición abrir/cambiar/cerrar; carga rápida/lenta/fallida y versión estática. |
| Q5 Credenciales y editorial | Draft excluido; ID inexistente seguro; rutas nuevas compatibles; datos y HTML escapados; fechas precisas y verificación opcional. | Colección vacía honesta hasta evidencia; originales legibles cuando existan; coherencia de FoxMind/Flower y pendientes reales. |

`test_runner` reproduce antes de RED en Space dedicado `quality-portfolio-20261031`; usa ego(lite), Snapshot y capture. Guarda capturas baseline/final y explica límites. Viewports obligatorios 1366×768, 390×844, 320×568, 844×390; teléfono físico solo si disponible y realmente probado. Carga lenta/fallida necesita instrumentación real de operaciones, no una animación artificial.

Cada etapa: tests dirigidos y luego `npm test`, `npm run lint`, `npm run build -- --base=/PortfolioPersonal/`. Revisión de fronteras y secretos staged antes del commit local. Informe final vincula hallazgo→cambio→evidencia e identifica assets nuevos/modificados, material pendiente del usuario y límites de QA. No afirmar acabado artístico ni credenciales verificadas si falta evidencia.
