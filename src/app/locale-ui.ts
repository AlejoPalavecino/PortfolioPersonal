import { sections, type Section } from '../entities'
import { language, selectLanguage, t, type Language } from '../shared/i18n'
import { localizeVisibleUi } from '../shared/locale-copy'
import type { createViews } from './views'
import type { bindIntroFx } from './fx/intro-fx'
import type { createSession } from './session'
import { assetUrl } from '../shared'
import { INTRO_LINES } from '../core/experience/intro-dialogue'
import { setControlLabel } from './control-label'

type Views = ReturnType<typeof createViews>
type Intro = ReturnType<typeof bindIntroFx>
type Session = ReturnType<typeof createSession>

/** Update static markup in place: never remount the app, actor, scene loader or audio. */
function syncStaticUi(root: HTMLElement): void {
  const lang = language()
  root.dataset.language = lang
  const set = (selector: string, value: string) => {
    const el = root.querySelector<HTMLElement>(selector)
    if (el) el.textContent = value
  }
  root.querySelectorAll<HTMLButtonElement>('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === lang))
  })
  root.querySelectorAll<HTMLElement>('.language-picker').forEach(group => group.setAttribute('aria-label', t('Idioma / Language', 'Language / Idioma')))
  for (const section of Object.keys(sections) as Section[]) {
    root.querySelectorAll<HTMLElement>('.world-label[data-section="' + section + '"] .sign-text').forEach(label => {
      if (label.lastChild?.nodeType === Node.TEXT_NODE) label.lastChild.textContent = sections[section]
    })
    root.querySelectorAll<HTMLElement>('.camp-destinations [data-section="' + section + '"] span:not(.destination-dot)').forEach(node => {
      node.textContent = sections[section]
    })
    root.querySelectorAll<HTMLElement>('.mobile-menu [data-section="' + section + '"] > span:first-child').forEach(node => {
      node.textContent = sections[section]
    })
    const extendedLabels: Record<Section, string> = {
      projects: t('Taller · Proyectos','Workshop · Projects'),
      about: t('Carpa · Sobre mí','Tent · About me'),
      journey: t('Archivo · Trayectoria','Journal · Journey'),
      contact: t('Radio · Contacto','Radio · Contact'),
    }
    root.querySelectorAll<HTMLElement>('.mobile-menu [data-section="' + section + '"] > span:first-child').forEach(node => {
      node.textContent = extendedLabels[section]
    })
  }
  set('.hud-left .menu-toggle span', t('Campamento','Camp'))
  root.querySelector<HTMLElement>('.hud-left .brand')?.setAttribute('aria-label', t('Volver al campamento','Back to camp'))
  set('.hud-right [data-section="contact"]', sections.contact)
  set('.hud-right [data-action="help"]', t('Cómo jugar','How to play'))
  set('.mobile-menu > strong', t('Explorar el campamento','Explore the camp'))
  set('.mobile-menu .settings [data-action="help"]', t('Cómo jugar','How to play'))
  root.querySelectorAll<HTMLAnchorElement>('a[download]').forEach(link => {
    link.href = assetUrl(lang === 'en' ? 'cv-alejo-palavecino-en.pdf' : 'cv-alejo-palavecino-es.pdf')
    if (link.closest('.room-quick-nav')) link.textContent = t('Descargar CV ↓','Download resume ↓')
  })
  set('.intro-brand-pill span', t('CAMPAMENTO CREATIVO','CREATIVE CAMP'))
  set('.boot-kicker', t('CAMPAMENTO CREATIVO','CREATIVE CAMP'))
  set('.intro-boot h2', t('Preparando tu aventura','Preparing your adventure'))
  set('.intro-arrival-note span', t('Tu próxima parada: el campamento.','Your next stop: the camp.'))
  set('.intro-arrival-note small', t('Alejo se acerca para darte la bienvenida.','Alejo is here to welcome you.'))
  set('.intro-beat-kicker', t('ALEJO · TU GUÍA','ALEJO · YOUR GUIDE'))
  set('.intro-beat-title', INTRO_LINES.greeting.title)
  set('.intro-actor-tag', 'ALEJO · DEV')
  const eyebrow = root.querySelector<HTMLElement>('.intro-eyebrow')
  if (eyebrow?.lastChild) eyebrow.lastChild.textContent = ' ' + t('INGENIERÍA EN SISTEMAS · DESARROLLO','SYSTEMS ENGINEERING · DEVELOPMENT')
  const title = root.querySelector<HTMLElement>('.intro-heading h1')
  if (title) title.innerHTML = t('Ideas que cobran <em>vida.</em>','Ideas brought <em>to life.</em>')
  set('.intro-lead', t('Soy Alejo: estudio Ingeniería en Sistemas y creo software a medida, automatizaciones con IA y experiencias web diferentes. Acá te muestro lo que construyo.','I’m Alejo, a Systems Engineering student building custom software, AI automations and unique web experiences. Come see what I create.'))
  set('.intro .direct-button', t('Ir directo a proyectos','Skip to projects'))
  const enter = root.querySelector<HTMLButtonElement>('.intro .enter-button')
  if (enter?.firstChild) enter.firstChild.textContent = t('Explorar el campamento','Explore the camp') + ' '
  set('.intro .retry-intro', t('Reintentar carga','Retry loading'))
  set('.intro-top-actions .intro-skip', t('Omitir presentación ↗','Skip intro ↗'))
  set('.boot-actions [data-action="direct"]', t('Ver proyectos sin esperar ↗','View projects now ↗'))
  const queued = root.querySelector<HTMLElement>('.boot-queue-status')
  if (queued && !queued.hidden) queued.textContent = t('Entrarás al campamento apenas termine la carga esencial.','You will enter the camp as soon as essential loading finishes.')
  set('.intro-handoff .handoff-title', t('Entrando al campamento','Entering the camp'))
  set('.intro-handoff .handoff-detail', t('Proyectos · Contacto · Trayectoria · Sobre mí','Projects · Contact · Journey · About me'))
  const sound = root.dataset.sound === 'true'
  const reduced = root.dataset.userMotion === 'true'
  root.querySelectorAll<HTMLButtonElement>('[data-action="sound"]').forEach(button =>
    setControlLabel(button, sound ? t('Apagar sonido','Mute sound') : t('Activar sonido','Enable sound')))
  root.querySelectorAll<HTMLButtonElement>('[data-action="motion"]').forEach(button =>
    setControlLabel(button, reduced ? t('Activar movimiento','Enable motion') : t('Reducir movimiento','Reduce motion')))
}

export function bindLanguagePicker(root: HTMLElement, views: Views, intro: Intro, session: Session): void {
  const apply = () => {
    syncStaticUi(root)
    views.relocalize()
    intro.refresh()
    session.refreshLanguage()
    localizeVisibleUi(root)
  }
  root.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-language]')
    if (!button || !root.contains(button)) return
    const next = button.dataset.language as Language
    if (next !== 'es' && next !== 'en') return
    if (selectLanguage(next)) {
      const inRoom = !!button.closest('.room-topbar')
      const inIntro = !!button.closest('.intro-top-actions')
      const inMenu = !!button.closest('.mobile-lang')
      apply()
      const scope = inRoom ? '.room-topbar ' : inIntro ? '.intro-top-actions ' : inMenu ? '.mobile-lang ' : '.hud-right '
      root.querySelector<HTMLButtonElement>(scope + '[data-language="' + next + '"]')?.focus({ preventScroll: true })
    }
  })
  syncStaticUi(root)
  localizeVisibleUi(root)
}
