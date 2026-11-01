import { WALK_SPEED, approachSpeed, walkFrame } from '../../core/fx/gait'
import { FX_LIMITS } from '../../core/fx/budget'
import type { CueBus } from '../../core/fx/cues'
import { assetUrl } from '../../shared'
import type { Loop } from '../loop'
import { createFireParticles, drawFlame } from './pixel-fire'

/**
 * The loading vignette: Alejo walks into the camp at dusk of day and warms up at the fire.
 * - The fire grows with the REAL preparation progress (completed / total). No timers invent progress.
 * - When the world is ready he turns to face the visitor ("Listo para explorar").
 * - It is a 160x72 pixel canvas drawn with the camp palette, so it costs a few KB and appears
 *   before the world has downloaded. The only network use is 5 small avatar frames.
 * - Under reduced motion it draws one still frame and redraws only when progress changes.
 */
const W = 160, H = 72, GROUND = 54, FEET = 64, FIRE_X = 114
const SCALE = 0.135, STAND_X = 78, START_X = -14
const RATIO = SCALE / 0.28
type FrameInfo = { name: string; w: number; h: number; anchorX: number; anchorY: number }
type Sprite = { info: FrameInfo; image: HTMLImageElement }

const hash = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x) }
function ridge(ctx: CanvasRenderingContext2D, points: readonly (readonly [number, number])[], base: number, color: string) {
  ctx.fillStyle = color
  for (let x = 0; x < W; x++) {
    let y = base
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1]!, [x1, y1] = points[i]!
      if (x >= x0 && x <= x1) { y = Math.round(y0 + (y1 - y0) * (x - x0) / Math.max(1, x1 - x0)); break }
    }
    ctx.fillRect(x, y, 1, base - y)
  }
}
function spans(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  for (let dy = -ry; dy <= ry; dy++) {
    const half = Math.round(rx * Math.sqrt(1 - (dy / ry) ** 2))
    ctx.fillRect(cx - half, cy + dy, half * 2, 1)
  }
}

function paintBackdrop(ctx: CanvasRenderingContext2D) {
  const bands = ['#6cb3d6', '#80c0e2', '#98d1e9', '#b2e0f1']
  bands.forEach((color, i) => { ctx.fillStyle = color; ctx.fillRect(0, i * 13, W, 13) })
  ctx.fillStyle = '#ffffff'
  for (const [x, y, w] of [[22, 9, 12], [96, 14, 16], [128, 6, 9]] as const) { ctx.fillRect(x, y, w, 2); ctx.fillRect(x + 2, y - 1, w - 5, 1); ctx.fillRect(x + 1, y + 2, w - 3, 1) }
  ridge(ctx, [[0, 46], [14, 33], [24, 40], [40, 25], [52, 37], [66, 30], [80, 42], [100, 30], [116, 40], [134, 23], [148, 35], [160, 31]], 50, '#8bacc6')
  ctx.fillStyle = '#f4f8fb'
  for (const [x, y] of [[40, 25], [39, 26], [41, 26], [134, 23], [133, 24], [135, 24], [14, 33]] as const) ctx.fillRect(x, y, 1, 1)
  ridge(ctx, [[0, 50], [20, 43], [44, 48], [70, 41], [96, 48], [122, 43], [160, 49]], GROUND, '#5b8c63')
  for (const x of [6, 15, 143, 152]) {
    ctx.fillStyle = '#35603a'
    for (let row = 0; row < 7; row++) ctx.fillRect(x - Math.floor(row / 2), GROUND - 7 + row, 1 + Math.floor(row / 2) * 2, 1)
    ctx.fillStyle = '#5a3a24'; ctx.fillRect(x, GROUND, 1, 2)
  }
  ctx.fillStyle = '#d9a463'; ctx.fillRect(0, GROUND, W, H - GROUND)
  for (let i = 0; i < 120; i++) {
    const x = Math.floor(hash(i) * W), y = GROUND + 2 + Math.floor(hash(i + 400) * (H - GROUND - 2))
    ctx.fillStyle = hash(i + 900) > 0.5 ? '#c48f50' : '#e9c07f'
    ctx.fillRect(x, y, hash(i + 77) > 0.7 ? 2 : 1, 1)
  }
  ctx.fillStyle = '#5f9a3c'; ctx.fillRect(0, GROUND, W, 2)
  ctx.fillStyle = '#86b94a'
  for (let x = 2; x < W; x += 5 + Math.floor(hash(x) * 4)) ctx.fillRect(x, GROUND - 1, 1, 1)
  ctx.fillStyle = '#74533b'; ctx.fillRect(0, H - 2, W, 2)
}

const stones: readonly (readonly [number, number])[] = [[-14, 0], [-11, -3], [-5, -4], [1, -5], [7, -4], [12, -2], [14, 1], [10, 4], [4, 5], [-3, 5], [-9, 4]]
function ring(ctx: CanvasRenderingContext2D, front: boolean) {
  stones.forEach(([dx, dy], i) => {
    if ((dy > 0) !== front && dy !== 0) return
    if (dy === 0 && front) return
    ctx.fillStyle = i % 2 ? '#8b9298' : '#aab0b4'
    ctx.fillRect(FIRE_X + dx - 1, FEET - 1 + dy, 4, 2)
    ctx.fillStyle = '#5f666b'; ctx.fillRect(FIRE_X + dx - 1, FEET + dy, 4, 1)
  })
}

export function createVignette(canvas: HTMLCanvasElement, options: { bus: CueBus; loop: Loop; reducedMotion: () => boolean }) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { dispose() {}, refresh() {} }
  canvas.width = W; canvas.height = H
  const sprites = new Map<string, Sprite>()
  const smoke = createFireParticles(FX_LIMITS.full.smoke)
  let target = 0, shown = 0.06, ready = false, x = START_X, speed = 0, travelled = 0, clock = 0
  let visible = true, off: (() => void) | null = null, disposed = false

  const standing = () => x >= STAND_X
  const spriteName = () => {
    if (!standing()) return `walk-right-${walkFrame(travelled / RATIO) + 1}`
    return ready ? 'idle-down' : 'idle-right'
  }
  const draw = () => {
    paintBackdrop(ctx)
    ring(ctx, false)
    ctx.fillStyle = '#6e4527'; ctx.fillRect(FIRE_X - 8, FEET - 3, 16, 3); ctx.fillRect(FIRE_X - 5, FEET - 6, 10, 3)
    ctx.fillStyle = '#8c5a33'; ctx.fillRect(FIRE_X - 8, FEET - 3, 16, 1)
    ctx.fillStyle = '#2a1b12'; ctx.fillRect(FIRE_X - 4, FEET - 1, 8, 1)
    drawFlame(ctx, FIRE_X, FEET - 3, shown, Math.floor(clock / 120) % 4, { height: 19, half: 6 })
    ring(ctx, true)
    const sprite = sprites.get(spriteName())
    if (sprite) {
      const { info, image } = sprite
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'
      ctx.fillStyle = 'rgba(70,45,25,.28)'; spans(ctx, Math.round(x), FEET, 6, 2)
      ctx.drawImage(image, Math.round(x - info.anchorX * SCALE), Math.round(FEET - info.anchorY * SCALE), Math.round(info.w * SCALE), Math.round(info.h * SCALE))
    }
    smoke.draw(ctx)
    const glow = Math.max(0, shown - 0.15)
    if (glow > 0) {
      for (const [rx, ry, alpha] of [[40, 9, 0.05], [28, 6, 0.06], [16, 4, 0.08]] as const) { ctx.fillStyle = `rgba(255,170,70,${alpha * glow * 1.4})`; spans(ctx, FIRE_X, FEET, rx, ry) }
    }
  }
  const frame = (_time: number, elapsed: number) => {
    clock += elapsed
    shown += (target - shown) * (1 - Math.exp(-elapsed / 280))
    if (!standing()) {
      speed = approachSpeed(speed, WALK_SPEED, elapsed)
      const step = speed * RATIO * elapsed / 1000
      x = Math.min(STAND_X, x + step); travelled += step
    } else speed = 0
    smoke.step(elapsed, FIRE_X, FEET - 8, shown, true)
    draw()
  }
  const sync = () => {
    off?.(); off = null
    if (disposed) return
    if (options.reducedMotion()) { x = STAND_X; shown = target; draw(); return }
    if (visible && !document.hidden) off = options.loop.add(frame, { intervalMs: 66 })
  }

  const offs = [
    options.bus.on('prepare-start', () => { ready = false; target = 0.06; if (options.reducedMotion()) { shown = target; draw() } }),
    options.bus.on('prepare-progress', ({ completed, total }) => { target = Math.max(target, 0.06 + 0.8 * (completed / Math.max(1, total))); if (options.reducedMotion()) { shown = target; draw() } }),
    options.bus.on('prepare-ready', () => { ready = true; target = 1; if (options.reducedMotion()) { shown = 1; draw() } }),
  ]
  const observer = new IntersectionObserver(entries => { visible = !!entries.at(-1)?.isIntersecting; sync() })
  observer.observe(canvas)
  const onVisibility = () => sync()
  document.addEventListener('visibilitychange', onVisibility)

  void (async () => {
    try {
      const meta = await (await fetch(assetUrl('avatar/frames.json'))).json() as FrameInfo[]
      const wanted = ['idle-right', 'idle-down', 'walk-right-1', 'walk-right-2', 'walk-right-3', 'walk-right-4']
      await Promise.all(wanted.map(async name => {
        const info = meta.find(item => item.name === name); if (!info) return
        const image = new Image(); image.src = assetUrl(`avatar/${name}.webp`); await image.decode()
        sprites.set(name, { info, image })
      }))
    } catch { /* The fire alone is a complete, honest vignette. */ }
    if (!disposed && (options.reducedMotion() || !off)) { if (options.reducedMotion()) x = STAND_X; draw() }
  })()
  draw(); sync()
  return {
    dispose() { disposed = true; off?.(); offs.forEach(fn => fn()); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) },
    refresh: sync,
  }
}
