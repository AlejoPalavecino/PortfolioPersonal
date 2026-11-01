import { createCamera, followCamera, screenToWorld, type Camera } from '../core/camera'
import { WORLD, type Point } from '../core/domain'
import type { Loop } from './loop'

const SETTLE_ZOOM = 1.07
const ease = (t: number) => 1 - (1 - t) ** 3

/**
 * Camera transform for the world. Art, collisions and click coordinates all go through the same
 * `camera` value, so the entry "settle" (a brief zoom that eases to 1) and the parallax never
 * desynchronise them: `point()` always converts with the camera that is actually painted.
 */
export function createWorldCamera(root: HTMLElement, loop?: Loop) {
  const viewport = root.querySelector<HTMLElement>('.world-scroll')!
  const world = root.querySelector<HTMLElement>('.world')!
  const landscape = root.querySelector<HTMLElement>('.landscape')
  const menu = root.querySelector<HTMLElement>('.mobile-menu')
  const panel = root.querySelector<HTMLElement>('.panel')
  let size = { width: viewport.clientWidth, height: viewport.clientHeight }
  let focus: Point = WORLD.spawn
  const scale = () => size.width < 700 ? 1.08 : Math.max(.75, size.width / 1000, size.height / 650)
  let camera: Camera = createCamera(WORLD, size, focus, scale())
  let locked = false, reduced = false, settle: { start: number; duration: number } | null = null
  let labels: { label: HTMLButtonElement; x: number; y: number; w: number; h: number }[] = []
  const measureLabels = () => {
    labels = [...world.querySelectorAll<HTMLButtonElement>('.world-label')].map(label => ({ label, x: label.offsetLeft, y: label.offsetTop, w: label.offsetWidth, h: label.offsetHeight }))
  }
  const parallax = () => {
    if (!landscape) return
    if (reduced) { landscape.style.backgroundPosition = ''; return }
    const visibleW = size.width / camera.scale, visibleH = size.height / camera.scale
    const maxX = Math.max(0, WORLD.width - visibleW), maxY = Math.max(0, WORLD.height - visibleH)
    const tx = maxX > 0 ? camera.x / maxX : .5, ty = maxY > 0 ? camera.y / maxY : .5
    landscape.style.backgroundPosition = `${(50 + (.5 - tx) * 6).toFixed(1)}% ${(50 + (.5 - ty) * 4).toFixed(1)}%`
  }
  const paint = () => {
    world.style.transform = `translate(${-camera.x * camera.scale}px, ${-camera.y * camera.scale}px) scale(${camera.scale})`
    root.dataset.camera = `${camera.x.toFixed(1)},${camera.y.toFixed(1)},${camera.scale.toFixed(2)}`
    parallax()
    if (!labels.length) measureLabels()
    for (const item of labels) {
      const x = (item.x - camera.x) * camera.scale, y = (item.y - camera.y) * camera.scale
      const index = x >= 0 && y >= 0 && x + item.w * camera.scale <= size.width && y + item.h * camera.scale <= size.height ? 0 : -1
      if (item.label.tabIndex !== index) item.label.tabIndex = index
    }
  }
  const resize = () => { size = { width: viewport.clientWidth, height: viewport.clientHeight }; camera = createCamera(WORLD, size, focus, scale() * boost()); measureLabels(); paint() }
  const boost = () => settle ? 1 + (SETTLE_ZOOM - 1) * (1 - ease(Math.min(1, (performance.now() - settle.start) / settle.duration))) : 1
  const tick = (_time: number, elapsed: number) => {
    if (settle) {
      const progress = (performance.now() - settle.start) / settle.duration
      if (progress >= 1) settle = null
      camera = createCamera(WORLD, size, focus, scale() * boost()); paint()
      return
    }
    const next = followCamera(camera, focus, WORLD, size, elapsed, { locked: locked || !!menu && !menu.hidden || !!panel && !panel.hidden, reducedMotion: reduced })
    if (Math.abs(next.x - camera.x) > .02 || Math.abs(next.y - camera.y) > .02) { camera = next; paint() }
  }
  const off = loop?.add(tick)
  window.addEventListener('resize', resize)
  const observer = new ResizeObserver(resize); observer.observe(viewport)
  paint()
  return {
    update(point: Point, freeze: boolean, motion: boolean) { focus = point; locked = freeze; if (motion !== reduced) { reduced = motion; paint() } },
    point(x: number, y: number) { const rect = viewport.getBoundingClientRect(); return screenToWorld({ x: x - rect.left, y: y - rect.top }, camera) },
    /** Entry gesture: start slightly closer and ease out. Ignored with reduced motion. */
    settle(durationMs = 560) { if (!reduced) settle = { start: performance.now(), duration: durationMs } },
    /** An order arrived during the settle: finish it now so aim and picture agree again. */
    finishSettle() { if (settle) { settle = null; camera = createCamera(WORLD, size, focus, scale()); paint() } },
    dispose() { off?.(); observer.disconnect(); window.removeEventListener('resize', resize) },
  }
}
