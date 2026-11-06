import { setControlLabel } from './control-label'
import { t } from '../shared/i18n'
import { hitDestination } from '../core/domain'
import { effectiveReducedMotion } from '../core/experience'
import type { CueBus } from '../core/fx/cues'
import type { createController } from './controller'
import type { createViews, View } from './views'
import type { createAudio } from './audio'
import type { createSession } from './session'
import type { createWorldCamera } from './camera'
import { bindKeyboard } from './keyboard'
import type { Loop } from './loop'
import { closeMenu, returnToCamp } from './actions'
import { restoreHistoryView } from './history'
import { writeManualMotion } from './motion-preference'

type Controller = ReturnType<typeof createController>
type Session = ReturnType<typeof createSession>
export function bindPreferences(root: HTMLElement, controller: Controller, session: Session, initial: boolean) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let user = initial
  const apply = () => {
    const reduced = effectiveReducedMotion(motion.matches, user)
    root.dataset.userMotion = String(user); root.dataset.motion = reduced ? 'reduced' : 'full'
    if (reduced) {
      root.getAnimations?.({ subtree: true }).forEach(animation => animation.cancel())
      const panel = root.querySelector<HTMLElement>('.panel')
      if (panel && root.dataset.reading === 'false') panel.hidden = true
    }
    const button = root.querySelector<HTMLButtonElement>('[data-action=motion]')!
    const label = motion.matches ? (user ? t('Movimiento reducido: sistema y preferencia','Motion reduced by system and personal preferences') : t('Movimiento reducido por el sistema','Motion reduced by system preference')) : user ? t('Activar movimiento','Enable motion') : t('Reducir movimiento','Reduce motion')
    const desc = motion.matches ? t('El sistema solicita reducir movimiento.','Your system requests reduced motion.') : t('Preferencia de movimiento del portfolio.','Portfolio motion preference.')
    button.setAttribute('aria-pressed', String(user))
    button.setAttribute('aria-description', desc)
    controller.dispatch({ type: 'set-motion', reduced }); session.update({ type: 'set-motion', reduced })
    setControlLabel(button, label)
    root.querySelectorAll?.<HTMLButtonElement>('[data-action=motion]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(user))
      btn.setAttribute('aria-description', desc)
      setControlLabel(btn, label)
    })
  }
  motion.addEventListener('change', apply); apply()
  return () => { user = !user; writeManualMotion(user); apply() }
}
export function bindEvents(root: HTMLElement, controller: Controller, views: ReturnType<typeof createViews>, audio: ReturnType<typeof createAudio>, session: Session, camera: ReturnType<typeof createWorldCamera>, loop?: Loop, bus?: CueBus) {
  const world = root.querySelector<HTMLElement>('.world')!
  const help = root.querySelector<HTMLElement>('.help-card')!
  const touch = matchMedia('(pointer: coarse)').matches
  if (touch) help.querySelector('p')!.textContent = t('Tocá un destino para caminar hasta él. También podés tocar un punto del camino.','Tap a destination to walk there. You can also tap a point along the path.')
  let down: { x: number; y: number } | null = null, dragged = false
  world.addEventListener('pointerdown', e => { if (!e.isPrimary) { dragged = true; return }; down = { x: e.clientX, y: e.clientY }; dragged = false })
  world.addEventListener('pointermove', e => { if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 12) dragged = true })
  world.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation() } }, true)
  world.addEventListener('click', e => {
    if (dragged || (e.target as HTMLElement).closest('button') || session.state.phase !== 'explore' || session.state.overlay !== 'none') return
    camera.finishSettle()
    const point = camera.point(e.clientX, e.clientY)
    const destination = hitDestination(point)
    if (destination) { views.saveFocus(); controller.select(destination); help.hidden = true; return }
    if (controller.state.reducedMotion || controller.state.scene !== 'ready') return
    if (controller.ground(point)) help.hidden = true
  })
  bindKeyboard(world, controller, () => session.state.phase === 'explore' && session.state.overlay === 'none', loop)
  world.addEventListener('keydown', event => { if (session.state.phase === 'explore' && /^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|w|a|s|d|e|Enter)$/i.test(event.key)) help.hidden = true })
  root.addEventListener('click', e => { if ((e.target as HTMLElement).closest('[data-section]') && session.state.phase === 'explore') help.hidden = true })
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || (event.target as HTMLElement)?.closest('input,textarea,select')) return
    const intro = root.querySelector<HTMLElement>('.intro')
    if (intro && !intro.hidden) return
    const roomMenu = root.querySelector<HTMLElement>('details.room-navigation[open]')
    if (roomMenu) {
      roomMenu.removeAttribute('open')
      roomMenu.querySelector<HTMLElement>('summary')?.focus()
      return
    }
    if (!root.querySelector<HTMLElement>('.mobile-menu')!.hidden) { closeMenu(root, session); root.querySelector<HTMLButtonElement>('.menu-toggle')!.focus() }
    else if (!help.hidden && session.state.phase === 'explore' && !controller.state.route) { help.hidden = true; root.querySelector<HTMLElement>('[data-action=help]')?.focus() }
    else if (controller.state.route) { controller.dispatch({ type: 'cancel' }); if (views.current.kind === 'camp') root.querySelector<HTMLElement>('.world')?.focus() }
    else if (views.current.kind === 'case') controller.dispatch({ type: 'back-projects' })
    else if (views.current.kind === 'credential') controller.dispatch({ type: 'restore', view: { kind: 'recognitions' } })
    else if (views.current.kind === 'recognitions') controller.dispatch({ type: 'restore', view: { kind: 'section', section: 'journey' } })
    else if (views.current.kind !== 'camp') { returnToCamp(controller, views, session) }
  })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      root.dataset.paused = 'true'
      controller.dispatch({ type: 'pause' })
      audio.pause()
      bus?.emit('pause', { reason: 'hidden' })
      const sound = root.querySelector<HTMLButtonElement>('[data-action=sound]')!
      if (sound.getAttribute('aria-pressed') === 'true') setControlLabel(sound, t('Continuar sonido','Resume sound'))
      root.querySelectorAll?.<HTMLButtonElement>('[data-action=sound]').forEach(btn => {
        if (btn.getAttribute('aria-pressed') === 'true') setControlLabel(btn, t('Continuar sonido','Resume sound'))
      })
    } else {
      delete root.dataset.paused
      bus?.emit('resume', { reason: 'visible' })
    }
  })
  window.addEventListener('popstate', event => restoreHistoryView((event.state as View | null) ?? { kind: 'camp' }, controller, views, session))
  window.addEventListener('hashchange', () => {
    views.restoreUrl(controller)
    restoreHistoryView(views.current, controller, views, session)
  })
}
