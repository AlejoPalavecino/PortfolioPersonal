import { DESTINATIONS, WORLD, type Point, type Section } from '../core/domain'
import type { createController } from './controller'
import type { Loop } from './loop'

const points = (polygon: readonly Point[]) => polygon.map(point => `${point.x},${point.y}`).join(' ')
const polygon = (shape: readonly Point[], color: string) =>
  `<polygon points="${points(shape)}" fill="${color}22" stroke="${color}" stroke-width="1.5"/>`

/** Local art calibration. The controller keeps using the checked-in world. */
export function bindSceneCalibration(root: HTMLElement, loop: Loop, controller: ReturnType<typeof createController>) {
  const world = root.querySelector<HTMLElement>('.world')!
  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  overlay.setAttribute('viewBox', `0 0 ${WORLD.width} ${WORLD.height}`)
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:900;pointer-events:none'
  const drafts = structuredClone(DESTINATIONS)
  const panel = document.createElement('details')
  panel.open = true
  panel.style.cssText = 'position:absolute;z-index:1000;right:8px;top:68px;width:min(310px,90vw);max-height:70vh;overflow:auto;background:#102f38;color:#fff4d9;padding:12px;font:13px Lexend,sans-serif;border:1px solid #f6cf87;border-radius:10px'
  panel.innerHTML = `<summary>Calibración · solo desarrollo</summary>
    <p>Rojo: sólido. Verde: interacción. Azul: oclusión. Amarillo: entrada y ruta.</p>
    <p>Los ajustes son una vista previa. Incorporá las coordenadas exportadas al catálogo para probarlas en la navegación.</p>
    <label>Lugar <select>${Object.entries(drafts).map(([id, item]) => `<option value="${id}">${item.sign}</option>`).join('')}</select></label>
    <div class="calibration-inputs"></div><button type="button">Exportar coordenadas</button>
    <textarea aria-label="Catálogo exportado" readonly hidden style="width:100%;height:160px"></textarea>`
  const select = panel.querySelector('select')!
  const fields = panel.querySelector<HTMLElement>('.calibration-inputs')!

  function paint() {
    const obstacles = WORLD.obstacles.flatMap(obstacle => obstacle.kind === 'circle'
      ? [`<circle cx="${obstacle.center.x}" cy="${obstacle.center.y}" r="${obstacle.radius + WORLD.clearance}" fill="#ff6d6d33" stroke="#ff6d6d"/>`] : [])
    const landmarks = Object.entries(drafts).map(([id, item]) => {
      const { point, radius } = item.arrival
      return `${polygon(item.footprint, '#ff6d6d')}${polygon(item.interaction, '#7cef9c')}${polygon(item.occlusion, '#6dbeff')}
        <circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="#ffdb5144" stroke="#ffdb51"/>
        <text x="${point.x + 15}" y="${point.y}" font-size="10" fill="#fff">${id}</text>
        <line x1="0" y1="${item.depthY}" x2="${WORLD.width}" y2="${item.depthY}" stroke="#6dbeff66" stroke-dasharray="3 6"/>`
    })
    overlay.innerHTML = [
      polygon(WORLD.boundary, '#e8f2ff'), ...obstacles, ...landmarks,
      '<polyline class="calibration-route" fill="none" stroke="#ffe456" stroke-width="2" stroke-dasharray="4 4"/>',
      `<circle class="calibration-feet" r="${WORLD.clearance}" fill="#ffdc51"/>`,
    ].join('')
    for (const [id, item] of Object.entries(drafts)) {
      const sign = world.querySelector<HTMLElement>(`.world-label[data-section="${id}"]`)
      if (sign) {
        sign.style.left = `${item.visual.sign.x}px`
        sign.style.top = `${item.visual.sign.y}px`
      }
    }
  }

  function form() {
    const item = drafts[select.value as Section]
    const values = {
      signX: item.visual.sign.x, signY: item.visual.sign.y,
      entryX: item.arrival.point.x, entryY: item.arrival.point.y,
    }
    fields.innerHTML = Object.entries(values).map(([key, value]) =>
      `<label style="display:block;margin:8px 0">${key}
        <input data-field="${key}" type="number" step="1" value="${value}" style="width:90px"></label>`
    ).join('')
  }

  fields.addEventListener('input', event => {
    const input = event.target as HTMLInputElement
    const value = input.valueAsNumber
    if (!Number.isFinite(value)) return
    const item = drafts[select.value as Section]
    switch (input.dataset.field) {
      case 'signX': item.visual.sign.x = value; break
      case 'signY': item.visual.sign.y = value; break
      case 'entryX': item.arrival.point = { ...item.arrival.point, x: value }; break
      case 'entryY': item.arrival.point = { ...item.arrival.point, y: value }; break
    }
    paint()
  })
  select.addEventListener('change', form)
  panel.querySelector('button')!.addEventListener('click', () => {
    const output = panel.querySelector('textarea')!
    output.hidden = false
    output.value = JSON.stringify(drafts, null, 2)
    output.select()
  })
  world.append(overlay)
  root.append(panel)
  paint()
  form()
  loop.add(() => {
    const position = controller.state.position
    overlay.querySelector('.calibration-route')?.setAttribute('points', points([position, ...controller.path]))
    const feet = overlay.querySelector('.calibration-feet')
    feet?.setAttribute('cx', String(position.x))
    feet?.setAttribute('cy', String(position.y))
  }, { intervalMs: 80 })
}
