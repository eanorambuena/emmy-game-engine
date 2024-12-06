class CollisionObserver {
  constructor({ item, isHard = false, onCollision = () => {} }) {
    this.item = item
    this.isHard = isHard
    this.onCollision = onCollision
  }

  checkCollision(item) {
    return this.item.x < item.x + item.width &&
      this.item.x + this.item.width > item.x &&
      this.item.y < item.y + item.height &&
      this.item.y + this.item.height > item.y
  }
}

export function createSoftCollision(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      items[i].addCollisionObserver(new CollisionObserver({ item: items[j] }))
      items[j].addCollisionObserver(new CollisionObserver({ item: items[i] }))
    }
  }
}

export function createHardCollision(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      items[i].addCollisionObserver(new CollisionObserver({ item: items[j], isHard: true }))
      items[j].addCollisionObserver(new CollisionObserver({ item: items[i], isHard: true }))
    }
  }
}

