import { describe, expect, it } from 'vitest'
import { WORLD, findPath, isWalkable, moveSafely, nearbySection } from '../src/core/domain'
import type { World } from '../src/core/domain'

const sections = ['projects', 'about', 'journey', 'contact'] as const
const fixture: World = {
  width: 100, height: 100, spawn: { x: 10, y: 10 }, clearance: 2, cellSize: 2,
  boundary: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
  obstacles: [{ kind: 'polygon', points: [{ x: 45, y: 20 }, { x: 55, y: 20 }, { x: 55, y: 80 }, { x: 45, y: 80 }] }],
  arrivals: {
    projects: { point: { x: 10, y: 10 }, radius: 3, proximityRadius: 10 },
    about: { point: { x: 20, y: 10 }, radius: 3, proximityRadius: 10 },
    journey: { point: { x: 80, y: 10 }, radius: 3, proximityRadius: 10 },
    contact: { point: { x: 90, y: 90 }, radius: 3, proximityRadius: 10 },
  },
}

describe('geometría del campamento', () => {
  it('conecta el inicio y todos los destinos entre sí', () => {
    const points = [WORLD.spawn, ...sections.map(section => WORLD.arrivals[section].point)]
    for (const from of points) for (const to of points) {
      expect(isWalkable(WORLD, from)).toBe(true)
      const path = findPath(WORLD, from, to)
      expect(path).not.toBeNull()
      expect(path![0]).toEqual(from)
      expect(path!.at(-1)).toEqual(to)
      for (let i = 1; i < path!.length; i++) for (let step = 0; step <= 20; step++) {
        const a = path![i - 1]!, b = path![i]!, t = step / 20
        expect(isWalkable(WORLD, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })).toBe(true)
      }
    }
  })

  it('respeta el margen de borde y obstáculo y evita atravesarlo con un movimiento largo', () => {
    expect(isWalkable(fixture, { x: 1, y: 50 })).toBe(false)
    expect(isWalkable(fixture, { x: 44, y: 50 })).toBe(false)
    expect(isWalkable(fixture, { x: 10, y: 50 })).toBe(true)
    const end = moveSafely(fixture, { x: 10, y: 50 }, { x: 80, y: 0 })
    expect(isWalkable(fixture, end)).toBe(true)
    expect(end.x).toBeLessThan(45)
  })

  it('busca una ruta alrededor de obstáculos sin cortar sus esquinas', () => {
    const path = findPath(fixture, { x: 10, y: 50 }, { x: 90, y: 50 })
    expect(path).not.toBeNull()
    for (let i = 1; i < path!.length; i++) for (let step = 0; step <= 100; step++) {
      const a = path![i - 1]!, b = path![i]!, t = step / 100
      expect(isWalkable(fixture, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })).toBe(true)
    }
    expect(findPath(fixture, { x: 50, y: 50 }, { x: 90, y: 50 })).toBeNull()
    expect(findPath(fixture, { x: 10, y: 10 }, { x: 10, y: 10 })).toEqual([{ x: 10, y: 10 }])
  })

  it('escoge la sección próxima más cercana y resuelve empates en orden estable', () => {
    expect(nearbySection(fixture, { x: 15, y: 10 })).toBe('projects')
    expect(nearbySection(fixture, { x: 19, y: 10 })).toBe('about')
    expect(nearbySection(fixture, { x: 50, y: 50 })).toBeNull()
  })
})


describe('deslizamiento del personaje contra sólidos', () => {
  it('continúa sobre el eje libre al llegar en diagonal a una pared', () => {
    const from = { x: 40, y: 35 }
    const end = moveSafely(fixture, from, { x: 24, y: 20 })
    expect(end.x).toBeGreaterThan(from.x)
    expect(end.x).toBeLessThan(45 - fixture.clearance + 0.01)
    expect(end.y).toBeGreaterThan(48)
    expect(isWalkable(fixture, end)).toBe(true)
  })

  it('no cruza esquinas ni márgenes con movimientos diagonales prolongados', () => {
    for (const delta of [{ x: 16, y: 12 }, { x: 16, y: -12 }, { x: 35, y: 0 }]) {
      const from = { x: 40, y: 50 }
      const end = moveSafely(fixture, from, delta)
      expect(isWalkable(fixture, end)).toBe(true)
      // The wall extends beyond the attempted vertical displacement.
      expect(end.x).toBeLessThan(45 - fixture.clearance + 0.01)
    }
  })

  it('descarta entradas no finitas sin modificar la posición', () => {
    const start = { x: 10, y: 50 }
    expect(moveSafely(fixture, start, { x: Number.NaN, y: 5 })).toEqual(start)
    expect(moveSafely(fixture, start, { x: 0, y: Infinity })).toEqual(start)
  })
})
