import { sampleIntroTimeline } from '../../core/experience'
import { INTRO_LINES, visibleDialogue } from '../../core/experience/intro-dialogue'
import type { CueBus } from '../../core/fx/cues'
import { assetUrl } from '../../shared'
import type { Loop } from '../loop'

/** One mandatory arrival, two exits and an uninterrupted handoff to the world. */
export function bindIntroFx(root: HTMLElement, bus: CueBus, loop: Loop, reducedMotion: () => boolean, _onComplete?: () => void) {
  void _onComplete
  const intro = root.querySelector<HTMLElement>('.intro')!
  const actor = intro.querySelector<HTMLImageElement>('.intro-actor')!
  const bubble = intro.querySelector<HTMLElement>('.intro-story-banner')!
  const text = intro.querySelector<HTMLElement>('.intro-beat-subtitle')!
  const accessible = intro.querySelector<HTMLElement>('.intro-dialogue-accessible')!
  const buttons = [...intro.querySelectorAll<HTMLButtonElement>('.intro-primary-actions button')]
  const bar = intro.querySelector<HTMLElement>('.loading-progress')!
  let elapsed = 0, departing = 0, selected: HTMLButtonElement | null = null, bypass = false, disposed = false
  let off: (() => void) | null = null
  const paint = () => {
    const instant = reducedMotion()
    if (instant) elapsed = Math.max(elapsed, 6000)
    root.dataset.introReady = String(elapsed >= 6000)
    const snap = sampleIntroTimeline(Math.min(elapsed, 2800))
    root.dataset.introStage = elapsed < 2800 ? 'playing' : 'conversation'
    root.dataset.introAction = snap.action
    intro.querySelector<HTMLElement>('.intro-actor-stage')!.style.setProperty('--arrival-x', `${Math.min(0,(snap.actorXPercent-28)*7)}px`)
    actor.src = assetUrl(`camp-rooms-v1/avatars/${snap.actorFrame}.png`)
    bubble.hidden = elapsed < 2800
    text.textContent = visibleDialogue(INTRO_LINES.greeting.text,elapsed-2800,instant)
    if (!bubble.hidden) accessible.textContent = INTRO_LINES.greeting.text
    for (const button of buttons) button.disabled = !!selected || elapsed < 6000 || (button.dataset.action === 'enter' && root.dataset.prepared !== 'true')
  }
  const tick = (_t: number, dt: number) => {
    if (disposed || intro.hidden) { off?.(); off = null; return }
    if (document.hidden) return
    if (selected) {
      departing += Math.min(dt,100)
      if (departing >= (reducedMotion() ? 0 : 900)) {
        const button = selected; selected = null; bypass = true; button.disabled = false; button.click(); bypass = false
        off?.(); off = null
      }
      return
    }
    elapsed += Math.min(dt,100); paint()
    if (elapsed >= 6000) { off?.(); off = null }
  }
  const sync = () => { off?.(); off = null; if (!intro.hidden && !disposed) { paint(); if(elapsed < 6000 || selected) off = loop.add(tick) } }
  const onClick = (e: Event) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('.intro-primary-actions button')
    if (!button || bypass) return
    e.stopImmediatePropagation()
    if(button.disabled || selected) return
    selected = button; departing = 0
    root.dataset.introTransition = button.dataset.action === 'direct' ? 'projects' : 'camp'
    bus.emit('intro-cue',{kind:'depart'}); paint(); off = loop.add(tick)
  }
  intro.addEventListener('click',onClick,true)
  const progress = (completed:number,total:number) => { bar.setAttribute('aria-valuenow',String(completed)); bar.setAttribute('aria-valuemax',String(total)); bar.querySelector<HTMLElement>('span')!.style.setProperty('--progress',String(total ? completed/total : 0)) }
  const offs = [bus.on('prepare-start',()=>{root.dataset.prepared='false';progress(0,28);paint()}),bus.on('prepare-progress',({completed,total})=>progress(completed,total)),bus.on('prepare-ready',()=>{root.dataset.prepared='true';progress(28,28);paint()})]
  const observer = new MutationObserver(sync)
  observer.observe(root,{attributes:true,attributeFilter:['data-motion']})
  observer.observe(intro,{attributes:true,attributeFilter:['hidden']})
  sync()
  return {refresh:sync,dispose(){disposed=true;off?.();offs.forEach(fn=>fn());observer.disconnect();intro.removeEventListener('click',onClick,true)}}
}
