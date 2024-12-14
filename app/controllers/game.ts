import { Movement, MovementIds } from './movements'
import { GameCanvas } from './canvas'
import { Keyboard } from './keyboard'
import { Vector } from './vector'
import { DynamicItem, Item, RigidBody } from './item'

const DEFAULT_DELTA_TIME = 15

export class Game {
  keyboard: Keyboard
  canvas?: GameCanvas
  staticItems: Item[]
  dynamicItems: DynamicItem[]
  rigidBodies: RigidBody[]
  gameLoop: () => void
  deltaTime: number

  constructor({showColliders = false, deltaTime = DEFAULT_DELTA_TIME } = {}) {
    this.keyboard = new Keyboard()
    this.canvas = undefined
    this.staticItems = []
    this.dynamicItems = []
    this.rigidBodies = []
    this.gameLoop = () => {}
    this.deltaTime = deltaTime

    const checkCollisionsAndDraw = (item: Item) => {
      this.canvas?.drawItem(item)
      Object.values(item.collisionObservers).forEach(observer => {
        if (observer.checkCollision(item)) observer.onCollision()
        else observer.onNoCollision()
      })
    }

    const drawColliders = (item: Item) => {
      this.canvas?.fillRect({
        position: new Vector({ x: item.collider.x, y: item.collider.y }),
        width: item.collider.width,
        height: item.collider.height,
        color: 'rgba(255, 0, 0, 0.7)'
      })
    }

    setInterval(() => {
      this.gameLoop()

      for (const rigidBody of this.rigidBodies) {
        const netForce = rigidBody.getNetForce()
        const acceleration = netForce.scale(1 / rigidBody.inertia)
        rigidBody.velocity = rigidBody.velocity.add(acceleration)
        const velocityMovement = new Movement({ x: rigidBody.velocity.x, y: rigidBody.velocity.y, id: MovementIds.PHYSICS })
        rigidBody.addMovement(velocityMovement)
      }

      for (const dynamicItem of this.dynamicItems) {
        if (dynamicItem.keyBinding) {
          for (const [key, movement] of Object.entries(dynamicItem.keyBinding(this))) {
            if (this.keyboard.keys[key]) dynamicItem.addMovement(movement)
          }
        }
        dynamicItem.move(dynamicItem.getControllerMovementDirection().scale(this.deltaTime))
        dynamicItem.move(dynamicItem.getPhysicsMovementDirection().scale(this.deltaTime))
        dynamicItem.clearOldMovements()
      }

      if (this.canvas) this.canvas.clear()

      this.staticItems.forEach(staticItem => {
        this.canvas?.drawItem(staticItem)
      })

      this.staticItems.forEach(checkCollisionsAndDraw)
      this.dynamicItems.forEach(checkCollisionsAndDraw)

      if (!showColliders) {
        return
      }
      
      this.staticItems.forEach(drawColliders)
      this.dynamicItems.forEach(drawColliders)
    }, this.deltaTime)
  }

  addStaticItem(staticItem: Item) {
    this.staticItems.push(staticItem)
  }

  addDynamicItem(dynamicItem: DynamicItem) {
    this.dynamicItems.push(dynamicItem)
  }

  addRigidBody(rigidBody: RigidBody) {
    this.rigidBodies.push(rigidBody)
    this.addDynamicItem(rigidBody)
  }

  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = new GameCanvas(canvas)
  }
}
