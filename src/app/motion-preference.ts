export const MOTION_STORAGE_KEY = 'camp:motion:v1'

export function readManualMotion(storage?: Pick<Storage, 'getItem'>): boolean {
  try {
    return (storage ?? localStorage).getItem(MOTION_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeManualMotion(user: boolean, storage?: Pick<Storage, 'setItem'>): void {
  try {
    (storage ?? localStorage).setItem(MOTION_STORAGE_KEY, String(user))
  } catch {
    // Storage is optional.
  }
}
