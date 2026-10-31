import { createExperience, reduceExperience, type ExperienceEvent } from '../core/experience'
import type { ScenePreparation } from '../shared'
import type { createController } from './controller'

export function createSession(root: HTMLElement, controller: ReturnType<typeof createController>, reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const intro = root.querySelector<HTMLElement>('.intro')!
  const status = root.querySelector<HTMLElement>('.loading-status')!
  const enter = root.querySelector<HTMLButtonElement>('[data-action=enter]')!
  let entered = false
  try { entered = sessionStorage.getItem('camp-entered') === '1' } catch { /* Storage is optional. */ }
  let state = createExperience({ entered, direct: !!location.hash, reducedMotion })
  let awaitingEntry = !location.hash
  const update = (event: ExperienceEvent) => {
    if (event.type === 'read') awaitingEntry = false
    state = reduceExperience(state, event)
    if (event.type === 'load-ready' && awaitingEntry && state.entered && state.preparation === 'ready') {
      state = reduceExperience(state, { type: 'enter' })
    }
    root.dataset.phase = state.phase
    intro.hidden = !awaitingEntry || state.phase === 'explore' || state.phase === 'read'
    if (state.phase === 'explore') awaitingEntry = false
    root.querySelector<HTMLElement>('.hud-left')!.inert = !intro.hidden
    root.querySelector<HTMLElement>('.hud-right')!.inert = !intro.hidden
    root.querySelector<HTMLElement>('.world')!.inert = !intro.hidden || root.dataset.reading === 'true'
    enter.disabled = state.preparation !== 'ready'
  }
  const loading = (load: ScenePreparation) => {
    root.dataset.load = `${load.completed}/${load.total}`
    const sceneStatus = root.querySelector<HTMLElement>('.scene-status')!
    const introRetry = root.querySelector<HTMLElement>('.retry-intro')!
    if (load.status !== 'failed' && (sceneStatus.contains(document.activeElement) || introRetry.contains(document.activeElement))) {
      const panel = root.querySelector<HTMLElement>('.panel')!
      const target = !panel.hidden ? panel.querySelector<HTMLElement>('#reading-title')
        : !intro.hidden ? root.querySelector<HTMLElement>('[data-action=direct]')
          : root.querySelector<HTMLElement>('.menu-toggle')
      target?.focus({ preventScroll: true })
    }
    if (load.status === 'loading' && load.generation !== state.generation) update({ type: 'load-start', generation: load.generation })
    if (load.timedOut) update({ type: 'load-slow', generation: load.generation })
    if (load.status === 'ready') { update({ type: 'load-ready', generation: load.generation }); controller.dispatch({ type: 'set-scene', scene: 'ready' }) }
    if (load.status === 'failed') { update({ type: 'load-failed', generation: load.generation }); controller.dispatch({ type: 'set-scene', scene: 'failed' }) }
    status.textContent = load.status === 'ready' ? 'Listo para explorar' : load.status === 'failed' ? 'No se pudo preparar el campamento. Podés consultar el portfolio.' : load.timedOut ? 'Está tardando. Podés consultar el portfolio mientras tanto.' : `Preparando el campamento… ${load.completed} de ${load.total}`
    sceneStatus.hidden = load.status !== 'failed'
    introRetry.hidden = load.status !== 'failed'
  }
  update({ type: 'set-motion', reduced: state.reducedMotion })
  const prepareEntry = () => {
    awaitingEntry = true
    update({ type: 'camp' })
    root.querySelector<HTMLButtonElement>('[data-action=direct]')!.focus({ preventScroll: true })
  }
  const direct = () => { awaitingEntry = false; update({ type: 'direct' }) }
  const enterCamp = () => {
    awaitingEntry = false
    update({ type: 'enter' })
    if (state.phase !== 'explore') return
    try { sessionStorage.setItem('camp-entered', '1') } catch { /* Storage is optional. */ }
    root.querySelector<HTMLElement>('.world')!.focus({ preventScroll: true })
  }
  return { update, loading, prepareEntry, direct, get state() { return state }, enter: enterCamp }
}
