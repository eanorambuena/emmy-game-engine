import { load, html } from 'emmy-dom'
import { Game } from '../controllers/game'
import { setup } from '../setup'

export function game({ el }) {
  el.className = 'flex justify-center items-center'
  const width = 800
  const height = 400
  
  const game = new Game()
  setup(game)

  el.useEffect(() => {
    game.initializeCanvas(el.querySelector('#gameCanvas'))
    game.keyboard.bindHandlers()
  }, ['didMount'])

  return () => html`
    <canvas 
      id='gameCanvas'
      width='${width}'
      height='${height}'
      class='border-2 border-black'
    >
    </canvas>
  `
}

load(game, 'Game')
