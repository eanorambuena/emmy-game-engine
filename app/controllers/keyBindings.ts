import { Game } from './game'
import { Key } from './keyboard'
import { Movement, Movements } from './movements'

export type KeyBinding = (game: Game) => Partial<Record<Key, Movement>>

export const KeyBindings = {
  ARROWS: (game: Game) => ({
    ArrowRight: Movements.RIGHT,
    ArrowLeft: Movements.LEFT,
    ArrowUp: Movements.UP,
    ArrowDown: Movements.DOWN
  }),
  WASD: (game: Game) => ({
    w: Movements.UP,
    a: Movements.LEFT,
    s: Movements.DOWN,
    d: Movements.RIGHT
  })
} as const
