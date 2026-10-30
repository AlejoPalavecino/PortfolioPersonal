import { assetUrl } from '../shared'

export function createAudio() {
  const ambient = new Audio(assetUrl('camp-ambience-loop.wav'))
  ambient.loop = true; ambient.volume = .22
  let enabled = false, paused = false
  return {
    async toggle() {
      if (paused && enabled) paused = false
      else enabled = !enabled
      if (enabled) { try { await ambient.play() } catch { enabled = false; return { enabled, failed: true } } }
      else ambient.pause()
      return { enabled, failed: false }
    },
    pause() { if (enabled) { ambient.pause(); paused = true } },
  }
}
