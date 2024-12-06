import { RigidBody } from './controllers/item'
import { Vector } from './controllers/vector'
import { KeyBindings } from './controllers/keyBindings'

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

  game.addRigidBody(player1)
  game.addDynamicItem(player2)

  game.gameLoop = () => {
    //player1.addMovement(new Vector({ x: game.deltaTime, y: game.deltaTime * .5 }))
  }
}
