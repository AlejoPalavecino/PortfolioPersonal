import { createCamera, followCamera, screenToWorld, type Camera } from '../core/camera'
import { WORLD, type Point } from '../core/domain'

export function createWorldCamera(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>('.world-scroll')!
  const world = root.querySelector<HTMLElement>('.world')!
  let size = { width: viewport.clientWidth, height: viewport.clientHeight }
  let focus: Point = WORLD.spawn
  const scale = () => size.width < 700 ? 1.08 : Math.max(.75, size.width / 1000, size.height / 650)
  let camera: Camera = createCamera(WORLD, size, focus, scale())
  let last = 0, locked = false, reduced = false
  const paint = () => {
    world.style.transform = `translate(${-camera.x * camera.scale}px, ${-camera.y * camera.scale}px) scale(${camera.scale})`
    root.dataset.camera = `${camera.x.toFixed(1)},${camera.y.toFixed(1)},${camera.scale.toFixed(2)}`
    world.querySelectorAll<HTMLButtonElement>('.world-label').forEach(label => {
      const x = (label.offsetLeft - camera.x) * camera.scale, y = (label.offsetTop - camera.y) * camera.scale
      label.tabIndex = x >= 0 && y >= 0 && x + label.offsetWidth * camera.scale <= size.width && y + label.offsetHeight * camera.scale <= size.height ? 0 : -1
    })
  }
  const resize = () => { size = { width: viewport.clientWidth, height: viewport.clientHeight }; camera = createCamera(WORLD, size, focus, scale()); paint() }
  const tick = (time: number) => {
    const menuOpen = !root.querySelector<HTMLElement>('.mobile-menu')!.hidden
    const reading = !root.querySelector<HTMLElement>('.panel')!.hidden
    const next = followCamera(camera, focus, WORLD, size, last ? time - last : 0, { locked: locked || menuOpen || reading, reducedMotion: reduced })
    if (Math.abs(next.x - camera.x) > .02 || Math.abs(next.y - camera.y) > .02) { camera = next; paint() }
    last = time; requestAnimationFrame(tick)
  }
  window.addEventListener('resize', resize)
  new ResizeObserver(resize).observe(viewport)
  paint(); requestAnimationFrame(tick)
  return {
    update(point: Point, freeze: boolean, motion: boolean) { focus = point; locked = freeze; reduced = motion },
    point(x: number, y: number) { const rect = viewport.getBoundingClientRect(); return screenToWorld({ x: x - rect.left, y: y - rect.top }, camera) },
  }
}
