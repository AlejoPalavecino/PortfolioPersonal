import { describe, expect, it } from 'vitest'
import { createExperience, reduceExperience } from '../src/core/experience'

describe('inicio y ciclo de experiencia', () => {
  it('no entra automáticamente tras preparar la primera visita', () => {
    const initial = createExperience()
    expect(initial).toMatchObject({ phase: 'intro', preparation: 'idle', entered: false, direct: false })
    const loading = reduceExperience(initial, { type: 'load-start', generation: 1 })
    expect(reduceExperience(loading, { type: 'enter' })).toEqual(loading)
    const ready = reduceExperience(loading, { type: 'load-ready', generation: 1 })
    expect(ready).toMatchObject({ phase: 'ready', preparation: 'ready', entered: false })
    expect(reduceExperience(ready, { type: 'enter' })).toMatchObject({ phase: 'explore', entered: true })
  })

  it('abre enlaces directos y mantiene lectura si la carga termina después', () => {
    const direct = createExperience({ direct: true })
    expect(direct).toMatchObject({ phase: 'direct', direct: true })
    const loading = reduceExperience(direct, { type: 'load-start', generation: 1 })
    expect(reduceExperience(loading, { type: 'load-ready', generation: 1 })).toMatchObject({ phase: 'direct', preparation: 'ready' })
    expect(reduceExperience(loading, { type: 'read' }).phase).toBe('direct')
  })

  it('permite reingreso de sesión sin retirar la primera presentación automáticamente', () => {
    const session = createExperience({ entered: true })
    const loading = reduceExperience(session, { type: 'load-start', generation: 1 })
    expect(reduceExperience(loading, { type: 'load-ready', generation: 1 }).phase).toBe('explore')
  })

  it('ignora callbacks antiguos tras reintentar y muestra carga lenta solo para generación vigente', () => {
    const first = reduceExperience(createExperience(), { type: 'load-start', generation: 1 })
    const second = reduceExperience(first, { type: 'load-start', generation: 2 })
    expect(reduceExperience(second, { type: 'load-ready', generation: 1 })).toEqual(second)
    expect(reduceExperience(second, { type: 'load-failed', generation: 1 })).toEqual(second)
    expect(reduceExperience(second, { type: 'load-slow', generation: 1 })).toEqual(second)
    expect(reduceExperience(second, { type: 'load-slow', generation: 2 }).slow).toBe(true)
  })

  it('mantiene acceso directo tras fallo de escena incluso durante lectura', () => {
    let state = reduceExperience(createExperience(), { type: 'load-start', generation: 1 })
    state = reduceExperience(state, { type: 'load-ready', generation: 1 })
    state = reduceExperience(state, { type: 'enter' })
    state = reduceExperience(state, { type: 'read' })
    const failed = reduceExperience(state, { type: 'load-failed', generation: 1 })
    expect(failed).toMatchObject({ phase: 'read', preparation: 'failed', direct: true })
    expect(reduceExperience(failed, { type: 'camp' }).phase).toBe('direct')
  })

  it('abrir y cerrar menú no cambia la fase de exploración', () => {
    let state = reduceExperience(createExperience(), { type: 'load-start', generation: 1 })
    state = reduceExperience(state, { type: 'load-ready', generation: 1 })
    state = reduceExperience(state, { type: 'enter' })
    const menu = reduceExperience(state, { type: 'overlay', overlay: 'menu' })
    expect(menu).toMatchObject({ phase: 'explore', overlay: 'menu' })
    expect(reduceExperience(menu, { type: 'overlay', overlay: 'none' })).toMatchObject({ phase: 'explore', overlay: 'none' })
  })
})
