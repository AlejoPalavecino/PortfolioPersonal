import { describe, expect, it, vi, afterEach } from 'vitest'
import { cases, featuredCaseIds, linkedin } from '../src/entities'
import { caseMarkup, sectionMarkup } from '../src/widgets'
import { language, t, languageHref } from '../src/shared/i18n'

afterEach(() => vi.unstubAllGlobals())

describe('versión pública para compartir', () => {
  it('incluye ocho casos, destaca Chuli y el portfolio abierto entre los primeros y conserva la confidencialidad de ART', () => {
    const ids = ['foxmind','chuli','portfolio','flower','agrotech','irrigacion','herbario','art']
    for (const id of ids) {
      expect(Object.keys(cases)).toContain(id)
      expect(sectionMarkup('projects')).toContain('data-case="' + id + '"')
      expect(caseMarkup(id as keyof typeof cases)).toContain('MI PARTICIPACIÓN')
    }
    expect(featuredCaseIds.slice(0, 4)).toEqual(['foxmind', 'chuli', 'portfolio', 'flower'])
    const projects = sectionMarkup('projects')
    expect(projects.indexOf('data-case="chuli"')).toBeLessThan(projects.indexOf('data-case="portfolio"'))
    expect(projects.indexOf('data-case="portfolio"')).toBeLessThan(projects.indexOf('data-case="flower"'))
    expect(caseMarkup('chuli')).toContain('https://github.com/AlejoPalavecino/codex-engineering-harness')
    expect(caseMarkup('chuli')).toContain('target="_blank"')
    expect(caseMarkup('portfolio')).toContain('https://github.com/AlejoPalavecino/PortfolioPersonal')
    expect(caseMarkup('portfolio')).toContain('https://alejopalavecino.com.ar/')
    expect(caseMarkup('portfolio')).toContain('Ver versión online')
    expect(caseMarkup('art')).toContain('confidenciales')
    expect(caseMarkup('foxmind')).toContain('pruebas piloto')
  })

  it('usa solamente correo y LinkedIn para contacto y no presenta diplomas', () => {
    const contact = sectionMarkup('contact')
    expect(contact).toContain(linkedin)
    expect(contact).toContain('mailto:')
    expect(contact).not.toContain('wa.me')
    expect(sectionMarkup('journey')).not.toContain('data-action="recognitions"')
  })

  it('permite cambiar idioma sin perder el hash de la visita', () => {
    vi.stubGlobal('location', { search:'?lang=en', hash:'#proyectos/foxmind' })
    expect(language()).toBe('en')
    expect(t('Hola','Hello')).toBe('Hello')
    expect(languageHref('es')).toBe('?lang=es#proyectos/foxmind')
  })
})
