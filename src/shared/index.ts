export { createSceneLoader } from './scene-loader'
export type { ScenePorts, ScenePreparation, SpriteFrame } from './scene-loader'

export function assetUrl(file: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  return `${base}/assets/${file.replace(/^\/+/, '')}`
}
