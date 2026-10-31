import { WORLD, findPath, isWalkable } from '../core/domain'
import { assetUrl, createSceneLoader, type ScenePreparation } from '../shared'

export function prepareScene(onChange: (state: ScenePreparation) => void) {
  const loader = createSceneLoader({
    async metadata() { const response = await fetch(assetUrl('avatar/frames.json')); if (!response.ok) throw new Error('No se pudieron cargar los movimientos'); return response.json() },
    async image(file) { const image = new Image(); image.src = assetUrl(file); await image.decode() },
    async navigation() {
      if (!isWalkable(WORLD, WORLD.spawn)) throw new Error('El punto inicial no está disponible')
      for (const arrival of Object.values(WORLD.arrivals)) if (!findPath(WORLD, WORLD.spawn, arrival.point)) throw new Error('Falta un camino del campamento')
    },
  }, onChange)
  loader.start()
  return loader
}
