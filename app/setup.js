import { DynamicItem, Item, RigidBody } from './controllers/item'
import { Vector, ZERO_VECTOR } from './controllers/vector'
import { KeyBindings } from './controllers/keyBindings'
import { createHardCollision } from './controllers/collisions'
import { Movement, Movements } from './controllers/movements'

export function setup(game) {
  const floor = new Item({
    position: new Vector({ x: 0, y: 350 }),
    width: 800,
    height: 50
  })
  const player1 = new RigidBody({
    position: new Vector({ x: 50, y: 50 }),
    size: 50,
    keyBindings: KeyBindings.ARROWS,
    texture: 'https://emojicdn.elk.sh/🚀'
  })
  const player2 = new RigidBody({
    position: new Vector({ x: 300, y: 300 }),
    size: 50,
    movementSpeed: new Vector({ x: 0.5, y: 2 }),
    gravity: new Vector({ x: 0, y: 0.0001 }),
    keyBindings: KeyBindings.WASD,
    texture: 'https://emojicdn.elk.sh/👾'
  })

  game.addStaticItem(floor)
  game.addRigidBody(player1)
  game.addRigidBody(player2)

  createHardCollision(player1, floor)
  createHardCollision(player2, floor)
  createHardCollision(player1, player2)

  floor
    .OnCollision(player1, () => {
      player1.velocity = ZERO_VECTOR
    })
    .OnCollision(player2, () => {
      player2.velocity = ZERO_VECTOR
    })

  let cactusSpeed = 0.01

  const resetGame = () => {
    cactusList.forEach(cactus => cactus.remove())
    window.location.reload()
  }

  const cactusList = []
  for (let i = 0; i < 5; i++) {
    const cactus = new DynamicItem({
      position: new Vector({ x: 800 + i * (150 + 100 * Math.random()), y: 300 }),
      size: 50,
      texture: 'https://emojicdn.elk.sh/🌵'
    })
    game.addDynamicItem(cactus)
    cactusList.push(cactus)

    createHardCollision(cactus, player2)

    cactus
      .OnCollision(player2, () => {
        game.canvas.fillText('Player 👾 lost!', 30, 30)
        resetGame()
      })
  }

  game.gameLoop = () => {
    if (player2.y >= 299) {
      player2.keyBindings = KeyBindings.WASD
    }
    else {
      player2.keyBindings = (game) => ({
        w: ZERO_VECTOR,
        a: Movements.LEFT,
        s: Movements.DOWN,
        d: Movements.RIGHT
      })
    }

    cactusList.forEach(cactus => {
      cactus.addMovement(new Movement({ x: -0.01, y: 0 }))

      if (cactus.x < 0) {
        cactus.position = new Vector({ x: 800, y: 300 })
      }
    })

    cactusSpeed += 0.001
  }
}
