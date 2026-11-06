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
  const bubble = intro.querySelector<HTMLElement>('.intro-story-banner')!
  const text = intro.querySelector<HTMLElement>('.intro-beat-subtitle')!
  const accessible = intro.querySelector<HTMLElement>('.intro-dialogue-accessible')!
  const buttons = [...intro.querySelectorAll<HTMLButtonElement>('.intro-primary-actions button')]
  const bar = intro.querySelector<HTMLElement>('.loading-progress')!
  const boot = intro.querySelector<HTMLElement>('.intro-boot')!
  const handoff = intro.querySelector<HTMLElement>('.intro-handoff')!
  let failed = false
  const loading = () => root.dataset.prepared !== 'true' && !failed
  let elapsed = 0, departing = 0, selected: HTMLButtonElement | null = null, bypass = false, disposed = false
  let off: (() => void) | null = null
  const paint = () => {
    const instant = reducedMotion()
    const waiting = loading()
    root.dataset.introBoot = String(waiting)
    boot.hidden = !waiting
    intro.querySelector<HTMLElement>('.intro-content')!.inert = !!selected
    if (instant && !waiting) elapsed = Math.max(elapsed, 6000)
    root.dataset.introReady = String(!waiting)
    const snap = sampleIntroTimeline(Math.min(elapsed, 2800))
    root.dataset.introStage = elapsed < 2800 ? 'playing' : 'conversation'
    root.dataset.introAction = snap.action
    intro.querySelector<HTMLElement>('.intro-actor-stage')!.style.setProperty('--arrival-x', `${Math.min(0,(snap.actorXPercent-28)*7)}px`)
    const src = assetUrl(`avatar/${snap.actorFrame}.webp`)
    if (actor.getAttribute('src') !== src) actor.src = src
    actor.style.opacity = !waiting && snap.actorVisible ? '1' : '0'
    bubble.hidden = elapsed < 2800
    intro.querySelector<HTMLElement>('.intro-beat-title')!.textContent = INTRO_LINES.greeting.title
    text.textContent = visibleDialogue(INTRO_LINES.greeting.text,elapsed-2800,instant)
    if (!bubble.hidden) accessible.textContent = INTRO_LINES.greeting.text
    for (const button of buttons) button.disabled = !!selected || (button.dataset.action === 'enter' && waiting)
  }
  const tick = (_t: number, dt: number) => {
    if (disposed || intro.hidden) { off?.(); off = null; return }
    if (document.hidden || loading()) return
    if (selected) {
      departing += Math.min(dt,100)
      if (departing >= (reducedMotion() ? 0 : 320)) {
        const button = selected; selected = null; bypass = true; button.disabled = false; button.click(); bypass = false
        off?.(); off = null
      }
      return
    }
    elapsed += Math.min(dt,100); paint()
    if (elapsed >= 6000) { off?.(); off = null }
  }
  const sync = () => { off?.(); off = null; if (!intro.hidden && !disposed) { paint(); if(!loading() && (elapsed < 6000 || selected)) off = loop.add(tick) } }
  const onClick = (e: Event) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('.intro-primary-actions button')
    if (!button || bypass) return
    e.stopImmediatePropagation()
    if(button.disabled || selected) return
    selected = button; departing = 0
    handoff.hidden = false
    const direct = button.dataset.action === 'direct'
    handoff.querySelector<HTMLElement>('.handoff-title')!.textContent = direct ? t('Preparando el taller de proyectos','Preparing the project workshop') : t('Entrando al campamento','Entering the camp')
    handoff.querySelector<HTMLElement>('.handoff-detail')!.textContent = direct ? t('Cargando el interior del taller…','Loading the workshop…') : t('Proyectos · Contacto · Trayectoria · Sobre mí','Projects · Contact · Journey · About me')
    // The project dossier opens immediately with a fallback background if needed.
    // It already has its own lazy room loader; do not block on an illustration.
    root.dataset.introTransition = button.dataset.action === 'direct' ? 'projects' : 'camp'
    bus.emit('intro-cue',{kind:'depart'}); paint(); off = loop.add(tick)
  }
  intro.addEventListener('click',onClick,true)
  const progress = (completed:number,total:number) => { bar.setAttribute('aria-valuenow',String(completed)); bar.setAttribute('aria-valuemax',String(total)); bar.querySelector<HTMLElement>('span')!.style.setProperty('--progress',String(total ? completed/total : 0)); boot.style.setProperty('--boot-progress',String(total ? completed/total : 0)); boot.querySelector<HTMLElement>('.boot-count')!.textContent = `${completed} ${t('de','of')} ${total} ${t('recursos','assets')}` }
  const offs = [
    bus.on('prepare-start',()=>{failed=false;elapsed=0;root.dataset.prepared='false';progress(0,INITIAL_SCENE_TASKS);sync()}),
    bus.on('prepare-progress',({completed,total,task})=>{progress(completed,total);boot.querySelector<HTMLElement>('.boot-task')!.textContent=localizeText(task)}),
    bus.on('prepare-ready',()=>{root.dataset.prepared='true';progress(INITIAL_SCENE_TASKS,INITIAL_SCENE_TASKS);sync()}),
    bus.on('prepare-failed',()=>{failed=true;elapsed=6000;sync()}),
  ]
  const observer = new MutationObserver(sync)
  observer.observe(root,{attributes:true,attributeFilter:['data-motion']})
  observer.observe(intro,{attributes:true,attributeFilter:['hidden']})
  sync()
  return {refresh:sync,dispose(){disposed=true;off?.();offs.forEach(fn=>fn());observer.disconnect();intro.removeEventListener('click',onClick,true)}}
}
