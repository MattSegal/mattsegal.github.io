const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const LOOP_DELAY = 50 // ms
const NUM_ITERS = 3280 // 3**8 / 2 for some reason
import ColorWheel from 'colors'

export default class Sierpinski {
  constructor(token) {
    this.token = token
    const canvas = document.getElementById('canvas')
    this.setSize(canvas)
    this.ctx = canvas.getContext('2d')
    this.queue = []
    this.initColor = 2 * Math.PI * Math.random()
    this.counter = 0
    // Push starting shape onto stack
    this.queue.push({
      x: this.initX, y: this.initY, 
      width: this.width,
      height: this.height,
      depth: 0
    })
  }

  static run(token) {
    const sierpinski = new Sierpinski(token)
    return new Promise((resolve, reject) => sierpinski.runLoop(resolve, reject))
  }


  runLoop(resolve, reject) {
    // Confirm and bail if token is cancelled
    if (this.token.isCancelling()) {
      this.token.finishCancel()
      reject('Sierpinski animation cancelled by token')
      return
    }

    const triangle = this.queue.shift()
    this.drawTriangle(triangle)
    this.pushChildren(triangle)
    this.counter++
    if (this.counter >= NUM_ITERS) {
      resolve()
    } else {
      setTimeout(() => this.runLoop(resolve, reject), LOOP_DELAY / triangle.depth)
    }
  }


  setSize(canvas) {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const heightToWidth = 1 / Math.tan(Math.PI / 5)
    const sizeByWidth = 0.95 * window.innerWidth
    const sizeByHeight = 0.95 * window.innerHeight * heightToWidth
    const size = Math.min(sizeByWidth, sizeByHeight)
    this.width = size
    this.height = size / heightToWidth
    
    // x and y reference triangle's bottom left corner
    this.initX = canvas.width / 2 - this.width / 2
    this.initY = this.height + canvas.height / 2 - this.height / 2
  }

  
  pushChildren(triangle) {
    // Bottom left triangle
    this.queue.push({
      x: triangle.x,
      y: triangle.y,
      width: triangle.width / 2,
      height: triangle.height / 2,
      depth: triangle.depth + 1
    })
    // Bottom right triangle
    this.queue.push({
      x: triangle.x + (triangle.width / 2),
      y: triangle.y,
      width: triangle.width / 2,
      height: triangle.height / 2,
      depth: triangle.depth + 1
    })
    // Top triangle
    this.queue.push({
      x: triangle.x + (triangle.width / 4),
      y: triangle.y - (triangle.height / 2),
      width: triangle.width / 2,
      height: triangle.height / 2,
      depth: triangle.depth + 1
    })
  }

  drawTriangle(triangle) {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.getColor(triangle.depth)
    this.ctx.moveTo(triangle.x, triangle.y)
    this.ctx.lineTo(triangle.x + triangle.width, triangle.y)
    this.ctx.lineTo(triangle.x + (triangle.width / 2), triangle.y - triangle.height)
    this.ctx.closePath()
    this.ctx.fill()
  }

  getColor(depth) { 
    // depth is 0 to 7
    this.colorWheel = new ColorWheel(this.initColor, 1, 1)
    const angle = (depth**1.4 + depth) * (Math.PI / 10)
    this.colorWheel.rotate(angle)
    this.colorWheel.sat = 0.5 + depth / (7 * 2)
    return this.colorWheel.asCSS()
  }
}