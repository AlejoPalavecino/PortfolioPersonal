import { DESTINATIONS } from './destinations'
import type { Section, World } from './types'

const sections = Object.keys(DESTINATIONS) as Section[]
export const WORLD: World = {
  width: 1000, height: 650, clearance: 8, cellSize: 8,
  spawn: { x: 510, y: 350 },
  boundary: [
    { x: 75, y: 295 }, { x: 130, y: 270 }, { x: 300, y: 270 },
    { x: 355, y: 290 }, { x: 430, y: 300 }, { x: 470, y: 220 },
    { x: 530, y: 185 }, { x: 720, y: 180 }, { x: 810, y: 205 },
    { x: 820, y: 255 }, { x: 740, y: 290 }, { x: 680, y: 330 },
    { x: 790, y: 340 }, { x: 875, y: 360 }, { x: 885, y: 405 },
    { x: 820, y: 445 }, { x: 700, y: 445 }, { x: 620, y: 450 },
    { x: 550, y: 475 }, { x: 480, y: 495 }, { x: 405, y: 515 },
    { x: 340, y: 490 }, { x: 270, y: 490 }, { x: 240, y: 450 },
    { x: 210, y: 420 }, { x: 165, y: 405 }, { x: 135, y: 365 },
    { x: 85, y: 345 },
  ],
  // Feet are a disk with an 8-unit clearance; decorative alpha is never a collider.
  obstacles: [
    ...sections.map(section => ({ kind: 'polygon' as const, points: DESTINATIONS[section].footprint })),
    { kind: 'circle', center: { x: 250, y: 278 }, radius: 23 }, // Fire ring and logs.
    { kind: 'circle', center: { x: 190, y: 282 }, radius: 12 }, // Front stump.
    { kind: 'circle', center: { x: 300, y: 263 }, radius: 11 }, // Side stump.
    { kind: 'circle', center: { x: 174, y: 338 }, radius: 4 }, // About sign post.
    { kind: 'circle', center: { x: 630, y: 396 }, radius: 18 }, // Rock beside the radio path.
  ],
  arrivals: Object.fromEntries(sections.map(section => [section, DESTINATIONS[section].arrival])) as World['arrivals'],
}
