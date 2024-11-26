import { load, html } from 'emmy-dom'
import './components/game'

export function app({ el }) {
  el.className = 'flex flex-col justify-center items-center space-y-3 text-center w-full h-full text-white'

  return html`
    <h1 class='text-3xl font-bold'>Game built using Emmy.js</h1>
    <p>Use ARROWS to move player 1 and WASD to move player 2</p>
    <Game />
  `
}

export const App = load(app, 'App')
