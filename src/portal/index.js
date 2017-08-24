import Triangle from './triangle'

const RPS = 1 / 60       // rotations per second
const LOOP_DELAY = 30     // ms per timestep
const BIRTH_RATE = 10     // timesteps per triangle
const GROWTH_RATE = 1    // percent growth per timestep
const NUM_ITERS = 800
const MAX_TRIANGLES = 50
const INIT_SIZE = 20
const INIT_COUNT = 18

export default class Portal {
  constructor() {
    const canvas = document.getElementById('canvas')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight    
    this.ctx = canvas.getContext('2d')
    this.initX = canvas.width / 2
    this.initY = canvas.height / 2
    this.rotation = RPS * (LOOP_DELAY / 1000) * (2 * Math.PI)  
    this.triangles = [new Triangle(this.initX, this.initY, INIT_SIZE, 0)]
  }

  run() {
    this.counter = 0
    return new Promise(resolve => this.runLoop(resolve))
  }

  runLoop(resolve) {
    const preRender = this.triangles.length < INIT_COUNT
    for (let triangle of this.triangles) {
      if (!preRender) {
        this.drawShape(triangle)
      }
      triangle.rotate(this.rotation)
      triangle.grow(1 + GROWTH_RATE / 100)
    }

    // Add new baby triangles
    if (this.counter > 0 && this.counter % BIRTH_RATE === 0) {
      this.triangles.push(new Triangle(this.initX, this.initY, INIT_SIZE, 0))
    }

    // Kill triangles who are too old to be useful
    if (this.triangles.length > MAX_TRIANGLES) {
      this.triangles.shift()
    }

    this.counter++
    if (this.counter >= NUM_ITERS) {
      this.finish(resolve)
    } else if (preRender) {
      this.runLoop(resolve)
    } else {
      setTimeout(() => this.runLoop(resolve), LOOP_DELAY)
    }
  }

  finish(resolve) {
    this.counter++
    for (let triangle of this.triangles) {
      this.drawShape(triangle)
      triangle.rotate(this.rotation)
      triangle.grow(1 + GROWTH_RATE / 100)
    }

    if (this.counter % 4 == 0) {
      this.triangles.pop()  
      if (this.triangles.length < 20) {
        return resolve()
      }
    } 
    setTimeout(() => this.finish(resolve), LOOP_DELAY)
  }

  drawShape(shape) {
    const points = shape.getPoints()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.getColor(shape.radius)
    this.ctx.moveTo(points[0][0], points[0][1])
    for (let point of points.slice(1)) {
       this.ctx.lineTo(point[0], point[1])
    }
    this.ctx.closePath()
    this.ctx.fill()
  }

  getColor(scalar) { 
    const color = Math.abs(Math.floor((scalar / 6) % 512) - 256)
    return `rgb(${color}, ${color}, ${color})`
  }
}