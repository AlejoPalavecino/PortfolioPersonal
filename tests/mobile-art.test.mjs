// @vitest-environment happy-dom
/* global document */
import { readFileSync, statSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules() })

describe('camp artwork delivery', () => {
  it.each([[true, 'compact/'], [false, '']])('uses the same scenery on screen and in preparation (compact: %s)', async (compact, directory) => {
    vi.stubGlobal('matchMedia', () => ({ matches: compact }))
    const { shell } = await import('../src/app/shell')
    const { createCampLoader } = await import('../src/app/load-scene')
    const root = document.createElement('div')
    root.innerHTML = shell()
    const ground = root.querySelector('.ground')
    const landscape = root.querySelector('.landscape')
    expect(ground.hasAttribute('src')).toBe(false)
    expect(landscape.style.getPropertyValue('--camp-backdrop')).toBe('')
    ground.decode = async () => {}
    vi.stubGlobal('Image', class { decode() { return Promise.resolve() } })
    const frames = JSON.parse(readFileSync('public/assets/avatar/frames.json', 'utf8'))
    vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => frames }))
    const loader = createCampLoader(root, () => {})
    loader.start()
    await vi.waitFor(() => expect(loader.state.status).toBe('ready'))
    expect(ground.getAttribute('src')).toBe('/assets/' + directory + 'camp-hillside.webp')
    expect(landscape.style.getPropertyValue('--camp-backdrop')).toContain('/assets/' + directory + 'world-backdrop.webp')
    loader.dispose()
  })

  it('requests the four buildings when entering the camp', async () => {
    const { worldMarkup, showWorldArt } = await import('../src/app/world-markup')
    const root = document.createElement('div')
    root.innerHTML = worldMarkup()
    const buildings = [...root.querySelectorAll('.poi')]
    expect(buildings).toHaveLength(4)
    expect(buildings.every(image => !image.hasAttribute('src'))).toBe(true)
    showWorldArt(root)
    for (const building of buildings) {
      expect(building.getAttribute('src')).toBe('/assets/poi-' + building.dataset.poi + '.webp')
    }
    expect(root.querySelector('[data-world-src]')).toBeNull()
  })

  it('keeps the phone welcome, terrain and essential avatar within the mobile transfer budget', () => {
    const bytes = path => statSync('public/assets/' + path).size
    const welcome = bytes('compact/arrival-center.webp') + bytes('compact/adventure-button.webp')
    const world = bytes('compact/camp-hillside.webp') + bytes('compact/world-backdrop.webp') + bytes('avatar/idle-down.webp')
    expect(welcome).toBeLessThan(110 * 1024)
    expect(bytes('compact/arrival-wide.webp')).toBeLessThan(110 * 1024)
    expect(world).toBeLessThan(330 * 1024)
    for (const room of ['projects', 'about', 'journey', 'contact']) {
      expect(bytes('compact/' + room + '-portrait.webp')).toBeLessThan(250 * 1024)
    }
  })
})
