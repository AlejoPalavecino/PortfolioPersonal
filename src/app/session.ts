import { createExperience, reduceExperience, type ExperienceEvent } from '../core/experience'
import type { CueBus } from '../core/fx/cues'
import type { ScenePreparation } from '../shared'
import type { createController } from './controller'

const INTRO_EXIT_MS = 420

export function createSession(root: HTMLElement, controller: ReturnType<typeof createController>, reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches, bus?: CueBus) {
  const intro = root.querySelector<HTMLElement>('.intro')!
  const status = root.querySelector<HTMLElement>('.loading-status')!
  const enter = root.querySelector<HTMLButtonElement>('[data-action=enter]')!
  let entered = false
  try { entered = sessionStorage.getItem('camp-entered') === '1' } catch { /* Storage is optional. */ }
  let state = createExperience({ entered, direct: !!location.hash, reducedMotion })
  let awaitingEntry = !location.hash, slowReported = 0
  let entryTimer: number | undefined

  const cancelExit = () => {
    if (entryTimer === undefined) return
    window.clearTimeout(entryTimer)
    entryTimer = undefined
    intro.classList.remove('is-leaving')
    intro.removeAttribute('aria-busy')
  }

  const update = (event: ExperienceEvent) => {
    if (event.type === 'read' || event.type === 'direct') awaitingEntry = false
    state = reduceExperience(state, event)
    root.dataset.phase = state.phase
    intro.hidden = !awaitingEntry || state.phase === 'explore' || state.phase === 'read'
    if (state.phase === 'explore') {
      awaitingEntry = false
      try { sessionStorage.setItem('camp-entered', '1') } catch { /* Storage is optional. */ }
    }
    root.querySelector<HTMLElement>('.hud-left')!.inert = !intro.hidden
    root.querySelector<HTMLElement>('.hud-right')!.inert = !intro.hidden
    root.querySelector<HTMLElement>('.world')!.inert = !intro.hidden || root.dataset.reading === 'true'
    enter.disabled = state.preparation !== 'ready' || entryTimer !== undefined
  }

  const loading = (load: ScenePreparation) => {
    root.dataset.load = load.completed + '/' + load.total
    if (load.status === 'loading' && load.generation !== state.generation) bus?.emit('prepare-start', {})
    if (load.status === 'loading') bus?.emit('prepare-progress', { completed: load.completed, total: load.total, task: load.task ?? 'Preparando el campamento' })
    if (load.timedOut && slowReported !== load.generation) { slowReported = load.generation; bus?.emit('prepare-slow', {}) }
    if (load.status === 'ready') bus?.emit('prepare-ready', {})
    if (load.status === 'failed') bus?.emit('prepare-failed', { error: load.error })
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
    if (load.status === 'failed') { cancelExit(); update({ type: 'load-failed', generation: load.generation }); controller.dispatch({ type: 'set-scene', scene: 'failed' }) }
    status.textContent = load.status === 'ready' ? 'Listo para explorar' : load.status === 'failed' ? 'No se pudo preparar el campamento. Podés consultar el portfolio.' : load.timedOut ? 'Está tardando. Podés consultar el portfolio mientras tanto.' : (load.task ?? 'Preparando el campamento') + '… ' + load.completed + ' de ' + load.total
    sceneStatus.hidden = load.status !== 'failed'
    introRetry.hidden = load.status !== 'failed'
  }

  update({ type: 'set-motion', reduced: state.reducedMotion })

  const prepareEntry = () => {
    cancelExit()
    awaitingEntry = true
    root.dataset.introSkipped = 'true'
    update({ type: 'camp' })
    root.querySelector<HTMLButtonElement>('[data-action=direct]')!.focus({ preventScroll: true })
  }
  const direct = () => { cancelExit(); awaitingEntry = false; update({ type: 'direct' }) }

  const enterCamp = () => {
    if (state.preparation !== 'ready' || entryTimer !== undefined) return
    const finish = () => {
      entryTimer = undefined
      intro.classList.remove('is-leaving')
      intro.removeAttribute('aria-busy')
      awaitingEntry = false
      update({ type: 'enter' })
      if (state.phase !== 'explore') return
      bus?.emit('enter', { reduced: state.reducedMotion })
      root.querySelector<HTMLElement>('.world')!.focus({ preventScroll: true })
    }
    if (intro.hidden || state.reducedMotion) { finish(); return }
    intro.classList.add('is-leaving')
    intro.setAttribute('aria-busy', 'true')
    enter.disabled = true
    entryTimer = window.setTimeout(finish, INTRO_EXIT_MS)
  }

  // Skipping the film is not entering the portfolio. Keep the final invitation,
  // loading feedback and both choices visible, even on slow networks.
  const skipIntro = () => {
    if (entryTimer !== undefined) return
    root.dataset.introSkipped = 'true'
    const target = state.preparation === 'ready' ? enter : root.querySelector<HTMLButtonElement>('[data-action=direct]')
    target?.focus({ preventScroll: true })
  }
  return { update, loading, prepareEntry, direct, skipIntro, get state() { return state }, enter: enterCamp }
}
