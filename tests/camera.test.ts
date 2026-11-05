import { describe, expect, it } from 'vitest'
import { createCamera, followCamera, responsiveCameraScale, screenToWorld, worldToScreen } from '../src/core/camera'

const world = { width: 1000, height: 650 }
const viewport = { width: 390, height: 844 }

describe('cámara y coordenadas', () => {
  it('convierte posiciones de ida y vuelta con paneo y distintas escalas', () => {
    for (const scale of [0.7, 1, 2]) {
      const camera = createCamera(world, viewport, { x: 600, y: 350 }, scale)
      for (const point of [{ x: 0, y: 0 }, { x: 312.5, y: 479 }, { x: 1000, y: 650 }]) {
        const result = screenToWorld(worldToScreen(point, camera), camera)
        expect(result.x).toBeCloseTo(point.x, 8)
        expect(result.y).toBeCloseTo(point.y, 8)
      }
    }
  })

  it('limita encuadre a bordes y centra el mundo cuando el viewport es mayor', () => {
    const size = { width: 400, height: 300 }
    expect(createCamera(world, size, { x: -20, y: -20 }, 1)).toEqual({ x: 0, y: 0, scale: 1 })
    expect(createCamera(world, size, { x: 1100, y: 700 }, 1)).toEqual({ x: 600, y: 350, scale: 1 })
    expect(createCamera(world, { width: 1200, height: 800 }, { x: 500, y: 325 }, 1)).toEqual({ x: -100, y: -75, scale: 1 })
  })

  it('recalcula encuadre al cambiar tamaño sin romper conversión de toque', () => {
    const focus = { x: 700, y: 400 }
    const large = createCamera(world, { width: 700, height: 400 }, focus, 1.5)
    const small = createCamera(world, { width: 320, height: 568 }, focus, 1.5)
    expect(large).not.toEqual(small)
    expect(screenToWorld(worldToScreen(focus, small), small)).toEqual(focus)
  })

  it('sigue suavemente sin sobrepasar destino y conserva encuadre al detenerse', () => {
    const size = { width: 400, height: 300 }
    const start = createCamera(world, size, { x: 250, y: 200 }, 1)
    const target = { x: 750, y: 450 }
    const next = followCamera(start, target, world, size, 16)
    const end = createCamera(world, size, target, 1)
    expect(next.x).toBeGreaterThan(start.x)
    expect(next.x).toBeLessThan(end.x)
    expect(next.y).toBeGreaterThan(start.y)
    expect(next.y).toBeLessThan(end.y)
    expect(followCamera(end, target, world, size, 16)).toEqual(end)
  })

  it('bloquea seguimiento durante lectura, movimiento reducido o tiempo nulo', () => {
    const camera = createCamera(world, { width: 400, height: 300 }, { x: 250, y: 200 }, 1)
    const target = { x: 750, y: 450 }
    expect(followCamera(camera, target, world, { width: 400, height: 300 }, 16, { locked: true })).toEqual(camera)
    expect(followCamera(camera, target, world, { width: 400, height: 300 }, 16, { reducedMotion: true })).toEqual(camera)
    expect(followCamera(camera, target, world, { width: 400, height: 300 }, 0)).toEqual(camera)
  })
})

describe('encuadre adaptable al alto del dispositivo', () => {
  it('muestra más contexto en retrato y aún más suelo en ventanas bajas', () => {
    const portrait = responsiveCameraScale(world, { width: 390, height: 844 })
    const compact = responsiveCameraScale(world, { width: 390, height: 360 })
    expect(viewport.width / portrait).toBeGreaterThanOrEqual(480)
    expect(compact).toBeLessThan(portrait)
    expect(compact).toBeGreaterThanOrEqual(0.6)
    expect(responsiveCameraScale(world, { width: 1366, height: 768 })).toBeCloseTo(1.366)
  })

  it('mantiene inversión precisa de coordenadas con todas las escalas adaptativas', () => {
    for (const view of [{ width: 320, height: 568 }, { width: 390, height: 360 }, { width: 844, height: 390 }, { width: 1440, height: 900 }]) {
      const camera = createCamera(world, view, { x: 650, y: 345 }, responsiveCameraScale(world, view))
      const point = { x: 550, y: 320 }
      const restored = screenToWorld(worldToScreen(point, camera), camera)
      expect(restored.x).toBeCloseTo(point.x, 8)
      expect(restored.y).toBeCloseTo(point.y, 8)
    }
  })
})
