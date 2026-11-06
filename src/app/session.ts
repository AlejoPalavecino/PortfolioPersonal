import { createExperience, reduceExperience, type ExperienceEvent } from '../core/experience'
import type { CueBus } from '../core/fx/cues'
import type { ScenePreparation } from '../shared'
import { t } from '../shared/i18n'
import { localizeText } from '../shared/locale-copy'
import type { createController } from './controller'

export function createSession(root: HTMLElement, controller: ReturnType<typeof createController>, reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches, bus?: CueBus) {
  const intro = root.querySelector<HTMLElement>('.intro')!
  const status = root.querySelector<HTMLElement>('.loading-status')!
  const enter = root.querySelector<HTMLButtonElement>('[data-action=enter]')!
  let entered = false
  try { entered = sessionStorage.getItem('camp-entered') === '1' } catch { /* Storage is optional. */ }
  let state = createExperience({ entered, direct: !!location.hash, reducedMotion })
  let awaitingEntry = !location.hash, slowReported = 0, skipRequested = false
  let latestLoad: ScenePreparation | null = null
  const loadLabel = (load: ScenePreparation) => load.status === 'ready' ? t('Listo para explorar', 'Ready to explore')
    : load.status === 'failed' ? t('No se pudo preparar el campamento. Podés consultar el portfolio.', 'The camp could not be prepared. You can still browse the portfolio.')
    : load.timedOut ? t('Está tardando. Podés consultar el portfolio mientras tanto.', 'Loading is taking longer. You can browse the portfolio in the meantime.')
    : localizeText((load.task ?? t('Preparando el campamento', 'Preparing the camp')) + '…') + ' ' + String(load.completed) + ' ' + t('de','of') + ' ' + String(load.total)
  const update = (event: ExperienceEvent) => {
    if (event.type === 'read' || event.type === 'direct') { awaitingEntry = false; skipRequested = false }
    state = reduceExperience(state, event)
    if (event.type === 'load-ready' && awaitingEntry && (state.entered || skipRequested) && state.preparation === 'ready') {
      state = reduceExperience(state, { type: 'enter' })
    }
    root.dataset.phase = state.phase
    intro.hidden = !awaitingEntry || state.phase === 'explore' || state.phase === 'read'
    if (state.phase === 'explore') {
      awaitingEntry = false
      skipRequested = false
      try { sessionStorage.setItem('camp-entered', '1') } catch { /* Storage is optional. */ }
    }
    root.querySelector<HTMLElement>('.hud-left')!.inert = !intro.hidden
    root.querySelector<HTMLElement>('.hud-right')!.inert = !intro.hidden
    root.querySelector<HTMLElement>('.world')!.inert = !intro.hidden || root.dataset.reading === 'true'
    enter.disabled = state.preparation !== 'ready' || root.dataset.introReady === 'false'
  }
  const loading = (load: ScenePreparation) => {
    latestLoad = load
    root.dataset.load = `${load.completed}/${load.total}`
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
    if (load.status === 'ready') {
      const wasExploring = state.phase === 'explore'
      update({ type: 'load-ready', generation: load.generation })
      controller.dispatch({ type: 'set-scene', scene: 'ready' })
      // A queued skip enters as soon as loading finishes, with the same focus/cue as Enter.
      if (!wasExploring && state.phase === 'explore') {
        bus?.emit('enter', { reduced: state.reducedMotion })
        root.querySelector<HTMLElement>('.world')!.focus({ preventScroll: true })
      }
    }
    if (load.status === 'failed') { update({ type: 'load-failed', generation: load.generation }); controller.dispatch({ type: 'set-scene', scene: 'failed' }) }
    status.textContent = loadLabel(load)
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
    skipRequested = false
    update({ type: 'enter' })
    if (state.phase !== 'explore') return
    try { sessionStorage.setItem('camp-entered', '1') } catch { /* Storage is optional. */ }
    bus?.emit('enter', { reduced: state.reducedMotion })
    root.querySelector<HTMLElement>('.world')!.focus({ preventScroll: true })
  }
  const skipIntro = () => {
    root.dataset.introSkipped = 'true'
    if (state.preparation === 'ready') {
      enterCamp()
    } else {
      skipRequested = true
      const message = root.querySelector<HTMLElement>('.boot-queue-status')
      if (message) {
        message.hidden = false
        message.textContent = t('Entrarás al campamento apenas termine la carga esencial.','You will enter the camp as soon as essential loading finishes.')
      }
    }
  }
  return { update, loading, prepareEntry, direct, skipIntro, refreshLanguage: () => { if (latestLoad) status.textContent = loadLabel(latestLoad) }, get state() { return state }, enter: enterCamp }
}
