import { WORLD, nearbySection } from '../core/domain'
import { frameName, type Direction } from '../core/fx/gait'
import { sections, type Section } from '../entities'
import { assetUrl } from '../shared'
import { t, language } from '../shared/i18n'
import type { createController, Pose } from './controller'
import type { createViews } from './views'
import { createWorldCamera } from './camera'
import type { Loop } from './loop'
import { renderScene } from './scene-rendering'

type State = ReturnType<typeof createController>['state']
type Frame = { name: string; w: number; h: number; anchorX: number; anchorY: number }
const DEFAULT_FRAME: Frame = { name: 'idle-down', w: 131, h: 255, anchorX: 64, anchorY: 252 }

function renderAccess(root: HTMLElement, state: State, nearby: Section | null) {
  const active = state.view.kind === 'section' ? state.view.section : state.view.kind === 'project' ? 'projects' : state.view.kind === 'recognitions' || state.view.kind === 'credential' ? 'journey' : null
  root.querySelectorAll<HTMLButtonElement>('[data-section]').forEach(button => {
    const section = button.dataset.section as Section
    button.toggleAttribute('data-visited', state.visited.includes(section))
    button.setAttribute('aria-description', state.visited.includes(section) ? t('Lugar visitado','Visited location') : t('Lugar por explorar','Location to explore'))
    button.toggleAttribute('data-selected', state.route?.target.kind === 'section' && state.route.target.section === section)
    button.toggleAttribute('data-nearby', nearby === section)
    if (active === section) button.setAttribute('aria-current', 'page')
    else button.removeAttribute('aria-current')
  })
  const unavailable = state.reducedMotion || state.scene !== 'ready'
  root.querySelector<HTMLElement>('.world')!.tabIndex = unavailable ? -1 : 0
  root.querySelector<HTMLElement>('.world')!.dataset.available = String(!unavailable)
  root.querySelector<HTMLElement>('.scene-status')!.hidden = state.scene !== 'failed'
}

function renderRoute(root: HTMLElement, state: State) {
  const controls = root.querySelector<HTMLElement>('.route-controls')!
  controls.hidden = !state.route
  const target = state.route?.target
  controls.querySelector('span')!.textContent = state.route?.status === 'paused' ? t('Recorrido en pausa','Journey paused')
    : target?.kind === 'section' ? t(`Yendo a ${sections[target.section]}…`, `Heading to ${sections[target.section]}…`) : t('Caminando…','Walking…')
  controls.querySelector<HTMLButtonElement>('[data-action=resume]')!.hidden = state.route?.status !== 'paused'
  controls.querySelector<HTMLButtonElement>('[data-action=open]')!.hidden = target?.kind !== 'section'
}

export function createRenderer(root: HTMLElement, views: ReturnType<typeof createViews>, loop?: Loop) {
  const avatar = root.querySelector<HTMLImageElement>('.avatar')!
  const shadow = root.querySelector<HTMLElement>('.avatar-shadow')
  let frames: readonly Frame[] = [DEFAULT_FRAME]
  let previous = ''
  let worldCamera: ReturnType<typeof createWorldCamera> | undefined
  const getCamera = () => worldCamera ??= createWorldCamera(root, loop)
  const render = (state: State, poseOrMoving: Pose | boolean, legacyDirection = 'down') => {
    const pose: Pose = typeof poseOrMoving === 'boolean'
      ? { moving: poseOrMoving, direction: legacyDirection as Direction, distance: 0 }
      : poseOrMoving
    const name = frameName(pose.direction, pose.moving, pose.distance)
    const frame = frames.find(item => item.name === name) ?? frames[0]
    if (frame && avatar.style) {
      if (avatar.dataset?.frame !== name) {
        avatar.dataset.frame = name
        avatar.src = assetUrl(`avatar/${frame.name}.webp`)
        avatar.style.width = `${frame.w * .28}px`
      }
      avatar.style.left = '0'; avatar.style.top = '0'
      avatar.style.transform = `translate(${state.position.x - frame.anchorX * .28}px, ${state.position.y - frame.anchorY * .28}px)`
      avatar.style.zIndex = String(Math.floor(state.position.y))
    }
    if (shadow?.style) {
      shadow.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
      shadow.style.zIndex = String(Math.max(1, Math.floor(state.position.y) - 1))
    }
    renderScene(root, state)
    getCamera().update(state.position, state.view.kind !== 'camp' || !root.querySelector<HTMLElement>('.mobile-menu')!.hidden, state.reducedMotion)
    root.dataset.position = `${state.position.x.toFixed(1)},${state.position.y.toFixed(1)}`
    const nearby = nearbySection(WORLD, state.position)
    const hint = root.querySelector<HTMLElement>('.world-hint')!
    const key = JSON.stringify([state.view, state.route, state.scene, state.reducedMotion, state.visited, nearby, language()])
    if (key === previous) return
    previous = key
    const touch = matchMedia('(pointer: coarse)').matches
    hint.textContent = touch ? t('Tocá un destino para caminar hasta él. También podés tocar un punto del camino.','Tap a destination to walk there. You can also tap a point along the path.') : nearby ? t(`Cerca de ${sections[nearby]}. E / Enter para abrir`, `Near ${sections[nearby]}. Press E / Enter to open`) : t('Elegí un destino para caminar. También podés explorar con WASD o las flechas.','Choose a destination to start walking. You can also explore with WASD or the arrow keys.')
    hint.hidden = state.reducedMotion || state.scene !== 'ready'
    root.dataset.routing = String(!!state.route)
    renderAccess(root, state, nearby)
    renderRoute(root, state)
    if (state.view.kind === 'section') views.show(state.view)
    else if (state.view.kind === 'project') views.show({ kind: 'case', id: state.view.project })
    else if (state.view.kind === 'recognitions' || state.view.kind === 'credential') views.show(state.view)
    else views.show({ kind: 'camp' }, false)
  }
  return { render, get camera() { return getCamera() }, setFrames(value: readonly Frame[]) { if (value.length) frames = value }, async loadFrames(ready: () => void) {
    try {
      const response = await fetch(assetUrl('avatar/frames.json'))
      if (response.ok) { frames = await response.json() as Frame[]; ready() }
    } catch { /* Static HTML avatar remains available without metadata. */ }
  } }
}
