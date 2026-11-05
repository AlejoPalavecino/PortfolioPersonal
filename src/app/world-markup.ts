import { DESTINATIONS, type Section } from '../core/domain'
import { assetUrl } from '../shared'

const SIGN_MOUNTS: Readonly<Record<Section, string>> = {
  projects: 'fachada-taller',
  about: 'poste-suelo',
  journey: 'placa-mesa',
  contact: 'tablilla-radio',
}

function signStyle(id: Section): string {
  return [
    `--sign-idle:url('${assetUrl(`camp-rooms-v1/signs/${id}-idle.png`)}')`,
    `--sign-hover:url('${assetUrl(`camp-rooms-v1/signs/${id}-hover.png`)}')`,
    `--sign-selected:url('${assetUrl(`camp-rooms-v1/signs/${id}-selected.png`)}')`,
    `--sign-visited:url('${assetUrl(`camp-rooms-v1/signs/${id}-visited.png`)}')`,
  ].join(';')
}

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
  const objects = entries.map(([id, item]) => `<img class="poi poi-${id}" data-poi="${id}" src="${assetUrl(item.sprite)}" alt="" style="z-index:${item.depthY}">`).join('')
  const signs = entries.map(([id, item]) =>
    `<button class="world-label label-${id}" data-section="${id}" data-mount="${SIGN_MOUNTS[id]}" style="${signStyle(id)}"><span class="sign-plate" aria-hidden="true"></span><span class="sign-text">${item.sign}</span></button>`
  ).join('')
  return `<div class="world-scroll"><div class="world" tabindex="0" role="application" aria-label="Campamento interactivo">
    <img class="ground" src="${assetUrl('camp-hillside.webp')}" alt="">
    <canvas class="world-fx-ground" width="1000" height="650" aria-hidden="true"></canvas>${objects}
    <div class="avatar-shadow" aria-hidden="true"></div>
    <img class="avatar" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt="">
    <div class="threshold-stage" style="${thresholdStyle()}" aria-hidden="true" hidden>
      <div class="threshold-fx"></div>
      <img class="threshold-actor" width="160" height="288" src="${assetUrl('camp-rooms-v1/avatars/idle-up.png')}" alt="">
    </div>
    <canvas class="world-fx-props" width="1000" height="650" aria-hidden="true"></canvas>${signs}
    <div class="avatar-occlusion" aria-hidden="true" hidden><img class="avatar avatar-ghost" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt=""></div>
  </div></div><nav class="camp-destinations" aria-label="Lugares del campamento">${entries.map(([id,item]) => `<button data-section="${id}"><span class="destination-dot" aria-hidden="true"></span>${item.sign}</button>`).join('')}</nav>`
}
