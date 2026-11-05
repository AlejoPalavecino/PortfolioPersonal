// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { createWorldCamera } from '../src/app/camera'
import { WORLD } from '../src/core/domain'

afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals() })

it('un toque en el centro del mapa útil usa el mismo desplazamiento vertical que el dibujo', () => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  const root = document.createElement('div')
  root.dataset.phase = 'explore'
  root.style.setProperty('--camera-top', '64px')
  root.style.setProperty('--camera-bottom', '184px')
  root.innerHTML = '<div class="world-scroll"><div class="world"></div></div>'
  document.body.append(root)
  const viewport = root.querySelector<HTMLElement>('.world-scroll')!
  Object.defineProperties(viewport, { clientWidth: { value: 390 }, clientHeight: { value: 844 } })
  viewport.getBoundingClientRect = () => new DOMRect(10, 20, 390, 844)
  const camera = createWorldCamera(root)
  // The usable height fits the 650 logical units. The horizontal view is centered on spawn.
  const point = camera.point(205, 20 + 64 + 596 / 2)
  expect(point.x).toBeCloseTo(WORLD.spawn.x)
  expect(point.y).toBeCloseTo(WORLD.height / 2)
  camera.dispose()
})
