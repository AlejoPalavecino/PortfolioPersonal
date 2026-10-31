import { describe, expect, it, vi } from 'vitest'
import { MOTION_STORAGE_KEY, readManualMotion, writeManualMotion } from '../src/app/motion-preference'

describe('persistencia de movimiento manual', () => {
  it('usa una clave versionada y acepta exclusivamente booleanos serializados', () => {
    expect(MOTION_STORAGE_KEY).toBe('camp:motion:v1')
    for (const [value, expected] of [['true', true], ['false', false], [null, false], ['TRUE', false], ['1', false], ['{}', false]] as const) {
      const getItem = vi.fn().mockReturnValue(value)
      expect(readManualMotion({ getItem })).toBe(expected)
      expect(getItem).toHaveBeenCalledWith('camp:motion:v1')
    }
  })
  it('guarda ambos estados manuales y tolera almacenamiento bloqueado', () => {
    const setItem = vi.fn()
    writeManualMotion(true, { setItem }); writeManualMotion(false, { setItem })
    expect(setItem.mock.calls).toEqual([['camp:motion:v1', 'true'], ['camp:motion:v1', 'false']])
    expect(readManualMotion({ getItem: () => { throw new Error('blocked') } })).toBe(false)
    expect(() => writeManualMotion(true, { setItem: () => { throw new Error('blocked') } })).not.toThrow()
  })
})
