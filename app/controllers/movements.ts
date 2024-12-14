import { Vector } from './vector'

export enum MovementIds {
  UP, DOWN, LEFT, RIGHT, PHYSICS, ZERO
}

export class Movement extends Vector {
  id: MovementIds
  createdAt: number

  constructor({ x, y, id = MovementIds.PHYSICS }) {
    super({ x, y })
    this.id = id
    this.createdAt = Date.now()
  }

  equals(movementOrVector) {
    return this.id === movementOrVector?.id
  }

  normalize() {
    const normalized = super.normalize()
    const movement = new Movement({ x: normalized.x, y: normalized.y })
    movement.id = this.id
    return movement
  }
}

export const Movements = {
  UP: new Movement({ x: 0, y: -1, id: MovementIds.UP }),
  DOWN: new Movement({ x: 0, y: 1, id: MovementIds.DOWN }),
  LEFT: new Movement({ x: -1, y: 0, id: MovementIds.LEFT }),
  RIGHT: new Movement({ x: 1, y: 0, id: MovementIds.RIGHT }),
  ZERO: new Movement({ x: 0, y: 0, id: MovementIds.ZERO })
}
