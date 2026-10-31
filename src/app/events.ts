import type { Section } from '../entities'
import type { createController } from './controller'
import type { createViews, View } from './views'
import type { createAudio } from './audio'
import type { createSession } from './session'
import type { createWorldCamera } from './camera'
import { bindKeyboard } from './keyboard'
import { closeMenu, returnToCamp } from './actions'
import { restoreHistoryView } from './history'

type Controller = ReturnType<typeof createController>
type Session = ReturnType<typeof createSession>
export function bindPreferences(controller: Controller, session: Session) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  controller.dispatch({ type: 'set-motion', reduced: motion.matches })
  motion.addEventListener('change', event => { controller.dispatch({ type: 'set-motion', reduced: event.matches }); session.update({ type: 'set-motion', reduced: event.matches }) })
}
export function bindEvents(root: HTMLElement, controller: Controller, views: ReturnType<typeof createViews>, audio: ReturnType<typeof createAudio>, session: Session, camera: ReturnType<typeof createWorldCamera>) {
  const world = root.querySelector<HTMLElement>('.world')!
  const help = root.querySelector<HTMLElement>('.help-card')!
  const touch = matchMedia('(pointer: coarse)').matches
  if (touch) help.querySelector('p')!.textContent = 'Tocá un destino para caminar hasta él. También podés tocar un punto del camino.'
  let down: { x: number; y: number } | null = null, dragged = false
  world.addEventListener('pointerdown', e => { if (!e.isPrimary) { dragged = true; return }; down = { x: e.clientX, y: e.clientY }; dragged = false })
  world.addEventListener('pointermove', e => { if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 12) dragged = true })
  world.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation() } }, true)
  world.addEventListener('click', e => {
    if (dragged || (e.target as HTMLElement).closest('button') || session.state.phase !== 'explore' || session.state.overlay !== 'none') return
    const poi = (e.target as HTMLElement).closest<HTMLElement>('[data-poi]')
    if (poi) { views.saveFocus(); controller.select(poi.dataset.poi as Section); help.hidden = true; return }
    if (controller.state.reducedMotion || controller.state.scene !== 'ready') return
    if (controller.ground(camera.point(e.clientX, e.clientY))) help.hidden = true
  })
  bindKeyboard(world, controller, () => session.state.phase === 'explore' && session.state.overlay === 'none')
  world.addEventListener('keydown', event => { if (session.state.phase === 'explore' && /^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|w|a|s|d|e|Enter)$/i.test(event.key)) help.hidden = true })
  root.addEventListener('click', e => { if ((e.target as HTMLElement).closest('[data-section]') && session.state.phase === 'explore') help.hidden = true })
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || (event.target as HTMLElement)?.closest('input,textarea,select')) return
    if (!root.querySelector<HTMLElement>('.mobile-menu')!.hidden) { closeMenu(root, session); root.querySelector<HTMLButtonElement>('.menu-toggle')!.focus() }
    else if (!help.hidden && session.state.phase === 'explore' && !controller.state.route) help.hidden = true
    else if (controller.state.route) controller.dispatch({ type: 'cancel' })
    else if (views.current.kind === 'case') controller.dispatch({ type: 'back-projects' })
    else if (views.current.kind !== 'camp') { returnToCamp(controller, views, session) }
  })
  document.addEventListener('visibilitychange', () => { if (document.hidden) { controller.dispatch({ type: 'pause' }); audio.pause(); const sound = root.querySelector<HTMLButtonElement>('[data-action=sound]')!; if (sound.getAttribute('aria-pressed') === 'true') sound.textContent = 'Continuar sonido' } })
  window.addEventListener('popstate', event => restoreHistoryView((event.state as View | null) ?? { kind: 'camp' }, controller, views, session))
  window.addEventListener('hashchange', () => {
    views.restoreUrl(controller)
    restoreHistoryView(views.current, controller, views, session)
  })
}
