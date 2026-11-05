import type { Arrival, Point, Section } from './types'

type Destination = {
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
    footprint: [{ x: 525, y: 210 }, { x: 575, y: 180 }, { x: 725, y: 185 }, { x: 772, y: 230 }, { x: 772, y: 290 }, { x: 758, y: 317 }, { x: 535, y: 310 }],
    interaction: [{ x: 520, y: 215 }, { x: 570, y: 170 }, { x: 645, y: 132 }, { x: 745, y: 163 }, { x: 785, y: 215 }, { x: 760, y: 315 }, { x: 528, y: 307 }],
    arrival: { point: { x: 650, y: 345 }, radius: 12, proximityRadius: 45 }, depthY: 317,
    sprite: 'poi-projects.webp', sign: 'Proyectos', occlusion: rect(525, 190, 770, 317),
  },
  about: {
    footprint: [{ x: 125, y: 250 }, { x: 165, y: 200 }, { x: 245, y: 215 }, { x: 295, y: 285 }, { x: 280, y: 317 }, { x: 140, y: 315 }],
    interaction: [{ x: 112, y: 245 }, { x: 165, y: 155 }, { x: 245, y: 170 }, { x: 300, y: 280 }, { x: 285, y: 315 }, { x: 135, y: 315 }],
    arrival: { point: { x: 220, y: 335 }, radius: 12, proximityRadius: 45 }, depthY: 317,
    sprite: 'poi-about.webp', sign: 'Sobre mí', occlusion: rect(125, 245, 295, 317),
  },
  journey: {
    footprint: [{ x: 263, y: 385 }, { x: 345, y: 360 }, { x: 345, y: 325 }, { x: 390, y: 330 }, { x: 395, y: 390 }, { x: 420, y: 425 }, { x: 407, y: 457 }, { x: 375, y: 466 }, { x: 280, y: 444 }],
    interaction: [{ x: 260, y: 405 }, { x: 285, y: 365 }, { x: 346, y: 360 }, { x: 347, y: 325 }, { x: 390, y: 330 }, { x: 390, y: 390 }, { x: 420, y: 425 }, { x: 405, y: 457 }, { x: 280, y: 444 }],
    arrival: { point: { x: 365, y: 477 }, radius: 12, proximityRadius: 45 }, depthY: 466,
    sprite: 'poi-journey.webp', sign: 'Trayectoria', occlusion: rect(270, 360, 420, 466),
  },
  contact: {
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
