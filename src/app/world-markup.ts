import { DESTINATIONS, type Section } from '../core/domain'
import { sections } from '../entities'
import { assetUrl } from '../shared'
import { campIcon } from '../shared/camp-icons'

function thresholdStyle(): string {
  return [
    `--fx-door-open:url('${assetUrl('camp-rooms-v1/fx/door-open.png')}')`,
    `--fx-canvas-open:url('${assetUrl('camp-rooms-v1/fx/canvas-open.png')}')`,
    `--fx-journal-open:url('${assetUrl('camp-rooms-v1/fx/journal-open.png')}')`,
    `--fx-radio-signal:url('${assetUrl('camp-rooms-v1/fx/radio-signal.png')}')`,
  ].join(';')
}

export function worldMarkup(): string {
  const entries = Object.entries(DESTINATIONS) as [Section, (typeof DESTINATIONS)[Section]][]
  const objects = entries.map(([id, item]) => `<img class="poi poi-${id}" data-poi="${id}" src="${assetUrl(item.sprite)}" loading="lazy" decoding="async" fetchpriority="low" alt="" style="z-index:${item.depthY};left:${item.visual.x}px;top:${item.visual.y}px;width:${item.visual.width}px;height:${item.visual.height}px">`).join('')
  const signs = entries.map(([id, item]) => {
    const sign = item.visual.sign
    return `<button class="world-label label-${id}" data-section="${id}" data-mount="${sign.mount}"
      style="left:${sign.x}px;top:${sign.y}px;--sign-width:${sign.width}px;--sign-height:${sign.height}px;z-index:${item.depthY + 7}">
      <span class="sign-plate" aria-hidden="true"></span><span class="sign-text">${campIcon(id)}${sections[id]}</span>
    </button>`
  }).join('')
  return `<div class="world-scroll"><div class="world" tabindex="0" role="application" aria-label="Campamento interactivo">
    <img class="ground" src="${assetUrl('camp-hillside.webp')}" decoding="async" fetchpriority="high" alt="">
    <canvas class="world-fx-ground" width="1000" height="650" aria-hidden="true"></canvas>${objects}
    <div class="avatar-shadow" aria-hidden="true"></div>
    <img class="avatar" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt="">
    <div class="threshold-stage" style="${thresholdStyle()}" aria-hidden="true" hidden>
      <div class="threshold-fx"></div>
      <img class="threshold-actor" width="131" height="255" src="${assetUrl('avatar/idle-up.webp')}" alt="">
    </div>
    <canvas class="world-fx-props" width="1000" height="650" aria-hidden="true"></canvas>${signs}
    <div class="avatar-occlusion" aria-hidden="true" hidden><img class="avatar avatar-ghost" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt=""></div>
  </div></div><nav class="camp-destinations" aria-label="Lugares del campamento">${entries.map(([id]) => `<button data-section="${id}">${campIcon(id)}<span>${sections[id]}</span><span class="destination-dot" aria-hidden="true"></span></button>`).join('')}</nav>`
}
