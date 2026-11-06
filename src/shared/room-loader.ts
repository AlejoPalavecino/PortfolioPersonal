import type { Section } from '../core/domain'
import { assetUrl } from './index'
import { t } from './i18n'

export type RoomTheme = 'workbench' | 'linen' | 'journal' | 'radio'
export type RoomAssetStatus = 'idle' | 'loading' | 'ready' | 'failed'

export type RoomMeta = Readonly<{
  section: Section
  number: string
  title: string
  shortLabel: string
  eyebrow: string
  enteringLabel: string
  loadingLabel: string
  theme: RoomTheme
  fallbackBg: string
  desktopAsset: string
  portraitAsset: string
  iconAsset: string
  frameAsset: string
  introFx: 'door-open' | 'canvas-open' | 'journal-open' | 'radio-signal'
}>

export const ROOM_META: Readonly<Record<Section, RoomMeta>> = {
  projects: {
    section: 'projects',
    number: '01',
    get title() { return t('Taller de soluciones', 'Solutions workshop') },
    get shortLabel() { return t('Proyectos', 'Projects') },
    get eyebrow() { return t('CAMPAMENTO / TALLER DE SOLUCIONES', 'CAMP / SOLUTIONS WORKSHOP') },
    get enteringLabel() { return t('Entrando al taller…', 'Entering the workshop…') },
    get loadingLabel() { return t('Preparando el interior…', 'Preparing the room…') },
    theme: 'workbench',
    fallbackBg: '#241b16',
    desktopAsset: 'camp-rooms-v2/projects-desktop.webp',
    portraitAsset: 'compact/projects-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-projects@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-workbench-9slice.png',
    introFx: 'door-open',
  },
  about: {
    section: 'about',
    number: '02',
    get title() { return t('Carpa personal', 'Personal tent') },
    get shortLabel() { return t('Sobre mí', 'About me') },
    get eyebrow() { return t('CAMPAMENTO / CARPA PERSONAL', 'CAMP / PERSONAL TENT') },
    get enteringLabel() { return t('Entrando a la carpa…', 'Entering the tent…') },
    get loadingLabel() { return t('Preparando el interior…', 'Preparing the room…') },
    theme: 'linen',
    fallbackBg: '#1f2a24',
    desktopAsset: 'camp-rooms-v2/about-desktop.webp',
    portraitAsset: 'compact/about-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-about@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-linen-9slice.png',
    introFx: 'canvas-open',
  },
  journey: {
    section: 'journey',
    number: '03',
    get title() { return t('Archivo de expedición', 'Adventure archive') },
    get shortLabel() { return t('Trayectoria', 'Journey') },
    get eyebrow() { return t('CAMPAMENTO / ARCHIVO DE EXPEDICIÓN', 'CAMP / ADVENTURE ARCHIVE') },
    get enteringLabel() { return t('Abriendo el archivo…', 'Opening the archive…') },
    get loadingLabel() { return t('Preparando el interior…', 'Preparing the room…') },
    theme: 'journal',
    fallbackBg: '#261e17',
    desktopAsset: 'camp-rooms-v2/journey-desktop.webp',
    portraitAsset: 'compact/journey-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-journey@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-journal-9slice.png',
    introFx: 'journal-open',
  },
  contact: {
    section: 'contact',
    number: '04',
    get title() { return t('Puesto de radio', 'Radio station') },
    get shortLabel() { return t('Contacto', 'Contact') },
    get eyebrow() { return t('CAMPAMENTO / PUESTO DE RADIO', 'CAMP / RADIO STATION') },
    get enteringLabel() { return t('Conectando puesto de radio…', 'Connecting radio station…') },
    get loadingLabel() { return t('Preparando el interior…', 'Preparing the room…') },
    theme: 'radio',
    fallbackBg: '#16262f',
    desktopAsset: 'camp-rooms-v2/contact-desktop.webp',
    portraitAsset: 'compact/contact-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-contact@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-radio-9slice.png',
    introFx: 'radio-signal',
  },
}

export function roomVariantAsset(section: Section, portrait = false): string {
  const meta = ROOM_META[section]
  return assetUrl(portrait ? meta.portraitAsset : meta.desktopAsset)
}

function defaultDecodeImage(url: string): Promise<void> {
  if (typeof Image === 'undefined') return Promise.resolve()
  const image = new Image()
  image.src = url
  return image.decode()
}

export type RoomStateSnapshot = {
  status: RoomAssetStatus
  url: string
  generation: number
}

export function createRoomLoader(
  decodeImage: (url: string) => Promise<void> = defaultDecodeImage,
  isPortrait: () => boolean = () => typeof window !== 'undefined' && typeof matchMedia === 'function' ? matchMedia('(max-width: 700px)').matches : false,
  timeoutMs = 8000,
) {
  const states = new Map<Section, RoomStateSnapshot>()
  const inflight = new Map<Section, Promise<RoomAssetStatus>>()
  const listeners = new Set<(section: Section, snapshot: RoomStateSnapshot) => void>()
  const cancellations = new Set<() => void>()
  let generation = 0
  let disposed = false

  function get(section: Section): RoomStateSnapshot {
    const url = roomVariantAsset(section, isPortrait())
    const existing = states.get(section)
    if (existing?.url.split('?')[0] === url) return existing
    const state: RoomStateSnapshot = { status: 'idle', url, generation: ++generation }
    states.set(section, state)
    return state
  }

  function decode(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cancel = () => { clear(); reject(new Error('La carga de la ilustración no terminó')) }
      const timer = setTimeout(cancel, timeoutMs)
      const clear = () => { clearTimeout(timer); cancellations.delete(cancel) }
      cancellations.add(cancel)
      Promise.resolve().then(() => decodeImage(url)).then(
        () => { clear(); resolve() },
        error => { clear(); reject(error) },
      )
    })
  }

  function publish(section: Section, state: RoomStateSnapshot) {
    states.set(section, state)
    for (const listener of [...listeners]) listener(section, state)
  }

  function load(section: Section, retry = false): Promise<RoomAssetStatus> {
    if (disposed) return Promise.resolve('idle')
    const current = get(section)
    if (!retry && current.status === 'ready') return Promise.resolve('ready')
    if (!retry && current.status === 'loading') {
      const pending = inflight.get(section)
      if (pending) return pending
    }
    const id = ++generation
    const base = roomVariantAsset(section, isPortrait())
    const url = retry ? `${base}?r=${id}` : base
    const loading: RoomStateSnapshot = { status: 'loading', url, generation: id }
    const complete = (status: RoomAssetStatus): RoomAssetStatus => {
      const latest = get(section)
      if (disposed || latest !== loading) return latest.status
      inflight.delete(section)
      publish(section, { status, url, generation: id })
      return status
    }
    const pending = decode(url).then(() => complete('ready'), () => complete('failed'))
    inflight.set(section, pending)
    publish(section, loading)
    return pending
  }

  return {
    get,
    prefetch: (section: Section) => load(section),
    retry: (section: Section) => load(section, true),
    subscribe(fn: (section: Section, snapshot: RoomStateSnapshot) => void) {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    dispose() {
      disposed = true
      for (const cancel of cancellations) cancel()
      cancellations.clear()
      listeners.clear()
      inflight.clear()
    },
  }
}

export type RoomLoader = ReturnType<typeof createRoomLoader>
