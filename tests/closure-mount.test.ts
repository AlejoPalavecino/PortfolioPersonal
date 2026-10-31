import { afterEach, expect, it, vi } from 'vitest'

vi.mock('../src/app/shell', () => ({ shell: () => { throw new Error('shell boundary') } }))
import { mount } from '../src/app'

afterEach(() => vi.unstubAllGlobals())

it('aplica movimiento persistido antes de construir el contenido animado', () => {
  vi.stubGlobal('localStorage', { getItem: () => 'true' })
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  const root = { dataset: {}, innerHTML: '' } as unknown as HTMLElement
  expect(() => mount(root)).toThrow('shell boundary')
  expect(root.dataset).toMatchObject({ motion: 'reduced', userMotion: 'true' })
})
