import ColorWheel from 'colors'

const LOOP_DELAY = 50 // ms
const MAX_DEPTH = 6

export default class Tree {
  constructor(token) {
    this.token = token
    const canvas = document.getElementById('canvas')
    this.setSize(canvas)
    this.ctx = canvas.getContext('2d')
    this.queue = []
    this.initColor = 2 * Math.PI * Math.random()
    this.counter = 0
    // Push starting branch onto stack/queue (it functions as both)
    this.maxDepth = 0
    this.queue.push({
      x: this.initX, y: this.initY, 
      length: this.initLength,
      angle: 0,  // 0 is up, +ve counter-clockwise
      depth: 0
    })
  }

  static run(token) {
    const tree = new Tree(token)
    return new Promise((resolve, reject) => tree.runLoop(resolve, reject))
  }


  runLoop(resolve, reject) {
    // Confirm and bail if token is cancelled
    if (this.token.isCancelling()) {
      this.token.finishCancel()
      reject('Tree animation cancelled by token')
      return
    }


    const isStack = Math.random() > 0.2
    const branch = isStack ? this.queue.pop() : this.queue.shift()
    this.drawBranch(branch)
    this.pushChildren(branch, Math.random() > 0.5)
    this.counter++
    if (this.queue.length === 0) {
      resolve()
    } else {
      setTimeout(() => this.runLoop(resolve, reject), LOOP_DELAY / branch.depth)
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
    
    // x and y reference start point of the tree's root
    this.initX = canvas.width / 2
    this.initY = this.height + canvas.height / 2 - this.height / 2
    this.initLength = this.height / 3
  }

  pushChildren(branch, isRight) {
    // isLeft controls whether we push to the left or righthand side 1st 
    if (branch.depth === MAX_DEPTH) {
      return
    }
    this.maxDepth = Math.max(this.maxDepth, branch.depth + 1)
    const numBranches = Math.min(Math.max(branch.depth + 3, 2), 5)
    for (let i = 0; i < numBranches; i++) {
      this.queue.push({
          x: this.getEndX(branch),
          y: this.getEndY(branch),
          length: 2 * branch.length / 3,
          angle: isRight 
            ? branch.angle + (Math.PI / 2) - ((i + 1) * Math.PI / (numBranches + 1))
            : branch.angle - (Math.PI / 2) + ((i + 1) * Math.PI / (numBranches + 1)),
          depth: branch.depth + 1
      })
    }
  }

  drawBranch(branch) {
    this.ctx.lineCap = 'round'

    this.ctx.lineWidth = branch.depth ? 10 / branch.depth**1.2 : 20
    this.ctx.strokeStyle = this.getColor(branch.depth)
    this.ctx.beginPath()
    this.ctx.moveTo(branch.x, branch.y)
    this.ctx.lineTo(this.getEndX(branch), this.getEndY(branch))
    this.ctx.stroke()
  }

  getEndX(branch) {
    return branch.x + branch.length * Math.sin(branch.angle)
  }

  getEndY(branch) {
    return branch.y - branch.length * Math.cos(branch.angle)
  }

  getColor(depth) { 
    this.colorWheel = new ColorWheel(this.initColor, 1, 1)
    this.colorWheel.val = 0.3 + 0.6 * (depth / MAX_DEPTH)
    this.colorWheel.sat = 1 - 0.8 * (depth / MAX_DEPTH)
    this.colorWheel.rotate(depth * Math.PI / 8)
    return this.colorWheel.asCSS()
  }
}