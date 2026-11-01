/**
 * Performance budget. Particles and ambience degrade first; the avatar's response never does.
 * `full`: desktop-class. `lite`: touch or small screens. `minimal`: reduced motion or struggling device.
 */
export type FxLevel = 'full' | 'lite' | 'minimal'
export type FxLimits = { dust: number; smoke: number; glints: number; ambientFps: number; markers: boolean }

export const FX_LIMITS: Readonly<Record<FxLevel, FxLimits>> = {
  full: { dust: 14, smoke: 7, glints: 9, ambientFps: 20, markers: true },
  lite: { dust: 7, smoke: 4, glints: 4, ambientFps: 12, markers: true },
  minimal: { dust: 0, smoke: 0, glints: 0, ambientFps: 0, markers: true },
}

export type Environment = { reducedMotion: boolean; coarsePointer: boolean; width: number; cores?: number; memory?: number; saveData?: boolean }

export function initialLevel(env: Environment): FxLevel {
  if (env.reducedMotion) return 'minimal'
  if (env.saveData || (env.cores !== undefined && env.cores <= 2) || (env.memory !== undefined && env.memory <= 2)) return 'lite'
  return env.coarsePointer || env.width < 700 ? 'lite' : 'full'
}

const ORDER: readonly FxLevel[] = ['full', 'lite', 'minimal']
export const degrade = (level: FxLevel): FxLevel => ORDER[Math.min(ORDER.length - 1, ORDER.indexOf(level) + 1)]!

/**
 * Rolling frame-time monitor. After `window` consecutive frames averaging above `limitMs`
 * it asks for one step down. It never steps back up in the same session: no oscillation.
 */
export function createFrameMonitor(onDegrade: () => void, limitMs = 26, window = 90) {
  let total = 0, count = 0
  return {
    sample(deltaMs: number) {
      if (deltaMs <= 0 || deltaMs > 250) return // tab switches and breakpoints are not performance data
      total += deltaMs; count++
      if (count < window) return
      const average = total / count
      total = 0; count = 0
      if (average > limitMs) onDegrade()
    },
    reset() { total = 0; count = 0 },
  }
}
