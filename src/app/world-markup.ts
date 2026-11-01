import { DESTINATIONS } from '../core/domain'
import { assetUrl } from '../shared'

export function worldMarkup(): string {
  const entries = Object.entries(DESTINATIONS)
  const objects = entries.map(([id, item]) => `<img class="poi poi-${id}" data-poi="${id}" src="${assetUrl(item.sprite)}" alt="" style="z-index:${item.depthY}">`).join('')
  const signs = entries.map(([id, item]) => `<button class="world-label label-${id}" data-section="${id}">${item.sign}</button>`).join('')
  return `<div class="world-scroll"><div class="world" tabindex="0" role="application" aria-label="Campamento interactivo">
    <img class="ground" src="${assetUrl('camp-hillside.webp')}" alt="">
    <canvas class="world-fx-ground" width="1000" height="650" aria-hidden="true"></canvas>${objects}
    <div class="avatar-shadow" aria-hidden="true"></div>
    <img class="avatar" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt="">
    <canvas class="world-fx-props" width="1000" height="650" aria-hidden="true"></canvas>${signs}
    <div class="avatar-occlusion" aria-hidden="true" hidden><img class="avatar avatar-ghost" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt=""></div>
  </div></div>`
}
