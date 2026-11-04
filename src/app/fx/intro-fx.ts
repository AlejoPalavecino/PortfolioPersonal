import { sampleIntroTimeline } from '../../core/experience'
import { advanceIntroArrival, INTRO_ARRIVAL_MS, INTRO_LINES, visibleDialogue, type IntroDialogue } from '../../core/experience/intro-dialogue'
import type { CueBus } from '../../core/fx/cues'
import { assetUrl } from '../../shared'
import type { Loop } from '../loop'

/** Arrival, dialogue typing and sound share one clock. Loading remains independent. */
export function bindIntroFx(root: HTMLElement, bus: CueBus, loop: Loop, reducedMotion: () => boolean, onComplete?: () => void) {
  const intro = root.querySelector<HTMLElement>('.intro')
  const card = root.querySelector<HTMLElement>('.intro-card')
  if (!intro || !card) return { dispose() {}, refresh() {} }
  const actor = root.querySelector<HTMLImageElement>('.intro-actor')!
  const stage = root.querySelector<HTMLElement>('.intro-actor-stage')!
  const bubble = root.querySelector<HTMLElement>('.intro-story-banner')!
  const title = bubble.querySelector<HTMLElement>('.intro-beat-title')!
  const text = bubble.querySelector<HTMLElement>('.intro-beat-subtitle')!
  const accessible = bubble.querySelector<HTMLElement>('.intro-dialogue-accessible')!
  const replies = bubble.querySelector<HTMLElement>('.intro-replies')!
  const next = bubble.querySelector<HTMLButtonElement>('.intro-dialogue-next')!
  const character = stage.querySelector<HTMLButtonElement>('.intro-character')!
  const emote = stage.querySelector<HTMLElement>('.intro-emote')!
  const pause = root.querySelector<HTMLButtonElement>('[data-action="intro-pause"]')!
  const bar = root.querySelector<HTMLElement>('.loading-progress')
  const fill = bar?.querySelector<HTMLElement>('span')
  const live = document.createElement('p')
  live.className = 'sr-only'; live.setAttribute('role', 'status'); card.append(live)

  let elapsed = 0, typedMs = 0, lastStep = -1, lastVoice = -1
  let paused = false, stopped = false, greeted = false, revealAll = false
  let dialogue: IntroDialogue = 'greeting'
  let off: (() => void) | null = null
  const active = () => !stopped && !intro.hidden && root.dataset.introSkipped !== 'true'
  const cue = (kind: 'step' | 'greeting' | 'voice' | 'reply' | 'depart') => {
    if (active() && !paused && !document.hidden) bus.emit('intro-cue', { kind })
  }
  const paint = () => {
    const snap = sampleIntroTimeline(elapsed)
    root.dataset.introAction = snap.action
    root.dataset.introStage = elapsed < INTRO_ARRIVAL_MS ? 'playing' : 'conversation'
    root.dataset.introDialogue = dialogue
    stage.style.setProperty('--arrival-x', `${Math.min(0, (snap.actorXPercent - 28) * 7)}px`)
    character.style.opacity = snap.actorVisible ? '1' : '0'
    const src = assetUrl(`camp-rooms-v1/avatars/${snap.actorFrame}.png`)
    if (actor.getAttribute('src') !== src) actor.src = src
    bubble.hidden = elapsed < INTRO_ARRIVAL_MS
    emote.textContent = INTRO_LINES[dialogue].marker; emote.hidden = bubble.hidden
    const line = INTRO_LINES[dialogue]
    title.textContent = line.title
    text.textContent = visibleDialogue(line.text, typedMs, revealAll || reducedMotion())
    // Announce the complete sentence once, never every typed character.
    if (!bubble.hidden && accessible.textContent !== line.text) accessible.textContent = line.text
    replies.hidden = dialogue !== 'greeting'; next.hidden = dialogue === 'greeting'
  }
  const setPaused = (value: boolean) => {
    paused = value; root.dataset.introPaused = String(value || document.hidden)
    pause.setAttribute('aria-pressed', String(value))
    pause.textContent = value ? 'Continuar presentación' : 'Pausar presentación'
  }
  const greet = () => {
    if (greeted) return
    greeted = true; elapsed = INTRO_ARRIVAL_MS; cue('greeting')
  }
  const tick = (_now: number, dt: number) => {
    if (!active()) { off?.(); off = null; return }
    if (paused || document.hidden) return
    elapsed = advanceIntroArrival(elapsed, dt, false)
    if (elapsed >= INTRO_ARRIVAL_MS) {
      greet(); typedMs += Math.min(dt, 100)
      const voice = Math.floor(typedMs / 110)
      if (!revealAll && text.textContent !== INTRO_LINES[dialogue].text && voice !== lastVoice) { lastVoice = voice; cue('voice') }
    } else if (elapsed >= 1200) {
      const step = Math.floor((elapsed - 1200) / 260)
      if (step !== lastStep) { lastStep = step; cue('step') }
    }
    paint()
    if (elapsed >= INTRO_ARRIVAL_MS && text.textContent === INTRO_LINES[dialogue].text) { off?.(); off = null }
  }
  const sync = () => {
    off?.(); off = null
    if (!active()) return
    if (reducedMotion()) { elapsed = INTRO_ARRIVAL_MS; greeted = true; revealAll = true }
    paint()
    if (!reducedMotion() && !paused && !document.hidden) off = loop.add(tick)
  }
  const choose = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-intro-reply]')
    if (!button || !active()) return
    const reply = button.dataset.introReply
    if (reply !== 'camp' && reply !== 'work') return
    dialogue = reply; typedMs = 0; lastVoice = -1; revealAll = reducedMotion() || paused
    cue('reply'); paint(); next.focus({ preventScroll: true }); sync()
  }
  const onCharacter = () => {
    if (!active()) return
    if (elapsed < INTRO_ARRIVAL_MS) greet()
    else revealAll = true
    paint(); sync()
  }
  const onNext = () => { if (active()) { cue('depart'); onComplete?.() } }
  const onPause = () => { setPaused(!paused); sync() }
  const onVisibility = () => { if (document.hidden && active()) setPaused(true); sync() }
  replies.addEventListener('click', choose); character.addEventListener('click', onCharacter)
  next.addEventListener('click', onNext); pause.addEventListener('click', onPause)
  document.addEventListener('visibilitychange', onVisibility)
  const paintProgress = (completed: number, total: number) => {
    bar?.setAttribute('aria-valuemax', String(total)); bar?.setAttribute('aria-valuenow', String(completed))
    fill?.style.setProperty('--progress', String(total ? completed / total : 0))
    root.dataset.prepared = String(total > 0 && completed >= total)
  }
  const offs = [
    bus.on('prepare-start', () => { live.textContent = 'Preparando el campamento.'; paintProgress(0, 28) }),
    bus.on('prepare-progress', ({ completed, total }) => paintProgress(completed, total)),
    bus.on('prepare-ready', () => { live.textContent = 'Listo para explorar.'; root.dataset.prepared = 'true'; bar?.setAttribute('aria-valuenow', bar.getAttribute('aria-valuemax') ?? '28'); fill?.style.setProperty('--progress', '1') }),
    bus.on('prepare-slow', () => { live.textContent = 'La preparación está tardando. Podés consultar el portfolio mientras tanto.' }),
    bus.on('prepare-failed', () => { live.textContent = 'No se pudo preparar el campamento. Podés reintentar o consultar el portfolio.' }),
    bus.on('enter', () => { stopped = true; off?.(); off = null }),
  ]
  const observer = new MutationObserver(sync)
  observer.observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-intro-skipped'] })
  observer.observe(intro, { attributes: true, attributeFilter: ['hidden'] })
  for (const name of ['idle-down', 'walk-right-1', 'walk-right-2', 'walk-right-3', 'walk-right-4']) {
    const image = new Image(); image.src = assetUrl(`camp-rooms-v1/avatars/${name}.png`)
    void image.decode().catch(() => {})
  }
  setPaused(false); sync()
  return {
    refresh: sync,
    dispose() {
      stopped = true; off?.(); offs.forEach(fn => fn()); observer.disconnect(); live.remove()
      replies.removeEventListener('click', choose); character.removeEventListener('click', onCharacter)
      next.removeEventListener('click', onNext); pause.removeEventListener('click', onPause)
      document.removeEventListener('visibilitychange', onVisibility)
    },
  }
}
