import { describe, expect, it, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { cases, linkedin } from '../src/entities'
import { caseMarkup, sectionMarkup } from '../src/widgets'
import { language, t, languageHref } from '../src/shared/i18n'

afterEach(() => vi.unstubAllGlobals())

describe('versión pública para compartir', () => {
  it('incluye seis casos y conserva la confidencialidad del desarrollo de ART', () => {
    const ids = ['foxmind','flower','agrotech','irrigacion','herbario','art']
    for (const id of ids) {
      expect(Object.keys(cases)).toContain(id)
      expect(sectionMarkup('projects')).toContain('data-case="' + id + '"')
      expect(caseMarkup(id as keyof typeof cases)).toContain('MI PARTICIPACIÓN')
    }
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

  it('mantiene SEO indexable, canonical, alternates, OpenGraph y JSON-LD', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('name="robots" content="index, follow')
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('hreflang="en"')
    expect(html).toContain('application/ld+json')
    expect(html).toContain('property="og:image"')
    expect(readFileSync('public/sitemap.xml','utf8')).toContain('PortfolioPersonal/?lang=en')
  })

  it('solo expone los CV regenerados sin datos de identificación', () => {
    for (const lang of ['es','en']) {
      const pdf=readFileSync('public/assets/cv-alejo-palavecino-'+lang+'.pdf','latin1')
      expect(pdf).toMatch(/^%PDF-1\.4/)
      expect(pdf).toContain('ALEJO PALAVECINO')
      expect(pdf).not.toMatch(/\b(?:DNI|CUIL|CUIT)\b/i)
      expect(pdf).not.toMatch(/\+?54\s*9\s*\d{2,4}/)
    }
  })

  it('permite cambiar idioma sin perder el hash de la visita', () => {
    vi.stubGlobal('location', { search:'?lang=en', hash:'#proyectos/foxmind' })
    expect(language()).toBe('en')
    expect(t('Hola','Hello')).toBe('Hello')
    expect(languageHref('es')).toBe('?lang=es#proyectos/foxmind')
  })
})
