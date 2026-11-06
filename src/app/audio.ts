import { WORLD, type Point } from '../core/domain'
import type { CueBus } from '../core/fx/cues'
import { ambientTargets } from '../core/fx/mix'
import type { Surface } from '../core/fx/surface'
import { assetUrl } from '../shared'

export type AudioLevels = { master: number; ambient: number; sfx: number }

type WebSynth = {
  ctx: AudioContext
  masterGain: GainNode
  ambientGain: GainNode
  sfxGain: GainNode
  waterGain: GainNode
  fireGain: GainNode
  waterPan: StereoPannerNode | null
  firePan: StereoPannerNode | null
}

function buildSynth(): WebSynth | null {
  const Ctor = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
    ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  try {
    const ctx = new Ctor()
    const masterGain = ctx.createGain()
    const ambientGain = ctx.createGain()
    const sfxGain = ctx.createGain()
    const waterGain = ctx.createGain()
    const fireGain = ctx.createGain()
    masterGain.gain.value = 0.85
    ambientGain.gain.value = 0.7
    sfxGain.gain.value = 0.8
    waterGain.gain.value = 0.08
    fireGain.gain.value = 0.05
    ambientGain.connect(masterGain)
    sfxGain.connect(masterGain)
    masterGain.connect(ctx.destination)

    const length = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.04 * white) / 1.04
      data[i] = last * 1.8
    }

    const makeLoop = (freq: number, q: number, target: GainNode) => {
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = freq
      filter.Q.value = q
      src.connect(filter)
      const pan = typeof ctx.createStereoPanner === 'function' ? ctx.createStereoPanner() : null
      if (pan) { filter.connect(pan); pan.connect(target) }
      else filter.connect(target)
      target.connect(ambientGain)
      src.start()
      return pan
    }

    const waterPan = makeLoop(620, 1.4, waterGain)
    const firePan = makeLoop(260, 0.9, fireGain)
    return { ctx, masterGain, ambientGain, sfxGain, waterGain, fireGain, waterPan, firePan }
  } catch {
    return null
  }
}

export function createAudio(bus?: CueBus, getState?: () => { position: Point; reading: boolean; intro?: boolean }) {
  const ambient = new Audio()
  // Do not download the 2 MB soundtrack before the visitor enables sound.
  ambient.preload = 'none'
  ambient.src = assetUrl('camp-ambience-loop.wav')
  ambient.loop = true
  ambient.volume = 0.22
  let enabled = false, paused = false
  let levels: AudioLevels = { master: 0.85, ambient: 0.75, sfx: 0.8 }
  let synth: WebSynth | null = null
  let revision = 0, disposed = false
  const cooldowns = new Map<string, number>()

  const canPlay = (key: string, minGapMs: number): boolean => {
    if (!enabled || paused) return false
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const prev = cooldowns.get(key) ?? -Infinity
    if (now - prev < minGapMs) return false
    cooldowns.set(key, now)
    return true
  }

  const updateSpatial = () => {
    const current = getState ? getState() : { position: WORLD.spawn, reading: false }
    const targets = ambientTargets(current.position, current.reading)
    const baseVol = Math.max(0, Math.min(1, 0.24 * levels.master * levels.ambient * targets.wind))
    ambient.volume = enabled && !paused ? baseVol : 0
    if (!synth || !enabled || paused) return
    const now = synth.ctx.currentTime
    synth.masterGain.gain.setTargetAtTime(levels.master, now, 0.08)
    synth.ambientGain.gain.setTargetAtTime(levels.ambient, now, 0.18)
    synth.sfxGain.gain.setTargetAtTime(levels.sfx, now, 0.08)
    synth.waterGain.gain.setTargetAtTime(targets.water * 0.14, now, 0.25)
    synth.fireGain.gain.setTargetAtTime((current.intro ? 0.38 : targets.fire * 0.12), now, 0.25)
    synth.waterPan?.pan.setTargetAtTime(targets.panWater, now, 0.25)
    synth.firePan?.pan.setTargetAtTime(targets.panFire, now, 0.25)
  }

  const tone = (freq: number, endFreq: number, durationSec: number, gain: number, type: OscillatorType = 'sine', delaySec = 0) => {
    if (!synth || !enabled || paused) return
    const { ctx, sfxGain } = synth
    const start = ctx.currentTime + delaySec
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), start + durationSec)
    env.gain.setValueAtTime(0.0001, start)
    env.gain.linearRampToValueAtTime(Math.min(0.25, gain), start + 0.012)
    env.gain.exponentialRampToValueAtTime(0.0001, start + durationSec)
    osc.connect(env)
    env.connect(sfxGain)
    osc.start(start)
    osc.stop(start + durationSec + 0.01)
    osc.onended = () => { osc.disconnect(); env.disconnect() }
  }

  const playStep = (foot: 'left' | 'right', surface: Surface) => {
    if (!canPlay('step', 110)) return
    const detune = (foot === 'left' ? -0.035 : 0.035) + (Math.random() - 0.5) * 0.03
    if (surface === 'wood') {
      tone(255 * (1 + detune), 145, 0.065, 0.09, 'triangle')
    } else if (surface === 'dirt') {
      tone(175 * (1 + detune), 92, 0.06, 0.075, 'sine')
    } else {
      tone(150 * (1 + detune), 85, 0.055, 0.06, 'sine')
    }
  }

  const offs = bus ? [
    bus.on('intro-cue', ({ kind }) => {
      if (!canPlay(`intro-${kind}`, kind === 'voice' ? 95 : 120)) return
      if (kind === 'step') tone(170, 85, 0.065, 0.065, 'triangle')
      else if (kind === 'voice') tone(330, 290, 0.035, 0.022, 'triangle')
      else if (kind === 'greeting') {
        tone(392, 440, 0.14, 0.065, 'sine')
        tone(659, 659, 0.2, 0.05, 'triangle', 0.1)
      } else if (kind === 'reply') {
        tone(523, 659, 0.1, 0.055, 'sine')
      } else {
        tone(392, 392, 0.16, 0.06, 'triangle')
        tone(523, 523, 0.18, 0.05, 'triangle', 0.1)
        tone(784, 784, 0.26, 0.045, 'sine', 0.2)
      }
    }),
    bus.on('step', ({ foot, surface }) => { updateSpatial(); playStep(foot, surface) }),
    bus.on('ground-tap', () => { if (canPlay('tap', 90)) tone(360, 300, 0.07, 0.065, 'sine') }),
    bus.on('destination-selected', ({ section }) => {
      if (!canPlay('select', 100)) return
      tone(392, 440, 0.09, 0.08, 'triangle')
      tone(523.25, 540, 0.11, 0.07, 'sine', 0.055)
      if (section === 'contact') tone(690, 810, 0.12, 0.05, 'sine', 0.11)
    }),
    bus.on('arrive', ({ section }) => {
      updateSpatial()
      if (!canPlay('arrive', 140)) return
      if (section === 'contact') {
        tone(660, 880, 0.11, 0.075, 'sine')
        tone(880, 740, 0.12, 0.065, 'triangle', 0.09)
      } else if (section) {
        tone(440, 440, 0.14, 0.08, 'sine')
        tone(659.25, 659.25, 0.18, 0.07, 'triangle', 0.05)
      }
    }),
    bus.on('surface-open', () => {
      updateSpatial()
      if (canPlay('open', 100)) tone(310, 440, 0.13, 0.075, 'triangle')
    }),
    bus.on('surface-close', () => {
      updateSpatial()
      if (canPlay('close', 100)) tone(410, 270, 0.12, 0.07, 'triangle')
    }),
    bus.on('page-change', () => {
      if (canPlay('page', 90)) tone(480, 560, 0.075, 0.055, 'sine')
    }),
  ] : []

  return {
    get enabled() { return enabled && !paused },
    get levels() { return levels },
    setLevels(next: Partial<AudioLevels>) {
      levels = { ...levels, ...next }
      updateSpatial()
    },
    sync: updateSpatial,
    async toggle() {
      if (disposed) return { enabled: false, failed: false }
      const request = ++revision
      if (paused && enabled) paused = false
      else enabled = !enabled
      // Mute and expose the requested state synchronously, before any media promise.
      ambient.muted = !enabled
      if (!enabled) {
        ambient.volume = 0
        ambient.pause()
        if (synth) {
          synth.masterGain.gain.cancelScheduledValues?.(synth.ctx.currentTime)
          synth.masterGain.gain.value = 0
        }
        return { enabled: false, failed: false }
      }
      try {
        synth ??= buildSynth()
        if (synth) synth.masterGain.gain.value = levels.master
        updateSpatial()
        // Invoke both immediately in the gesture; don't wait for resume before play.
        const resume = synth?.ctx.state === 'suspended' ? synth.ctx.resume() : Promise.resolve()
        await Promise.all([resume, ambient.play()])
      } catch {
        if (request !== revision || disposed) return { enabled: enabled && !paused, failed: false }
        enabled = false; paused = false; ambient.muted = true; ambient.pause()
        if (synth) synth.masterGain.gain.value = 0
        return { enabled: false, failed: true }
      }
      return { enabled: enabled && !paused, failed: false }
    },
    pause() {
      revision++
      ambient.muted = true
      if (enabled) {
        ambient.pause()
        if (synth && synth.ctx.state === 'running') void synth.ctx.suspend()
        paused = true
      }
    },
    dispose() {
      disposed = true; revision++; enabled = false; ambient.muted = true
      offs.forEach(off => off())
      ambient.pause()
      if (synth) void synth.ctx.close()
    },
  }
}
