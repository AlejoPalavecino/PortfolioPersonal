import type { createController } from './controller'
import type { Loop } from './loop'

const moves: Record<string, [number, number]> = {
  arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1],
  arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
}

/**
 * Keyboard input only reports which directions are held. Speed, diagonal normalisation and
 * easing are owned by the controller, so keys and routes share exactly the same locomotion.
 */
export function bindKeyboard(world: HTMLElement, controller: ReturnType<typeof createController>, enabled: () => boolean = () => true, loop?: Loop) {
  const held = new Set<string>()
  const active = () => enabled() && document.activeElement === world && !document.hidden &&
    controller.state.scene === 'ready' && !controller.state.reducedMotion && controller.state.view.kind === 'camp'
  const push = () => {
    const vector = [...held].reduce((sum, key) => [sum[0]! + moves[key]![0], sum[1]! + moves[key]![1]], [0, 0])
    controller.setInput(vector[0]!, vector[1]!)
  }
  const stop = () => { if (held.size) { held.clear(); controller.stopManual() } }
  // Reading, menus or focus loss can start without a key event: check cheaply instead of every frame.
  loop?.add(() => { if (held.size && !active()) stop() }, { intervalMs: 100 })
  world.addEventListener('keydown', event => {
    if (!active() || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return
    const key = event.key.toLowerCase()
    if (moves[key]) { event.preventDefault(); if (!held.has(key)) { held.add(key); push() } }
    else if ((key === 'enter' || key === 'e') && !controller.state.route) { event.preventDefault(); controller.interact() }
  })
  world.addEventListener('keyup', event => {
    if (held.delete(event.key.toLowerCase())) push()
    if (!held.size) controller.stopManual()
  })
  world.addEventListener('blur', stop)
  window.addEventListener('blur', stop)
  document.addEventListener('visibilitychange', stop)
}
