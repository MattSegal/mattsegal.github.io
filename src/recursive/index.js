const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const LOOP_DELAY = 3 // ms
const NUM_ITERS = 3280 // 3**8 / 2 for some reason

export default class Sierpinski {
  constructor() {
    const canvas = document.getElementById('canvas')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height
    this.queue = []
    // Push starting shape onto stack
    this.queue.push({
      x: 0, y: canvas.height, // bottom left corner
      width: canvas.width,
      height: canvas.height,
      dark: false,
      depth: 0
    })
  }

  run() {
    return new Promise((resolve) => {
      let counter = 0
      const intervalId = setInterval(() => {
        const triangle = this.queue.shift()
        this.drawTriangle(triangle)
        this.pushChildren(triangle)
        counter++
        if (counter >= NUM_ITERS) {
          clearInterval(intervalId)
          resolve()
        } 
      }, LOOP_DELAY)
    })
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

  getColor(depth) {
    const scale = 200 - 80 * depth % 200 + 30
    if (depth % 2 == 0) {
      return  `rgb(255,${scale},${scale})`
    } else {
      return `rgb(${scale},${scale},255)`
    }
  }
}