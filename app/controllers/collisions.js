class CollisionObserver {
  constructor({ item, isHard = false, onCollision = () => {}, onNoCollision = () => {} }) {
    this.item = item
    this.isHard = isHard
    this.onCollision = onCollision
    this.onNoCollision = onNoCollision
  }

  checkCollision(item) {
    return this.item.x < item.x + item.width &&
      this.item.x + this.item.width > item.x &&
      this.item.y < item.y + item.height &&
      this.item.y + this.item.height > item.y
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

export function createSoftCollision(item1, item2) {
  item1.addCollisionObserver(new CollisionObserver({ item: item2 }))
  item2.addCollisionObserver(new CollisionObserver({ item: item1 }))
}

export function createHardCollision(item1, item2) {
  item1.addCollisionObserver(new CollisionObserver({ item: item2, isHard: true }))
  item2.addCollisionObserver(new CollisionObserver({ item: item1, isHard: true }))
}
