// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { bindActions } from '../src/app/actions'
import { bindObjectInteractions } from '../src/app/room-interactions'
import { shell } from '../src/app/shell'
import { createViews } from '../src/app/views'
import { createRoomLoader } from '../src/shared'
import { sectionMarkup } from '../src/widgets'

beforeEach(() => {
  document.body.innerHTML = ''
  history.replaceState(null, '', '/')
})
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

function surface(section: Parameters<typeof sectionMarkup>[0]) {
  const node = document.createElement('div')
  node.innerHTML = sectionMarkup(section)
  document.body.append(node)
  bindObjectInteractions(node)
  return node
}

function setupViews(loader = createRoomLoader(async () => {}, () => false)) {
  const root = document.createElement('div')
  root.dataset.motion = 'reduced'
  root.innerHTML = shell()
  document.body.append(root)
  return { root, views: createViews(root, { roomLoader: loader }) }
}

it('navega el cuaderno con teclado y cambia la página anunciada', () => {
  const content = surface('about')
  const tabs = [...content.querySelectorAll<HTMLButtonElement>('[role=tab]')]
  tabs[0]!.focus()
  tabs[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(document.activeElement).toBe(tabs[1])
  expect(tabs[1]!.getAttribute('aria-selected')).toBe('true')
  expect(content.querySelector<HTMLElement>('#page-profile')!.hidden).toBe(true)
  expect(content.querySelector<HTMLElement>('#page-method')!.hidden).toBe(false)
  tabs[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(tabs.filter(tab => tab.tabIndex === 0)).toEqual([tabs[2]])
})

it('la bitácora abre el hito correcto y pone el foco en su contenido', () => {
  const content = surface('journey')
  content.querySelector<HTMLButtonElement>('[data-milestone=flower]')!.click()
  expect(content.querySelectorAll('[data-journal-page]:not([hidden])')).toHaveLength(1)
  expect(document.activeElement?.id).toBe('entry-flower')
  expect(content.querySelector('#entry-flower [data-case]')?.getAttribute('data-case')).toBe('flower')
})

it('la radio actualiza el asunto del correo según el canal', () => {
  const content = surface('contact')
  content.querySelector<HTMLButtonElement>('[data-contact-intent=proyecto]')!.click()
  expect(content.querySelector('[data-contact-intent=laboral]')?.getAttribute('aria-pressed')).toBe('false')
  expect(content.querySelector('[data-contact-intent=proyecto]')?.getAttribute('aria-pressed')).toBe('true')
  expect(content.querySelector<HTMLAnchorElement>('.radio-send')!.href).toContain(encodeURIComponent('Proyecto de desarrollo a medida'))
})

it('volver del dossier restaura scroll y foco en el plano elegido', () => {
  const { root, views } = setupViews()
  views.show({ kind: 'section', section: 'projects' })
  root.querySelector<HTMLElement>('.panel-scroll')!.scrollTop = 154
  const plan = root.querySelector<HTMLButtonElement>('[data-case=flower]')!
  plan.focus()
  views.show({ kind: 'case', id: 'flower' })
  plan.dispatchEvent(new Event('focusout'))
  expect(location.hash).toBe('#proyectos/flower')
  expect(root.querySelector('.room-actor-status')?.textContent).toBe('ALEJO · FLOWER')
  views.show({ kind: 'section', section: 'projects' })
  expect(root.querySelector<HTMLElement>('.panel-scroll')!.scrollTop).toBe(154)
  expect((document.activeElement as HTMLElement).dataset.case).toBe('flower')
})

it('regresar al cuaderno conserva la página elegida', () => {
  const { root, views } = setupViews()
  views.show({ kind: 'section', section: 'about' })
  root.querySelector<HTMLButtonElement>('button[data-notebook=skills]')!.click()
  views.show({ kind: 'section', section: 'projects' })
  views.show({ kind: 'section', section: 'about' })
  expect(root.querySelector('button[data-notebook=skills]')?.getAttribute('aria-selected')).toBe('true')
  expect(root.querySelector<HTMLElement>('#page-skills')!.hidden).toBe(false)
})

it('un rechazo del portapapeles nunca muestra una copia exitosa en el diálogo', async () => {
  const { root, views } = setupViews()
  views.show({ kind: 'section', section: 'contact' })
  let reject!: (error: Error) => void
  const pending = new Promise<void>((_, no) => { reject = no })
  vi.stubGlobal('navigator', { clipboard: { writeText: () => pending } })
  bindActions(root, {} as Parameters<typeof bindActions>[1], views,
    {} as Parameters<typeof bindActions>[3], {} as Parameters<typeof bindActions>[4], vi.fn(), vi.fn())
  root.querySelector<HTMLButtonElement>('[data-action=copy-email]')!.click()
  expect(root.querySelector('.room-actor-status')?.textContent).not.toBe('CORREO COPIADO')
  reject(new Error('NotAllowedError'))
  await vi.waitFor(() => expect(root.querySelector('.room-actor-status')?.textContent).toBe('COPIA MANUAL'))
  expect(root.querySelector<HTMLElement>('.copy-fallback-wrap')!.hidden).toBe(false)
})

it('una variante anterior no reemplaza la que corresponde al nuevo tamaño', async () => {
  let portrait = false
  const pending: (() => void)[] = []
  const loader = createRoomLoader(() => new Promise(resolve => pending.push(resolve)), () => portrait)
  const desktop = loader.prefetch('projects')
  await vi.waitFor(() => expect(pending).toHaveLength(1))
  portrait = true
  const mobile = loader.prefetch('projects')
  await vi.waitFor(() => expect(pending).toHaveLength(2))
  pending[0]!()
  await desktop
  expect(loader.get('projects').status).toBe('loading')
  pending[1]!()
  expect(await mobile).toBe('ready')
  expect(loader.get('projects').url).toContain('portrait.webp')
})

it('una ilustración colgada libera la sala y permite reintentar', async () => {
  vi.useFakeTimers()
  let late!: () => void
  const loader = createRoomLoader(url => url.includes('?r=') ? Promise.resolve() : new Promise(resolve => { late = resolve }), () => false, 100)
  const pending = loader.prefetch('about')
  await vi.advanceTimersByTimeAsync(101)
  expect(await pending).toBe('failed')
  expect(await loader.retry('about')).toBe('ready')
  late()
  expect(loader.get('about').url).toContain('?r=')
})
