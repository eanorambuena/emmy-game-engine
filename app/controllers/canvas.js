export class GameCanvas {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  fillRect({ position, width, height, color }) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(position.x, position.y, width, height)
  }

  fillSprite({ x, y, width, height, texture }) {
    const img = new Image()
    img.src = texture // URL or path to your texture image
    img.onload = () => {
      this.ctx.drawImage(img, x, y, width, height)
    }
  }

  fillText(text, x, y) {
    this.ctx.font = '30px Arial red'
    this.ctx.fillText(text, x, y)
  }

  drawItem(item) {
    if (!item.isActive) return
    if (item.texture) {
      this.fillSprite(item)
    } else {
      this.fillRect(item)
    }
  }
}
