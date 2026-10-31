# Cerrar movimiento persistente y carga tardía sin interrumpir la lectura

`ESTADO_DISENO: IMPLEMENTADO_Y_VALIDADO` — contrato original conservado; resultado actual y límites en ACEPTACION-CLOSURE.md.

Este contrato se definió antes de implementar: la selección manual se reiniciaba en `bindPreferences` y faltaba prueba real de conservación de lectura al terminar una carga lenta. Ambos puntos están ahora implementados/comprobados según ACEPTACION-CLOSURE.md. Se conserva TypeScript/Vite, el dominio, la cámara, el loader y sus28 operaciones. Los resultados históricos de [la entrega anterior](ENTREGA-QUALITY.md) no se usaron como pruebas nuevas. Engram MCP no está registrado en este runtime; este documento guarda el contrato sin simular escrituras de memoria.

## API_DOT

### Preferencia manual

Adaptador pequeño en `src/app/motion-preference.ts`, sin nuevas dependencias:

```ts
export const MOTION_STORAGE_KEY = 'camp:motion:v1'
export function readManualMotion(storage?: Pick<Storage, 'getItem'>): boolean
export function writeManualMotion(user: boolean, storage?: Pick<Storage, 'setItem'>): void
```

- Usar `localStorage` por defecto; resolver su acceso dentro de `try/catch`, igual que `getItem` y `setItem`. Un getter bloqueado tampoco impide montar la aplicación.
- Únicamente las cadenas exactas `'true'` y `'false'` representan preferencias válidas. Ausencia, vacío, `'1'`, otras mayúsculas, JSON y cualquier valor inválido producen `false`. No reparar ni borrar datos automáticamente al leer.
- Escribir `String(user)` solo al cambiar el control manual. Un fallo de escritura no revierte la selección en memoria ni interrumpe la visita.
- No persistir `system || user`: el sistema no modifica la preferencia manual almacenada. Desactivar el ajuste manual guarda `'false'` aunque el sistema siga imponiendo reducción.

Integración acordada:

```ts
bindPreferences(root, controller, session, userInitial = readManualMotion())
```

`mount` lee el valor una sola vez y fija `root.dataset.userMotion` y `root.dataset.motion` con `system || user` **antes de `root.innerHTML = shell()`**. Pasa ese mismo booleano a `bindPreferences`; la viñeta no debe comenzar una animación evitable en su primer frame. La aplicación termina de sincronizar controlador/sesión antes de iniciar la preparación de escena.

`bindPreferences` conserva su listener de cambios de `matchMedia`, la cancelación de Web Animations activas, la sincronización con navegación/cámara/CSS y el texto que explica la imposición del sistema. `aria-pressed` representa únicamente el ajuste manual. Se conserva la política existente de cancelación de rutas al activar reducción. Sonido y `camp-entered` no cambian; ninguna lectura de storage activa audio.

### Pruebas RED/GREEN de movimiento

| Caso | Resultado exigido |
| --- | --- |
| Sin almacenamiento previo | Manual `false`; efectivo igual al sistema; montar no escribe. |
| `'true'` y nueva visita | Manual `true`; datasets reducidos antes de insertar shell; controlador/sesión y control coherentes. |
| `'false'` | Manual `false`, sin confundir una cadena no vacía con `true`. |
| Sistema activo, manual inactiva | Efectivo `true`, etiqueta del sistema y ninguna escritura causada por el sistema. |
| Ambas activas; desactivar manual | Guarda `'false'`; efectivo sigue `true` y la etiqueta sigue explicando el sistema. |
| Cambio live del sistema | Actualiza efectivo, controlador/sesión y etiqueta; cancela animaciones activas al reducir; no escribe storage. |
| Getter/getItem/setItem bloqueados | No lanza; lectura cae a `false`; un cambio manual sigue funcionando en memoria. |
| Valores inválidos | Cada valor se rechaza sin crash ni migración silenciosa. |
| Audio | Control apagado al montar/recargar; el ajuste de movimiento no lo activa. |

Usar almacenamiento falso y `matchMedia` controlable para pruebas unitarias; verificar el orden de montaje, no solo el helper OR ya cubierto. En navegador comprobar recarga con preferencia manual, cambio live del sistema, ausencia de animaciones y coherencia de ventanas/viñeta. Los tests de implementación pertenecen a `test_runner`; `slice_worker` no los modifica ni relaja.

### Carga real retenida por HTTP

Crear un servidor de pruebas en `tools/qa/`, ejecutado solo en loopback, que sirva la build bajo `/PortfolioPersonal/`. El servidor retiene la respuesta real de `/PortfolioPersonal/assets/avatar/frames.json` hasta recibir una orden externa de liberar o fallar. Los demás recursos conservan su contenido real; usar `Cache-Control: no-store` para que repetir la prueba vuelva a solicitar metadata. Retener todas las solicitudes coincidentes, sin asumir que solo existirá una.

El control pertenece al servidor de pruebas, nunca al bundle ni a un query param de producción. Debe permitir consultar modo/solicitudes retenidas y ordenar `hold`, `release` o `fail`. `release` entrega el archivo real con su tipo JSON; `fail` responde un error HTTP real, por ejemplo 503. Reintentar debe producir una nueva solicitud observable. No introducir retrasos en `src/app/load-scene.ts` ni reemplazar el loader en navegador por un mock.

Secuencia automatizable y repetible en un Space dedicado de ego(lite):

1. Abrir una visita nueva con metadata retenida y comprobar una petición pendiente y preparación incompleta.
2. Usar **Ver portfolio sin recorrer** y abrir Flower mediante controles reales.
3. Desplazar `.panel-scroll` hasta un valor mayor que cero y enfocar un control visible. Registrar URL completa, título/vista, scroll, identidad del foco, posición/cámara, `data-routing` y visibilidad de intro/panel.
4. Liberar metadata desde el control externo, sin clicar otro elemento de la aplicación. Esperar condición observable `data-load="28/28"` y estado listo, con timeout acotado.
5. Comparar con la captura previa: misma URL, vista Flower, mismo nodo enfocado y scroll con tolerancia de un píxel; panel visible, intro oculta, ruta ausente, posición/cámara conservadas. Entrar queda habilitado sin recibir foco. Volver después por acción explícita confirma que el campamento está preparado.
6. Repetir con `fail`: comprobar fallo real y lectura disponible; activar `hold`, pulsar **Reintentar escena**, esperar nueva solicitud retenida, volver a desplazar/enfocar el contenido y liberar. Comparar contra el estado tomado **después del clic de reintento**, para que el control ocultado al recuperarse no falsee la comprobación de foco.

Agregar regresión automatizada que reproduzca ambas secuencias contra este servidor. Las pruebas unitarias de `createSession` deben cubrir además ready/fail/retry durante consulta directa, sin reenfocar un control ajeno a la zona de fallo, y descarte de generaciones antiguas. Complementan la interacción completa; no la sustituyen. Guardar protocolo, resultado observado, log del gate y capturas actuales. Si la prueba real no se ejecuta, marcarla pendiente.

## OWNERSHIP

| Responsable | Archivos/responsabilidad |
| --- | --- |
| Diseño | Solo `docs/PLAN-CLOSURE.md`. |
| `test_runner` | `tests/**`, servidor y recorridos en `tools/qa/**`, capturas/evidencia; primero RED, luego prueba real. |
| `slice_worker` | `src/app/motion-preference.ts`, `src/app/events.ts`, `src/app/index.ts`; `src/app/session.ts` únicamente si una regresión reproduce un fallo. |
| Coordinación/revisión | Dependencias/configuración asignadas por separado, informe de cierre y sincronización de documentos existentes con resultados verificados. |

No revertir cambios ajenos. Coordinar cualquier salida de ownership antes de editar. Para esta tarea pequeña basta partición por archivos; un worktree adicional solo si aparece trabajo externo incompatible. Mantener archivos cohesivos de menos de 200 líneas, funciones de menos de 40 y unidades revisables de hasta 400 líneas. No crear un nuevo contrato de dominio: `effectiveReducedMotion(system, user)` ya expresa la regla compartida, y storage pertenece al adaptador de aplicación.

## RIESGOS

| Dimensión DoR | Decisión/supuesto reversible |
| --- | --- |
| Datos/idempotencia | Clave versionada con dos cadenas válidas; montar/escuchar sistema no escribe. |
| Estados | Efectivo siempre sistema OR manual; ready/fail/retry conserva lectura y no inicia entrada/ruta. |
| Fallos | Storage opcional; errores HTTP son recuperables; resultado tardío requiere generación vigente. |
| Concurrencia | Cambios del sistema se evalúan con la última selección manual en memoria. Entre pestañas rige el último valor escrito al recargar; no se agrega sincronización live entre pestañas. |
| Permisos | Preferencia local sin datos personales; servidor QA solo loopback, fuera de producción; publicación requiere autorización nueva. |
| GRASP | Dominio puro permanece; adaptador pequeño de storage y pruebas de transporte aisladas. |

No hay DB, backend ni migración: integración Docker `_test` no aplica. No se aceptan alertas altas/críticas residuales en nombre del usuario. La validación editorial conserva borradores y avisos según [CREDENTIALS.md](CREDENTIALS.md). Arte/huellas/anclajes solo se modifican tras un hallazgo actual con captura; [ASSETS-QUALITY.md](ASSETS-QUALITY.md), [ART-QUALITY.md](ART-QUALITY.md) y [UI-QUALITY.md](UI-QUALITY.md) siguen como referencia, no como evidencia nueva.

## PLAN

1. Conservar baseline de commit/rama/versión/árbol y auditorías raw; distinguir alerta real de consulta fallida. Resolver dependencias en su unidad asignada, sin cambiar stack.
2. `test_runner` crea regresiones de storage, montaje y sesión y demuestra RED. El servidor QA ofrece el transporte real requerido para verificar la finalización tardía.
3. `slice_worker` implementa persistencia e integración hasta GREEN. Corregir carga/navegación solo cuando exista un fallo reproducido; dos fallos consecutivos iguales escalan con traza y triaje de causa raíz.
4. Ejecutar instalación reproducible, auditorías, tests, lint y build con base `/PortfolioPersonal/`. Recorrer la build por HTTP en 1366×768, 390×844, 320×568 y 844×390: navegación, geometría real, teclado/foco, texto ampliado, ventanas y estados editoriales. Pruebas de carga real y motion forman parte de la matriz de aceptación.
5. Pulir únicamente hallazgos visuales registrados con antes/después. Actualizar documentación con resultados, evidencia y límites reales, diferenciando unitarias, integración, navegador y revisión visual. Teléfono físico y audio se afirman solo si se prueban.
6. Revisión DoD y secretos staged antes de commits locales pequeños. Entregar rama/commits, matriz, capturas y reproducción HTTP exacta; conservar pendientes del usuario separados. No hacer push, PR ni publicación con esta autorización.

## Addendum: migraciones oficiales de dependencias

Revisión del 31 de octubre de 2026. El [plan de registro](evidence/closure/dependencies/registry-plan.json) es una propuesta inicial; la documentación oficial de soporte justifica reemplazar su recomendación temporal de conservar ESLint 9. Context7 agotó cuota durante la exploración y Exa MCP devolvió 401 en esta consulta; se contrastaron directamente fuentes primarias por web y metadatos de npm, sin solicitar credenciales.

| Paquete | Candidato compatible con Node 24 y alcance |
| --- | --- |
| Vitest | `4.1.12`; conservar Vite `7.3.7`. Revisar migración 3→4 y demostrar compatibilidad con la suite completa. |
| boundaries | `7.4.0`, que declara Handlebars `4.7.10` y elements `3.3.0`; no elegir una versión que conserve Handlebars afectado. |
| ESLint / @eslint/js | `10.14.0` / `10.0.1`, emparejados por major. ESLint 9 alcanzó EOL el 6 de agosto de 2026; quedarse en 9 no resuelve la advertencia de soporte. [Política oficial](https://eslint.org/version-support/) |
| typescript-eslint / TypeScript | Conservar `8.72.1` / `5.9.3`; sus rangos aceptan ESLint 10 y TypeScript `>=4.8.4 <6.1.0`. [Compatibilidad oficial](https://typescript-eslint.io/users/dependency-versions/) |

**Vitest: cambios aplicables.** La [guía versionada de Vitest 4](https://v4.vitest.dev/guide/migration.html) exige Node 20+ y Vite 6+, elimina Tinypool, cambia restauración de mocks y permite mocks de constructores solo con funciones/clases construibles. El mock actual de Audio ya utiliza `function`. La suite observada no tiene configuración de coverage, pools o reporters personalizados que migrar; no agregar esas configuraciones por defecto. Revisar que el descubrimiento siga limitado a pruebas previstas: v4 reduce exclusiones predeterminadas. `vi.restoreAllMocks()` deja de limpiar estado de spies; comprobar aislamiento sin relajar aserciones. Una suite verde verifica estos usos concretos, sin certificar APIs no usadas.

**boundaries: preservar imposición.** La [migración 5→6](https://www.jsboundaries.dev/docs/releases/migration-guides/v5-to-v6/) amplía el análisis por defecto a imports, exports, require e import dinámico. Conservar esa cobertura y corregir hallazgos; no limitarla a imports para conseguir GREEN. La [migración 6→7](https://www.jsboundaries.dev/docs/releases/migration-guides/v6-to-v7/) conserva la configuración antigua, aunque puede advertir deprecaciones. Para actualizarla: `element-types`→`dependencies`, `rules`→`policies`, `no-unknown`→`no-unknown-dependencies`, `mode: 'full'`→`partialMatch: false`; envolver cada selector `from` en `{ element: ... }` y cada permiso en `{ to: { element: ... } }`. Mantener la matriz de capas y `default: 'disallow'`. Conservar `no-unknown-files`. Las [notas 7.3](https://www.jsboundaries.dev/docs/releases/upgrade-notes/v7-3-0/) y [7.4](https://www.jsboundaries.dev/docs/releases/upgrade-notes/v7-4-0/) corrigen coincidencias, rutas y cache; nuestros patrones con `/**` exigen verificar clasificación, no asumir semántica por ausencia de errores.

**ESLint 10: migración pequeña, comprobada.** Ya existe flat config. La [guía oficial](https://eslint.org/docs/latest/use/migrate-to-10.0.0) admite Node 24, cambia la búsqueda de configuración y añade `no-unassigned-vars`, `no-useless-assignment` y `preserve-caught-error` a recommended. Corregir infracciones reales sin deshabilitar reglas. Verificar configuración resuelta sobre un archivo de dominio y otro de aplicación, lint completo y un control negativo: un import temporal domain→app debe denunciar fronteras. Retirar la fixture después; no introducir una dependencia prohibida en el producto.

**Minimatch: resolución condicionada a compatibilidad.** El [aviso GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) afecta versiones `<11.0.1`: patrones hostiles con `optimizationLevel >= 2` pueden amplificar CPU/memoria. La última 10 observada, `10.2.6`, sigue afectada. En el árbol observado tras subir ESLint hay tres consumidores modernos: ESLint, config-array y typescript-estree; usan `Minimatch` o `minimatch` como exports nombrados. Eso habilita investigar un override **acotado a minimatch `^10`→`11.0.3`**, pero no demuestra equivalencia semántica ni autoriza un override global sobre generaciones antiguas.

Para justificar ese override, conservar comparación antes/después de globs reales `files`/`ignores` sobre rutas del repositorio, separadores Windows/normalizados, dotfiles, negación, globstar y clases POSIX; comprobar APIs usadas y selección de archivos. Exigir control positivo/negativo de fronteras, lint, suite, build, árbol sin paquetes inválidos, `npm ci` y ambas auditorías. Documentar el selector exacto y cómo retirarlo cuando upstream acepte la versión corregida. Si no supera estas pruebas, no forzarlo: registrar residual moderado, cadena, exposición de desarrollo/CI y mitigación concreta de patrones controlados y límites de ejecución. No tratar una auditoría `--omit=dev` limpia como cierre de ese residual.

`closure_deps` conserva ownership de package/lock/configuración y evidencia de auditorías; este addendum solo prescribe migración y aceptación. Los resultados de instalación y seguridad deben registrarse tras ejecutar los candidatos, no inferirse de los peers declarados.
