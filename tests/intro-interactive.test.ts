// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bindIntroFx } from '../src/app/fx/intro-fx'
import { createSession } from '../src/app/session'
import type { createController } from '../src/app/controller'
import type { ScenePreparation } from '../src/shared'
import { createAudio } from '../src/app/audio'
import { shell } from '../src/app/shell'
import { createCueBus } from '../src/core/fx/cues'
import { INTRO_LINES, advanceIntroArrival, visibleDialogue } from '../src/core/experience/intro-dialogue'
import type { FrameFn, Loop } from '../src/app/loop'

const cleanups: (() => void)[] = []
afterEach(() => { cleanups.splice(0).forEach(fn => fn()); document.body.innerHTML = ''; vi.restoreAllMocks(); vi.unstubAllGlobals() })
function setup(reduced = false) {
  document.body.innerHTML = `<div id="app">${shell()}</div>`
  const root = document.querySelector<HTMLElement>('#app')!
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  vi.spyOn(Image.prototype, 'decode').mockResolvedValue(undefined)
  const fns = new Set<FrameFn>()
  const loop: Loop = { add(fn) { fns.add(fn); return () => fns.delete(fn) }, get size() { return fns.size }, dispose() { fns.clear() } }
  const bus = createCueBus(), complete = vi.fn(), cues: string[] = []
  const unlisten = bus.on('intro-cue', ({ kind }) => cues.push(kind))
  const fx = bindIntroFx(root, bus, loop, () => reduced, complete)
  cleanups.push(() => { fx.dispose(); unlisten(); bus.dispose() })
  const click = (selector: string) => root.querySelector<HTMLButtonElement>(selector)!.click()
  const advance = (ms: number) => { for (let n = 0; n < ms; n += 50) for (const fn of [...fns]) fn(n, 50) }
  return { root, bus, fx, complete, cues, click, advance, loop, reduce: () => { reduced = true; fx.refresh() } }
}

describe('interactive arrival', () => {
  it('holds the greeting indefinitely and waits for an explicit reply and entry', () => {
    const s = setup()
    s.advance(12000)
    expect(s.root.querySelector<HTMLElement>('.intro-story-banner')!.hidden).toBe(false)
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.greeting.text)
    expect(s.complete).not.toHaveBeenCalled()
    expect(s.cues.filter(c => c === 'greeting')).toHaveLength(1)
    expect(s.cues).toContain('step')
    expect(s.loop.size).toBe(0)
    s.click('[data-intro-reply="work"]')
    expect(document.activeElement).toBe(s.root.querySelector('.intro-dialogue-next'))
    s.advance(4000)
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.work.text)
    expect(s.complete).not.toHaveBeenCalled()
    s.click('[data-action="intro-next"]')
    expect(s.complete).toHaveBeenCalledTimes(1)
    expect(s.cues).toContain('depart')
  })
  it('restarts the greeting without entering or losing keyboard focus', () => {
    const s = setup()
    s.advance(8000)
    const replay = s.root.querySelector<HTMLButtonElement>('[data-action="intro-replay"]')!
    expect(replay.hidden).toBe(false)
    s.click('[data-intro-reply="work"]')
    s.advance(4000)
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.work.text)
    replay.click()
    expect(s.root.dataset.introStage).toBe('playing')
    expect(s.root.querySelector<HTMLElement>('.intro-story-banner')!.hidden).toBe(true)
    expect(replay.hidden).toBe(true)
    expect(document.activeElement).toBe(s.root.querySelector('[data-action="intro-pause"]'))
    s.advance(8000)
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.greeting.text)
    expect(s.cues.filter(c => c === 'greeting')).toHaveLength(2)
    expect(s.complete).not.toHaveBeenCalled()
  })
  it('pauses both walking and typing, resumes explicitly, and supports greeting by keyboard-compatible button', () => {
    const s = setup()
    s.advance(1500); s.click('[data-action="intro-pause"]')
    const position = s.root.querySelector<HTMLElement>('.intro-actor-stage')!.style.cssText
    const count = s.cues.length
    s.advance(3000)
    expect(s.root.querySelector<HTMLElement>('.intro-actor-stage')!.style.cssText).toBe(position)
    expect(s.cues).toHaveLength(count)
    s.click('[data-action="intro-pause"]'); s.click('.intro-character'); s.advance(300)
    s.click('[data-action="intro-pause"]')
    const text = s.root.querySelector('.intro-beat-subtitle')!.textContent
    s.advance(4000)
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(text)
    s.click('[data-action="intro-pause"]'); s.click('.intro-character')
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.greeting.text)
  })
  it('shows complete dialogue with reduced motion and keeps the camp branch usable', () => {
    const s = setup(true)
    expect(s.loop.size).toBe(0)
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.greeting.text)
    expect(s.cues).toEqual([])
    s.click('[data-intro-reply="camp"]')
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.camp.text)
    s.click('[data-action="intro-next"]')
    expect(s.complete).toHaveBeenCalledOnce()
  })
  it('switches motion preference mid-walk without making users wait', () => {
    const s = setup(); s.advance(1400); s.reduce()
    expect(s.root.dataset.introStage).toBe('conversation')
    expect(s.loop.size).toBe(0)
    expect(s.root.querySelector('.intro-dialogue-accessible')!.textContent).toBe(INTRO_LINES.greeting.text)
  })
  it('pauses when hidden and does not resume merely by returning', () => {
    const s = setup(); s.advance(1400)
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(s.root.dataset.introPaused).toBe('true')
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange')); s.advance(5000)
    expect(s.root.dataset.introStage).toBe('playing')
    s.click('[data-action="intro-pause"]'); s.advance(5000)
    expect(s.root.dataset.introStage).toBe('conversation')
  })
  it('keeps real preparation independent of dialogue, with failure and retry', () => {
    const s = setup()
    s.bus.emit('prepare-start', {})
    s.bus.emit('prepare-progress', { completed: 7, total: 28, task: 'Assets' })
    s.advance(10000)
    expect(s.root.querySelector('.loading-progress')!.getAttribute('aria-valuenow')).toBe('7')
    expect(s.root.dataset.prepared).toBe('false')
    s.bus.emit('prepare-failed', { error: 'offline' })
    expect(s.root.textContent).toContain('Podés reintentar')
    s.bus.emit('prepare-start', {}); s.bus.emit('prepare-progress', { completed: 28, total: 28, task: 'Listo' }); s.bus.emit('prepare-ready', {})
    expect(s.root.dataset.prepared).toBe('true')
    expect(s.complete).not.toHaveBeenCalled()
  })
  it('stops on direct access, skip and disposal without leaking listeners', async () => {
    const s = setup(); s.advance(1500)
    s.root.querySelector<HTMLElement>('.intro')!.hidden = true
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(s.loop.size).toBe(0)
    const count = s.cues.length
    s.advance(6000); expect(s.cues).toHaveLength(count)
    s.fx.dispose(); expect(s.bus.size()).toBe(1)
    s.click('[data-action="intro-next"]'); expect(s.complete).not.toHaveBeenCalled()
  })
  it('finishes a queued skip only after real readiness and transfers focus to the world', () => {
    const s = setup()
    vi.stubGlobal('location', { hash: '' })
    vi.stubGlobal('sessionStorage', { getItem: () => null, setItem: vi.fn() })
    const controller = { dispatch: vi.fn() } as unknown as ReturnType<typeof createController>
    const session = createSession(s.root, controller, false, s.bus)
    const load = (status: ScenePreparation['status']): ScenePreparation => ({ generation: 1, status, completed: status === 'ready' ? 28 : 7, total: 28, timedOut: false, error: null, frames: [] })
    const entered = vi.fn(); s.bus.on('enter', entered)
    session.loading(load('loading')); session.skipIntro()
    expect(session.state.phase).not.toBe('explore')
    expect(s.root.querySelector<HTMLElement>('.intro')!.hidden).toBe(false)
    session.loading(load('ready'))
    expect(session.state.phase).toBe('explore')
    expect(s.root.querySelector<HTMLElement>('.intro')!.hidden).toBe(true)
    expect(document.activeElement).toBe(s.root.querySelector('.world'))
    expect(entered).toHaveBeenCalledOnce()
    expect(s.loop.size).toBe(0)
    expect(s.root.querySelector('.loading-progress')!.getAttribute('aria-valuenow')).toBe('28')
  })
  it('does not fast-forward after a long frame and can reveal a full line instantly', () => {
    expect(advanceIntroArrival(1500, 50000, false)).toBe(1600)
    expect(advanceIntroArrival(1500, 50, true)).toBe(1500)
    expect(visibleDialogue('Hola', 22, false)).toBe('H')
    expect(visibleDialogue('Hola', 0, true)).toBe('Hola')
  })
})

describe('voluntary intro sound', () => {
  it('does not create audio context or play media before consent; mutes and disposes', async () => {
    const play = vi.fn().mockResolvedValue(undefined), pause = vi.fn()
    vi.stubGlobal('Audio', class { loop = false; volume = 0; play = play; pause = pause })
    const param = () => ({ value: 0, setTargetAtTime: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() })
    const node = () => ({ connect: vi.fn(), disconnect: vi.fn(), gain: param(), frequency: param(), Q: param(), pan: param(), start: vi.fn(), stop: vi.fn() })
    const oscillator = vi.fn(node), close = vi.fn(), suspend = vi.fn()
    const ctor = vi.fn(function () { return { state: 'running', currentTime: 0, sampleRate: 10, destination: {}, createGain: node, createBuffer: () => ({ getChannelData: () => new Float32Array(20) }), createBufferSource: node, createBiquadFilter: node, createStereoPanner: node, createOscillator: oscillator, close, suspend } })
    vi.stubGlobal('AudioContext', ctor)
    const bus = createCueBus(), audio = createAudio(bus)
    bus.emit('intro-cue', { kind: 'greeting' })
    expect(ctor).not.toHaveBeenCalled(); expect(play).not.toHaveBeenCalled()
    expect(await audio.toggle()).toEqual({ enabled: true, failed: false })
    bus.emit('intro-cue', { kind: 'greeting' })
    expect(oscillator).toHaveBeenCalledTimes(2)
    await audio.toggle(); bus.emit('intro-cue', { kind: 'reply' })
    expect(oscillator).toHaveBeenCalledTimes(2); expect(pause).toHaveBeenCalled()
    audio.dispose(); expect(close).toHaveBeenCalled(); expect(bus.size()).toBe(0)
  })
})
