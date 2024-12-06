import { RigidBody } from './controllers/item'
import { Vector } from './controllers/vector'
import { KeyBindings } from './controllers/keyBindings'
import { createCollision } from './controllers/collisions'

export function setup(game) {
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
    position: new Vector({ x: 200, y: 200 }),
    size: 50,
    texture: 'https://emojicdn.elk.sh/🌵',
    isActive: false
  })

  game.addRigidBody(player1)
  game.addDynamicItem(player2)
  game.addDynamicItem(cactus)

  createCollision([player1, player2])
  
  player1.collisionObservers[player2].onCollision = () => {
    console.log('COLLISION!')
    cactus.isActive = true
  }

  game.gameLoop = () => {
    
  }
}
