import type { World } from './types'

export const WORLD: World = {
  width: 1000, height: 650, clearance: 5, cellSize: 8,
  spawn: { x: 510, y: 350 },
  boundary: [
    { x: 75, y: 295 }, { x: 130, y: 270 }, { x: 300, y: 270 },
    { x: 355, y: 290 }, { x: 430, y: 300 }, { x: 470, y: 220 },
    { x: 530, y: 185 }, { x: 720, y: 180 }, { x: 810, y: 205 },
    { x: 820, y: 255 }, { x: 740, y: 290 }, { x: 680, y: 330 },
    { x: 790, y: 340 }, { x: 875, y: 360 }, { x: 885, y: 405 },
    { x: 820, y: 430 }, { x: 700, y: 430 }, { x: 620, y: 450 },
    { x: 550, y: 475 }, { x: 480, y: 495 }, { x: 405, y: 515 },
    { x: 340, y: 490 }, { x: 270, y: 490 }, { x: 240, y: 450 },
    { x: 210, y: 420 }, { x: 165, y: 405 }, { x: 135, y: 365 },
    { x: 85, y: 345 },
  ],
  obstacles: [
    { kind: 'polygon', points: [{ x: 590, y: 200 }, { x: 700, y: 200 }, { x: 700, y: 252 }, { x: 590, y: 252 }] },
    { kind: 'polygon', points: [{ x: 160, y: 265 }, { x: 260, y: 265 }, { x: 260, y: 317 }, { x: 160, y: 317 }] },
    { kind: 'polygon', points: [{ x: 290, y: 410 }, { x: 340, y: 410 }, { x: 340, y: 430 }, { x: 290, y: 430 }] },
    { kind: 'polygon', points: [{ x: 740, y: 345 }, { x: 790, y: 345 }, { x: 790, y: 370 }, { x: 740, y: 370 }] },
  ],
  arrivals: {
    projects: { point: { x: 650, y: 275 }, radius: 12, proximityRadius: 45 },
    about: { point: { x: 220, y: 335 }, radius: 12, proximityRadius: 45 },
    journey: { point: { x: 345, y: 445 }, radius: 12, proximityRadius: 45 },
    contact: { point: { x: 765, y: 390 }, radius: 12, proximityRadius: 45 },
  },
}
