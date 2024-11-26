export class Vector {
  constructor({ x, y }) {
    this.x = x
    this.y = y
  }

  add(vector) {
    return new Vector({ x: this.x + vector.x, y: this.y + vector.y })
  }

  normalize() {
    const magnitude = this.magnitude
    if (magnitude === 0) return new Vector({ x: 0, y: 0 })
    return new Vector({ x: this.x / magnitude, y: this.y / magnitude })
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  scale(scalar) {
    return new Vector({ x: this.x * scalar, y: this.y * scalar })
  }

  equals(vector) {
    return this.x === vector.x && this.y === vector.y
  }
}
