import { Movements } from './movements'

export const KeyBindings = {
  ARROWS: (game) => ({
    ArrowRight: Movements.RIGHT,
    ArrowLeft: Movements.LEFT,
    ArrowUp: Movements.UP,
    ArrowDown: Movements.DOWN
  }),
  WASD: (game) => ({
    w: Movements.UP,
    a: Movements.LEFT,
    s: Movements.DOWN,
    d: Movements.RIGHT
  })
}
