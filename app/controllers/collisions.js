class CollisionObserver {
  constructor({ item, isHard = false, onCollision = () => {}, onNoCollision = () => {} }) {
    this.item = item
    this.isHard = isHard
    this.onCollision = onCollision
    this.onNoCollision = onNoCollision
  }

  checkCollision(item) {
    // Padding is used to make the collision detection less strict, I don't know why its too strict without it or why the padding is 3
    const PADDING = 3

    const paddedOwnItemCollider = {
      x: this.item.collider.x + PADDING,
      y: this.item.collider.y + PADDING,
      width: this.item.collider.width - PADDING * 2,
      height: this.item.collider.height - PADDING * 2
    }
    const paddedOtherItemCollider = {
      x: item.collider.x + PADDING,
      y: item.collider.y + PADDING,
      width: item.collider.width - PADDING * 2,
      height: item.collider.height - PADDING * 2
    }
    return paddedOwnItemCollider.x < paddedOtherItemCollider.x + paddedOtherItemCollider.width &&
      paddedOwnItemCollider.x + (paddedOwnItemCollider.width - PADDING) > paddedOtherItemCollider.x &&
      paddedOwnItemCollider.y < paddedOtherItemCollider.y + paddedOtherItemCollider.height &&
      paddedOwnItemCollider.y + paddedOwnItemCollider.height > paddedOtherItemCollider.y
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
  #item
  constructor({ item, width, height }) {
    this.#item = item
    this.width = width ?? item.width
    this.height = height ?? item.height
  }

  get x() {
    return this.#item.x + (this.#item.width - this.width) / 2
  }

  get y() {
    return this.#item.y + (this.#item.height - this.height) / 2
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
