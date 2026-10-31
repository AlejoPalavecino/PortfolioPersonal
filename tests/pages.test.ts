import { afterEach, describe, expect, it, vi } from 'vitest'
import { assetUrl } from '../src/shared'
import { shell } from '../src/app/shell'
import { createAudio } from '../src/app/audio'
import { createRenderer } from '../src/app/rendering'
import { sectionMarkup } from '../src/widgets'

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

describe.each(['/', '/PortfolioPersonal/'])('recursos con BASE_URL %s', (base) => {
  it('resuelve recursos concretos del avatar, fuentes y CV', () => {
    vi.stubEnv('BASE_URL', base)
    expect(assetUrl('avatar/idle-down.webp')).toBe(`${base}assets/avatar/idle-down.webp`)
    expect(assetUrl('fonts/pixel.woff2')).toBe(`${base}assets/fonts/pixel.woff2`)
    expect(assetUrl('cv-alejo-palavecino-es.pdf')).toBe(`${base}assets/cv-alejo-palavecino-es.pdf`)
  })

  it('genera imágenes y descargas utilizables en campamento y secciones', () => {
    vi.stubEnv('BASE_URL', base)
    const markup = shell() + sectionMarkup('about') + sectionMarkup('contact')
    const urls = [...markup.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map(match => match[1])
    expect(urls).toContain(`${base}assets/camp-hillside.webp`)
    expect(urls).toContain(`${base}assets/avatar/idle-down.webp`)
    expect(urls).toContain(`${base}assets/portrait.webp`)
    expect(urls).toContain(`${base}assets/cv-alejo-palavecino-es.pdf`)
    expect(urls.every(url => url?.startsWith(`${base}assets/`))).toBe(true)
  })

  it('carga metadatos del avatar y ambiente desde la misma base', async () => {
    vi.stubEnv('BASE_URL', base)
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)
    const audio = vi.fn(function () { return { loop: false, volume: 0 } })
    vi.stubGlobal('Audio', audio)
    createAudio()
    const root = { querySelector: () => ({}) } as unknown as HTMLElement
    const views = {} as Parameters<typeof createRenderer>[1]
    await createRenderer(root, views).loadFrames(() => {})
    expect(audio).toHaveBeenCalledWith(`${base}assets/camp-ambience-loop.wav`)
    expect(fetchMock).toHaveBeenCalledWith(`${base}assets/avatar/frames.json`)
  })
})

describe('normalización de la base', () => {
  it('evita barras duplicadas con base sin barra final y archivo con barra inicial', () => {
    vi.stubEnv('BASE_URL', '/PortfolioPersonal')
    expect(assetUrl('/emblem.webp')).toBe('/PortfolioPersonal/assets/emblem.webp')
  })
})

