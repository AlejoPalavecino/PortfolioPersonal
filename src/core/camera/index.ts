export type Point = Readonly<{ x: number; y: number }>
export type Size = Readonly<{ width: number; height: number }>
export type Camera = Readonly<{ x: number; y: number; scale: number }>

function axis(size: number, viewport: number, focus: number, scale: number): number {
  const visible = viewport / scale
  return visible >= size ? (size - visible) / 2 : Math.max(0, Math.min(size - visible, focus - visible / 2))
}

export function createCamera(world: Size, viewport: Size, focus: Point, scale: number): Camera {
  return { x: axis(world.width, viewport.width, focus.x, scale), y: axis(world.height, viewport.height, focus.y, scale), scale }
}

export function worldToScreen(point: Point, camera: Camera): Point {
  return { x: (point.x - camera.x) * camera.scale, y: (point.y - camera.y) * camera.scale }
}

export function screenToWorld(point: Point, camera: Camera): Point {
  return { x: point.x / camera.scale + camera.x, y: point.y / camera.scale + camera.y }
}

export function followCamera(camera: Camera, focus: Point, world: Size, viewport: Size, elapsed: number, options: { locked?: boolean; reducedMotion?: boolean } = {}): Camera {
  if (options.locked || options.reducedMotion || elapsed <= 0) return camera
  const target = createCamera(world, viewport, focus, camera.scale), alpha = 1 - Math.exp(-Math.min(elapsed, 100) / 120)
  return { x: camera.x + (target.x - camera.x) * alpha, y: camera.y + (target.y - camera.y) * alpha, scale: camera.scale }
}
