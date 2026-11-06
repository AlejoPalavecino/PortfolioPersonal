import { sampleIntroTimeline } from '../../core/experience'
import { INTRO_LINES, visibleDialogue } from '../../core/experience/intro-dialogue'
import type { CueBus } from '../../core/fx/cues'
import { assetUrl, INITIAL_SCENE_TASKS } from '../../shared'
import { t } from '../../shared/i18n'
import { localizeText } from '../../shared/locale-copy'
import type { Loop } from '../loop'

/** Optional story; visitors can enter as soon as essential scenery is ready. */
export function bindIntroFx(root: HTMLElement, bus: CueBus, loop: Loop, reducedMotion: () => boolean, _onComplete?: () => void) {
  void _onComplete
  const intro = root.querySelector<HTMLElement>('.intro')!
  const actor = intro.querySelector<HTMLImageElement>('.intro-actor')!
  const actorStage = intro.querySelector<HTMLElement>('.intro-actor-stage')!
  const content = intro.querySelector<HTMLElement>('.intro-content')!
  const title = intro.querySelector<HTMLElement>('.intro-beat-title')!
  const bubble = intro.querySelector<HTMLElement>('.intro-story-banner')!
  const text = intro.querySelector<HTMLElement>('.intro-beat-subtitle')!
  const accessible = intro.querySelector<HTMLElement>('.intro-dialogue-accessible')!
  const buttons = [...intro.querySelectorAll<HTMLButtonElement>('.intro-primary-actions button')]
  const bar = intro.querySelector<HTMLElement>('.loading-progress')!
  const boot = intro.querySelector<HTMLElement>('.intro-boot')!
  const handoff = intro.querySelector<HTMLElement>('.intro-handoff')!
  let failed = false
  const waitingForEntry = () => root.dataset.introQueued === 'true' && root.dataset.prepared !== 'true' && !failed
  let elapsed = 0, departing = 0, selected: HTMLButtonElement | null = null, bypass = false, disposed = false
  let off: (() => void) | null = null
  let greeting = ''
  const paintScene = () => {
    const snap = sampleIntroTimeline(Math.min(elapsed, 2800))
    const stage = elapsed < 2800 ? 'playing' : 'conversation'
    if (root.dataset.introStage !== stage) root.dataset.introStage = stage
    if (root.dataset.introAction !== snap.action) root.dataset.introAction = snap.action
    actorStage.style.setProperty('--arrival-x', `${Math.min(0,(snap.actorXPercent-28)*7)}px`)
    const src = assetUrl(`avatar/${snap.actorFrame}.webp`)
    if (actor.getAttribute('src') !== src) actor.src = src
    actor.style.opacity = snap.actorVisible ? '1' : '0'
    if (bubble.hidden !== (stage === 'playing')) bubble.hidden = stage === 'playing'
    const dialogue = visibleDialogue(greeting, elapsed - 2800, reducedMotion())
    if (text.textContent !== dialogue) text.textContent = dialogue
    if (!bubble.hidden && accessible.textContent !== greeting) accessible.textContent = greeting
  }
  const paintControls = () => {
    const waiting = waitingForEntry()
    const focusWasCovered = (waiting ? content : boot).contains(document.activeElement)
    root.dataset.introBoot = String(waiting)
    root.dataset.introReady = String(!waiting)
    boot.hidden = !waiting
    handoff.hidden = !selected
    content.inert = !!selected || waiting
    if (reducedMotion() && !waiting) elapsed = Math.max(elapsed, 6000)
    title.textContent = INTRO_LINES.greeting.title
    greeting = INTRO_LINES.greeting.text
    for (const button of buttons) button.disabled = !!selected || (button.dataset.action === 'enter' && failed)
    if (focusWasCovered) {
      const visible = waiting ? boot : content
      visible.querySelector<HTMLButtonElement>('[data-action=direct]')?.focus({ preventScroll: true })
    }
    if (!waiting) paintScene()
  }
  const tick = (_t: number, dt: number) => {
    if (disposed || intro.hidden) { off?.(); off = null; return }
    if (document.hidden || waitingForEntry()) return
    if (selected) {
      departing += Math.min(dt,100)
      if (departing >= (reducedMotion() ? 0 : 320)) {
        const button = selected; selected = null; bypass = true; button.disabled = false; button.click(); bypass = false
        off?.(); off = null
      }
      return
    }
    elapsed += Math.min(dt,100); paintScene()
    if (elapsed >= 6000) { off?.(); off = null }
  }
  const sync = () => {
    off?.()
    off = null
    if (intro.hidden || disposed) {
      selected = null
      delete root.dataset.introTransition
      return
    }
    paintControls()
    if (!waitingForEntry() && (elapsed < 6000 || selected)) off = loop.add(tick, { duringIntro: true })
  }
  const onClick = (e: Event) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('.intro-primary-actions button')
    // The dossier opens immediately. Only entering the prepared camp plays the departure.
    if (!button || bypass || button.dataset.action === 'direct' || root.dataset.prepared !== 'true') return
    e.stopImmediatePropagation()
    if(button.disabled || selected) return
    selected = button; departing = 0
    root.dataset.introTransition = 'camp'
    bus.emit('intro-cue',{kind:'depart'}); sync()
  }
  intro.addEventListener('click',onClick,true)
  const progress = (completed:number,total:number) => { bar.setAttribute('aria-valuenow',String(completed)); bar.setAttribute('aria-valuemax',String(total)); bar.querySelector<HTMLElement>('span')!.style.setProperty('--progress',String(total ? completed/total : 0)); boot.style.setProperty('--boot-progress',String(total ? completed/total : 0)); boot.querySelector<HTMLElement>('.boot-count')!.textContent = `${completed} ${t('de','of')} ${total} ${t('recursos','assets')}` }
  const offs = [
    bus.on('prepare-start',()=>{failed=false;root.dataset.prepared='false';progress(0,INITIAL_SCENE_TASKS);sync()}),
    bus.on('prepare-progress',({completed,total,task})=>{progress(completed,total);boot.querySelector<HTMLElement>('.boot-task')!.textContent=localizeText(task)}),
    bus.on('prepare-ready',()=>{root.dataset.prepared='true';progress(INITIAL_SCENE_TASKS,INITIAL_SCENE_TASKS);sync()}),
    bus.on('prepare-failed',()=>{failed=true;elapsed=6000;sync()}),
  ]
  const observer = new MutationObserver(sync)
  observer.observe(root,{attributes:true,attributeFilter:['data-motion','data-intro-queued']})
  observer.observe(intro,{attributes:true,attributeFilter:['hidden']})
  sync()
  return {refresh:sync,dispose(){disposed=true;off?.();offs.forEach(fn=>fn());observer.disconnect();intro.removeEventListener('click',onClick,true)}}
}
