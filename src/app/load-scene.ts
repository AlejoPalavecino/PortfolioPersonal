import { CAMP_SCENERY } from '../shared/camp-scenery'
import { WORLD, isWalkable } from '../core/domain'
import { assetUrl, createSceneLoader, type ScenePreparation } from '../shared'

export function createCampLoader(root: HTMLElement, onChange: (state: ScenePreparation) => void) {
  return createSceneLoader({
    async metadata() {
      const response = await fetch(assetUrl('avatar/frames.json'))
      if (!response.ok) throw new Error('No se pudieron cargar los movimientos')
      return response.json()
    },
    async image(file) {
      const image = file === CAMP_SCENERY.ground ? root.querySelector<HTMLImageElement>('.ground')! : new Image()
      image.src = assetUrl(file)
      await image.decode()
      if (file === CAMP_SCENERY.backdrop) {
        root.querySelector<HTMLElement>('.landscape')!.style.setProperty('--camp-backdrop', `url("${image.src}")`)
      }
    },
    async navigation() {
      // A cheap check is enough before first paint. All routed paths are checked
      // by CI and calculated on demand when visitors choose a destination.
      if (!isWalkable(WORLD, WORLD.spawn)) throw new Error('El punto inicial no está disponible')
      for (const arrival of Object.values(WORLD.arrivals)) {
        if (!isWalkable(WORLD, arrival.point)) throw new Error('Una entrada no está disponible')
      }
    },
  }, onChange)
}
