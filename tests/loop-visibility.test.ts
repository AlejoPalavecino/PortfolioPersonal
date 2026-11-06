// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { createLoop } from '../src/app/loop'

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

it('runs only the welcome clock until entry, sleeps in reading, and keeps one pending frame', async () => {
  const root = document.createElement('div')
  root.innerHTML = '<div class="intro"></div><nav class="mobile-menu" hidden></nav>'
  const pending = new Map<number, FrameRequestCallback>()
  let serial = 0
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => { pending.set(++serial, fn); return serial })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => pending.delete(id))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  function frame(ms: number) {
    expect(pending.size).toBe(1)
    const [id, run] = [...pending][0]!
    pending.delete(id)
    run(ms)
  }

  const clock = createLoop(root)
  const world = vi.fn(), extra = vi.fn()
  clock.add(world)
  expect(pending.size).toBe(0)
  const done = clock.add(() => clock.add(extra), { duringIntro: true })
  frame(10)
  expect(world).not.toHaveBeenCalled()
  expect(pending.size).toBe(1)
  done()
  expect(pending.size).toBe(0)

  root.querySelector<HTMLElement>('.intro')!.hidden = true
  await new Promise(resolve => setTimeout(resolve, 0))
  frame(100)
  expect(world).toHaveBeenCalledWith(100, 0)
  root.dataset.reading = 'true'
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(pending.size).toBe(0)
  clock.dispose()
})
