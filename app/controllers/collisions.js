class CollisionObserver {
  constructor({ item, isHard = false, onCollision = () => {}, onNoCollision = () => {} }) {
    this.item = item
    this.isHard = isHard
    this.onCollision = onCollision
    this.onNoCollision = onNoCollision
  }

  checkCollision(item) {
    return this.item.collider.x < item.collider.x + item.collider.width &&
      this.item.collider.x + this.item.collider.width > item.collider.x &&
      this.item.collider.y < item.collider.y + item.collider.height &&
      this.item.collider.y + this.item.collider.height > item.collider.y
  }

  OnCollision(action) {
    this.onCollision = action
    return this
  }

  OnNoCollision(action) {
    this.onNoCollision = action
    return this
  }
}

export class Collider {
  constructor({ item, width, height }) {
    this.item = item
    this.width = width ?? item.width
    this.height = height ?? item.height
  }

  get x() {
    return this.item.x + (this.item.width - this.width) / 2
  }

  get y() {
    return this.item.y + (this.item.height - this.height) / 2
  }
}

export function createSoftCollision(item1, item2) {
  item1.addCollisionObserver(new CollisionObserver({ item: item2 }))
  item2.addCollisionObserver(new CollisionObserver({ item: item1 }))
}

export function createHardCollision(item1, item2) {
  item1.addCollisionObserver(new CollisionObserver({ item: item2, isHard: true }))
  item2.addCollisionObserver(new CollisionObserver({ item: item1, isHard: true }))
}
