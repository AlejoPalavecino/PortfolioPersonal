import type { Point, Section, World } from './types'
import { findPath } from './path'

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

function edgeDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x, dy = b.y - a.y
  const length = dx * dx + dy * dy
  const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length))
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy })
}

function polygonStatus(point: Point, polygon: readonly Point[]): { inside: boolean; margin: number } {
  let inside = false, margin = Infinity
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i]!, b = polygon[(i + 1) % polygon.length]!
    margin = Math.min(margin, edgeDistance(point, a, b))
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
  }
  return { inside, margin }
}

export function isWalkable(world: World, point: Point): boolean {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false
  const boundary = polygonStatus(point, world.boundary)
  if (!boundary.inside || boundary.margin < world.clearance) return false
  return world.obstacles.every(obstacle => {
    if (obstacle.kind === 'circle') return distance(point, obstacle.center) >= obstacle.radius + world.clearance
    const status = polygonStatus(point, obstacle.points)
    return !status.inside && status.margin >= world.clearance
  })
}

function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

function edgesClose(a: Point, b: Point, c: Point, d: Point, clearance: number): boolean {
  const abC = cross(a, b, c), abD = cross(a, b, d), cdA = cross(c, d, a), cdB = cross(c, d, b)
  const overlaps = Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x)) <= Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) && Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y)) <= Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y))
  if (overlaps && abC * abD <= 0 && cdA * cdB <= 0) return true
  return Math.min(edgeDistance(a, c, d), edgeDistance(b, c, d), edgeDistance(c, a, b), edgeDistance(d, a, b)) < clearance
}

function polygonClear(from: Point, to: Point, polygon: readonly Point[], clearance: number): boolean {
  return polygon.every((point, index) => !edgesClose(from, to, point, polygon[(index + 1) % polygon.length]!, clearance))
}

export function segmentClear(world: World, from: Point, to: Point): boolean {
  return isWalkable(world, from) && isWalkable(world, to)
    && polygonClear(from, to, world.boundary, world.clearance)
    && world.obstacles.every(obstacle => obstacle.kind === 'circle'
      ? edgeDistance(obstacle.center, from, to) >= obstacle.radius + world.clearance
      : polygonClear(from, to, obstacle.points, world.clearance))
}

export function moveSafely(world: World, from: Point, delta: Point): Point {
  if (!isWalkable(world, from)) return from
  const steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.y) / Math.max(0.25, Math.min(world.cellSize / 4, world.clearance / 2))))
  let last = from
  for (let i = 1; i <= steps; i++) {
    const point = { x: from.x + delta.x * i / steps, y: from.y + delta.y * i / steps }
    if (!segmentClear(world, last, point)) break
    last = point
  }
  return last
}

export function nearbySection(world: World, point: Point): Section | null {
  if (!isWalkable(world, point)) return null
  const sections: Section[] = ['projects', 'about', 'journey', 'contact']
  let nearest: Section | null = null, best = Infinity
  for (const section of sections) {
    const arrival = world.arrivals[section], d = distance(point, arrival.point)
    if (d <= arrival.proximityRadius && d < best && findPath(world, point, arrival.point)) { nearest = section; best = d }
  }
  return nearest
}
