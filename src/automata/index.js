/*
  Automata - Draws a bunch of cellular automata to an HTML5 canvas
  Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
*/
import ColorWheel from 'colors'
import {ruleFactory, rules} from './rules'

const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const MAX_SCALE = 4
const MIN_CELL_LENGTH = 1 // px
const MIN_LOOP_DELAY = 15 // ms
const END_DELAY = 3000 // ms


// Draws the given automata to the screen, row-by-row
export default class Automata {
  constructor(rule, scale, seed) {
    this.color = 2 * Math.PI * Math.random()
    this.scale = scale
    this.rule = rule
    const canvas = document.getElementById('canvas')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    this.ctx = canvas.getContext('2d')
    
    this.loop_delay = MIN_LOOP_DELAY * scale
    this.cell_length = MIN_CELL_LENGTH * scale  
    const num_rows = 2 * (Math.ceil(canvas.height / (2 * this.cell_length)))
    const num_cols = 2 * (Math.ceil(canvas.width / (2 * this.cell_length)))
    this.middle = Math.floor(num_rows / 2) // row indices
    let top = this.middle
    let bot = this.middle

    // Initialise grid model - fill the top half with white, bottom half black
    const grid = Array(num_rows).fill(0)
      .map((row, rowIdx) => rowIdx > bot
        ? Array(num_cols).fill(0)
        : Array(num_cols).fill(0)
      )

    // Seed initial values at the start
    if (seed < 0.33) {
      grid[top][Math.floor(grid[0].length / 2)] = 1
    } else if (seed < 0.66) {
      grid[top][Math.floor(grid[0].length / 2)] = 1
      grid[top][0] = 1
      grid[top][grid[0].length - 1] = 1
    } else {
      for (let i = 0; i < 4; i++) {
        grid[top][Math.floor(Math.random() * grid[0].length)] = 1
      }
    }
    this.grid = grid
    this.top = top
    this.bot = bot
  }

  static getRandomAutomata() {
    const ruleIdx = Math.floor(Math.random() * rules.length)
    const scale = 2 //Math.ceil(Math.random() * MAX_SCALE)
    const seed = Math.random()
    const rule = ruleFactory(ruleIdx)
    return new Automata(rule, scale, seed)
  }

  resize() {
      // todo - just cancel the animation
  }

  run() {
    return new Promise((resolve) => {
      let top = this.top
      let bot = this.bot
      // Clean the screen by rendering the initial grid
      this.renderInit()
      this.renderRow(this.grid[top], top, true)
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
        this.renderRow(this.grid[top], top, true)
        this.renderRow(this.grid[bot], bot, false)
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

  // Draw the whole grid to the screen
  renderInit() {
    const c = this.cell_length
    this.ctx.fillStyle = WHITE
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.ctx.fillRect(j * c, i * c, c, c)
      }
    }
  }

  renderRow(row, i, isTop) {
    const c = this.cell_length
    for (let j = 0; j < row.length; j++) {
      if (isTop === !!this.grid[i][j]) {
        this.ctx.fillStyle = this.getColor(i, isTop)
        this.ctx.fillRect(j * c, i * c, c, c)
      }
    }
  }

  getColor(i, isTop) {
    const colorWheel = new ColorWheel(this.color, 1, 1)
    const distance = Math.abs((this.middle - i) / this.middle)
    colorWheel.val = (1 - distance) + Math.random() * distance
    const angle = this.color + 2 * distance + 0.5 * Math.PI * Math.random() 
    colorWheel.rotate(angle)
    return colorWheel.asCSS()
  }
}
