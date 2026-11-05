import type { Arrival, Point, Section } from './types'

export type Destination = {
  visual: {
    version: string
    x: number; y: number; width: number; height: number
    ground: Point
    sign: { x: number; y: number; width: number; height: number; mount: string }
    threshold: { actor: Point; fx: { x: number; y: number; width: number; height: number } }
  }
  footprint: readonly Point[]
  interaction: readonly Point[]
  arrival: Arrival
  depthY: number
  sprite: string
  sign: string
  occlusion: readonly Point[]
}
const rect = (left: number, top: number, right: number, bottom: number): readonly Point[] => [
  { x: left, y: top }, { x: right, y: top }, { x: right, y: bottom }, { x: left, y: bottom },
]

export const DESTINATIONS: Readonly<Record<Section, Destination>> = {
  projects: {
    visual: {
      version: 'v1', x: 490, y: 117, width: 320, height: 215.111, ground: { x: 650, y: 317 },
      sign: { x: 638, y: 205, width: 99, height: 27, mount: 'fachada-taller' },
      threshold: { actor: { x: 643, y: 336 }, fx: { x: 611, y: 266, width: 64, height: 64 } },
    },
    footprint: [{ x: 525, y: 210 }, { x: 575, y: 180 }, { x: 725, y: 185 }, { x: 772, y: 230 }, { x: 772, y: 290 }, { x: 758, y: 317 }, { x: 535, y: 310 }],
    interaction: [{ x: 520, y: 215 }, { x: 570, y: 170 }, { x: 645, y: 132 }, { x: 745, y: 163 }, { x: 785, y: 215 }, { x: 760, y: 315 }, { x: 528, y: 307 }],
    arrival: { point: { x: 650, y: 345 }, radius: 12, proximityRadius: 45 }, depthY: 317,
    sprite: 'poi-projects.webp', sign: 'Proyectos', occlusion: rect(525, 190, 770, 317),
  },
  about: {
    visual: {
      version: 'v1', x: 100, y: 110.5, width: 220, height: 224.818, ground: { x: 220, y: 317 },
      sign: { x: 172, y: 326, width: 94, height: 30, mount: 'poste-suelo' },
      threshold: { actor: { x: 220, y: 332 }, fx: { x: 176, y: 238, width: 96, height: 84 } },
    },
    footprint: [{ x: 125, y: 250 }, { x: 165, y: 200 }, { x: 245, y: 215 }, { x: 295, y: 285 }, { x: 280, y: 317 }, { x: 140, y: 315 }],
    interaction: [{ x: 112, y: 245 }, { x: 165, y: 155 }, { x: 245, y: 170 }, { x: 300, y: 280 }, { x: 285, y: 315 }, { x: 135, y: 315 }],
    arrival: { point: { x: 220, y: 335 }, radius: 12, proximityRadius: 45 }, depthY: 317,
    sprite: 'poi-about.webp', sign: 'Sobre mí', occlusion: rect(125, 245, 295, 317),
  },
  journey: {
    visual: {
      version: 'v1', x: 250, y: 299, width: 190, height: 182.192, ground: { x: 365, y: 466 },
      sign: { x: 334, y: 449, width: 100, height: 29, mount: 'placa-mesa' },
      threshold: { actor: { x: 365, y: 477 }, fx: { x: 312, y: 356, width: 96, height: 72 } },
    },
    footprint: [{ x: 263, y: 385 }, { x: 345, y: 360 }, { x: 345, y: 325 }, { x: 390, y: 330 }, { x: 395, y: 390 }, { x: 420, y: 425 }, { x: 407, y: 457 }, { x: 375, y: 466 }, { x: 280, y: 444 }],
    interaction: [{ x: 260, y: 405 }, { x: 285, y: 365 }, { x: 346, y: 360 }, { x: 347, y: 325 }, { x: 390, y: 330 }, { x: 390, y: 390 }, { x: 420, y: 425 }, { x: 405, y: 457 }, { x: 280, y: 444 }],
    arrival: { point: { x: 365, y: 477 }, radius: 12, proximityRadius: 45 }, depthY: 466,
    sprite: 'poi-journey.webp', sign: 'Trayectoria', occlusion: rect(270, 360, 420, 466),
  },
  contact: {
    visual: {
      version: 'v1', x: 660, y: 234, width: 200, height: 198.23, ground: { x: 755, y: 420 },
      sign: { x: 766, y: 308, width: 87, height: 27, mount: 'tablilla-radio' },
      threshold: { actor: { x: 680, y: 405 }, fx: { x: 736, y: 312, width: 64, height: 32 } },
    },
    footprint: [{ x: 690, y: 315 }, { x: 750, y: 290 }, { x: 812, y: 325 }, { x: 812, y: 357 }, { x: 844, y: 380 }, { x: 835, y: 405 }, { x: 755, y: 420 }, { x: 690, y: 402 }],
    interaction: [{ x: 690, y: 288 }, { x: 725, y: 275 }, { x: 810, y: 300 }, { x: 840, y: 325 }, { x: 835, y: 405 }, { x: 755, y: 420 }, { x: 690, y: 402 }],
    arrival: { point: { x: 680, y: 405 }, radius: 12, proximityRadius: 45 }, depthY: 420,
    sprite: 'poi-contact.webp', sign: 'Contacto', occlusion: rect(690, 310, 840, 420),
  },
}

function contains(point: Point, polygon: readonly Point[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!, b = polygon[j]!
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}

export function hitDestination(point: Point): Section | null {
  return (Object.keys(DESTINATIONS) as Section[]).find(section => contains(point, DESTINATIONS[section].interaction)) ?? null
}

export function occludingDestination(point: Point): Section | null {
  return (Object.keys(DESTINATIONS) as Section[])
    .filter(section => point.y < DESTINATIONS[section].depthY && contains(point, DESTINATIONS[section].occlusion))
    .sort((a, b) => DESTINATIONS[b].depthY - DESTINATIONS[a].depthY)[0] ?? null
}

export function isOccluded(point: Point): boolean {
  return occludingDestination(point) !== null
}
