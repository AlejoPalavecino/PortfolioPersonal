import { WORLD } from '../core/domain'
import type { Section } from '../entities'
import { closeMenu, handleClick } from './actions'
import type { createController } from './controller'
import type { createViews, View } from './views'
import type { createAudio } from './audio'
import { bindKeyboard } from './keyboard'

type Controller = ReturnType<typeof createController>
type Views = ReturnType<typeof createViews>
const editable = (target: EventTarget | null) => target instanceof HTMLElement &&
  (target.isContentEditable || !!target.closest('input,textarea,select,[role=combobox]'))

export function bindPreferences(root: HTMLElement, controller: Controller) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  controller.dispatch({ type: 'set-motion', reduced: motion.matches })
  motion.addEventListener('change', event => controller.dispatch({ type: 'set-motion', reduced: event.matches }))
  const settings = root.querySelector<HTMLElement>('.settings')!
  const menu = root.querySelector<HTMLElement>('.mobile-menu')!
  const mobile = matchMedia('(max-width: 700px)')
  const place = () => { if (mobile.matches) menu.append(settings); else root.append(settings) }
  place()
  mobile.addEventListener('change', place)
}

function bindWorld(root: HTMLElement, controller: Controller, views: Views) {
  const world = root.querySelector<HTMLElement>('.world')!
  world.addEventListener('click', event => {
    if ((event.target as HTMLElement).closest('button') || controller.state.view.kind !== 'camp') return
    const poi = (event.target as HTMLElement).closest<HTMLElement>('[data-poi]')
    if (poi) { views.saveFocus(); controller.select(poi.dataset.poi as Section); return }
    if (controller.state.reducedMotion || controller.state.scene !== 'ready') return
    const rect = world.getBoundingClientRect()
    const valid = controller.ground({ x: (event.clientX - rect.left) / rect.width * WORLD.width,
      y: (event.clientY - rect.top) / rect.height * WORLD.height })
    if (!valid) world.querySelector<HTMLElement>('.world-hint')!.textContent = 'Elegí un lugar accesible del camino'
  })
  bindKeyboard(world, controller)
}

function bindEscape(root: HTMLElement, controller: Controller, views: Views) {
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || editable(event.target)) return
    if (!root.querySelector<HTMLElement>('.mobile-menu')!.hidden) {
      closeMenu(root)
      root.querySelector<HTMLButtonElement>('.menu-toggle')!.focus()
    } else if (controller.state.route) controller.dispatch({ type: 'cancel' })
    else if (views.current.kind === 'case') controller.dispatch({ type: 'back-projects' })
    else if (views.current.kind !== 'camp') { views.show({ kind: 'camp' }); controller.dispatch({ type: 'camp' }) }
    else root.querySelector<HTMLButtonElement>('.brand')!.focus()
  })
}

export function bindEvents(root: HTMLElement, controller: Controller, views: Views, audio: ReturnType<typeof createAudio>) {
  root.addEventListener('click', event => {
    if ((event.target as HTMLElement).closest('.skip')) {
      event.preventDefault()
      const content = root.querySelector<HTMLElement>('.panel:not([hidden]) h2') ?? root.querySelector<HTMLElement>('main')!
      content.tabIndex = -1
      content.focus()
      return
    }
    const hadRoute = !!controller.state.route
    handleClick(event, root, controller, views.show, audio, () => {
      if (!controller.state.route) views.saveFocus()
    })
    if (!hadRoute && controller.state.route && matchMedia('(max-width: 700px)').matches) {
      root.querySelector<HTMLElement>('.world')!.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
    if (controller.state.route && !(document.activeElement as HTMLElement)?.offsetParent) {
      root.querySelector<HTMLElement>('[data-action=open]:not([hidden]),[data-action=cancel]')?.focus()
    }
  })
  bindWorld(root, controller, views)
  bindEscape(root, controller, views)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return
    controller.dispatch({ type: 'pause' })
    audio.pause()
    const button = root.querySelector<HTMLButtonElement>('[data-action=sound]')!
    if (button.getAttribute('aria-pressed') === 'true') {
      button.textContent = 'Continuar sonido'
      button.setAttribute('aria-label', 'Continuar sonido')
    }
  })
  window.addEventListener('popstate', event => views.restore((event.state as View | null) ?? { kind: 'camp' }, controller))
  window.addEventListener('hashchange', () => views.restoreUrl(controller))
}
