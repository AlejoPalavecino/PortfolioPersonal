// Keep the loader and the painted scene on the same files, including after rotation.
const compact = typeof matchMedia === 'function'
  && matchMedia('(max-width: 700px), (pointer: coarse) and (max-height: 600px)').matches
const directory = compact ? 'compact/' : ''

export const CAMP_SCENERY = {
  ground: directory + 'camp-hillside.webp',
  backdrop: directory + 'world-backdrop.webp',
}
