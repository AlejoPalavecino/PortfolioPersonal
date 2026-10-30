import { WORLD, nearbySection } from '../core/domain'
import { sections, type Section } from '../entities'
import { assetUrl } from '../shared'
import type { createController } from './controller'
import type { createViews } from './views'

type State = ReturnType<typeof createController>['state']
type Frame = { name: string; w: number; h: number; anchorX: number; anchorY: number }

function renderAccess(root: HTMLElement, state: State) {
  const active = state.view.kind === 'section' ? state.view.section : state.view.kind === 'project' ? 'projects' : null
  root.querySelectorAll<HTMLButtonElement>('[data-section]').forEach(button => {
    const section = button.dataset.section as Section
    button.toggleAttribute('data-visited', state.visited.includes(section))
    if (active === section) button.setAttribute('aria-current', 'page')
    else button.removeAttribute('aria-current')
  })
  const unavailable = state.reducedMotion || state.scene !== 'ready'
  root.querySelector<HTMLElement>('.world')!.tabIndex = unavailable ? -1 : 0
  root.querySelector<HTMLElement>('[data-action=explore]')!.hidden = unavailable
  root.querySelector<HTMLElement>('.scene-status')!.hidden = state.scene !== 'failed'
  const motion = root.querySelector<HTMLButtonElement>('[data-action=motion]')!
  motion.setAttribute('aria-pressed', String(state.reducedMotion))
  motion.textContent = state.reducedMotion ? 'Activar movimiento' : 'Reducir movimiento'
}

function renderRoute(root: HTMLElement, state: State) {
  const controls = root.querySelector<HTMLElement>('.route-controls')!
  controls.hidden = !state.route
  const target = state.route?.target
  controls.querySelector('span')!.textContent = state.route?.status === 'paused' ? 'Recorrido en pausa'
    : target?.kind === 'section' ? `Yendo a ${sections[target.section]}…` : 'Caminando…'
  controls.querySelector<HTMLButtonElement>('[data-action=resume]')!.hidden = state.route?.status !== 'paused'
  controls.querySelector<HTMLButtonElement>('[data-action=open]')!.hidden = target?.kind !== 'section'
}

export function createRenderer(root: HTMLElement, views: ReturnType<typeof createViews>) {
  const avatar = root.querySelector<HTMLImageElement>('.avatar')!
  let frames: Frame[] = []
  const render = (state: State, moving: boolean, direction: string) => {
    const name = moving ? `walk-${direction}-${Math.floor(performance.now() / 167) % 4 + 1}` : `idle-${direction}`
    const frame = frames.find(item => item.name === name)
    if (frame) {
      avatar.src = assetUrl(`avatar/${frame.name}.webp`)
      avatar.style.width = `${frame.w * .28 / 10}%`
      avatar.style.transform = `translate(${-frame.anchorX / frame.w * 100}%, ${-frame.anchorY / frame.h * 100}%)`
    }
    avatar.style.left = `${state.position.x / WORLD.width * 100}%`
    avatar.style.top = `${state.position.y / WORLD.height * 100}%`
    avatar.style.zIndex = String(Math.floor(state.position.y))
    const nearby = nearbySection(WORLD, state.position)
    const hint = root.querySelector<HTMLElement>('.world-hint')!
    hint.textContent = nearby ? `Cerca de ${sections[nearby]}. Enter o E para abrir`
      : 'Flechas o WASD para caminar. Enter o E junto a una entrada. Tab para salir.'
    hint.hidden = state.reducedMotion || state.scene !== 'ready'
    renderAccess(root, state)
    renderRoute(root, state)
    if (state.view.kind === 'section') views.show(state.view)
    else if (state.view.kind === 'project') views.show({ kind: 'case', id: state.view.project })
    else views.show({ kind: 'camp' }, false)
  }
  return { render, async loadFrames(ready: () => void) {
    try {
      const response = await fetch(assetUrl('avatar/frames.json'))
      if (response.ok) { frames = await response.json() as Frame[]; ready() }
    } catch { /* Static HTML avatar remains available without metadata. */ }
  } }
}
