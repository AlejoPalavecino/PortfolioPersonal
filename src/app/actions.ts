import { type CaseId, type Section } from '../entities'
import { type createController } from './controller'
import { type createAudio } from './audio'
type View = { kind: 'camp' } | { kind: 'section'; section: Section } | { kind: 'case'; id: CaseId }
export function closeMenu(root: HTMLElement) {
  root.querySelector<HTMLElement>('.mobile-menu')!.hidden = true
  const toggle = root.querySelector<HTMLButtonElement>('.menu-toggle')!; toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menú ☰'
}
export function handleClick(event: MouseEvent, root: HTMLElement, controller: ReturnType<typeof createController>, show: (view: View, push?: boolean) => void, audio: ReturnType<typeof createAudio>, saveFocus: () => void) {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return
  const section = button.dataset.section as Section | undefined, action = button.dataset.action, id = button.dataset.case as CaseId | undefined
  if (section) {
    saveFocus()
    closeMenu(root)
    controller.select(section)
    if (!button.offsetParent && document.activeElement === button) {
      const fallback = controller.state.route ? '[data-action=open]' : '.menu-toggle'
      root.querySelector<HTMLButtonElement>(fallback)?.focus()
    }
    return
  }
  if (id) { controller.dispatch({ type: 'open-project', project: id }); show({ kind: 'case', id }); return }
  if (action === 'explore') { const world = root.querySelector<HTMLElement>('.world')!; world.scrollIntoView({ block: 'center' }); world.focus({ preventScroll: true }); return }
  if (action === 'menu') { const menu = root.querySelector<HTMLElement>('.mobile-menu')!; menu.hidden = !menu.hidden; button.setAttribute('aria-expanded', String(!menu.hidden)); button.textContent = menu.hidden ? 'Menú ☰' : 'Cerrar ✕'; return }
  if (action === 'home' || action === 'back') { show({ kind: 'camp' }); controller.dispatch({ type: 'camp' }); return }
  if (action === 'projects') { controller.dispatch({ type: 'back-projects' }); show({ kind: 'section', section: 'projects' }); return }
  if (action === 'cancel') controller.dispatch({ type: 'cancel' })
  if (action === 'resume') controller.dispatch({ type: 'resume' })
  if (action === 'open') controller.dispatch({ type: 'open-now' })
  if (action === 'motion') { const reduced = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(reduced)); button.textContent = reduced ? 'Activar movimiento' : 'Reducir movimiento'; controller.dispatch({ type: 'set-motion', reduced }) }
  if (action === 'sound') void audio.toggle().then(({ enabled, failed }) => {
    button.setAttribute('aria-pressed', String(enabled))
    button.setAttribute('aria-label', enabled ? 'Desactivar sonido' : 'Activar sonido')
    button.textContent = failed ? 'No se pudo activar sonido' : enabled ? 'Sonido activado' : 'Sonido apagado'
  })
}

