import { MovementIds } from './movements'
import { Vector, ZERO_VECTOR } from './vector'

const DEFAULT_COLOR = 'green'
const DEFAULT_MOVEMENT_SPEED = 1
const DEFAULT_INERTIA = 100
const DEFAULT_GRAVITY = new Vector({ x: 0, y: 0.01 })

export class Item {
  constructor({ position, width, height, size, texture }) {
    this.position = position
    this.width = size ?? width
    this.height = size ?? height
    this.color = DEFAULT_COLOR
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
  constructor({ position, width, height, size, texture, inertia = DEFAULT_INERTIA, keyBindings }) {
    super({ position, width, height, size, texture })
    this.inertia = inertia
    this.velocity = ZERO_VECTOR
    this.movements = []
    this.keyBindings = keyBindings
    this.movementSpeed = DEFAULT_MOVEMENT_SPEED
  }

  move(movement) {
    this.position = this.position.add(movement)
  }

  addMovement(movement) {
    movement.createdAt = Date.now()
    this.movements.push(movement)
  }

  getMovementSum() {
    return this.movements.reduce((acc, movement) => acc.add(movement), ZERO_VECTOR)
  }

  getControllerMovementDirection() {
    return this.movements
      .filter(movement => movement.id !== MovementIds.PHYSICS)
      .reduce((acc, movement) => acc.add(movement), ZERO_VECTOR)
      .normalize()
      .scale(this.movementSpeed)
  }

  getPhysicsMovementDirection() {
    return this.movements
      .filter(movement => movement.id === MovementIds.PHYSICS)
      .reduce((acc, movement) => acc.add(movement), ZERO_VECTOR)
  }

  clearOldMovements() {
    this.movements = this.movements.filter(movement => Date.now() - movement.createdAt < this.inertia)
  }
}

export class RigidBody extends DynamicItem {
  constructor({ position, width, height, size, texture, step, inertia, keyBindings, mass }) {
    super({ position, width, height, size, texture, step, inertia, keyBindings })
    this.forces = []
    this.gravity = DEFAULT_GRAVITY
  }

  addForce(force) {
    this.forces.push(force)
  }

  getNetForce() {
    return this.forces
      .reduce((acc, force) => acc.add(force), ZERO_VECTOR)
      .add(this.gravity)
  }
}
