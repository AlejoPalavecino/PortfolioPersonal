import { describe, expect, it } from 'vitest'
import { credentials, credentialAssetIsSafe, credentialById, publishedCredentials } from '../src/entities'
import { createNavigation, reduceNavigation } from '../src/core/domain'
import { credentialMarkup, recognitionsMarkup } from '../src/widgets'

describe('credenciales pendientes de verificación', () => {
  it('conserva los tres antecedentes como borradores sin publicarlos', () => {
    const ids = ['ilan-foxmind', 'egg-full-stack', 'ucm-mobile']
    expect(credentials.map(item => item.id)).toEqual(expect.arrayContaining(ids))
    expect(publishedCredentials().map(item => item.id)).not.toEqual(expect.arrayContaining(ids))
    for (const id of ids) {
      expect(publishedCredentials().some(item => item.id === id)).toBe(false)
      expect(credentialById(id)).toBeUndefined()
    }
  })

  it('no presenta borradores ni diplomas ficticios en la colección o detalle', () => {
    const listing = recognitionsMarkup()
    expect(listing).not.toMatch(/ILAN|Egg Corporation|Complutense/i)
    expect(listing).not.toMatch(/<img\b|<iframe\b/i)
    for (const id of ['ilan-foxmind', 'egg-full-stack', 'ucm-mobile']) {
      const detail = credentialMarkup(id)
      expect(detail).not.toMatch(/<img\b|<iframe\b/i)
      expect(detail).not.toMatch(/ILAN|Egg Corporation|Complutense/i)
    }
  })

  it.each(['javascript:alert(1)', '../diploma.pdf', 'http://example.com/file.pdf', 'https://user:pass@example.com/file.pdf'])(
    'rechaza el recurso inseguro %s', url => expect(credentialAssetIsSafe(url)).toBe(false),
  )

  it.each([{ kind: 'recognitions' } as const, { kind: 'credential', id: 'example' } as const])(
    'restaura %j cancelando ruta y marcando Trayectoria como visitada', view => {
      const ready = reduceNavigation(createNavigation({ x: 510, y: 350 }), { type: 'set-scene', scene: 'ready' })
      const walking = reduceNavigation(ready, { type: 'select-section', section: 'contact' })
      const restored = reduceNavigation(walking, { type: 'restore', view })
      expect(restored.route).toBeNull()
      expect(restored.visited).toContain('journey')
      expect(reduceNavigation(restored, { type: 'arrive', id: walking.route!.id, position: { x: 1, y: 1 } })).toEqual(restored)
    },
  )
})
