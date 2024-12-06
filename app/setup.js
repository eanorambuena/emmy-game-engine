import { Item, RigidBody } from './controllers/item'
import { Vector, ZERO_VECTOR } from './controllers/vector'
import { KeyBindings } from './controllers/keyBindings'
import { createHardCollision } from './controllers/collisions'

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
    position: new Vector({ x: 100, y: 100 }),
    size: 50,
    keyBindings: KeyBindings.WASD,
    texture: 'https://emojicdn.elk.sh/👾'
  })
  const cactus = new RigidBody({
    position: new Vector({ x: 200, y: 300 }),
    size: 50,
    texture: 'https://emojicdn.elk.sh/🌵',
    isActive: false
  })

  game.addStaticItem(floor)
  game.addRigidBody(player1)
  game.addDynamicItem(player2)
  game.addDynamicItem(cactus)

  createHardCollision([player1, player2, floor, cactus])

  player1.getCollisionObserverWithItem(player2).onCollision = () => {
    console.log('COLLISION!')
    player1.movements = []
    player1.velocity = ZERO_VECTOR
    cactus.isActive = true
  }

  game.gameLoop = () => {
    
  }
}
