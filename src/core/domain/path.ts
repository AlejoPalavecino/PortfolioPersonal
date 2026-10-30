import { isWalkable, segmentClear } from './geometry'
import type { Point, World } from './types'

type Node = { point: Point; cost: number; score: number; parent: string | null }
const key = (x: number, y: number) => `${x},${y}`
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

function initialNodes(world: World, from: Point, to: Point): Map<string, Node> {
  const nodes = new Map<string, Node>(), size = world.cellSize
  const cx = Math.round(from.x / size), cy = Math.round(from.y / size)
  for (let x = cx - 2; x <= cx + 2; x++) for (let y = cy - 2; y <= cy + 2; y++) {
    const point = { x: x * size, y: y * size }
    if (segmentClear(world, from, point)) {
      const cost = dist(from, point)
      nodes.set(key(x, y), { point, cost, score: cost + dist(point, to), parent: null })
    }
  }
  return nodes
}

function reconstruct(nodes: Map<string, Node>, end: string, from: Point, to: Point): Point[] {
  const path = [to], seen = new Set<string>()
  let current: string | null = end
  while (current !== null && !seen.has(current)) {
    seen.add(current)
    const node: Node = nodes.get(current)!
    path.push(node.point)
    current = node.parent
  }
  path.push(from)
  return path.reverse().filter((point, i, all) => i === 0 || dist(point, all[i - 1]!) > 0)
}

function expand(world: World, node: Node, nodeKey: string, to: Point, nodes: Map<string, Node>, open: Set<string>, closed: Set<string>): void {
  const size = world.cellSize, x = Math.round(node.point.x / size), y = Math.round(node.point.y / size)
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    if (dx === 0 && dy === 0) continue
    const id = key(x + dx, y + dy), point = { x: (x + dx) * size, y: (y + dy) * size }
    if (closed.has(id) || !segmentClear(world, node.point, point)) continue
    const cost = node.cost + dist(node.point, point), old = nodes.get(id)
    if (!old || cost < old.cost) {
      nodes.set(id, { point, cost, score: cost + dist(point, to), parent: nodeKey })
      open.add(id)
    }
  }
}

export function findPath(world: World, from: Point, to: Point): Point[] | null {
  if (!isWalkable(world, from) || !isWalkable(world, to) || world.cellSize <= 0) return null
  if (dist(from, to) === 0) return [from]
  if (segmentClear(world, from, to)) return [from, to]
  const nodes = initialNodes(world, from, to), open = new Set(nodes.keys()), closed = new Set<string>()
  while (open.size) {
    let best: string | null = null
    for (const id of open) if (best === null || nodes.get(id)!.score < nodes.get(best)!.score) best = id
    const id = best!, node = nodes.get(id)!
    open.delete(id)
    closed.add(id)
    if (dist(node.point, to) <= world.cellSize * 2 && segmentClear(world, node.point, to)) return reconstruct(nodes, id, from, to)
    expand(world, node, id, to, nodes, open, closed)
  }
  return null
}
