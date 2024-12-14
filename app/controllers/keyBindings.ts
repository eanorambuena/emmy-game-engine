import { Key } from './keyboard'
import { Movement, Movements } from './movements'

export type KeyBinding = (game: any) => Partial<Record<Key, Movement>>

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
