// @vitest-environment happy-dom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { shell } from '../src/app/shell'
import { createViews } from '../src/app/views'
import { bindLanguagePicker } from '../src/app/locale-ui'
import { language, languagePicker, selectLanguage } from '../src/shared/i18n'
import { localizeText } from '../src/shared/locale-copy'
import { cases, sections } from '../src/entities'
import { sectionMarkup, caseMarkup } from '../src/widgets'

const marker = 'feat/instant-language'
const viewStub = () => {
  const intro = { refresh: vi.fn() }
  const session = { refreshLanguage: vi.fn() }
  return { intro, session }
}
beforeEach(() => {
  history.replaceState({ marker }, '', '/PortfolioPersonal/')
  document.body.innerHTML = '<div id="app"></div>'
})
afterEach(() => {
  history.replaceState(null, '', '/PortfolioPersonal/')
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('bilingual portfolio with no reload', () => {
  it('renders a native two-choice language control with explicit pressed state', () => {
    const html = languagePicker()
    expect(html).toContain('data-language="es"')
    expect(html).toContain('data-language="en"')
    expect(html).toContain('aria-pressed="true"')
    expect(html).not.toContain('href=')
  })

  it('switches introduction and map immediately, keeps DOM identity and hash', () => {
    document.querySelector<HTMLElement>('#app')!.innerHTML = shell()
    const root = document.querySelector<HTMLElement>('#app')!
    const world = root.querySelector('.world')
    const introScene = root.querySelector('.intro')
    const { intro, session } = viewStub()
    const views = { relocalize: vi.fn() } as unknown as ReturnType<typeof createViews>
    bindLanguagePicker(root, views, intro as never, session as never)
    history.replaceState({ marker, visited: ['about'] }, '', '/PortfolioPersonal/#sobre-mi')
    const expectedHistory = history.state
    const english = root.querySelector<HTMLButtonElement>('.intro-top-actions [data-language="en"]')!
    english.click()
    expect(language()).toBe('en')
    expect(location.hash).toBe('#sobre-mi')
    expect(history.state).toEqual(expectedHistory)
    expect(root.querySelector('.world')).toBe(world)
    expect(root.querySelector('.intro')).toBe(introScene)
    expect(intro.refresh).toHaveBeenCalledOnce()
    expect(session.refreshLanguage).toHaveBeenCalledOnce()
    expect(views.relocalize).toHaveBeenCalledOnce()
    expect(root.querySelector('.intro-lead')!.textContent).toContain('custom software')
    expect(root.querySelector('.world-label[data-section="projects"]')!.textContent).toContain('Projects')
    expect(root.querySelector('.intro-arrival-note')!.textContent).toContain('Your next stop')
    expect(english.getAttribute('aria-pressed')).toBe('true')
    expect(sections.contact).toBe('Contact')
    expect(cases.foxmind.role).toContain('Co-founder')
    const spanish = root.querySelector<HTMLButtonElement>('.intro-top-actions [data-language="es"]')!
    spanish.click()
    expect(language()).toBe('es')
    expect(location.search).toBe('')
    expect(root.querySelector('.intro-lead')!.textContent).toContain('Soy Alejo')
    expect(sections.projects).toBe('Proyectos')
    expect(cases.foxmind.role).toContain('Cofundador')
    expect(spanish.getAttribute('aria-pressed')).toBe('true')
  })

  it('updates an open notebook in place and preserves the selected page', () => {
    document.querySelector<HTMLElement>('#app')!.innerHTML = shell()
    const root = document.querySelector<HTMLElement>('#app')!
    root.dataset.motion = 'reduced'
    const views = createViews(root)
    views.show({ kind: 'section', section: 'about' })
    const scroll = root.querySelector<HTMLElement>('.panel-scroll')!
    const game = root.querySelector('.world')
    root.querySelector<HTMLButtonElement>('[data-notebook="method"]')!.click()
    expect(root.querySelector<HTMLElement>('.panel-content')!.dataset.notebook).toBe('method')
    const { intro, session } = viewStub()
    bindLanguagePicker(root, views, intro as never, session as never)
    root.querySelector<HTMLButtonElement>('.room-topbar [data-language="en"]')!.click()
    expect(language()).toBe('en')
    expect(root.querySelector('.world')).toBe(game)
    expect(root.querySelector('.panel-scroll')).toBe(scroll)
    expect(root.querySelector<HTMLElement>('.panel-content')!.dataset.notebook).toBe('method')
    expect(root.querySelector('button[data-notebook="method"]')!.textContent).toBe('How I work')
    expect(root.querySelector('.panel-content')!.textContent).toContain('Understand, define, build.')
    expect(root.querySelector<HTMLButtonElement>('.room-topbar [data-language="en"]')!.getAttribute('aria-pressed')).toBe('true')
    expect(views.current).toEqual({ kind: 'section', section: 'about' })
    expect(location.hash).toBe('#sobre-mi')
    root.querySelector<HTMLButtonElement>('.room-topbar [data-language="es"]')!.click()
    expect(root.querySelector('button[data-notebook="method"]')!.textContent).toBe('Cómo trabajo')
  })

  it('uses the selected locale on newly rendered cases, services and milestones', () => {
    expect(selectLanguage('en')).toBe(true)
    const about = sectionMarkup('about')
    const journey = sectionMarkup('journey')
    const contact = sectionMarkup('contact')
    expect(about).toContain('Systems Engineering student')
    expect(about).toContain('How I work')
    expect(journey).toContain('What comes next')
    expect(journey).toContain('remote worldwide')
    expect(contact).toContain('CHANNEL 01')
    expect(contact).toContain('Send email')
    expect(contact).toContain('LinkedIn')
    expect(selectLanguage('es')).toBe(true)
    expect(sectionMarkup('about')).toContain('Soy Alejo')
  })

  it('renders every project dossier and section in English without leftover UI labels', () => {
    expect(selectLanguage('en')).toBe(true)
    const sectionsToCheck = ['projects', 'about', 'journey', 'contact'] as const
    for (const section of sectionsToCheck) {
      const html = sectionMarkup(section)
      for (const leftover of ['QUIÉN SOY', 'CÓMO TRABAJO', 'QUÉ APORTO', 'CANAL 01', 'CANAL 02', 'Una conversación empieza acá.', 'Taller de soluciones', 'Abrir el caso']) {
        expect(html, section + ' contains untranslated: ' + leftover).not.toContain(leftover)
      }
    }
    for (const id of Object.keys(cases) as Array<keyof typeof cases>) {
      const html = caseMarkup(id)
      expect(html, id).toContain('THE PROBLEM')
      expect(html, id).toContain('MY CONTRIBUTION')
      expect(html, id).toContain('HIGHLIGHT')
      expect(html, id).toContain('Back to Projects')
      expect(html, id).not.toContain('EL PROBLEMA')
      expect(html, id).not.toContain('MI PARTICIPACIÓN')
    }
  })

  it('translates runtime and assistive labels in both directions', () => {
    expect(selectLanguage('en')).toBe(true)
    expect(localizeText('Lugar visitado')).toBe('Visited location')
    expect(localizeText('Trazando los caminos')).toBe('Mapping the paths')
    expect(localizeText('7 de 28 recursos')).toBe('7 of 28 assets')
    expect(selectLanguage('es')).toBe(true)
    expect(localizeText('Visited location')).toBe('Lugar visitado')
    expect(localizeText('7 of 28 assets')).toBe('7 de 28 recursos')
  })

})
