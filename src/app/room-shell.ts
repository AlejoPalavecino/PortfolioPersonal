import { sections, type Section } from '../entities'
import { t, language, languagePicker } from '../shared/i18n'
import { assetUrl, ROOM_META } from '../shared'
import { campIcon } from '../shared/camp-icons'
import type { RoomContext } from './room-types'
import { ROOM_ACTOR_DEFAULTS } from './room-actor'

export function syncRoomBackdrop(context: RoomContext, room: Section) {
  const stage = context.panel.querySelector<HTMLElement>('.room-stage')
  const scenery = context.panel.querySelector<HTMLElement>('.room-scenery')
  const retry = context.panel.querySelector<HTMLElement>('.room-bg-fallback')
  if (!stage || !scenery) return
  const transition = context.transition
  const paint = () => {
    if (context.mountedRoom !== room || context.transition !== transition || !stage.isConnected) return
    const state = context.roomLoader.get(room)
    stage.dataset.bgState = state.status
    context.panel.dataset.roomBg = state.status
    scenery.style.backgroundImage = state.status === 'ready' ? `url("${state.url}")` : 'none'
    if (retry) retry.hidden = state.status !== 'failed'
  }
  paint()
  const { status } = context.roomLoader.get(room)
  if (status === 'idle' || status === 'loading') void context.roomLoader.prefetch(room).then(paint)
}

function navigation(context: RoomContext, room: Section): string {
  const places = (Object.keys(sections) as Section[]).map(id =>
    `<button data-section="${id}"${id === room ? ' aria-current="page"' : ''}>${campIcon(id)}${sections[id]}</button>`
  ).join('')
  const sound = context.root.dataset.sound === 'true'
  const motion = context.root.dataset.userMotion === 'true'
  return `<button class="room-exit-btn" data-action="back">← <span>${t('Campamento','Camp')}</span></button>
    <span class="room-location">${campIcon(room)}${sections[room]}</span>
    ${languagePicker('room-language')}
    <details class="room-navigation"><summary>${t('Explorar','Explore')} <span aria-hidden="true">⌄</span></summary>
      <nav class="room-quick-nav" aria-label="${t('Cambiar de lugar','Choose a place')}">${places}
        <a href="${assetUrl(language() === 'en' ? 'cv-alejo-palavecino-en.pdf' : 'cv-alejo-palavecino-es.pdf')}" download>${t('Descargar CV','Download resume')} ↓</a>
        <button data-action="sound" aria-pressed="${sound}">${sound ? t('Apagar sonido','Turn sound off') : t('Activar sonido','Turn sound on')}</button>
        <button data-action="motion" aria-pressed="${motion}">${motion ? t('Activar movimiento','Enable motion') : t('Reducir movimiento','Reduce motion')}</button>
      </nav>
    </details>`
}

/** Refresh only the room toolbar: keeps scenery, reading and world camera mounted. */
export function refreshRoomNavigation(context: RoomContext, room: Section): void {
  const header = context.panel.querySelector<HTMLElement>('.room-topbar')
  if (!header) return
  const expanded = !!header.querySelector('details.room-navigation[open]')
  header.innerHTML = navigation(context, room)
  if (expanded) header.querySelector('details.room-navigation')?.setAttribute('open', '')
  context.panel.querySelector<HTMLElement>('.room-guide')?.setAttribute('aria-label', t('Comentario de Alejo', 'Comment from Alejo'))
}

export function buildRoomShell(context: RoomContext, room: Section, animateActor: boolean): HTMLElement {
  const existing = context.panel.querySelector<HTMLElement>('.panel-scroll')
  if (context.mountedRoom === room && existing) {
    syncRoomBackdrop(context, room)
    return existing
  }
  const meta = ROOM_META[room]
  context.mountedRoom = room
  context.panel.dataset.room = room
  context.panel.dataset.theme = meta.theme
  context.panel.style.setProperty('--room-fallback-bg', meta.fallbackBg)

  const topbar = document.createElement('header')
  topbar.className = 'room-topbar'
  topbar.innerHTML = navigation(context, room)
  const stage = document.createElement('div')
  stage.className = 'room-stage'
  stage.innerHTML = '<div class="room-scenery" aria-hidden="true"></div><div class="room-shade" aria-hidden="true"></div><div class="room-ambient" aria-hidden="true"></div>'
  const guide = document.createElement('aside')
  guide.className = 'room-guide'
  guide.setAttribute('aria-label', 'Comentario de Alejo')
  const reaction = ROOM_ACTOR_DEFAULTS[room]
  guide.innerHTML = `<img class="room-actor" src="${assetUrl('avatar/idle-down.webp')}" width="131" height="255" alt="">
    <div class="room-actor-bubble"><span class="room-actor-status">${reaction.status}</span><p class="room-actor-quote">${reaction.quote}</p></div>`
  const fallback = document.createElement('div')
  fallback.className = 'room-bg-fallback'
  fallback.hidden = true
  fallback.setAttribute('role', 'status')
  fallback.innerHTML = `<span>No se pudo cargar la ilustración. El contenido sigue disponible.</span>
    <button class="text-button" data-action="retry-room-bg" data-room="${room}">Reintentar fondo</button>`
  const scroll = document.createElement('div')
  scroll.className = 'panel-scroll'
  scroll.tabIndex = 0
  context.panel.replaceChildren(stage, topbar, guide, fallback, scroll)
  syncRoomBackdrop(context, room)
  if (animateActor && context.root.dataset.motion !== 'reduced') {
    guide.querySelector('img')?.animate?.([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250 })
  }
  return scroll
}
