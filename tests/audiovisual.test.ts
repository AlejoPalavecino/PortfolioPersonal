import { describe, expect, it, vi } from 'vitest'
import { WORLD } from '../src/core/domain'
import { FX_LIMITS, createFrameMonitor, degrade, initialLevel } from '../src/core/fx/budget'
import { createCueBus } from '../src/core/fx/cues'
import { STRIDE_PER_FRAME, WALK_SPEED, approachSpeed, brakingSpeed, facing, footfalls, frameName, normalize, walkFrame } from '../src/core/fx/gait'
import { FIRE, RIVER, ambientTargets } from '../src/core/fx/mix'
import { createParticlePool } from '../src/core/fx/particles'
import { raisesDust, surfaceAt } from '../src/core/fx/surface'
import { createController } from '../src/app/controller'
import type { Loop, FrameFn } from '../src/app/loop'

function manualLoop(): { loop: Loop; step: (ms: number) => void } {
  const fns = new Set<FrameFn>()
  let now = 0
  return {
    loop: {
      add(fn: FrameFn) { fns.add(fn); return () => fns.delete(fn) },
      get size() { return fns.size },
      dispose() { fns.clear() },
    },
    step(ms: number) { now += ms; for (const fn of [...fns]) fn(now, ms) },
  }
}

describe('locomoción, cadencia por distancia y superficies', () => {
  it('normaliza diagonales y vincula los cuadros y pasos a la distancia recorrida', () => {
    const diag = normalize(1, 1)
    expect(Math.hypot(diag.x, diag.y)).toBeCloseTo(1, 5)
    expect(frameName('down', false, 999)).toBe('idle-down')
    expect(walkFrame(0)).toBe(0)
    expect(walkFrame(STRIDE_PER_FRAME)).toBe(1)
    expect(walkFrame(STRIDE_PER_FRAME * 2)).toBe(2)
    expect(footfalls(5, 5).count).toBe(0)
    const first = footfalls(0, STRIDE_PER_FRAME + 1)
    const second = footfalls(STRIDE_PER_FRAME + 1, STRIDE_PER_FRAME * 3 + 1)
    expect(first).toEqual({ count: 1, foot: 'right' })
    expect(second).toEqual({ count: 1, foot: 'left' })
  })

  it('aplica histéresis direccional y rampa breve de velocidad sin sobrepasar el tope', () => {
    expect(facing('right', 10, 9)).toBe('right')
    expect(facing('right', 6, 10)).toBe('down')
    const fast = approachSpeed(0, WALK_SPEED, 1000)
    expect(fast).toBe(WALK_SPEED)
    expect(brakingSpeed(0)).toBeLessThan(WALK_SPEED)
  })

  it('distingue tierra, pasto y puente de madera sin emitir polvo sobre madera', () => {
    expect(surfaceAt(WORLD.spawn)).toBe('dirt')
    expect(surfaceAt({ x: 840, y: 465 })).toBe('wood')
    expect(surfaceAt({ x: 460, y: 260 })).toBe('grass')
    expect(raisesDust('dirt')).toBe(true)
    expect(raisesDust('wood')).toBe(false)
    expect(raisesDust('grass')).toBe(false)
  })
})

describe('bus de eventos, pool de partículas, presupuesto y mezcla espacial', () => {
  it('reutiliza partículas, respeta el tope y degrada el presupuesto ante frames lentos', () => {
    const pool = createParticlePool(3)
    expect(pool.spawn({ life: 200 })).toBe(true)
    expect(pool.spawn({ life: 200 })).toBe(true)
    expect(pool.spawn({ life: 200 })).toBe(true)
    expect(pool.spawn({ life: 200 })).toBe(false)
    expect(pool.count).toBe(3)
    pool.setMax(1)
    expect(pool.count).toBe(1)
    pool.step(250)
    expect(pool.count).toBe(0)

    expect(initialLevel({ reducedMotion: true, coarsePointer: false, width: 1366 })).toBe('minimal')
    expect(initialLevel({ reducedMotion: false, coarsePointer: true, width: 390 })).toBe('lite')
    expect(initialLevel({ reducedMotion: false, coarsePointer: false, width: 1366, cores: 8 })).toBe('full')
    expect(degrade('full')).toBe('lite')
    expect(degrade('lite')).toBe('minimal')
    expect(FX_LIMITS.minimal.dust).toBe(0)

    const onDegrade = vi.fn()
    const monitor = createFrameMonitor(onDegrade, 24, 4)
    for (let i = 0; i < 4; i++) monitor.sample(32)
    expect(onDegrade).toHaveBeenCalledTimes(1)
  })

  it('ajusta ganancias ambientales por cercanía y atenúa durante la lectura', () => {
    const nearFire = ambientTargets(FIRE, false)
    const nearRiver = ambientTargets(RIVER, false)
    const reading = ambientTargets(FIRE, true)
    expect(nearFire.fire).toBeGreaterThan(nearRiver.fire)
    expect(nearRiver.water).toBeGreaterThan(nearFire.water)
    expect(reading.fire).toBeLessThan(nearFire.fire)
    expect(reading.wind).toBeLessThan(nearFire.wind)
  })

  it('emite pasos solo al desplazarse y cancela rutas reemplazadas sin disparar llegadas huérfanas', () => {
    const { loop, step } = manualLoop()
    const bus = createCueBus()
    const steps: string[] = [], cancels: string[] = [], arrivals: (string | null)[] = []
    bus.on('step', ({ surface }) => steps.push(surface))
    bus.on('route-cancel', ({ reason }) => cancels.push(reason))
    bus.on('arrive', ({ section }) => arrivals.push(section))

    const controller = createController(() => {}, loop, bus)
    controller.dispatch({ type: 'set-scene', scene: 'ready' })
    step(200)
    expect(steps).toHaveLength(0)

    controller.select('projects')
    for (let i = 0; i < 6; i++) step(32)
    expect(steps.length).toBeGreaterThan(0)

    controller.select('contact')
    expect(cancels).toContain('replace')
    expect(arrivals).not.toContain('projects')

    for (let i = 0; i < 120; i++) step(32)
    expect(arrivals).toEqual(['contact'])
    controller.dispose()
    bus.dispose()
  })
})
