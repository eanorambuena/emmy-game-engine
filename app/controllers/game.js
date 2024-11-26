import { GameCanvas } from './canvas'
import { Keyboard } from './keyboard'

export class Game {
  constructor() {
    this.keyboard = new Keyboard()
    this.canvas = null
    this.dynamicItems = []

    setInterval(() => {
      if (this.canvas) this.canvas.clear()
      for (const dynamicItem of this.dynamicItems) {
        if (dynamicItem.keyBindings) {
          for (const [key, movement] of Object.entries(dynamicItem.keyBindings)) {
            if (this.keyboard.keys[key]) dynamicItem.addMovement(movement)
          }
        }
        dynamicItem.move(dynamicItem.getMovementDirection())
        dynamicItem.clearOldMovements()
        this.canvas.drawItem(dynamicItem)
      }
    }, 10)
  }

  addDynamicItem(dynamicItem) {
    this.dynamicItems.push(dynamicItem)
  }

  initializeCanvas(canvas) {
    this.canvas = new GameCanvas(canvas)
  }
}
