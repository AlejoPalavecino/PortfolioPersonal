export { createSceneLoader } from './scene-loader'
export type { ScenePorts, ScenePreparation, SpriteFrame } from './scene-loader'
export { ROOM_META, roomVariantAsset, createRoomLoader } from './room-loader'
export type { RoomMeta, RoomTheme, RoomAssetStatus, RoomStateSnapshot, RoomLoader } from './room-loader'

export function assetUrl(file: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  return `${base}/assets/${file.replace(/^\/+/, '')}`
}
