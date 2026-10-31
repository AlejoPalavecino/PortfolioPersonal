import type { Section } from '../entities'
import type { createController } from './controller'
import type { createViews } from './views'
import type { createAudio } from './audio'
import type { createSession } from './session'

type Controller = ReturnType<typeof createController>
type Session = ReturnType<typeof createSession>
export function closeMenu(root: HTMLElement, session: Session) {
  root.querySelector<HTMLElement>('.mobile-menu')!.hidden = true
  const button = root.querySelector<HTMLButtonElement>('.menu-toggle')!
  button.setAttribute('aria-expanded', 'false'); session.update({ type: 'overlay', overlay: 'none' })
}
export function bindActions(root: HTMLElement, controller: Controller, views: ReturnType<typeof createViews>, audio: ReturnType<typeof createAudio>, session: Session, retry: () => void) {
  root.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return
    const section = button.dataset.section as Section | undefined, action = button.dataset.action, id = button.dataset.case
    if (section) {
      if (!controller.state.route) views.saveFocus()
      closeMenu(root, session)
      if (session.state.phase === 'direct' || session.state.phase === 'intro' || session.state.phase === 'loading' || session.state.phase === 'ready') {
        session.direct(); controller.dispatch({ type: 'select-section', section, arrived: true })
      } else controller.select(section)
      if (document.activeElement === button && !button.offsetParent) root.querySelector<HTMLButtonElement>(controller.state.route ? '[data-action=open]' : '.menu-toggle')?.focus()
      return
    }
    if (id === 'foxmind' || id === 'flower') { controller.dispatch({ type: 'open-project', project: id }); return }
    if (action === 'enter') { session.enter(); return }
    if (action === 'direct') { session.direct(); controller.dispatch({ type: 'select-section', section: 'projects', arrived: true }); return }
    if (action === 'menu') { toggleMenu(root, controller, session); return }
    if (action === 'help') {
      closeMenu(root, session)
      root.querySelector<HTMLElement>('.help-card')!.hidden = false
      root.querySelector<HTMLElement>('.world-hint')!.focus({ preventScroll: true })
      return
    }
    if (action === 'dismiss-help') { root.querySelector<HTMLElement>('.help-card')!.hidden = true; return }
    if (action === 'retry') { retry(); return }
    if (action === 'home' || action === 'back') { returnToCamp(controller, views, session); return }
    if (action === 'projects') { controller.dispatch({ type: 'back-projects' }); return }
    if (action === 'cancel') controller.dispatch({ type: 'cancel' })
    if (action === 'resume') controller.dispatch({ type: 'resume' })
    if (action === 'open') controller.dispatch({ type: 'open-now' })
    if (action === 'motion') { const reduced = !controller.state.reducedMotion; controller.dispatch({ type: 'set-motion', reduced }); session.update({ type: 'set-motion', reduced }) }
    if (action === 'sound') void audio.toggle().then(({ enabled, failed }) => { button.setAttribute('aria-pressed', String(enabled)); button.textContent = failed ? 'No se pudo activar sonido' : enabled ? 'Sonido activado' : 'Sonido apagado' })
  })
}
function toggleMenu(root: HTMLElement, controller: Controller, session: Session) {
  const menu = root.querySelector<HTMLElement>('.mobile-menu')!, button = root.querySelector<HTMLButtonElement>('.menu-toggle')!
  if (!menu.hidden) { closeMenu(root, session); button.focus(); return }
  controller.dispatch({ type: 'pause' }); menu.hidden = false; button.setAttribute('aria-expanded', 'true')
  session.update({ type: 'overlay', overlay: 'menu' }); menu.querySelector<HTMLButtonElement>('button')?.focus()
}

export function returnToCamp(controller: Controller, views: ReturnType<typeof createViews>, session: Session) {
  const direct = session.state.direct
  views.show({ kind: 'camp' })
  controller.dispatch({ type: 'camp' })
  if (!direct) return
  if (session.state.preparation === 'ready') session.enter()
  else session.prepareEntry()
}
