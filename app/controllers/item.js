import { MovementIds } from './movements'
import { Vector, ZERO_VECTOR } from './vector'

const DEFAULT_COLOR = 'green'
const DEFAULT_MOVEMENT_SPEED = 1
const DEFAULT_INERTIA = 100
const DEFAULT_GRAVITY = new Vector({ x: 0, y: 0.01 })

export class Item {
  constructor({ position, width, height, size, texture, color = DEFAULT_COLOR, isActive = true }) {
    this.position = position
    this.width = size ?? width
    this.height = size ?? height
    this.color = color
    this.texture = texture
    this.collisionObservers = []
    this.isActive = isActive
  }

  get x() {
    return this.position.x
  }

  get y() {
    return this.position.y
  }

  checkCollision(item) {
    return this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
  }

  addCollisionObserver(observer) {
    this.collisionObservers.push(observer)
  }

  getCollisionObserverWithItem(item) {
    return this.collisionObservers.find(observer => observer.item === item)
  }
}


export class DynamicItem extends Item {
  constructor({ position, width, height, size, texture, color, keyBindings, isActive, inertia = DEFAULT_INERTIA }) {
    super({ position, width, height, size, texture, color, isActive })
    this.inertia = inertia
    this.velocity = ZERO_VECTOR
    this.movements = []
    this.keyBindings = keyBindings
    this.movementSpeed = DEFAULT_MOVEMENT_SPEED
  }

  move(movement) {
    const nextPosition = this.position.add(movement)
 
    const itemInNextPosition = new Item({ position: nextPosition, width: this.width, height: this.height })

    const willCollide = Object.values(this.collisionObservers).some(collisionObserver => {
      const willCollideWithThatItem = collisionObserver.isHard && collisionObserver.checkCollision(itemInNextPosition)
      if (willCollideWithThatItem) {
        collisionObserver.onCollision()
        collisionObserver.item.getCollisionObserverWithItem(this).onCollision()
      }
      return willCollideWithThatItem
    })
      
    if (!willCollide) {
      this.position = nextPosition
    }
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
  constructor({ position, width, height, size, texture, color, inertia, keyBindings, isActive }) {
    super({ position, width, height, size, texture, color, inertia, keyBindings, isActive })
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
