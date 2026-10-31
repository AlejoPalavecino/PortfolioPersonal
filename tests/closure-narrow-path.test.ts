import { describe, expect, it } from 'vitest'
import { WORLD, findPath, isWalkable } from '../src/core/domain'
import { segmentClear } from '../src/core/domain/geometry'

describe('conexión al extremo este del campamento', () => {
  const east = { x: 850, y: 390 }
  it.each([[WORLD.spawn, east], [east, WORLD.spawn]])('encuentra una ruta segura en ambos sentidos', (from, to) => {
    expect(isWalkable(WORLD, from)).toBe(true)
    expect(isWalkable(WORLD, to)).toBe(true)
    const path = findPath(WORLD, from, to)
    expect(path).not.toBeNull()
    expect(path![0]).toEqual(from)
    expect(path!.at(-1)).toEqual(to)
    for (let i = 1; i < path!.length; i++) {
      expect(isWalkable(WORLD, path![i]!)).toBe(true)
      expect(segmentClear(WORLD, path![i - 1]!, path![i]!)).toBe(true)
    }
  })
  it('sigue rechazando puntos fuera del mundo y dentro de sólidos', () => {
    expect(findPath(WORLD, WORLD.spawn, { x: 0, y: 0 })).toBeNull()
    expect(findPath(WORLD, WORLD.spawn, { x: 650, y: 300 })).toBeNull()
  })
})
