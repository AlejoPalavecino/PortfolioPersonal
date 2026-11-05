export type Language = 'es' | 'en'

export function language(): Language {
  if (typeof location === 'undefined') return 'es'
  return new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es'
}

export function t(es: string, en: string): string {
  return language() === 'en' ? en : es
}

export function languageHref(next: Language): string {
  const hash = typeof location === 'undefined' ? '' : location.hash.replace(/[<>"'&]/g, '')
  return '?lang=' + next + hash
}

export function applyPageMetadata(): void {
  if (typeof document === 'undefined') return
  const en = language() === 'en'
  document.documentElement.lang = en ? 'en' : 'es-AR'
  const site = 'https://alejopalavecino.github.io/PortfolioPersonal/'
  const title = en
    ? 'Alejo Palavecino | Full Stack Developer & Systems Engineering'
    : 'Alejo Palavecino | Desarrollo Full Stack e Ingeniería en Sistemas'
  const description = en
    ? 'Explore my interactive portfolio. I build custom software, AI automations and unique web experiences. Open to remote opportunities worldwide.'
    : 'Explorá mi portfolio interactivo: software a medida, automatizaciones con IA y experiencias web únicas. Abierto a oportunidades en Mendoza y remotas.'
  document.title = title
  const update = (selector: string, attribute: string, value: string) =>
    document.querySelector(selector)?.setAttribute(attribute, value)
  update('meta[name="description"]', 'content', description)
  update('meta[property="og:title"]', 'content', title)
  update('meta[property="og:description"]', 'content', description)
  update('meta[property="og:locale"]', 'content', en ? 'en_US' : 'es_AR')
  update('meta[name="twitter:title"]', 'content', title)
  update('meta[name="twitter:description"]', 'content', description)
  update('link[rel="canonical"]', 'href', en ? site + '?lang=en' : site)
}
