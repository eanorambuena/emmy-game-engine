import { Vector } from './vector'

export const Movements = {
  UP: new Vector({ x: 0, y: -1 }),
  DOWN: new Vector({ x: 0, y: 1 }),
  LEFT: new Vector({ x: -1, y: 0 }),
  RIGHT: new Vector({ x: 1, y: 0 })
}
