import Triangle from './triangle'

const LOOP_DELAY = 50 // ms
const NUM_ITERS = 100 // 3**8 / 2 for some reason
const MAX_TRIANGLES = 10

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
      triangle.grow(1.1)
    }

    // Add new baby triangles
    if (
        this.counter > 0 &&
        this.counter % 5 === 0
    ) {
      this.triangles.push(new Triangle(this.initX, this.initY, 100, 0))
    }

    // Kill triangles who are too old to be useful
    if (this.triangles.length > MAX_TRIANGLES) {
      this.triangles.shift()
    }


    this.counter++
    if (this.counter >= NUM_ITERS) {
      resolve()
    } else {
      setTimeout(() => this.runLoop(resolve), LOOP_DELAY)
    }
  }

  drawTriangle(triangle) {
    const points = triangle.getPoints()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.getColor(triangle.radius)
    this.ctx.moveTo(points[0][0], points[0][1])
    this.ctx.lineTo(points[1][0], points[1][1])
    this.ctx.lineTo(points[2][0], points[2][1])
    this.ctx.closePath()
    this.ctx.fill()
  }

  getColor(scalar) { 
    const color = Math.floor(scalar % 255)
    return `rgb(${color}, ${color}, ${color})`
  }
}