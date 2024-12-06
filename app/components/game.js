import { load, html } from 'emmy-dom'
import { Game } from '../controllers/game'
import { setup } from '../setup'

export function game({ el }) {
  el.className = 'flex justify-center items-center'
  
  const game = new Game()
  setup(game)

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
