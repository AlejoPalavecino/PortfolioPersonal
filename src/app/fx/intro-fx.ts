import { sampleIntroTimeline } from '../../core/experience'
import type { CueBus } from '../../core/fx/cues'
import { assetUrl } from '../../shared'
import type { Loop } from '../loop'
import { createVignette } from './vignette'

/**
 * Connects the real preparation cues and the 6.8 s narrative arrival timeline to the intro.
 * - Real loader progress (completed / total) and the 6.8 s presentation are strictly independent.
 * - "Omitir presentación" and "Pausar presentación" are operable from frame 0.
 * - Under reduced motion or after completion/skip, the presentation stays in a calm static state.
 */
export function bindIntroFx(
  root: HTMLElement,
  bus: CueBus,
  loop: Loop,
  reducedMotion: () => boolean,
  onComplete?: () => void,
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
  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-action="intro-pause"]')

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
  let offLoop: (() => void) | null = null

  const KICKERS: Readonly<Record<number, string>> = {
    0: '01 · AMANECER EN LA MONTAÑA',
    1: '02 · LLEGADA AL SENDERO',
    2: '03 · PRESENTACIÓN EN EL CAMPAMENTO',
    3: '04 · ESPECIALIDAD Y PROPÓSITO',
    4: '05 · CAMPAMENTO LISTO PARA EXPLORAR',
  }

  const applySnapshot = (ms: number) => {
    const snap = sampleIntroTimeline(ms)
    root.dataset.introBeat = String(snap.beatIndex)
    root.dataset.introAction = snap.action
    const kickerText = KICKERS[snap.beatIndex] ?? 'LLEGADA AL CAMPAMENTO'
    if (beatKicker && beatKicker.textContent !== kickerText) beatKicker.textContent = kickerText
    if (beatTitle && beatTitle.textContent !== snap.title) beatTitle.textContent = snap.title
    if (beatSub) {
      const subText = snap.subtitle || snap.specialty
      if (beatSub.textContent !== subText) beatSub.textContent = subText
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
    return snap
  }

  const showStaticEnd = () => {
    offLoop?.(); offLoop = null
    root.dataset.introStage = 'static'
    applySnapshot(5200)
    if (pauseBtn) {
      pauseBtn.hidden = true
    }
  }

  const tick = (_time: number, dt: number) => {
    if (!intro || intro.hidden || finished) {
      offLoop?.(); offLoop = null
      return
    }
    if (reducedMotion() || root.dataset.introSkipped === 'true') {
      showStaticEnd()
      return
    }
    if (paused || document.hidden) return
    elapsed += Math.min(dt, 100)
    const snap = applySnapshot(elapsed)
    if (snap.completed) {
      finished = true
      root.dataset.introStage = 'completed'
      offLoop?.(); offLoop = null
      if (pauseBtn) pauseBtn.hidden = true
      onComplete?.()
    }
  }

  const syncTimeline = () => {
    offLoop?.(); offLoop = null
    if (!intro || intro.hidden) return
    if (reducedMotion() || finished || root.dataset.introSkipped === 'true') {
      showStaticEnd()
      return
    }
    root.dataset.introStage = 'playing'
    if (pauseBtn) pauseBtn.hidden = false
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
      document.removeEventListener('visibilitychange', onVisibility)
      vignette?.dispose()
      live.remove()
    },
  }
}
