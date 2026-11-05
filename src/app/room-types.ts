import type { CueBus } from '../core/fx/cues'
import type { CaseId, Section } from '../entities'
import type { RoomLoader } from '../shared'

export type View =
  | { kind: 'camp' }
  | { kind: 'section'; section: Section }
  | { kind: 'case'; id: CaseId }
  | { kind: 'recognitions' }
  | { kind: 'credential'; id: string }

export type ViewOptions = {
  onView?: (view: View) => void
  onCamp?: () => void
  bus?: CueBus
  roomLoader?: RoomLoader
}

export type Reading = {
  scroll: number
  focus: number
  selector: string | null
  objects?: Record<string, string | undefined>
}

export type RoomContext = {
  root: HTMLElement
  panel: HTMLElement
  current: View
  reading: Map<string, Reading>
  origin: HTMLElement | null
  restoring: boolean
  options: ViewOptions
  transition: number
  closeTimer?: number
  entryTimer?: number
  curtainTimer?: number
  poseTimer?: number
  roomLoader: RoomLoader
  pendingSpatialSection: Section | null
  mountedRoom: Section | null
  offLoader?: () => void
}
