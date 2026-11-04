import { setControlLabel } from './control-label'
import { WORLD } from '../core/domain'
import { roomForView } from '../core/experience'
import { email as defaultEmail, type Section } from '../entities'
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

export async function copyEmailAddress(root: HTMLElement, button: HTMLButtonElement): Promise<boolean> {
  const address = button.dataset.email || defaultEmail
  const status = root.querySelector<HTMLElement>('.copy-status')
  const fallbackWrap = root.querySelector<HTMLElement>('.copy-fallback-wrap')
  const fallbackInput = root.querySelector<HTMLInputElement>('.copy-fallback')
  try {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      throw new Error('Portapapeles no disponible')
    }
    await navigator.clipboard.writeText(address)
    if (status) {
      status.hidden = false
      status.dataset.copyState = 'copied'
      status.textContent = `Correo copiado al portapapeles: ${address}`
    }
    if (fallbackWrap) fallbackWrap.hidden = true
    button.textContent = 'Correo copiado ✓'
    return true
  } catch {
    if (status) {
      status.hidden = false
      status.dataset.copyState = 'fallback'
      status.textContent = `No se pudo copiar automáticamente. El correo quedó listo para copiar manualmente: ${address}`
    }
    if (fallbackWrap) fallbackWrap.hidden = false
    if (fallbackInput) {
      fallbackInput.focus()
      fallbackInput.select?.()
    }
    return false
  }
}

export function bindActions(root: HTMLElement, controller: Controller, views: ReturnType<typeof createViews>, audio: ReturnType<typeof createAudio>, session: Session, retry: () => void, toggleMotion: () => void) {
  root.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return
    const section = button.dataset.section as Section | undefined, action = button.dataset.action, id = button.dataset.case
    if (section) {
      const inRoom = !!views.current && views.current.kind !== 'camp'
      if (!inRoom && !controller.state?.route) views.saveFocus?.()
      closeMenu(root, session)
      if (inRoom || session.state.phase === 'direct' || session.state.phase === 'intro' || session.state.phase === 'loading' || session.state.phase === 'ready') {
        if (!inRoom) session.direct()
        if (WORLD.arrivals[section]) controller.dispatch({ type: 'move', position: WORLD.arrivals[section].point })
        controller.dispatch({ type: 'select-section', section, arrived: true })
      } else controller.select(section)
      if (document.activeElement === button && !button.offsetParent) root.querySelector<HTMLButtonElement>(controller.state.route ? '[data-action=open]' : '.menu-toggle')?.focus()
      return
    }
    const credential = button.dataset.credential
    if (credential) { controller.dispatch({ type: 'restore', view: { kind: 'credential', id: credential } }); return }
    if (action === 'recognitions') { controller.dispatch({ type: 'restore', view: { kind: 'recognitions' } }); return }
    if (action === 'journey') { controller.dispatch({ type: 'restore', view: { kind: 'section', section: 'journey' } }); return }
    if (id === 'foxmind' || id === 'flower') { controller.dispatch({ type: 'open-project', project: id }); return }
    if (action === 'enter' || action === 'skip-intro') { if (session.skipIntro) session.skipIntro(); else session.enter(); return }
    if (action === 'direct') { session.direct(); controller.dispatch({ type: 'select-section', section: 'projects', arrived: true }); return }
    if (action === 'copy-email') { void copyEmailAddress(root, button); return }
    if (action === 'force-room') { views.forceOpenPendingRoom?.(); return }
    if (action === 'retry-room-bg' && button.dataset.room) { views.retryRoomBackground?.(button.dataset.room as Section); return }
    if (action === 'menu') { toggleMenu(root, controller, session); return }
    if (action === 'help') {
      closeMenu(root, session)
      root.querySelector<HTMLElement>('.help-card')!.hidden = false
      root.querySelector<HTMLElement>('.tutorial-hint')!.focus({ preventScroll: true })
      return
    }
    if (action === 'dismiss-help') { root.querySelector<HTMLElement>('.help-card')!.hidden = true; root.querySelector<HTMLElement>('[data-action=help]')?.focus(); return }
    if (action === 'retry') { retry(); return }
    if (action === 'home' || action === 'back') { closeMenu(root, session); returnToCamp(controller, views, session); return }
    if (action === 'projects') { controller.dispatch({ type: 'back-projects' }); return }
    if (action === 'cancel') { controller.dispatch({ type: 'cancel' }); if (views.current.kind === 'camp') root.querySelector<HTMLElement>('.world')?.focus() }
    if (action === 'resume') {
      controller.dispatch({ type: 'resume' })
      root.querySelector<HTMLElement>('.world')?.focus({ preventScroll: true })
    }
    if (action === 'open') controller.dispatch({ type: 'open-now' })
    if (action === 'motion') toggleMotion()
    if (action === 'sound') void audio.toggle().then(({ enabled, failed }) => {
      const label = failed ? 'No se pudo activar sonido' : enabled ? 'Sonido activado' : 'Sonido apagado'
      button.setAttribute('aria-pressed', String(enabled)); setControlLabel(button, label)
      root.querySelectorAll?.<HTMLButtonElement>('[data-action=sound]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(enabled)); setControlLabel(btn, label)
      })
    })
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
  const prevRoom = views.current ? roomForView(views.current) : null
  if (direct && prevRoom && WORLD.arrivals[prevRoom]) {
    controller.dispatch({ type: 'move', position: WORLD.arrivals[prevRoom].point })
  }
  views.show({ kind: 'camp' })
  controller.dispatch({ type: 'camp' })
  if (!direct) return
  if (session.state.preparation === 'ready') session.enter()
  else session.prepareEntry()
}
