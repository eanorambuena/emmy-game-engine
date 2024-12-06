import { Vector } from './vector'

export class Movement extends Vector {
  constructor({ x, y, id }) {
    super({ x, y })
    this.id = id
    this.createdAt = Date.now()
  }

  equals(movementOrVector) {
    return this.id === movementOrVector?.id
  }

  normalize() {
    const normalized = super.normalize()
    normalized.id = this.id
    return normalized
  }
}

export const MovementIds = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  PHYSICS: 'PHYSICS'
}

export const Movements = {
  UP: new Movement({ x: 0, y: -1, id: MovementIds.UP }),
  DOWN: new Movement({ x: 0, y: 1, id: MovementIds.DOWN }),
  LEFT: new Movement({ x: -1, y: 0, id: MovementIds.LEFT }),
  RIGHT: new Movement({ x: 1, y: 0, id: MovementIds.RIGHT }),
}
