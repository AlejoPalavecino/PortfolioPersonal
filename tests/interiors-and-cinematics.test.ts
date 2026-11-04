import { afterEach, describe, expect, it, vi } from 'vitest'
import { INTRO_DURATION_MS, roomForView, sampleIntroTimeline } from '../src/core/experience'
import { assetUrl, createRoomLoader, ROOM_META, roomVariantAsset } from '../src/shared'
import { copyEmailAddress } from '../src/app/actions'
import { shell } from '../src/app/shell'
import { caseMarkup, credentialMarkup, recognitionsMarkup, sectionMarkup } from '../src/widgets'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('guion de presentación inicial de 6,8 s (intro-timeline)', () => {
  it('recorre los 5 beats narrativos sin porcentajes falsos', () => {
    expect(INTRO_DURATION_MS).toBe(6800)

    const beat0 = sampleIntroTimeline(300)
    expect(beat0.beatIndex).toBe(0)
    expect(beat0.action).toBe('landscape-reveal')
    expect(beat0.actorVisible).toBe(false)
    expect(beat0.completed).toBe(false)

    const beat1 = sampleIntroTimeline(2000)
    expect(beat1.beatIndex).toBe(1)
    expect(beat1.action).toBe('walk-right')
    expect(beat1.actorVisible).toBe(true)
    expect(beat1.actorFrame).toMatch(/^walk-right-/)

    const beat2 = sampleIntroTimeline(3500)
    expect(beat2.beatIndex).toBe(2)
    expect(beat2.title).toBe('Soy Alejo Palavecino.')
    expect(beat2.actorFrame).toBe('idle-down')

    const beat3 = sampleIntroTimeline(5400)
    expect(beat3.beatIndex).toBe(3)
    expect(beat3.subtitle).toContain('Desarrollo software. Transformo ideas en productos.')
    expect(beat3.specialty).toContain('Full stack · Análisis · Automatización e IA')

    const beat4 = sampleIntroTimeline(6800)
    expect(beat4.beatIndex).toBe(4)
    expect(beat4.action).toBe('crossfade-to-existing-world')
    expect(beat4.completed).toBe(true)
  })

  it('mapea cada vista a su sala interior o campamento', () => {
    expect(roomForView({ kind: 'camp' })).toBeNull()
    expect(roomForView({ kind: 'section', section: 'projects' })).toBe('projects')
    expect(roomForView({ kind: 'case', id: 'flower' })).toBe('projects')
    expect(roomForView({ kind: 'section', section: 'about' })).toBe('about')
    expect(roomForView({ kind: 'section', section: 'journey' })).toBe('journey')
    expect(roomForView({ kind: 'recognitions' })).toBe('journey')
    expect(roomForView({ kind: 'credential', id: 'fiu-ack' })).toBe('journey')
    expect(roomForView({ kind: 'section', section: 'contact' })).toBe('contact')
  })
})

describe('cargador de interiores por sección (room-loader)', () => {
  it('selecciona una sola variante según orientación (desktop vs portrait)', () => {
    expect(roomVariantAsset('projects', false)).toBe(assetUrl(ROOM_META.projects.desktopAsset))
    expect(roomVariantAsset('projects', true)).toBe(assetUrl(ROOM_META.projects.portraitAsset))
    expect(roomVariantAsset('projects', false)).not.toBe(roomVariantAsset('projects', true))
  })

  it('deduplica prefetch por sala y carga solo la variante activa', async () => {
    const requestedUrls: string[] = []
    const loader = createRoomLoader(
      (url) => {
        requestedUrls.push(url)
        return Promise.resolve()
      },
      () => false
    )

    const p1 = loader.prefetch('projects')
    const p2 = loader.prefetch('projects')
    expect(await p1).toBe('ready')
    expect(await p2).toBe('ready')
    expect(requestedUrls).toHaveLength(1)
    expect(requestedUrls[0]).toContain('projects-desktop.webp')
    expect(loader.get('projects').status).toBe('ready')
  })

  it('registra fallo de imagen de sala y permite reintentar sin bloquear', async () => {
    let shouldFail = true
    const loader = createRoomLoader(
      () => (shouldFail ? Promise.reject(new Error('network error')) : Promise.resolve()),
      () => true
    )

    expect(await loader.prefetch('contact')).toBe('failed')
    expect(loader.get('contact').status).toBe('failed')

    shouldFail = false
    expect(await loader.retry('contact')).toBe('ready')
    expect(loader.get('contact').status).toBe('ready')
  })
})

describe('carteles exteriores, controles de intro y salas interiores', () => {
  it('incluye 4 soportes diferenciados con texto HTML y controles de intro desde el primer cuadro', () => {
    const html = shell()
    expect(html).toContain('data-mount="fachada-taller"')
    expect(html).toContain('data-mount="poste-suelo"')
    expect(html).toContain('data-mount="placa-mesa"')
    expect(html).toContain('data-mount="tablilla-radio"')
    expect(html).toContain('<span class="sign-text">Proyectos</span>')
    expect(html).toContain('<span class="sign-text">Sobre mí</span>')
    expect(html).toContain('<span class="sign-text">Trayectoria</span>')
    expect(html).toContain('<span class="sign-text">Contacto</span>')
    expect(html).toContain('data-action="skip-intro"')
    expect(html).toContain('data-action="intro-pause"')
  })

  it('estructura las cuatro salas interiores con contenido verificado y sin promesas falsas', () => {
    const projectsHtml = sectionMarkup('projects')
    expect(projectsHtml).toContain('FoxMind')
    expect(projectsHtml).toContain('Flower')
    expect(projectsHtml).not.toContain('workshop-interior.webp')

    const flowerCase = caseMarkup('flower')
    expect(flowerCase).toContain('← Volver a Proyectos')
    expect(flowerCase).toContain('Evidencia visual en preparación')

    const aboutHtml = sectionMarkup('about')
    expect(aboutHtml).toContain('Software a medida')
    expect(aboutHtml).toContain('Análisis funcional')
    expect(aboutHtml).toContain('Integraciones y automatización')
    expect(aboutHtml).toContain('IA aplicada')
    expect(aboutHtml).not.toMatch(/\b\d{2,3}\s*%/)

    const journeyHtml = sectionMarkup('journey')
    expect(journeyHtml).toContain('data-action="recognitions"')
    const recsHtml = recognitionsMarkup()
    expect(recsHtml).toContain('Menciones')
    expect(credentialMarkup('ilan-foxmind')).toContain('Documento no disponible')

    const contactHtml = sectionMarkup('contact')
    expect(contactHtml).toContain('Tengo una oportunidad laboral')
    expect(contactHtml).toContain('Necesito un desarrollo a medida')
    expect(contactHtml).toContain('Abrir cliente de correo')
    expect(contactHtml).toContain('data-action="copy-email"')
  })

  it('presenta intro estilo juego, esquemas de arquitectura en proyectos y contratos en contacto', () => {
    const introHtml = shell()
    expect(introHtml).toContain('intro-campfire-fx')
    expect(introHtml).toContain('intro-actor-stage')
    expect(introHtml).toContain('intro-beat-dots')
    expect(introHtml).toContain('intro-heading')
    expect(introHtml).toContain('intro-content')
    expect(introHtml).toContain('intro-loader-hud')

    const projectsHtml = sectionMarkup('projects')
    expect(projectsHtml).toContain('workshop-hud-bar')
    expect(projectsHtml).toContain('CASO #01 · EDTECH & IA')
    expect(projectsHtml).toContain('CASO #02 · GESTIÓN & ARCA')
    expect(projectsHtml).toContain('project-schematic')
    expect(projectsHtml).toContain('project-highlights')
    expect(projectsHtml).toContain('project-stack-chips')

    const foxmindCase = caseMarkup('foxmind')
    expect(foxmindCase).toContain('case-metrics-strip')
    expect(foxmindCase).toContain('case-modules-grid')
    expect(foxmindCase).toContain('MOD-01')

    const contactHtml = sectionMarkup('contact')
    expect(contactHtml).toContain('radio-console-bar')
    expect(contactHtml).toContain('CONTRATO #01 · CANAL EQUIPO')
    expect(contactHtml).toContain('CONTRATO #02 · CANAL PROYECTO')
    expect(contactHtml).toContain('contract-specs')
    expect(contactHtml).toContain('contract-chips')
    expect(contactHtml).toContain('channel-readout')
  })
})

describe('copia de correo con estado real y alternativa manual', () => {
  function makeMockRoot() {
    const statusNode = { hidden: true, dataset: {} as Record<string, string>, textContent: '' }
    const fallbackWrap = { hidden: true }
    const fallbackInput = { focus: vi.fn(), select: vi.fn() }
    const button = { dataset: { email: 'alejopalavecino12@gmail.com' }, textContent: 'Copiar correo' } as unknown as HTMLButtonElement
    const root = {
      querySelector: (selector: string) => {
        if (selector === '.copy-status') return statusNode
        if (selector === '.copy-fallback-wrap') return fallbackWrap
        if (selector === '.copy-fallback') return fallbackInput
        return null
      }
    } as unknown as HTMLElement
    return { root, statusNode, fallbackWrap, fallbackInput, button }
  }

  it('confirma cuando el portapapeles copia el correo', async () => {
    const { root, statusNode, fallbackWrap, button } = makeMockRoot()
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    expect(await copyEmailAddress(root, button)).toBe(true)
    expect(writeText).toHaveBeenCalledWith('alejopalavecino12@gmail.com')
    expect(button.textContent).toBe('Correo copiado ✓')
    expect(statusNode.textContent).toContain('Correo copiado al portapapeles')
    expect(fallbackWrap.hidden).toBe(true)
  })

  it('muestra campo seleccionable cuando el permiso del portapapeles falla', async () => {
    const { root, statusNode, fallbackWrap, fallbackInput, button } = makeMockRoot()
    const writeText = vi.fn().mockRejectedValue(new Error('NotAllowedError'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    expect(await copyEmailAddress(root, button)).toBe(false)
    expect(statusNode.textContent).toContain('No se pudo copiar automáticamente')
    expect(fallbackWrap.hidden).toBe(false)
    expect(fallbackInput.focus).toHaveBeenCalled()
    expect(fallbackInput.select).toHaveBeenCalled()
  })
})
