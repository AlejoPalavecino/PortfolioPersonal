export type Point = Readonly<{ x: number; y: number }>
export type Section = 'projects' | 'about' | 'journey' | 'contact'
export type SectionId = Section
export type ProjectId = 'foxmind' | 'flower'
export type SceneStatus = 'loading' | 'ready' | 'failed'
export type View = { kind: 'camp' } | { kind: 'section'; section: Section } | { kind: 'project'; project: ProjectId }
export type Target = { kind: 'section'; section: Section } | { kind: 'ground'; point: Point }
export type Route = { id: number; target: Target; origin: View; status: 'active' | 'paused' }
export type Navigation = { position: Point; view: View; route: Route | null; visited: readonly Section[]; scene: SceneStatus; reducedMotion: boolean; revision: number }
export type NavigationState = Navigation
export type NavigationEvent =
  | { type: 'set-scene'; scene: Navigation['scene'] }
  | { type: 'set-motion'; reduced: boolean }
  | { type: 'select-section'; section: Section; arrived?: boolean }
  | { type: 'select-ground'; point: Point }
  | { type: 'move'; position: Point }
  | { type: 'arrive'; id: number; position: Point }
  | { type: 'route-failed'; id: number }
  | { type: 'pause' | 'resume' | 'cancel' | 'open-now' | 'manual' | 'back-projects' | 'camp' }
  | { type: 'open-project'; project: ProjectId }
  | { type: 'restore'; view: View }
export type Arrival = { point: Point; radius: number; proximityRadius: number }
export type Obstacle = { kind: 'polygon'; points: readonly Point[] } | { kind: 'circle'; center: Point; radius: number }
export type World = { width: number; height: number; spawn: Point; clearance: number; cellSize: number; boundary: readonly Point[]; obstacles: readonly Obstacle[]; arrivals: Readonly<Record<Section, Arrival>> }
