import { load, html } from 'emmy-dom'
import { DynamicItem } from '../controllers/item'
import { Game } from '../controllers/game'
import { Vector } from '../controllers/vector'
import { KeyBindings } from '../controllers/keyBindings'

export function game({ el }) {
  el.className = 'flex justify-center items-center'
  
  const game = new Game()
  const player1 = new DynamicItem({
    position: new Vector({ x: 50, y: 50 }),
    size: 50,
    keyBindings: KeyBindings.ARROWS,
    texture: 'https://emojicdn.elk.sh/🚀'
  })
  const player2 = new DynamicItem({
    position: new Vector({ x: 100, y: 100 }),
    size: 50,
    keyBindings: KeyBindings.WASD,
    texture: 'https://emojicdn.elk.sh/👾'
  })
  game.addDynamicItem(player1)
  game.addDynamicItem(player2)

  el.useEffect(() => {
    game.initializeCanvas(el.querySelector('#gameCanvas'))
    game.keyboard.bindHandlers()
  }, ['didMount'])

  return () => html`
    <canvas 
      id='gameCanvas'
      width='800'
      height='400'
      class='border-2 border-black'
    >
    </canvas>
  `
}

load(game, 'Game')
