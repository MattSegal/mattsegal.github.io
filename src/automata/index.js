/*
  Automata - Draws a bunch of cellular automata to an HTML5 canvas
  Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
*/
import {ruleFactory, rules} from './rules'

const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const MAX_SCALE = 3
const MIN_CELL_LENGTH = 1 // px
const MIN_LOOP_DELAY = 15 // ms
const END_DELAY = 3000 // ms


// Draws the given automata to the screen, row-by-row
export default class Automata {
  constructor(rule, scale, startMiddle) {
    this.rule = rule
    const canvas = document.getElementById('canvas')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    this.ctx = canvas.getContext('2d')
    
    this.loop_delay = MIN_LOOP_DELAY * scale
    this.cell_length = MIN_CELL_LENGTH * scale  
    const num_rows = 2 * (Math.ceil(canvas.height / (2 * this.cell_length)))
    const num_cols = 2 * (Math.ceil(canvas.width / (2 * this.cell_length)))
    let top = Math.floor(num_rows / 2) // row indices
    let bot = top

    // Initialise grid model - fill the top half with white, bottom half black
    const grid = Array(num_rows).fill(0)
      .map((row, rowIdx) => rowIdx > bot
        ? Array(num_cols).fill(1)
        : Array(num_cols).fill(0)
      )

    // Seed initial values at the start
    if (startMiddle) {
      grid[top][Math.floor(grid[0].length / 2)] = 1
    } else {
      grid[top][Math.floor(grid[0].length / 2)] = 1
      grid[top][0] = 1
      grid[top][grid[0].length - 1] = 1
    }
    this.grid = grid
    this.top = top
    this.bot = bot
  }

  static getRandomAutomata() {
    const ruleIdx = Math.floor(Math.random() * rules.length)
    const scale = Math.ceil(Math.random() * MAX_SCALE)
    const startMiddle = Math.random() < 0.5
    const rule = ruleFactory(ruleIdx)
    return new Automata(rule, scale, startMiddle)
  }

  resize() {
      // todo - just cancel the animation
  }

  run() {
    return new Promise((resolve) => {
      let top = this.top
      let bot = this.bot
      // Clean the screen by rendering the initial grid
      this.renderGrid()
      top--
      bot++

      // Render the automata, row-by-row, from the middle out
      const intervalId = setInterval(() => {
        // Calculate next rows
        this.grid[top] = this.grid[top].map((val, colIdx) => this.rule(top, colIdx, this.grid))
        let inverse = this.grid[top].map((val, colIdx) =>  1 - val)
        inverse.reverse()
        this.grid[bot] = inverse

        // Draw the updated grid rows
        this.renderRow(this.grid[top], top)
        this.renderRow(this.grid[bot], bot)
        top--
        bot++

        if (top === 0) {
          clearInterval(intervalId)
          setTimeout(resolve, END_DELAY)
        }
      }, this.loop_delay)

      // Cancel on resizes
      window.addEventListener('resize', () => {
          clearInterval(intervalId)
          resolve()
      }, false)
    })
  }

  renderGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.drawCell(i, j)
      }
    }
  }

  renderRow(row, i) {
    for (let j = 0; j < row.length; j++) {
      this.drawCell(i, j)
    }
  }

  drawCell(i, j) {
    const c = this.cell_length
    this.ctx.fillStyle = this.grid[i][j] ? BLACK : WHITE
    this.ctx.fillRect(j * c, i * c, c, c)
  }
}
