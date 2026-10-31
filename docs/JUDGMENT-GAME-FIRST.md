# Revisión dual — candidato game-first

Target inicial inmutable: árbol Git `b541f5b32b8c83ae98c910685c3d86aaec6fc67b`, sobre baseline `57e2ed8dfaf53ef4da779f7fed28c782ba417404`. Dos jueces independientes, sin editar código ni leer los hallazgos del otro, inspeccionaron el mismo alcance. Skills resueltas por ruta: judgment-day, clean-architecture y caveman-review en `C:/Users/alejo/.codex/skills/`.

## Ledger congelado de hallazgos iniciales

| ID | Estado inicial | Ubicación | Evidencia y acción |
|---|---|---|---|
| JD-01 | HIGH confirmado por A y B | src/styles/hud-intro.css:41 | Menú en top78 sin altura máxima ni scroll; cuatro botones44 + ajustes y gaps superan viewport568×320. Corregir límites y scroll interno sin empujar escenario. |
| JD-02 | HIGH sospechado por B, pendiente de corroboración A | src/app/events.ts:45 | Atrás tras modo directo restaura camp sin entrar ni mostrar intro; en móvil el control home está oculto. Requiere contraste focalizado; no modificar hasta acuerdo. |
| JD-03 | WARNING informativo de A | src/app/session.ts:40 | Tras8s pendientes se muestra acceso directo, pero retry solo aparece al fallar. El contrato propone retry también en demora. No bloquear ni interpretar como falta de acceso profesional. |

No se atribuyen defectos de producto a teléfono físico ausente o a la medición de FPS limitada. El encargo autoriza implementar y corregir hasta una revisión coherente; no autoriza publicar esta evolución en main.

## Evidencia congelada para contrastar JD-02

Secuencia reproducible: primera visita sin hash, preparación ready, elegir Ver portfolio sin recorrer, Proyectos abre y crea historial, Atrás restaura la entrada camp inicial. No pulsar Back/Home del panel, que sí usan returnToCamp.

Del target inicial, `src/app/events.ts`:

```ts
window.addEventListener('popstate', event => views.restore((event.state as View | null) ?? { kind: 'camp' }, controller))
window.addEventListener('hashchange', () => views.restoreUrl(controller))
```

`src/app/views.ts` restore comunica la vista camp por el renderer/show; `onView` en index envía `session.update({ type: view.kind === 'camp' ? 'camp' : 'read' })`. No invoca returnToCamp desde listeners de historial.

`src/core/experience/index.ts`:

```ts
case 'camp': return { ...state, phase: state.direct || state.preparation === 'failed' ? 'direct' : 'explore', overlay: 'none' }
case 'direct': return { ...state, phase: 'direct', direct: true, overlay: 'none' }
```

`src/app/session.ts`:

```ts
let awaitingEntry = !location.hash
intro.hidden = !awaitingEntry || state.phase === 'explore' || state.phase === 'read'
const direct = () => { awaitingEntry = false; update({ type: 'direct' }) }
```

`src/app/keyboard.ts` exige `phase === 'explore'` mediante enabled callback de events; las selecciones de suelo también. En `src/styles/game-adaptation.css` para móvil `.hud-left .brand { display: none; }`; la marca es el botón data-action=home. El resultado simulado aportado por B fue phase=direct, preparation=ready, entered=false, introHidden=true, worldInert=false: el mundo aparece pero no admite exploración. Esta evidencia es del candidato inicial, no de un fix posterior.

## Rondas

Ronda de corrección 1 autorizada: únicamente JD-01, confirmado por ambos. Luego ambos jueces reciben este ledger y el delta inmutable para rejuicio focalizado; JD-02 sigue sin corregir hasta su corroboración. Máximo dos rondas de corrección/rejuicio, sin ampliar presupuesto.

Rejuicio 1 sobre árbol `2234a988adba015e9a83704c218c1bb0b4b87854`: ambos verificaron JD-01 corregido y corroboraron JD-02 con la evidencia congelada. JD-02 pasa a HIGH confirmado por ambos. Se autoriza la segunda y última corrección, limitada a restauración del historial/directo y prueba de regresión; JD-03 permanece informativo. No se introducen otros cambios de producto.

Ronda de corrección 2, target `5d3b1ca37a93ab864fcf5121f3dd6f7ceaa198a2`: se añadió `src/app/history.ts`, se conectaron popstate/hashchange al helper y se sincronizó awaitingEntry al restaurar lectura. Sesión previa lista puede volver a explorar; primera visita vuelve a una entrada visible; carga pendiente ofrece preparación y alternativa. Nueva regresión `tests/history.test.ts`, RED por módulo ausente y GREEN3/3. Regresión completa40/40, linter/tipos/build de subruta aprobados. El actor no abrió navegador. Delta autorizado respecto de `2234a988adba015e9a83704c218c1bb0b4b87854`: history.ts, events.ts, session.ts y history.test.ts. Rejuicio final únicamente sobre ledger y ese delta; no hay tercera ronda.

## Resultado final

Ambos jueces devolvieron `findings:[]` en el segundo rejuicio. JD-01 y JD-02 quedaron corregidos; no hubo hallazgos causados por los fixes. JD-03 se conserva como informativo: durante una demora sigue disponible el contenido directo, y el reintento aparece al declararse fallo. El requerimiento de acceso alternativo a los8s está satisfecho; ampliar ese control es una recomendación posterior.

```yaml
target_identity: 5d3b1ca37a93ab864fcf5121f3dd6f7ceaa198a2
round: 2
confirmed: [JD-01-fixed, JD-02-fixed]
suspect: []
contradictions: []
info: [JD-03]
fix_work_units: [menu-viewport-scroll, history-entry-restoration]
scoped_rejudgment: approved
terminal_state: approved
skill_resolution: paths-injected
```

Los fixes finales tienen regresión automatizada e inspección focalizada; no se abrió un segundo Space ni se presenta esa inspección como una nueva prueba en teléfono físico. La aprobación de este alcance no equivale a publicación o aceptación global de todos los criterios.

JUDGMENT: APPROVED ✅
