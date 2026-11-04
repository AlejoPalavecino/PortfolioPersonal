// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { createAudio } from '../src/app/audio'

afterEach(() => { vi.unstubAllGlobals() })
function setup() {
  const pending: { resolve: () => void; reject: () => void }[] = []
  const media = { muted: false, volume: 0, loop: false, pause: vi.fn(), play: vi.fn(() => new Promise<void>((resolve, reject) => pending.push({resolve, reject: () => reject(new Error('blocked'))}))) }
  vi.stubGlobal('Audio', function() { return media })
  const audio = createAudio()
  return { audio, media, pending }
}
it('mutes immediately while play is pending and ignores its stale rejection', async () => {
  const { audio, media, pending } = setup()
  const enabling = audio.toggle()
  expect(audio.enabled).toBe(true)
  expect(media.muted).toBe(false)
  const disabling = audio.toggle()
  expect(audio.enabled).toBe(false)
  expect(media.muted).toBe(true)
  expect(media.pause).toHaveBeenCalled()
  pending[0]!.reject()
  expect(await enabling).toEqual({enabled:false,failed:false})
  await disabling
  audio.dispose()
})
it('keeps the latest on state when an older play request fails', async () => {
  const { audio, media, pending } = setup()
  const first = audio.toggle(); await audio.toggle(); const last = audio.toggle()
  pending[0]!.reject(); await first
  expect(audio.enabled).toBe(true)
  expect(media.muted).toBe(false)
  pending[1]!.resolve(); expect(await last).toEqual({enabled:true,failed:false})
  audio.dispose()
})
it('reverts and mutes when the current playback request is rejected', async () => {
  const { audio, media, pending } = setup()
  const enabling = audio.toggle(); pending[0]!.reject()
  expect(await enabling).toEqual({enabled:false,failed:true})
  expect(audio.enabled).toBe(false); expect(media.muted).toBe(true)
  audio.dispose()
})
