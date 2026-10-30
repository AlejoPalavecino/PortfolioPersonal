import type { createController } from './controller'

const moves: Record<string, [number, number]> = {
  arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1],
  arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
}

export function bindKeyboard(world: HTMLElement, controller: ReturnType<typeof createController>) {
  const held = new Set<string>()
  let last = 0
  const active = () => document.activeElement === world && !document.hidden &&
    controller.state.scene === 'ready' && !controller.state.reducedMotion && controller.state.view.kind === 'camp'
  const stop = () => { if (held.size) { held.clear(); controller.stopManual() } }
  const tick = (time: number) => {
    const elapsed = Math.min((time - last) / 1000, .05)
    last = time
    if (!active()) stop()
    if (held.size) {
      const vector = [...held].reduce((sum, key) => [sum[0]! + moves[key]![0], sum[1]! + moves[key]![1]], [0, 0])
      const length = Math.hypot(vector[0]!, vector[1]!) || 1
      controller.manual(vector[0]! / length * elapsed * 150, vector[1]! / length * elapsed * 150)
    }
    requestAnimationFrame(tick)
  }
  world.addEventListener('keydown', event => {
    if (!active() || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return
    const key = event.key.toLowerCase()
    if (moves[key]) { event.preventDefault(); held.add(key) }
    else if ((key === 'enter' || key === 'e') && !controller.state.route) { event.preventDefault(); controller.interact() }
  })
  world.addEventListener('keyup', event => {
    held.delete(event.key.toLowerCase())
    if (!held.size) controller.stopManual()
  })
  world.addEventListener('blur', stop)
  window.addEventListener('blur', stop)
  document.addEventListener('visibilitychange', stop)
  requestAnimationFrame(tick)
}
