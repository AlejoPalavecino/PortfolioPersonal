import { describe, expect, it } from 'vitest'
import { createNavigation, reduceNavigation } from '../src/core/domain'

const start = () => reduceNavigation(createNavigation({ x: 10, y: 20 }), { type: 'set-scene', scene: 'ready' })
const select = (state: ReturnType<typeof start>, section: 'projects' | 'about' | 'journey' | 'contact') =>
  reduceNavigation(state, { type: 'select-section', section })

describe('navegación del campamento', () => {
  it('espera la llegada vigente y reemplaza la intención sin perder la posición', () => {
    const first = select(start(), 'projects')
    expect(first.view).toEqual({ kind: 'camp' })
    expect(first.route?.target).toEqual({ kind: 'section', section: 'projects' })
    const moved = reduceNavigation(first, { type: 'move', position: { x: 30, y: 40 } })
    const next = select(moved, 'contact')
    expect(next.position).toEqual({ x: 30, y: 40 })
    expect(next.route?.id).not.toBe(first.route?.id)
    const stale = reduceNavigation(next, { type: 'arrive', id: first.route!.id, position: { x: 99, y: 99 } })
    expect(stale).toEqual(next)
    const arrived = reduceNavigation(stale, { type: 'arrive', id: next.route!.id, position: { x: 50, y: 60 } })
    expect(arrived.view).toEqual({ kind: 'section', section: 'contact' })
    expect(arrived.visited).toEqual(['contact'])
    expect(arrived.route).toBeNull()
    expect(reduceNavigation(arrived, { type: 'arrive', id: next.route!.id, position: { x: 50, y: 60 } })).toEqual(arrived)
  })

  it('conserva el origen inicial y la posición alcanzada al cancelar una ruta redirigida', () => {
    const origin = reduceNavigation(start(), { type: 'restore', view: { kind: 'section', section: 'about' } })
    const first = select(origin, 'projects')
    const moved = reduceNavigation(first, { type: 'move', position: { x: 22, y: 33 } })
    const next = select(moved, 'contact')
    expect(next.route?.origin).toEqual(origin.view)
    const cancelled = reduceNavigation(next, { type: 'cancel' })
    expect(cancelled.view).toEqual(origin.view)
    expect(cancelled.position).toEqual({ x: 22, y: 33 })
    expect(cancelled.route).toBeNull()
    expect(reduceNavigation(cancelled, { type: 'arrive', id: next.route!.id, position: { x: 1, y: 1 } })).toEqual(cancelled)
  })

  it('requiere reanudar explícitamente una ruta pausada', () => {
    const walking = select(start(), 'journey')
    const paused = reduceNavigation(walking, { type: 'pause' })
    expect(paused.route?.status).toBe('paused')
    expect(reduceNavigation(paused, { type: 'arrive', id: walking.route!.id, position: { x: 2, y: 3 } })).toEqual(paused)
    const resumed = reduceNavigation(paused, { type: 'resume' })
    expect(resumed.route?.status).toBe('active')
    expect(reduceNavigation(resumed, { type: 'arrive', id: walking.route!.id, position: { x: 2, y: 3 } }).view).toEqual({ kind: 'section', section: 'journey' })
  })

  it.each(['loading', 'failed'] as const)('abre directamente si la escena está %s', (scene) => {
    const state = reduceNavigation(createNavigation({ x: 0, y: 0 }), { type: 'set-scene', scene })
    const result = select(state, 'projects')
    expect(result.view).toEqual({ kind: 'section', section: 'projects' })
    expect(result.route).toBeNull()
  })

  it('abre el destino vigente al reducir movimiento o fallar la ruta', () => {
    const walking = select(start(), 'contact')
    const reduced = reduceNavigation(walking, { type: 'set-motion', reduced: true })
    expect(reduced.view).toEqual({ kind: 'section', section: 'contact' })
    expect(reduced.route).toBeNull()
    const failed = reduceNavigation(walking, { type: 'route-failed', id: walking.route!.id })
    expect(failed.view).toEqual({ kind: 'section', section: 'contact' })
    expect(failed.route).toBeNull()
  })

  it('llegar al suelo libre no abre contenido y reducir movimiento cancela esa ruta', () => {
    const walking = reduceNavigation(start(), { type: 'select-ground', point: { x: 60, y: 70 } })
    const arrived = reduceNavigation(walking, { type: 'arrive', id: walking.route!.id, position: { x: 60, y: 70 } })
    expect(arrived.view).toEqual({ kind: 'camp' })
    expect(arrived.route).toBeNull()
    expect(arrived.visited).toEqual([])
    const reduced = reduceNavigation(walking, { type: 'set-motion', reduced: true })
    expect(reduced.view).toEqual({ kind: 'camp' })
    expect(reduced.route).toBeNull()
  })

  it('no reinicia el mismo destino y abrir ahora solo abre la intención vigente', () => {
    const first = select(start(), 'projects')
    expect(select(first, 'projects')).toEqual(first)
    const next = select(first, 'about')
    const opened = reduceNavigation(next, { type: 'open-now' })
    expect(opened.view).toEqual({ kind: 'section', section: 'about' })
    expect(opened.visited).toEqual(['about'])
    expect(select(opened, 'about')).toEqual(opened)
  })
})

describe('transiciones adicionales', () => {
  it('el movimiento manual cancela el recorrido sin abrir contenido', () => {
    const walking = select(start(), 'projects')
    const manual = reduceNavigation(walking, { type: 'manual' })
    expect(manual.view).toEqual({ kind: 'camp' })
    expect(manual.route).toBeNull()
    expect(reduceNavigation(manual, { type: 'arrive', id: walking.route!.id, position: { x: 10, y: 20 } })).toEqual(manual)
  })
  it('permite abrir proyecto, volver a la lista y regresar al campamento', () => {
    const projects = reduceNavigation(start(), { type: 'select-section', section: 'projects', arrived: true })
    expect(projects.view).toEqual({ kind: 'section', section: 'projects' })
    const project = reduceNavigation(projects, { type: 'open-project', project: 'foxmind' })
    expect(project.view).toEqual({ kind: 'project', project: 'foxmind' })
    const back = reduceNavigation(project, { type: 'back-projects' })
    expect(back.view).toEqual({ kind: 'section', section: 'projects' })
    expect(reduceNavigation(back, { type: 'camp' }).view).toEqual({ kind: 'camp' })
  })
  it('abre la ficha de Chuli desde el taller', () => {
    const projects = reduceNavigation(start(), { type: 'select-section', section: 'projects', arrived: true })
    const chuli = reduceNavigation(projects, { type: 'open-project', project: 'chuli' })
    expect(chuli.view).toEqual({ kind: 'project', project: 'chuli' })
    expect(chuli.route).toBeNull()
  })
  it('abre la ficha del portfolio de código abierto desde el taller', () => {
    const projects = reduceNavigation(start(), { type: 'select-section', section: 'projects', arrived: true })
    const portfolio = reduceNavigation(projects, { type: 'open-project', project: 'portfolio' })
    expect(portfolio.view).toEqual({ kind: 'project', project: 'portfolio' })
    expect(portfolio.route).toBeNull()
  })
  it('abre la intención pendiente cuando falla la escena', () => {
    const walking = select(start(), 'contact')
    const failed = reduceNavigation(walking, { type: 'set-scene', scene: 'failed' })
    expect(failed.view).toEqual({ kind: 'section', section: 'contact' })
    expect(failed.route).toBeNull()
    expect(failed.visited).toEqual(['contact'])
  })
})
