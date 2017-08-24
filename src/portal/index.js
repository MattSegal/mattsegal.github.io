import Triangle from './triangle'

const LOOP_DELAY = 200 // ms
const NUM_ITERS = 100 // 3**8 / 2 for some reason

export default class Portal {
  constructor() {
    const canvas = document.getElementById('canvas')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight    
    this.ctx = canvas.getContext('2d')
    this.initX = canvas.width / 2
    this.initY = canvas.height / 2
    this.triangles = [new Triangle(this.initX, this.initY, 100, 0)]
  }

  run() {
    this.counter = 0
    return new Promise(resolve => this.runLoop(resolve))
  }

  runLoop(resolve) {
    for (let triangle of this.triangles) {
      this.drawTriangle(triangle)
      triangle.rotate(Math.PI / 6)
      triangle.grow(100)
    }

    this.triangles.push(new Triangle(this.initX, this.initY, 100, 0))
    this.counter++
    if (this.counter >= NUM_ITERS) {
      resolve()
    } else {
      setTimeout(() => this.runLoop(resolve), LOOP_DELAY)
    }
  }

  drawTriangle(triangle) {
    const points = triangle.getPoints()
    const colorIdx = triangle.size % 800 / 100
    console.log(colorIdx)
    this.ctx.beginPath()
    this.ctx.fillStyle = this.getColor(colorIdx)
    this.ctx.moveTo(points[0][0], points[0][1])
    this.ctx.lineTo(points[1][0], points[1][1])
    this.ctx.lineTo(points[2][0], points[2][1])
    this.ctx.closePath()
    this.ctx.fill()
  }

  // I decided to hard code some colors after hours of messing around
  getColor(idx) { // depth is 0 to 7
    const colors = this.colors[idx]
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