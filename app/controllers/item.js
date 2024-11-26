import { Vector } from './vector'

export class Item {
  constructor({ position, width, height, size, texture }) {
    this.position = position
    this.width = size ?? width
    this.height = size ?? height
    this.color = 'green'
    this.texture = texture
  }

  get x() {
    return this.position.x
  }

  get y() {
    return this.position.y
  }
}


export class DynamicItem extends Item {
  constructor({ position, width, height, size, texture, step = 1, inertia = 100, keyBindings }) {
    super({ position, width, height, size, texture })
    this.step = step
    this.inertia = inertia
    this.movements = []
    this.keyBindings = keyBindings
  }

  move(movement, amount = this.step) {
    this.position = this.position.add(movement.scale(amount))
  }

  addMovement(movement) {
    movement.createdAt = Date.now()
    this.movements.push(movement)
  }

  getMovementSum() {
    return this.movements.reduce((acc, movement) => acc.add(movement), new Vector({ x: 0, y: 0 }))
  }

  getMovementDirection() {
    return this.getMovementSum().normalize()
  }

  clearOldMovements() {
    this.movements = this.movements.filter(movement => Date.now() - movement.createdAt < this.inertia)
  }
}
