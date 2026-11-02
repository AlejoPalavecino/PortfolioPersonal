import { credentialById, sections, type CaseId, type Section } from '../entities'
import { roomForView } from '../core/experience'
import type { CueBus } from '../core/fx/cues'
import { assetUrl, createRoomLoader, ROOM_META, type RoomLoader } from '../shared'
import { caseMarkup, sectionMarkup, recognitionsMarkup, credentialMarkup } from '../widgets'
import type { createController } from './controller'

export type View = { kind: 'camp' } | { kind: 'section'; section: Section } | { kind: 'case'; id: CaseId } | { kind: 'recognitions' } | { kind: 'credential'; id: string }
export type ViewOptions = { onView?: (view: View) => void; onCamp?: () => void; bus?: CueBus; roomLoader?: RoomLoader }
type Reading = { scroll: number; focus: number; selector: string | null }
type Context = {
  root: HTMLElement; panel: HTMLElement; current: View; reading: Map<string, Reading>
  origin: HTMLElement | null; restoring: boolean; options: ViewOptions; transition: number
  closeTimer?: number; entryTimer?: number; curtainTimer?: number; poseTimer?: number
  actorTimers: number[]
  roomLoader: RoomLoader; pendingSpatialSection: Section | null; mountedRoom: Section | null
  offLoader?: () => void
}

type ActorReaction = Readonly<{ status: string; quote: string; pose?: string }>

const ROOM_ACTOR_DEFAULTS: Readonly<Record<Section, ActorReaction>> = {
  projects: {
    status: '🛠️ EN EL TALLER',
    quote: '¡Bienvenido al taller! Elegí un plano para ver la arquitectura y cómo construí cada sistema.',
  },
  about: {
    status: '⛺ EN LA CARPA',
    quote: 'Acá podés conocer mi perfil, cómo encaro los problemas y en qué puedo ayudarte.',
  },
  journey: {
    status: '📖 EN EL ARCHIVO',
    quote: 'En esta bitácora registro mi formación en la UTN, hitos de proyectos y evidencias.',
  },
  contact: {
    status: '📻 EN LA RADIO',
    quote: 'Equipos listos para transmitir. Elegí un contrato o copiá mi correo directo.',
  },
}

const SUBVIEW_ACTOR_QUOTES: Readonly<Record<string, ActorReaction>> = {
  foxmind: {
    status: '🦊 CASO · FOXMIND',
    quote: 'En FoxMind lideré todo el desarrollo técnico de la plataforma educativa y su motor de IA.',
  },
  flower: {
    status: '📦 CASO · FLOWER',
    quote: 'Flower está en producción real: gestiona stock y emite facturas automáticas con ARCA.',
  },
  recognitions: {
    status: '🏅 EVIDENCIAS',
    quote: 'Solo publico certificados verificados con su documento original y atribución clara.',
  },
  laboral: {
    status: '📡 CH-01 · EQUIPO',
    quote: 'Disponible para sumarme a equipos en roles Full Stack, Análisis Funcional o IA aplicada.',
  },
  proyecto: {
    status: '⚡ CH-02 · A MEDIDA',
    quote: 'Desarrollo sistemas a medida de punta a punta: desde el análisis hasta producción.',
  },
  copied: {
    status: '✓ CANAL COPIADO',
    quote: '¡Correo copiado al portapapeles! Escribime cuando quieras y coordinamos.',
  },
}

const urls: Record<Section, string> = {
  projects: 'proyectos', about: 'sobre-mi', journey: 'trayectoria', contact: 'contacto',
}
const key = (view: View) => JSON.stringify(view)
const controls = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('button,a')]
const path = (view: View) => view.kind === 'camp' ? location.pathname
  : view.kind === 'case' ? `#proyectos/${view.id}` : view.kind === 'recognitions' ? '#trayectoria/reconocimientos'
    : view.kind === 'credential' ? `#trayectoria/reconocimientos/${view.id}` : `#${urls[view.section]}`

function remember(context: Context) {
  if (context.current.kind === 'camp') return
  const scroll = context.panel.querySelector?.<HTMLElement>('.panel-scroll')
  if (!scroll) return
  const active = document.activeElement as HTMLElement | null
  let selector: string | null = null
  if (active && scroll.contains?.(active)) {
    if (active.dataset?.case) selector = `[data-case="${active.dataset.case}"]`
    else if (active.dataset?.credential) selector = `[data-credential="${active.dataset.credential}"]`
    else if (active.dataset?.action) selector = `[data-action="${active.dataset.action}"]`
  }
  context.reading.set(key(context.current), {
    scroll: scroll.scrollTop,
    focus: controls(scroll).indexOf(active as HTMLElement),
    selector,
  })
}

function bindMediaState(container: HTMLElement) {
  container.querySelectorAll<HTMLImageElement>('img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) return
    img.dataset.loading = 'true'
    const clear = () => { delete img.dataset.loading; delete img.dataset.failed }
    img.addEventListener('load', clear, { once: true })
    img.addEventListener('error', () => {
      delete img.dataset.loading
      img.dataset.failed = 'true'
      if (img.nextElementSibling?.classList.contains('media-error')) return
      const note = document.createElement('p')
      note.className = 'media-error'
      note.innerHTML = 'No se pudo cargar la imagen. <button type="button" class="text-button">Reintentar</button>'
      note.querySelector('button')?.addEventListener('click', () => {
        note.remove()
        img.dataset.loading = 'true'
        delete img.dataset.failed
        const base = img.src.split('?')[0]!
        img.src = `${base}?r=${Date.now()}`
      })
      img.after(note)
    })
  })
}

function clearActorTimers(context: Context) {
  if (context.poseTimer !== undefined) { window.clearTimeout(context.poseTimer); context.poseTimer = undefined }
  while (context.actorTimers.length) {
    const id = context.actorTimers.pop()
    if (id !== undefined) window.clearTimeout(id)
  }
}

function clearTimers(context: Context) {
  if (context.closeTimer !== undefined) { window.clearTimeout(context.closeTimer); context.closeTimer = undefined }
  if (context.entryTimer !== undefined) { window.clearTimeout(context.entryTimer); context.entryTimer = undefined }
  if (context.curtainTimer !== undefined) { window.clearTimeout(context.curtainTimer); context.curtainTimer = undefined }
  clearActorTimers(context)
  if (context.offLoader) { context.offLoader(); context.offLoader = undefined }
}

function roomFxMarkup(room: Section): string {
  if (room === 'projects') {
    return `<div class="room-fx room-fx-projects" aria-hidden="true">
      <span class="fx-workshop-glow"></span>
      <span class="fx-workshop-spark fx-spark-a"></span>
      <span class="fx-workshop-spark fx-spark-b"></span>
      <span class="fx-workshop-fire"></span>
      <span class="fx-workshop-terminal"><i class="fx-led-dot"></i>BUILD · 2 CASOS ACTIVOS</span>
    </div>`
  }
  if (room === 'contact') {
    return `<div class="room-fx room-fx-contact" aria-hidden="true">
      <div class="fx-radio-unit">
        <div class="fx-radio-head">
          <span class="fx-radio-led"></span>
          <span class="fx-radio-freq">TX/RX · 142.8 MHz</span>
        </div>
        <div class="fx-radio-meter"></div>
      </div>
      <div class="fx-radio-waves"><span></span><span></span></div>
    </div>`
  }
  return `<div class="room-fx room-fx-${room}" aria-hidden="true">
    <span class="fx-ambient-glow"></span>
    <span class="fx-ambient-spark"></span>
  </div>`
}

function updateActorBubble(context: Context, reaction: ActorReaction, glance = false) {
  const statusEl = context.panel.querySelector?.<HTMLElement>('.room-actor-status')
  const quoteEl = context.panel.querySelector?.<HTMLElement>('.room-actor-quote')
  const bubbleEl = context.panel.querySelector?.<HTMLElement>('.room-actor-bubble')
  const actorEl = context.panel.querySelector?.<HTMLImageElement>('.room-actor')
  if (statusEl) statusEl.textContent = reaction.status
  if (quoteEl) quoteEl.textContent = reaction.quote
  if (bubbleEl && context.root.dataset.motion !== 'reduced') {
    bubbleEl.dataset.pulse = 'true'
    const t = window.setTimeout(() => { delete bubbleEl.dataset.pulse }, 220)
    context.actorTimers.push(t)
  }
  if (glance && actorEl && context.root.dataset.motion !== 'reduced') {
    actorEl.src = assetUrl(`camp-rooms-v1/avatars/${reaction.pose ?? 'idle-right'}.png`)
    actorEl.dataset.pose = 'glance'
    const t = window.setTimeout(() => {
      if (actorEl.isConnected) {
        actorEl.src = assetUrl('camp-rooms-v1/avatars/idle-down.png')
        actorEl.dataset.pose = 'idle'
      }
    }, 520)
    context.actorTimers.push(t)
  }
}

function defaultReactionForView(view: Exclude<View, { kind: 'camp' }>): ActorReaction {
  const room = roomForView(view)!
  if (view.kind === 'case') return SUBVIEW_ACTOR_QUOTES[view.id] ?? ROOM_ACTOR_DEFAULTS[room]
  if (view.kind === 'recognitions' || view.kind === 'credential') return SUBVIEW_ACTOR_QUOTES.recognitions!
  return ROOM_ACTOR_DEFAULTS[room]
}

function bindRoomInteractions(context: Context, content: HTMLElement, view: Exclude<View, { kind: 'camp' }>) {
  const restoreDefault = () => updateActorBubble(context, defaultReactionForView(view), false)
  content.querySelectorAll<HTMLElement>('[data-project-card],[data-case]').forEach(el => {
    const id = el.dataset.projectCard || el.dataset.case
    if (!id || !SUBVIEW_ACTOR_QUOTES[id]) return
    const react = () => updateActorBubble(context, SUBVIEW_ACTOR_QUOTES[id]!, true)
    el.addEventListener('pointerenter', react)
    el.addEventListener('focusin', react)
    el.addEventListener('pointerleave', restoreDefault)
  })
  content.querySelectorAll<HTMLElement>('[data-intent-card]').forEach(el => {
    const id = el.dataset.intentCard
    if (!id || !SUBVIEW_ACTOR_QUOTES[id]) return
    const react = () => updateActorBubble(context, SUBVIEW_ACTOR_QUOTES[id]!, true)
    el.addEventListener('pointerenter', react)
    el.addEventListener('focusin', react)
    el.addEventListener('pointerleave', restoreDefault)
  })
  content.querySelectorAll<HTMLButtonElement>('[data-action="copy-email"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (SUBVIEW_ACTOR_QUOTES.copied) updateActorBubble(context, SUBVIEW_ACTOR_QUOTES.copied, true)
    })
  })
}

function hideCurtain(root: HTMLElement) {
  const curtain = root.querySelector?.<HTMLElement>('.room-curtain')
  if (!curtain) return
  curtain.hidden = true
  curtain.classList.remove('is-active', 'is-loading')
}

function showCurtain(root: HTMLElement, section: Section, isLoading: boolean) {
  const curtain = root.querySelector?.<HTMLElement>('.room-curtain')
  if (!curtain) return
  const meta = ROOM_META[section]
  const icon = curtain.querySelector<HTMLImageElement>('.room-curtain-icon')
  const text = curtain.querySelector<HTMLElement>('.room-curtain-text')
  const sub = curtain.querySelector<HTMLElement>('.room-curtain-sub')
  const forceBtn = curtain.querySelector<HTMLButtonElement>('[data-action="force-room"]')
  if (icon) icon.src = assetUrl(meta.iconAsset)
  if (text) text.textContent = isLoading ? meta.loadingLabel : meta.enteringLabel
  if (sub) sub.textContent = isLoading ? `${meta.title} · Descargando escenario` : `${meta.number} · ${meta.title}`
  if (forceBtn) forceBtn.hidden = !isLoading
  curtain.hidden = false
  curtain.classList.add('is-active')
  curtain.classList.toggle('is-loading', isLoading)
}

function syncRoomBackdrop(context: Context, room: Section) {
  const stage = context.panel.querySelector?.<HTMLElement>('.room-stage')
  const scenery = context.panel.querySelector?.<HTMLElement>('.room-scenery')
  const retryBar = context.panel.querySelector?.<HTMLElement>('.room-bg-fallback')
  if (!stage || !scenery) return
  const meta = ROOM_META[room]
  stage.style.setProperty('--room-fallback-bg', meta.fallbackBg)
  const snapshot = context.roomLoader.get(room)
  if (snapshot.status === 'ready') {
    scenery.style.backgroundImage = `url("${snapshot.url}")`
    stage.dataset.bgState = 'ready'
    context.panel.dataset.roomBg = 'ready'
    if (retryBar) retryBar.hidden = true
  } else if (snapshot.status === 'failed') {
    scenery.style.backgroundImage = 'none'
    stage.dataset.bgState = 'failed'
    context.panel.dataset.roomBg = 'failed'
    if (retryBar) retryBar.hidden = false
  } else {
    scenery.style.backgroundImage = 'none'
    stage.dataset.bgState = 'loading'
    context.panel.dataset.roomBg = 'loading'
    if (retryBar) retryBar.hidden = true
    void context.roomLoader.prefetch(room).then(status => {
      if (context.mountedRoom !== room) return
      const updated = context.roomLoader.get(room)
      if (status === 'ready') {
        scenery.style.backgroundImage = `url("${updated.url}")`
        stage.dataset.bgState = 'ready'
        context.panel.dataset.roomBg = 'ready'
        if (retryBar) retryBar.hidden = true
      } else if (status === 'failed') {
        scenery.style.backgroundImage = 'none'
        stage.dataset.bgState = 'failed'
        context.panel.dataset.roomBg = 'failed'
        if (retryBar) retryBar.hidden = false
      }
    })
  }
}

function buildRoomShell(context: Context, room: Section, animateActor: boolean): HTMLElement {
  const meta = ROOM_META[room]
  context.panel.dataset.room = room
  context.panel.dataset.theme = meta.theme
  context.panel.dataset.roomTheme = meta.theme
  context.panel.style?.setProperty('--room-fallback-bg', meta.fallbackBg)
  context.panel.style?.setProperty('--room-frame-url', `url("${assetUrl(meta.frameAsset)}")`)

  const existingScroll = context.panel.querySelector?.<HTMLElement>('.panel-scroll')
  if (context.mountedRoom === room && existingScroll) {
    const navButtons = context.panel.querySelectorAll?.<HTMLButtonElement>('.room-topbar [data-section]')
    navButtons?.forEach(btn => {
      if (btn.dataset.section === room) btn.setAttribute('aria-current', 'page')
      else btn.removeAttribute('aria-current')
    })
    return existingScroll
  }

  context.mountedRoom = room
  const topbar = document.createElement('div')
  topbar.className = 'room-topbar'
  const sectionButtons = (Object.keys(sections) as Section[]).map(id =>
    `<button type="button" class="room-nav-pill" data-section="${id}"${id === room ? ' aria-current="page"' : ''}>${sections[id]}</button>`
  ).join('')
  topbar.innerHTML = `<button type="button" class="room-exit-btn" data-action="back">← Salir al campamento</button>
    <span class="room-badge"><img src="${assetUrl(meta.iconAsset)}" alt="" width="20" height="20"> <strong>${meta.number} · ${meta.title}</strong></span>
    <nav class="room-quick-nav" aria-label="Cambiar de lugar">${sectionButtons}<a class="room-cv-link" href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>CV ↓</a></nav>`

  const stage = document.createElement('div')
  stage.className = 'room-stage'
  stage.dataset.room = room
  stage.style.setProperty('--fx-radio-signal', `url("${assetUrl('camp-rooms-v1/fx/radio-signal.png')}")`)
  stage.style.setProperty('--fx-spark', `url("${assetUrl('camp-rooms-v1/fx/spark.png')}")`)
  stage.style.setProperty('--fx-fire', `url("${assetUrl('camp-rooms-v1/fx/fire.png')}")`)
  stage.style.setProperty('--fx-smoke', `url("${assetUrl('camp-rooms-v1/fx/smoke.png')}")`)
  const initialPose = animateActor ? (room === 'about' ? 'walk-left-1' : 'walk-right-1') : 'idle-down'
  const defaultReaction = ROOM_ACTOR_DEFAULTS[room]
  stage.innerHTML = `<div class="room-scenery" aria-hidden="true"></div>
    <div class="room-shade" aria-hidden="true"></div>
    ${roomFxMarkup(room)}
    <div class="room-plaque" aria-hidden="true">
      <span class="room-plaque-num">${meta.number}</span>
      <strong class="room-plaque-title">${meta.title}</strong>
      <span class="room-plaque-sub">${meta.eyebrow}</span>
    </div>
    <div class="room-character-dock" aria-hidden="true">
      <div class="room-actor-bubble">
        <span class="room-actor-status">${defaultReaction.status}</span>
        <p class="room-actor-quote">${defaultReaction.quote}</p>
      </div>
      <div class="room-actor-pedestal${animateActor ? ' is-entering' : ''}">
        <span class="room-actor-shadow"></span>
        <img class="room-actor" data-pose="${animateActor ? 'walking' : 'idle'}" src="${assetUrl(`camp-rooms-v1/avatars/${initialPose}.png`)}" width="160" height="288" alt="Alejo en ${meta.title}">
        <span class="room-actor-tag">ALEJO · ${meta.shortLabel.toUpperCase()}</span>
      </div>
    </div>`

  const fallbackBar = document.createElement('div')
  fallbackBar.className = 'room-bg-fallback'
  fallbackBar.setAttribute('role', 'status')
  fallbackBar.hidden = true
  fallbackBar.innerHTML = `<span>Fondo ilustrado no disponible. Mostrando tema sólido del lugar.</span>
    <button type="button" class="text-button" data-action="retry-room-bg" data-room="${room}">Reintentar fondo</button>`

  const scroll = document.createElement('div')
  scroll.className = 'panel-scroll'
  scroll.tabIndex = 0

  context.panel.replaceChildren(topbar, stage, fallbackBar, scroll)
  syncRoomBackdrop(context, room)

  if (animateActor && context.root.dataset.motion !== 'reduced') {
    const actor = stage.querySelector<HTMLImageElement>('.room-actor')
    const pedestal = stage.querySelector<HTMLElement>('.room-actor-pedestal')
    const dir = room === 'about' ? 'left' : 'right'
    const steps: readonly [number, string][] = [
      [90, `walk-${dir}-2`],
      [180, `walk-${dir}-3`],
      [260, `walk-${dir}-4`],
      [340, `idle-${dir}`],
    ]
    for (const [delay, frame] of steps) {
      context.actorTimers.push(window.setTimeout(() => {
        if (actor && context.mountedRoom === room) {
          actor.src = assetUrl(`camp-rooms-v1/avatars/${frame}.png`)
        }
      }, delay))
    }
    context.poseTimer = window.setTimeout(() => {
      if (actor && context.mountedRoom === room) {
        actor.src = assetUrl('camp-rooms-v1/avatars/idle-down.png')
        actor.dataset.pose = 'idle'
        pedestal?.classList.remove('is-entering')
      }
    }, 440)
  }

  return scroll
}

function renderReading(context: Context, view: Exclude<View, { kind: 'camp' }>, animateActor = false) {
  const room = roomForView(view)!
  const meta = ROOM_META[room]
  const source = document.createElement('div')
  source.innerHTML = view.kind === 'section' ? sectionMarkup(view.section) : view.kind === 'case' ? caseMarkup(view.id)
    : view.kind === 'recognitions' ? recognitionsMarkup() : credentialMarkup(view.id)
  const heading = source.querySelector('h2')!
  const title = heading.textContent ?? ''
  const navigation = source.querySelector('.panel-nav')!
  const sourceEyebrow = source.querySelector('.eyebrow')
  const eyebrowText = sourceEyebrow?.textContent || meta.eyebrow
  sourceEyebrow?.remove()
  const header = document.createElement('header')
  const sceneStatus = context.root.querySelector<HTMLElement>('.scene-status')
  header.className = 'panel-header'
  header.dataset.subview = String(view.kind !== 'section')
  header.innerHTML = `<div class="panel-header-top"><span class="eyebrow"><img class="panel-header-icon" src="${assetUrl(meta.iconAsset)}" alt="" width="18" height="18"> ${eyebrowText}</span></div>`
  header.append(navigation)
  heading.id = 'reading-title'; heading.tabIndex = -1
  header.append(heading)
  if (sceneStatus) header.append(sceneStatus)

  const scroll = buildRoomShell(context, room, animateActor)
  scroll.setAttribute('aria-label', `Contenido de ${title}`)
  const content = document.createElement('div')
  content.className = 'panel-content'
  content.append(...source.childNodes)
  bindMediaState(content)
  bindRoomInteractions(context, content, view)
  updateActorBubble(context, defaultReactionForView(view), false)
  scroll.replaceChildren(header, content)

  const previous = context.reading.get(key(view))
  scroll.scrollTop = previous?.scroll ?? 0
  const bySelector = previous?.selector ? scroll.querySelector<HTMLElement>(previous.selector) : null
  const byIndex = previous && previous.focus >= 0 ? controls(scroll)[previous.focus] : null
  const focus = bySelector ?? byIndex ?? heading
  focus.focus({ preventScroll: true })
}

function commitInterior(context: Context, next: Exclude<View, { kind: 'camp' }>, wasCamp: boolean, sameRoom: boolean, animateActor: boolean) {
  const room = roomForView(next)!
  const kind = next.kind === 'section' ? next.section : next.kind
  context.panel.hidden = false
  context.panel.inert = false
  context.panel.dataset.transition = wasCamp ? 'open' : sameRoom ? 'subview' : 'change'
  context.panel.dataset.variant = kind
  context.root.querySelector<HTMLElement>('.world')?. toggleAttribute('inert', true)
  context.root.dataset.reading = 'true'
  context.root.dataset.room = room
  context.root.dataset.sceneStage = 'interior'
  delete context.root.dataset.enteringRoom
  context.options.onView?.(next)
  if (wasCamp) context.options.bus?.emit('surface-open', { kind })
  else context.options.bus?.emit('page-change', { kind })
  renderReading(context, next, animateActor)
  const scroll = context.panel.querySelector<HTMLElement>('.panel-scroll')
  if (context.root.dataset.motion !== 'reduced') {
    scroll?.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180 })
  }
}

function show(context: Context, next: View, push = true) {
  const spatialSection = context.pendingSpatialSection
  context.pendingSpatialSection = null

  if (key(context.current) === key(next)) {
    if (push && next.kind === 'camp' && location.hash) history.pushState(next, '', location.pathname)
    return
  }
  remember(context)
  const prevRoom = roomForView(context.current)
  const nextRoom = roomForView(next)
  const wasCamp = context.current.kind === 'camp'
  const sameRoom = prevRoom !== null && prevRoom === nextRoom
  context.current = next
  const transition = ++context.transition
  clearTimers(context)
  hideCurtain(context.root)
  context.panel.getAnimations?.({ subtree: true }).forEach(animation => animation.cancel())

  const changesUrl = next.kind === 'camp' ? !!location.hash : location.hash !== path(next)
  if (push && !context.restoring && changesUrl) history.pushState(next, '', path(next))

  if (next.kind === 'camp') {
    context.mountedRoom = null
    delete context.root.dataset.room
    delete context.root.dataset.enteringRoom
    context.root.dataset.sceneStage = 'exploring'
    if (!context.panel.hidden && context.root.dataset.motion !== 'reduced') {
      context.panel.dataset.transition = 'close'; context.panel.inert = true
      context.closeTimer = window.setTimeout(() => { if (context.transition === transition) context.panel.hidden = true }, 180)
    } else {
      context.panel.hidden = true; context.panel.inert = false
    }
    const world = context.root.querySelector<HTMLElement>('.world')
    if (world) world.inert = false
    context.root.dataset.reading = 'false'
    context.options.onView?.(next)
    context.options.bus?.emit('surface-close', {})
    const sceneStatus = context.panel.querySelector?.<HTMLElement>('.scene-status')
    if (sceneStatus) context.root.querySelector('main')?.append(sceneStatus)
    context.options.onCamp?.()
    const signFallback = prevRoom ? context.root.querySelector<HTMLElement>(`.world-label[data-section="${prevRoom}"]`) : null
    const fallback = signFallback ?? context.root.querySelector<HTMLElement>('[data-action=menu],.menu-toggle,.world')
    const origin = context.origin?.isConnected && context.origin.offsetParent ? context.origin : fallback
    origin?.focus({ preventScroll: true })
    return
  }

  // Always ensure the target room's background is being prefetched.
  if (nextRoom) void context.roomLoader.prefetch(nextRoom)

  const reduced = context.root.dataset.motion === 'reduced'
  const hasCurtainDom = !!context.root.querySelector?.('.room-curtain')
  const useSpatialSequence = !context.restoring && !reduced && hasCurtainDom && wasCamp && next.kind === 'section' && spatialSection === next.section

  if (!useSpatialSequence) {
    commitInterior(context, next, wasCamp, sameRoom, !sameRoom && !reduced)
    return
  }

  // Spatial entry choreography: threshold gesture (280ms) -> curtain/asset gate -> interior reveal.
  const room = next.section
  context.root.dataset.sceneStage = 'entering'
  context.root.dataset.enteringRoom = room
  const world = context.root.querySelector<HTMLElement>('.world')
  if (world) world.inert = true

  context.entryTimer = window.setTimeout(() => {
    if (context.transition !== transition) return
    const snapshot = context.roomLoader.get(room)
    if (snapshot.status === 'loading') {
      context.root.dataset.sceneStage = 'room-loading'
      showCurtain(context.root, room, true)
      context.offLoader = context.roomLoader.subscribe((loadedSection, state) => {
        if (loadedSection !== room || context.transition !== transition) return
        if (state.status === 'ready' || state.status === 'failed') {
          context.offLoader?.(); context.offLoader = undefined
          commitInterior(context, next, wasCamp, false, true)
          context.curtainTimer = window.setTimeout(() => {
            if (context.transition === transition) hideCurtain(context.root)
          }, 160)
        }
      })
      return
    }
    showCurtain(context.root, room, false)
    commitInterior(context, next, wasCamp, false, true)
    context.curtainTimer = window.setTimeout(() => {
      if (context.transition === transition) hideCurtain(context.root)
    }, 220)
  }, 280)
}

export function createViews(root: HTMLElement, options: ViewOptions = {}) {
  const panel = root.querySelector<HTMLElement>('.panel')!
  panel.setAttribute('role', 'region')
  panel.setAttribute('aria-labelledby', 'reading-title')
  const roomLoader = options.roomLoader ?? createRoomLoader()
  const context: Context = {
    root, panel, current: { kind: 'camp' }, reading: new Map(),
    origin: null, restoring: false, options, transition: 0,
    actorTimers: [],
    roomLoader, pendingSpatialSection: null, mountedRoom: null,
  }

  options.bus?.on('destination-selected', ({ section }) => {
    void roomLoader.prefetch(section)
  })
  options.bus?.on('arrive', ({ section }) => {
    if (section) {
      void roomLoader.prefetch(section)
      context.pendingSpatialSection = section
    }
  })
  options.bus?.on('route-cancel', () => {
    context.pendingSpatialSection = null
    if (context.root.dataset.sceneStage === 'entering' || context.root.dataset.sceneStage === 'room-loading') {
      ++context.transition
      clearTimers(context)
      hideCurtain(context.root)
      delete context.root.dataset.enteringRoom
      context.root.dataset.sceneStage = 'exploring'
    }
  })

  const restore = (view: View, controller: ReturnType<typeof createController>) => {
    context.restoring = true
    context.pendingSpatialSection = null
    controller.dispatch({ type: 'restore', view: view.kind === 'case' ? { kind: 'project', project: view.id } : view })
    show(context, view, false)
    context.restoring = false
  }
  const restoreUrl = (controller: ReturnType<typeof createController>) => {
    const hash = location.hash.slice(1).split('/')
    const section = Object.entries(urls).find(([, value]) => hash[0] === value)?.[0] as Section | undefined
    const id = hash[1]
    const view: View = section === 'journey' && id === 'reconocimientos'
      ? hash[2] && credentialById(hash[2]) ? { kind: 'credential', id: hash[2] } : { kind: 'recognitions' }
      : section === 'projects' && (id === 'foxmind' || id === 'flower')
      ? { kind: 'case', id } : section ? { kind: 'section', section } : { kind: 'camp' }
    restore(view, controller)
    history.replaceState(view, '', path(view))
  }
  const forceOpenPendingRoom = () => {
    if (context.current.kind === 'camp') return
    clearTimers(context)
    hideCurtain(context.root)
    commitInterior(context, context.current, true, false, false)
  }
  const retryRoomBackground = (room: Section) => {
    const stage = context.panel.querySelector?.<HTMLElement>('.room-stage')
    const retryBar = context.panel.querySelector?.<HTMLElement>('.room-bg-fallback')
    if (stage) stage.dataset.bgState = 'loading'
    if (retryBar) retryBar.hidden = true
    void roomLoader.retry(room).then(() => {
      if (context.mountedRoom === room) syncRoomBackdrop(context, room)
    })
  }
  return {
    show: (next: View, push = true) => show(context, next, push), restore, restoreUrl,
    forceOpenPendingRoom, retryRoomBackground, roomLoader,
    get current() { return context.current },
    saveFocus() { context.origin = document.activeElement as HTMLElement },
  }
}
