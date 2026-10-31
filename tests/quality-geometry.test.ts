import { describe, expect, it } from 'vitest'
import { DESTINATIONS, WORLD, findPath, hitDestination, isOccluded, isWalkable } from '../src/core/domain'

const sections = ['projects', 'about', 'journey', 'contact'] as const

describe('contrato de selección y profundidad del campamento', () => {
  it('deja pasar al suelo el punto transparente del sprite del taller', () => {
    expect(hitDestination({ x: 500, y: 260 })).toBeNull()
  })

  it.each([
    { label: 'fachada del taller', point: { x: 650, y: 300 } },
    { label: 'mesa de trayectoria', point: { x: 345, y: 435 } },
    { label: 'plataforma de radio', point: { x: 765, y: 395 } },
  ])('impide caminar sobre $label', ({ point }) => {
    expect(isWalkable(WORLD, point)).toBe(false)
  })

  it.each(sections)('%s tiene huella, entrada y selección independientes y conectadas', section => {
    const destination = DESTINATIONS[section]
    expect(destination.footprint.length).toBeGreaterThan(0)
    expect(destination.interaction.length).toBeGreaterThan(0)
    expect(destination.depthY).toBeGreaterThan(0)
    expect(WORLD.arrivals[section]).toEqual(destination.arrival)
    expect(isWalkable(WORLD, destination.arrival.point)).toBe(true)
    expect(findPath(WORLD, WORLD.spawn, destination.arrival.point)).not.toBeNull()
  })

  it.each([{ x: 560, y: 240 }, { x: 575, y: 245 }, { x: 730, y: 242 }, { x: 345, y: 400 }, { x: 360, y: 414 }])(
    'identifica o impide el tránsito en el punto auditado %j', point => {
      expect(!isWalkable(WORLD, point) || isOccluded(point)).toBe(true)
    },
  )
})
