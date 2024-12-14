import { Collider, CollisionObserver, OnEventCallback } from './collisions'
import { Movement, MovementIds } from './movements'
import { Vector, ZERO_VECTOR } from './vector'
import { KeyBinding } from './keyBindings'

const DEFAULT_COLOR = 'green'
const DEFAULT_MOVEMENT_SPEED = new Vector({ x: 1, y: 1 })
const DEFAULT_INERTIA = 100
const DEFAULT_GRAVITY = new Vector({ x: 0, y: 0.098 })

type TextureParams = {
  color?: string
  texture?: string
}

type SizeParams = {
  width: number
  height: number
  size?: number
} | {
  width?: number
  height?: number
  size: number
}

type ItemParams = TextureParams & SizeParams & {
  position: Vector
  isActive?: boolean
}

export class Item {
  position: Vector
  width: number
  height: number
  color: string
  texture?: string
  collisionObservers: CollisionObserver[]
  isActive: boolean
  collider: Collider

  constructor({ position, texture, color = DEFAULT_COLOR, isActive = true, ...sizeParameters }: ItemParams) {
    if (!sizeParameters.size && !(sizeParameters.width && sizeParameters.height)) {
      throw new Error('You must provide either a size or a width and a height')
    }

    this.position = position
    this.width = (sizeParameters.size ?? sizeParameters.width) as number
    this.height = (sizeParameters.size ?? sizeParameters.height) as number
    this.color = color
    this.texture = texture
    this.collisionObservers = []
    this.isActive = isActive
    this.collider = new Collider({ item: this })
  }

  get x() {
    return this.position.x
  }

  get y() {
    return this.position.y
  }

  addCollisionObserver(observer: CollisionObserver) {
    this.collisionObservers.push(observer)
  }

  getCollisionObserverWithItem(item: Item) {
    return this.collisionObservers.find(observer => observer.item === item)
  }

  OnCollision(item: Item, action: OnEventCallback) {
    const observer = this.getCollisionObserverWithItem(item)
    if (observer) {
      observer.onCollision = action
    }
    return this
  }

  OnNoCollision(item: Item, action: OnEventCallback) {
    const observer = this.getCollisionObserverWithItem(item)
    if (observer) {
      observer.onNoCollision = action
    }
    return this
  }
}

type DynamicItemParams = ItemParams & {
  inertia?: number
  movementSpeed?: Vector
  keyBinding?: KeyBinding
}


export class DynamicItem extends Item {
  inertia: number
  velocity: Vector
  movements: Movement[]
  keyBinding?: KeyBinding
  movementSpeed: Vector
  normalizeMovementSpeed: boolean

  constructor({ keyBinding, inertia = DEFAULT_INERTIA, movementSpeed = DEFAULT_MOVEMENT_SPEED, ...rest } : DynamicItemParams) {
    super(rest)
    this.inertia = inertia
    this.velocity = ZERO_VECTOR
    this.movements = []
    this.keyBinding = keyBinding
    this.movementSpeed = movementSpeed
    this.normalizeMovementSpeed = true
  }

  move(movement: Vector) {
    const nextPosition = this.position.add(movement)
 
    const itemInNextPosition = new Item({ position: nextPosition, width: this.width, height: this.height })

    const willCollide = Object.values(this.collisionObservers).some(collisionObserver => {
      const willCollideWithThatItem = collisionObserver.isHard && collisionObserver.checkCollision(itemInNextPosition)
      const reciprocalCollisionObserver = collisionObserver.item.getCollisionObserverWithItem(this)
      if (willCollideWithThatItem) {
        collisionObserver.onCollision()
        reciprocalCollisionObserver?.onCollision()
      }
      else {
        collisionObserver.onNoCollision()
        reciprocalCollisionObserver?.onNoCollision()
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
    let computedMovements = this.movements
      .filter(movement => movement.id !== MovementIds.PHYSICS)
      .reduce((acc, movement) => acc.add(movement), ZERO_VECTOR)
    
    if (this.normalizeMovementSpeed) {
      computedMovements = computedMovements.normalize()
    }
    return computedMovements.kroneckerProduct(this.movementSpeed)
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


type RigidBodyParams = DynamicItemParams & {
  forces?: Vector[]
  gravity?: Vector
}

export class RigidBody extends DynamicItem {
  forces: Vector[]
  gravity: Vector

  constructor({ forces = [], gravity = DEFAULT_GRAVITY, ...dynamicItemParams }: RigidBodyParams) {
    super(dynamicItemParams)
    this.forces = forces
    this.gravity = gravity
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
