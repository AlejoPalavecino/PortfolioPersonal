// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bindIntroFx } from '../src/app/fx/intro-fx'
import { createAudio } from '../src/app/audio'
import { shell } from '../src/app/shell'
import { createCueBus } from '../src/core/fx/cues'
import { INTRO_LINES } from '../src/core/experience/intro-dialogue'
import type { FrameFn, Loop } from '../src/app/loop'

const cleanups: (() => void)[] = []
afterEach(() => { cleanups.splice(0).forEach(fn => fn()); document.body.innerHTML = ''; vi.restoreAllMocks(); vi.unstubAllGlobals() })
function setup(reduced = false, ready = true) {
  document.body.innerHTML = `<div id="app">${shell()}</div>`
  const root = document.querySelector<HTMLElement>('#app')!
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  vi.spyOn(Image.prototype, 'decode').mockResolvedValue(undefined)
  const fns = new Set<FrameFn>()
  const loop: Loop = { add(fn) { fns.add(fn); return () => fns.delete(fn) }, get size() { return fns.size }, dispose() { fns.clear() } }
  const bus = createCueBus(), complete = vi.fn(), cues: string[] = []
  const unlisten = bus.on('intro-cue', ({ kind }) => cues.push(kind))
  const fx = bindIntroFx(root, bus, loop, () => reduced, complete)
  if (ready) bus.emit('prepare-ready', {})
  cleanups.push(() => { fx.dispose(); unlisten(); bus.dispose() })
  const click = (selector: string) => root.querySelector<HTMLButtonElement>(selector)!.click()
  const advance = (ms: number) => { for (let n = 0; n < ms; n += 50) for (const fn of [...fns]) fn(n, 50) }
  return { root, bus, fx, complete, cues, click, advance, loop, reduce: () => { reduced = true; fx.refresh() } }
}

describe('cinematic arrival', () => {
  it('offers projects immediately and unlocks exploring as soon as critical assets are ready', () => {
    const s = setup(false, false)
    expect(s.root.querySelectorAll('.intro-primary-actions button')).toHaveLength(2)
    expect(s.root.querySelector<HTMLButtonElement>('.intro-primary-actions [data-action="direct"]')!.disabled).toBe(false)
    expect(s.root.querySelector<HTMLButtonElement>('.intro-primary-actions [data-action="enter"]')!.disabled).toBe(true)
    expect(s.root.querySelector('.intro-boot [data-action="direct"]')).not.toBeNull()
    expect(s.root.querySelector('.intro-top-actions [data-action="skip-intro"]')).not.toBeNull()
    s.bus.emit('prepare-ready', {})
    expect(s.root.dataset.introReady).toBe('true')
    expect(s.root.querySelector<HTMLButtonElement>('[data-action="enter"]')!.disabled).toBe(false)
  })
  it('hands off only after the departure animation and preserves the selected exit', async () => {
    const s = setup()
    const arrived = vi.fn()
    s.root.addEventListener('click', arrived)
    s.click('.intro-primary-actions [data-action="direct"]')
    expect(arrived).not.toHaveBeenCalled()
    await new Promise(resolve => setTimeout(resolve, 0))
    s.advance(200); expect(arrived).not.toHaveBeenCalled()
    s.advance(150); expect(arrived).toHaveBeenCalledOnce()
    expect(s.root.dataset.introTransition).toBe('projects')
  })
  it('waits for actual preparation, reports real tasks and supports failure recovery', () => {
    const s = setup(false, false)
    s.advance(10000)
    expect(s.root.dataset.introBoot).toBe('true')
    expect(s.root.querySelector<HTMLElement>('.intro-story-banner')!.hidden).toBe(true)
    s.bus.emit('prepare-progress', {completed:2,total:5,task:'Cargando el paisaje'})
    expect(s.root.querySelector('.boot-task')!.textContent).toBe('Cargando el paisaje')
    expect(s.root.querySelector('.boot-count')!.textContent).toBe('2 de 5 recursos')
    s.bus.emit('prepare-failed', {error:'offline'})
    expect(s.root.dataset.introBoot).toBe('false')
    expect(s.root.querySelector<HTMLButtonElement>('[data-action="direct"]')!.disabled).toBe(false)
    s.bus.emit('prepare-start', {})
    expect(s.root.dataset.introBoot).toBe('true')
    s.bus.emit('prepare-ready', {})
    expect(s.root.dataset.introReady).toBe('true')
  })
  it('respects reduced motion and removes all subscriptions on disposal', () => {
    const s = setup(true)
    expect(s.root.dataset.introReady).toBe('true')
    expect(s.root.querySelector('.intro-beat-subtitle')!.textContent).toBe(INTRO_LINES.greeting.text)
    s.fx.dispose(); expect(s.loop.size).toBe(0)
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
