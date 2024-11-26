export class Keyboard {
  constructor() {
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      a: false,
      s: false,
      d: false
    }
  }

  handleKeyDown(event) {
    if (event.key in this.keys) {
      this.keys[event.key] = true
      event.preventDefault()
    }
  }

  handleKeyUp(event) {
    if (event.key in this.keys) {
      this.keys[event.key] = false
      event.preventDefault()
    }
  }

  bindHandlers() {
    window.addEventListener('keydown', (event) => {
      this.handleKeyDown(event)
    })
    window.addEventListener('keyup', (event) => {
      this.handleKeyUp(event)
    })
  }
}
