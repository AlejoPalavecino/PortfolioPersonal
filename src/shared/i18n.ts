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
  const site = 'https://alejopalavecino.com.ar/'
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

/** Keeps the current game session, hash and history state intact. */
export function selectLanguage(next: Language): boolean {
  if (language() === next || typeof location === 'undefined') return false
  const nextUrl = new URL(location.href)
  if (next === 'es') nextUrl.searchParams.delete('lang')
  else nextUrl.searchParams.set('lang', next)
  history.replaceState(history.state, '', nextUrl.pathname + nextUrl.search + nextUrl.hash)
  applyPageMetadata()
  return true
}

/** A small two-position game control: a choice, never a page navigation. */
export function languagePicker(extraClass = ''): string {
  const current = language()
  return `<div class="language-picker ${extraClass}" role="group" aria-label="Idioma / Language">
    <svg class="language-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/>
    </svg>
    <button type="button" class="language-choice" data-language="es" lang="es" title="Español" aria-label="Cambiar a español" aria-pressed="${current === 'es'}"><strong>ES</strong><small>Español</small></button>
    <button type="button" class="language-choice" data-language="en" lang="en" title="English" aria-label="Switch to English" aria-pressed="${current === 'en'}"><strong>EN</strong><small>English</small></button>
  </div>`
}
