import { Movement, MovementIds } from './movements'
import { GameCanvas } from './canvas'
import { Keyboard } from './keyboard'

const DEFAULT_DELTA_TIME = 10

export class Game {
  constructor() {
    this.keyboard = new Keyboard()
    this.canvas = null
    this.staticItems = []
    this.dynamicItems = []
    this.rigidBodies = []
    this.gameLoop = () => {}
    this.deltaTime = DEFAULT_DELTA_TIME

    setInterval(() => {
      if (this.canvas) this.canvas.clear()
      this.gameLoop()

      this.staticItems.forEach(staticItem => {
        this.canvas?.drawItem(staticItem)
      })

      for (const rigidBody of this.rigidBodies) {
        const netForce = rigidBody.getNetForce()
        const acceleration = netForce.scale(1 / rigidBody.inertia)
        rigidBody.velocity = rigidBody.velocity.add(acceleration)
        const velocityMovement = new Movement({ x: rigidBody.velocity.x, y: rigidBody.velocity.y, id: MovementIds.PHYSICS })
        rigidBody.addMovement(velocityMovement)
      }

      for (const dynamicItem of this.dynamicItems) {
        if (dynamicItem.keyBindings) {
          for (const [key, movement] of Object.entries(dynamicItem.keyBindings)) {
            if (this.keyboard.keys[key]) dynamicItem.addMovement(movement)
          }
        }
        dynamicItem.move(dynamicItem.getControllerMovementDirection().scale(this.deltaTime))
        dynamicItem.move(dynamicItem.getPhysicsMovementDirection().scale(this.deltaTime))
        dynamicItem.clearOldMovements()
      }

      this.staticItems.forEach(staticItem => {
        Object.values(staticItem.collisionObservers).forEach(observer => {
          if (observer.checkCollision(staticItem)) observer.onCollision()
        })
        this.canvas?.drawItem(staticItem)
      })

      this.dynamicItems.forEach(dynamicItem => {
        Object.values(dynamicItem.collisionObservers).forEach(observer => {
          if (observer.checkCollision(dynamicItem)) observer.onCollision()
        })
        this.canvas?.drawItem(dynamicItem)
      })


    }, this.deltaTime)
  }

  addStaticItem(staticItem) {
    this.staticItems.push(staticItem)
  }

  addDynamicItem(dynamicItem) {
    this.dynamicItems.push(dynamicItem)
  }

  addRigidBody(rigidBody) {
    this.rigidBodies.push(rigidBody)
    this.addDynamicItem(rigidBody)
  }

  initializeCanvas(canvas) {
    this.canvas = new GameCanvas(canvas)
  }
}
