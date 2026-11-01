import { WORLD, nearbySection, type Point, type Section } from '../../core/domain'
import { FX_LIMITS, createFrameMonitor, degrade, initialLevel, type FxLevel } from '../../core/fx/budget'
import type { CueBus } from '../../core/fx/cues'
import { createParticlePool } from '../../core/fx/particles'
import { raisesDust } from '../../core/fx/surface'
import { assetUrl } from '../../shared'
import type { createWorldCamera } from '../camera'
import type { createController } from '../controller'
import type { Loop } from '../loop'
import { createFireParticles, drawFlame } from './pixel-fire'
import { CAMPFIRE, LANTERNS, drawDestinationResponse, drawHalo, drawPixelRing, drawWater } from './world-painters'

type TapMarker = { point: Point; age: number; duration: number }
type RouteTrail = { section: Section; point: Point; breadcrumbs: Point[]; age: number }
type ArrivalPulse = { section: Section; age: number; duration: number }

const SECTIONS: readonly Section[] = ['projects', 'about', 'journey', 'contact']

function sampleBreadcrumbs(path: readonly Point[], spacing = 26): Point[] {
  const result: Point[] = []
  let carry = spacing * 0.5
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]!, b = path[i]!
    const seg = Math.hypot(b.x - a.x, b.y - a.y)
    if (seg < 1) continue
    let d = carry
    while (d < seg - 14) {
      const t = d / seg
      result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
      d += spacing
    }
    carry = d - seg
  }
  return result.slice(0, 14)
}

export function bindWorldFx(
  root: HTMLElement,
  controller: ReturnType<typeof createController>,
  camera: ReturnType<typeof createWorldCamera>,
  bus: CueBus,
  loop: Loop,
) {
  const groundCanvas = root.querySelector<HTMLCanvasElement>('.world-fx-ground')
  const propsCanvas = root.querySelector<HTMLCanvasElement>('.world-fx-props')
  const groundCtx = groundCanvas?.getContext('2d') ?? null
  const propsCtx = propsCanvas?.getContext('2d') ?? null
  const reduced = () => root.dataset.motion === 'reduced'
  const reading = () => root.dataset.reading === 'true'
  const menuOpen = () => !root.querySelector<HTMLElement>('.mobile-menu')?.hidden

  const computeLevel = (): FxLevel => initialLevel({
    reducedMotion: reduced(),
    coarsePointer: matchMedia('(pointer: coarse)').matches,
    width: window.innerWidth || 1024,
    cores: navigator.hardwareConcurrency,
  })
  let level: FxLevel = computeLevel()
  root.dataset.fxLevel = level

  const dust = createParticlePool(FX_LIMITS[level].dust)
  const mote = createParticlePool(2)
  const fire = createFireParticles(FX_LIMITS[level].smoke, 4)

  const applyBudget = (next: FxLevel) => {
    level = next
    root.dataset.fxLevel = level
    const limits = FX_LIMITS[level]
    dust.setMax(limits.dust)
    fire.setMaxSmoke(limits.smoke)
    if (level === 'minimal') { dust.clear(); fire.clear(); mote.clear() }
  }

  const monitor = createFrameMonitor(() => {
    if (level !== 'minimal') applyBudget(degrade(level))
  })

  let tap: TapMarker | null = null
  let trail: RouteTrail | null = null
  let arrival: ArrivalPulse | null = null
  let clock = 0, carry = 0, moteTimer = 0
  const entryTimers: number[] = []
  const thresholdTimers: number[] = []
  const thresholdStage = root.querySelector<HTMLElement>('.threshold-stage')
  const thresholdActor = root.querySelector<HTMLImageElement>('.threshold-actor')

  const clearThreshold = () => {
    while (thresholdTimers.length) window.clearTimeout(thresholdTimers.pop())
    if (thresholdStage) {
      thresholdStage.hidden = true
      delete thresholdStage.dataset.section
    }
  }

  const startThreshold = (section: Section) => {
    clearThreshold()
    if (reduced() || !thresholdStage) return
    thresholdStage.hidden = false
    thresholdStage.dataset.section = section
    if (thresholdActor) {
      if (section === 'projects' || section === 'about') {
        thresholdActor.hidden = false
        thresholdActor.src = assetUrl('camp-rooms-v1/avatars/walk-up-1.png')
        thresholdTimers.push(window.setTimeout(() => {
          if (thresholdActor) thresholdActor.src = assetUrl('camp-rooms-v1/avatars/idle-up.png')
        }, 140))
      } else {
        thresholdActor.hidden = true
      }
    }
    thresholdTimers.push(window.setTimeout(() => clearThreshold(), 320))
  }

  const cancelEntry = () => {
    while (entryTimers.length) window.clearTimeout(entryTimers.pop())
    clearThreshold()
    delete root.dataset.entering
    camera.finishSettle()
  }

  const drawStatic = () => {
    if (!groundCtx || !propsCtx) return
    groundCtx.clearRect(0, 0, 1000, 650)
    propsCtx.clearRect(0, 0, 1000, 650)
    if (tap) drawPixelRing(groundCtx, tap.point.x, tap.point.y, 9, 5, '#ffe6a3', 0.85)
    if (trail) drawPixelRing(groundCtx, trail.point.x, trail.point.y, 13, 7, '#ffd25c', 0.9)
    drawHalo(propsCtx, CAMPFIRE.x, CAMPFIRE.y, 18, 'rgba(255,172,72,0.16)')
    drawFlame(propsCtx, CAMPFIRE.x, CAMPFIRE.y, 0.72, 0, { height: 11, half: 4 })
    for (const lantern of LANTERNS) drawHalo(propsCtx, lantern.x, lantern.y, lantern.r, 'rgba(255,212,124,0.2)')
    const nearby = nearbySection(WORLD, controller.state.position)
    for (const section of SECTIONS) {
      const active = (trail?.section === section ? 0.9 : 0) || (arrival?.section === section ? 1 : 0) || (nearby === section ? 0.65 : 0)
      drawDestinationResponse(propsCtx, section, active, 0, true)
    }
  }

  const paintDynamic = (elapsedMs: number) => {
    if (!groundCtx || !propsCtx) return
    const limits = FX_LIMITS[level]
    groundCtx.clearRect(0, 0, 1000, 650)
    propsCtx.clearRect(0, 0, 1000, 650)

    if (limits.glints > 0) drawWater(groundCtx, clock, limits.glints)

    if (tap) {
      tap.age += elapsedMs
      if (tap.age >= tap.duration) tap = null
      else {
        const p = tap.age / tap.duration
        drawPixelRing(groundCtx, tap.point.x, tap.point.y, 5 + p * 10, 3 + p * 5, '#ffe6a3', (1 - p) * 0.9)
      }
    }

    if (trail) {
      trail.age += elapsedMs
      const pos = controller.state.position
      const pulse = 0.75 + 0.25 * Math.sin(clock / 200)
      drawPixelRing(groundCtx, trail.point.x, trail.point.y, 12 + pulse * 3, 6 + pulse * 1.5, '#ffd25c', 0.85)
      drawHalo(groundCtx, trail.point.x, trail.point.y, 10, 'rgba(255,210,92,0.22)')
      const trailFade = Math.max(0, 1 - trail.age / 1600)
      if (trailFade > 0.04) {
        groundCtx.fillStyle = `rgba(255,232,166,${(0.72 * trailFade).toFixed(3)})`
        for (const pt of trail.breadcrumbs) {
          if (Math.hypot(pt.x - pos.x, pt.y - pos.y) < 18) continue
          groundCtx.fillRect(Math.round(pt.x) - 1, Math.round(pt.y) - 1, 3, 2)
        }
      }
    }

    if (arrival) {
      arrival.age += elapsedMs
      if (arrival.age >= arrival.duration) arrival = null
      else {
        const p = arrival.age / arrival.duration
        const pt = WORLD.arrivals[arrival.section].point
        drawPixelRing(groundCtx, pt.x, pt.y, 10 + p * 14, 5 + p * 7, '#fff1b3', (1 - p) * 0.9)
      }
    }

    const fireBoost = trail?.section === 'about' || arrival?.section === 'about' ? 0.96 : 0.78
    fire.step(elapsedMs, CAMPFIRE.x, CAMPFIRE.y - 3, fireBoost, level !== 'minimal')
    const fireFlicker = 0.14 + 0.04 * Math.sin(clock / 190)
    drawHalo(propsCtx, CAMPFIRE.x, CAMPFIRE.y, 22, `rgba(255,166,64,${fireFlicker.toFixed(3)})`)
    drawFlame(propsCtx, CAMPFIRE.x, CAMPFIRE.y, fireBoost, Math.floor(clock / 120) % 4, { height: 12, half: 4.4 })
    fire.draw(propsCtx)

    for (const lantern of LANTERNS) {
      const wave = 0.18 + 0.06 * Math.sin(clock / 520 + lantern.phase)
      drawHalo(propsCtx, lantern.x, lantern.y, lantern.r, `rgba(255,212,122,${wave.toFixed(3)})`)
    }

    dust.step(elapsedMs, 3.5)
    dust.forEach((p, progress) => {
      propsCtx.fillStyle = progress < 0.5 ? `rgba(236,202,148,${(0.68 * (1 - progress)).toFixed(3)})` : `rgba(210,170,114,${(0.55 * (1 - progress)).toFixed(3)})`
      propsCtx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
    })

    if (level === 'full') {
      moteTimer += elapsedMs
      if (moteTimer > 3600) {
        moteTimer = 0
        mote.spawn({ x: 260 + Math.random() * 440, y: 230 + Math.random() * 210, vx: 4 + Math.random() * 4, vy: -2 - Math.random() * 2, life: 3200, size: 2 })
      }
      mote.step(elapsedMs)
      mote.forEach((p, progress) => {
        const a = Math.sin(progress * Math.PI) * 0.65
        propsCtx.fillStyle = `rgba(255,244,196,${a.toFixed(3)})`
        propsCtx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
      })
    }

    const nearby = nearbySection(WORLD, controller.state.position)
    for (const section of SECTIONS) {
      const fromArrive = arrival?.section === section ? 1 - arrival.age / arrival.duration : 0
      const fromTrail = trail?.section === section ? 0.85 : 0
      const fromNear = nearby === section ? 0.65 : 0
      const intensity = Math.max(fromArrive, fromTrail, fromNear)
      drawDestinationResponse(propsCtx, section, intensity, clock, false)
    }
  }

  const tick = (_time: number, elapsedMs: number) => {
    if (reading() || menuOpen()) return
    monitor.sample(elapsedMs)
    if (level === 'minimal') return
    clock += elapsedMs
    carry += elapsedMs
    const interval = 1000 / Math.max(12, FX_LIMITS[level].ambientFps)
    const active = !!(tap || trail || arrival || dust.count || controller.pose.moving)
    if (!active && carry < interval) return
    const dt = carry; carry = 0
    paintDynamic(dt)
  }

  const offLoop = loop.add(tick)

  const offs = [
    bus.on('enter', ({ reduced: isReduced }) => {
      cancelEntry()
      if (isReduced) { drawStatic(); return }
      root.dataset.entering = 'true'
      camera.settle(560)
      controller.face('right')
      entryTimers.push(
        window.setTimeout(() => controller.face('down'), 210),
        window.setTimeout(() => { delete root.dataset.entering }, 540),
      )
    }),
    bus.on('move-start', () => cancelEntry()),
    bus.on('ground-tap', ({ point }) => {
      cancelEntry()
      trail = null
      tap = { point, age: 0, duration: reduced() ? 240 : 420 }
      if (level === 'minimal') {
        drawStatic()
        window.setTimeout(() => { if (tap?.point === point) { tap = null; drawStatic() } }, 240)
      }
    }),
    bus.on('destination-selected', ({ section, point, path }) => {
      cancelEntry()
      tap = null
      trail = { section, point, breadcrumbs: reduced() ? [] : sampleBreadcrumbs(path), age: 0 }
      if (level === 'minimal') drawStatic()
    }),
    bus.on('route-cancel', () => {
      trail = null; tap = null
      clearThreshold()
      if (level === 'minimal') drawStatic()
    }),
    bus.on('arrive', ({ section }) => {
      trail = null; tap = null
      if (section) {
        arrival = { section, age: 0, duration: reduced() ? 320 : 680 }
        startThreshold(section)
      }
      if (level === 'minimal') {
        drawStatic()
        if (section) window.setTimeout(() => { arrival = null; drawStatic() }, 320)
      }
    }),
    bus.on('step', ({ foot, surface, point }) => {
      if (level === 'minimal' || !raisesDust(surface)) return
      const side = foot === 'left' ? -3 : 3
      for (let i = 0; i < 2; i++) {
        dust.spawn({
          x: point.x + side + (Math.random() - 0.5) * 4,
          y: point.y - 1 + (Math.random() - 0.5) * 2,
          vx: (Math.random() - 0.5) * 14,
          vy: -(6 + Math.random() * 8),
          life: 320,
          size: i === 0 ? 2 : 1,
        })
      }
    }),
    bus.on('surface-open', () => { cancelEntry(); dust.clear() }),
  ]

  const motionObserver = new MutationObserver(() => {
    applyBudget(computeLevel())
    if (level === 'minimal') drawStatic()
  })
  motionObserver.observe(root, { attributes: true, attributeFilter: ['data-motion'] })

  if (level === 'minimal') drawStatic()
  else paintDynamic(16)

  return {
    get level() { return level },
    refresh() { if (level === 'minimal') drawStatic(); else paintDynamic(16) },
    dispose() {
      cancelEntry()
      offLoop()
      offs.forEach(fn => fn())
      motionObserver.disconnect()
    },
  }
}
