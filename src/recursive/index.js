const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const LOOP_DELAY = 50 // ms
const NUM_ITERS = 3280 // 3**8 / 2 for some reason

export default class Sierpinski {
  constructor() {
    const canvas = document.getElementById('canvas')
    this.setSize(canvas)
    this.ctx = canvas.getContext('2d')
    this.queue = []
    // Push starting shape onto stack
    this.queue.push({
      x: this.initX, y: this.initY, 
      width: this.width,
      height: this.height,
      dark: false,
      depth: 0
    })
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

  run() {
    this.counter = 0
    return new Promise((resolve) => {
      this.runLoop(resolve)
      // let counter = 0
      // const intervalId = setInterval(() => {
      //   const triangle = this.queue.shift()
      //   this.drawTriangle(triangle)
      //   this.pushChildren(triangle)
      //   counter++
      //   if (counter >= NUM_ITERS) {
      //     clearInterval(intervalId)
      //     resolve()
      //   } 
      // }, LOOP_DELAY)
    })
  }

  runLoop(resolve) {

    const triangle = this.queue.shift()
    this.drawTriangle(triangle)
    this.pushChildren(triangle)
    this.counter++
    if (this.counter >= NUM_ITERS) {
      resolve()
    } else {
      setTimeout(() => this.runLoop(resolve), this.getDelay(triangle.depth))
    }
  }

  getDelay(depth) {
    return LOOP_DELAY / depth
  }

  pushChildren(triangle) {
    // bottom left
    this.queue.push({
      x: triangle.x,
      y: triangle.y,
      width: triangle.width / 2,
      height: triangle.height / 2,
      dark: !triangle.dark,
      depth: triangle.depth + 1
    })
    // bottom right
    this.queue.push({
      x: triangle.x + (triangle.width / 2),
      y: triangle.y,
      width: triangle.width / 2,
      height: triangle.height / 2,
      dark: !triangle.dark,
      depth: triangle.depth + 1
    })
    // top
    this.queue.push({
      x: triangle.x + (triangle.width / 4),
      y: triangle.y - (triangle.height / 2),
      width: triangle.width / 2,
      height: triangle.height / 2,
      dark: !triangle.dark,
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

  // I decided to hard code some colors after hours of messing around
  getColor(depth) { // depth is 0 to 7
    const colors = this.colors[depth]
    return `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`
  }

  colors = [
    [255, 20, 160],
    [200, 20, 200],
    [160, 20, 230],
    [125, 20, 255],
    [20, 0, 255],
    [255, 0, 255],
    [20, 20, 20],
    [60, 255, 60],
  ]
}