export type SpriteFrame = { name: string; w: number; h: number; anchorX: number; anchorY: number }
const names = ['down', 'left', 'right', 'up'].flatMap(direction => [`idle-${direction}`, ...[1, 2, 3, 4].map(n => `walk-${direction}-${n}`)])

function validFrame(value: unknown): value is SpriteFrame {
  if (typeof value !== 'object' || value === null) return false
  const frame = value as Record<string, unknown>
  if (typeof frame.name !== 'string' || !names.includes(frame.name)) return false
  const { w, h, anchorX, anchorY } = frame
  return typeof w === 'number' && Number.isFinite(w) && w > 0 && typeof h === 'number' && Number.isFinite(h) && h > 0
    && typeof anchorX === 'number' && Number.isFinite(anchorX) && anchorX > 0 && anchorX <= w
    && typeof anchorY === 'number' && Number.isFinite(anchorY) && anchorY > 0 && anchorY <= h
}

export function validateFrames(value: unknown): SpriteFrame[] {
  if (!Array.isArray(value) || value.length !== names.length || !value.every(validFrame) || new Set(value.map(frame => frame.name)).size !== names.length) throw new Error('Metadatos de animación inválidos')
  return value
}
