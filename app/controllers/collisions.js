class CollisionObserver {
  constructor({ item, onCollision = () => {} }) {
    this.item = item
    this.onCollision = onCollision
  }
}

export function createCollision(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      items[i].addCollisionObserver(new CollisionObserver({ item: items[j] }))
      items[j].addCollisionObserver(new CollisionObserver({ item: items[i] }))
    }
  }
}

