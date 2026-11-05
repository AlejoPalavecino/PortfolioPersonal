import { describe, expect, it } from 'vitest'
import { WORLD, DESTINATIONS, findPath, isWalkable, moveSafely } from '../src/core/domain'
import { segmentClear } from '../src/core/domain/geometry'

const sections = ['projects','about','journey','contact'] as const

describe('calibrated camp solids', () => {
  it.each([
    ['workshop wall', {x:600,y:240}], ['tent canvas', {x:180,y:285}],
    ['chair back', {x:365,y:350}], ['desk surface', {x:330,y:390}],
    ['radio interior', {x:750,y:340}], ['fire', {x:250,y:278}],
    ['front stump', {x:190,y:282}], ['side stump', {x:300,y:263}],
    ['path rock', {x:630,y:396}],
  ])('blocks %s', (_name, point) => { expect(isWalkable(WORLD,point)).toBe(false) })
  it.each(sections)('keeps %s reachable from every other entrance', section => {
    const to = DESTINATIONS[section].arrival.point
    for (const from of [WORLD.spawn,...sections.map(id=>DESTINATIONS[id].arrival.point)]) {
      const path = findPath(WORLD,from,to)
      expect(path).not.toBeNull()
      for(let i=1;i<path!.length;i++) expect(segmentClear(WORLD,path![i-1]!,path![i]!)).toBe(true)
    }
  })
  it('does not strand walkable pockets around the landmarks', () => {
    for(let x=120;x<=880;x+=80) for(let y=240;y<=480;y+=80) {
      const point = {x,y}
      if(isWalkable(WORLD,point)) expect(findPath(WORLD,WORLD.spawn,point), JSON.stringify(point)).not.toBeNull()
    }
  })
  it('cannot tunnel through solids with a large displacement', () => {
    for (const from of [WORLD.spawn,...sections.map(id=>DESTINATIONS[id].arrival.point)]) {
      for(const delta of [{x:800,y:0},{x:-800,y:0},{x:0,y:-600},{x:300,y:400}]) {
        const end = moveSafely(WORLD,from,delta)
        expect(isWalkable(WORLD,end)).toBe(true)
      }
    }
  })
})
