import { WORLD, isWalkable } from '../core/domain'
import { assetUrl, createSceneLoader, type ScenePreparation } from '../shared'

export function prepareScene(onChange: (state: ScenePreparation) => void) {
  const loader = createSceneLoader({
    async metadata() {
      const response = await fetch(assetUrl('avatar/frames.json'))
      if (!response.ok) throw new Error('No se pudieron cargar los movimientos')
      return response.json()
    },
    async image(file) {
      const image = new Image()
      image.src = assetUrl(file)
      await image.decode()
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
  loader.start()
  return loader
}
