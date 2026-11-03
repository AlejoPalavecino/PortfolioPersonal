import { INTRO_DURATION_MS, sampleIntroTimeline } from '../../core/experience'
import type { CueBus } from '../../core/fx/cues'
import { assetUrl } from '../../shared'
import type { Loop } from '../loop'
import { createVignette } from './vignette'

/**
 * Connects real preparation cues and a non-blocking five-beat narrative to the intro.
 * - Real loader progress (completed / total) and the 7.8 s presentation are strictly independent.
 * - "Omitir presentación" and "Pausar presentación" are operable from frame 0.
 * - Completion/skip holds a final invitation until the visitor chooses to enter.
 */
export function bindIntroFx(
  root: HTMLElement,
  bus: CueBus,
  loop: Loop,
  reducedMotion: () => boolean,
) {
  const intro = root.querySelector<HTMLElement>('.intro')
  const card = root.querySelector<HTMLElement>('.intro-card')
  const canvas = root.querySelector<HTMLCanvasElement>('.loading-canvas')
  const bar = root.querySelector<HTMLElement>('.loading-progress')
  const fill = bar?.querySelector<HTMLElement>('span')
  const actor = root.querySelector<HTMLImageElement>('.intro-actor')
  const actorStage = root.querySelector<HTMLElement>('.intro-actor-stage')
  const beatKicker = root.querySelector<HTMLElement>('.intro-beat-kicker')
  const beatTitle = root.querySelector<HTMLElement>('.intro-beat-title')
  const beatSub = root.querySelector<HTMLElement>('.intro-beat-subtitle')
  const beatCount = root.querySelector<HTMLElement>('.intro-beat-count')
  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-action="intro-pause"]')
  const replayBtn = root.querySelector<HTMLButtonElement>('[data-action="intro-replay"]')

  if (!card) return { dispose() {}, refresh() {} }

  const live = document.createElement('p')
  live.className = 'sr-only'; live.setAttribute('role', 'status')
  card.append(live)

  const paintProgress = (completed: number, total: number) => {
    bar?.setAttribute('aria-valuemax', String(total)); bar?.setAttribute('aria-valuenow', String(completed))
    fill?.style.setProperty('--progress', String(total ? completed / total : 0))
    root.dataset.prepared = completed >= total && total > 0 ? 'true' : 'false'
  }

  let elapsed = 0
  let paused = false
  let finished = false
  let lastFrame = ''
  let previousBeat = -1
  let offLoop: (() => void) | null = null

  const KICKERS: Readonly<Record<number, string>> = {
    0: 'EL PUNTO DE PARTIDA',
    1: 'EL PROCESO',
    2: 'QUIÉN SOY',
    3: 'LO QUE CONSTRUYO',
    4: 'TU RECORRIDO COMIENZA',
  }

  const applySnapshot = (ms: number) => {
    const snap = sampleIntroTimeline(ms)
    root.dataset.introBeat = String(snap.beatIndex)
    root.dataset.introAction = snap.action
    const kickerText = KICKERS[snap.beatIndex] ?? 'LLEGADA AL CAMPAMENTO'
    if (snap.beatIndex !== previousBeat) {
      previousBeat = snap.beatIndex
      if (beatKicker) beatKicker.textContent = kickerText
      if (beatCount) beatCount.textContent = '0' + (snap.beatIndex + 1) + ' / 05'
      if (beatTitle) beatTitle.textContent = snap.title
      if (beatSub) beatSub.textContent = snap.subtitle
    }
    const leftPct = `${snap.actorXPercent.toFixed(2)}%`
    if (actorStage) {
      actorStage.style.left = leftPct
      actorStage.style.opacity = snap.actorVisible ? '1' : '0'
    }
    if (actor) {
      actor.style.left = leftPct
      actor.style.opacity = snap.actorVisible ? '1' : '0'
      if (lastFrame !== snap.actorFrame) {
        lastFrame = snap.actorFrame
        actor.src = assetUrl(`camp-rooms-v1/avatars/${snap.actorFrame}.png`)
      }
    }
    intro?.style.setProperty('--intro-crossfade', snap.crossfade.toFixed(3))
    intro?.style.setProperty('--intro-story-progress', snap.storyProgress.toFixed(4))
    intro?.style.setProperty('--intro-camera-scale', snap.cameraScale.toFixed(4))
    intro?.style.setProperty('--intro-camera-x', snap.cameraShiftPercent.toFixed(3) + '%')
    intro?.style.setProperty('--intro-sky-light', snap.skyLight.toFixed(3))
    return snap
  }

  const showEnd = (skipped: boolean) => {
    offLoop?.(); offLoop = null
    finished = true
    elapsed = INTRO_DURATION_MS
    root.dataset.introStage = skipped ? 'static' : 'completed'
    applySnapshot(elapsed)
    if (pauseBtn) pauseBtn.hidden = true
    if (replayBtn) replayBtn.hidden = reducedMotion()
  }

  const tick = (_time: number, dt: number) => {
    if (!intro || intro.hidden || finished) {
      offLoop?.(); offLoop = null
      return
    }
    if (reducedMotion() || root.dataset.introSkipped === 'true') {
      showEnd(true)
      return
    }
    if (paused || document.hidden) return
    elapsed += Math.min(dt, 100)
    const snap = applySnapshot(elapsed)
    if (snap.completed) showEnd(false)
  }

  const syncTimeline = () => {
    offLoop?.(); offLoop = null
    if (!intro || intro.hidden) return
    if (reducedMotion() || root.dataset.introSkipped === 'true') {
      showEnd(true)
      return
    }
    if (finished) {
      root.dataset.introStage = 'completed'
      if (pauseBtn) pauseBtn.hidden = true
      if (replayBtn) replayBtn.hidden = false
      applySnapshot(INTRO_DURATION_MS)
      return
    }
    root.dataset.introStage = 'playing'
    if (pauseBtn) pauseBtn.hidden = false
    if (replayBtn) replayBtn.hidden = true
    applySnapshot(elapsed)
    offLoop = loop.add(tick)
  }

  const onPauseClick = () => {
    if (finished || reducedMotion()) return
    paused = !paused
    root.dataset.introPaused = String(paused)
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', String(paused))
      pauseBtn.textContent = paused ? 'Continuar presentación' : 'Pausar presentación'
    }
  }
  pauseBtn?.addEventListener('click', onPauseClick)
  const onReplayClick = () => {
    if (reducedMotion()) return
    elapsed = 0
    paused = false
    finished = false
    previousBeat = -1
    root.dataset.introPaused = 'false'
    root.dataset.introSkipped = 'false'
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', 'false')
      pauseBtn.textContent = 'Pausar presentación'
    }
    syncTimeline()
  }
  replayBtn?.addEventListener('click', onReplayClick)

  const onVisibility = () => {
    if (document.hidden && !finished && !paused && intro && !intro.hidden) {
      paused = true
      root.dataset.introPaused = 'true'
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', 'true')
        pauseBtn.textContent = 'Continuar presentación'
      }
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  const offs = [
    bus.on('prepare-start', () => { live.textContent = 'Preparando el campamento.'; paintProgress(0, 28) }),
    bus.on('prepare-progress', ({ completed, total }) => paintProgress(completed, total)),
    bus.on('prepare-slow', () => { live.textContent = 'La preparación está tardando. Podés consultar el portfolio mientras tanto.' }),
    bus.on('prepare-ready', () => { live.textContent = 'Listo para explorar.'; root.dataset.prepared = 'true'; fill?.style.setProperty('--progress', '1') }),
    bus.on('prepare-failed', () => { live.textContent = 'No se pudo preparar el campamento. Podés reintentar o consultar el portfolio.' }),
    bus.on('enter', () => { finished = true; offLoop?.(); offLoop = null }),
  ]
  const vignette = canvas ? createVignette(canvas, { bus, loop, reducedMotion }) : null
  const motion = new MutationObserver(() => {
    vignette?.refresh?.()
    syncTimeline()
  })
  motion.observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-intro-skipped'] })

  syncTimeline()

  return {
    refresh() { vignette?.refresh?.(); syncTimeline() },
    dispose() {
      offLoop?.(); offLoop = null
      offs.forEach(off => off())
      motion.disconnect()
      pauseBtn?.removeEventListener('click', onPauseClick)
      replayBtn?.removeEventListener('click', onReplayClick)
      document.removeEventListener('visibilitychange', onVisibility)
      vignette?.dispose()
      live.remove()
    },
  }
}
