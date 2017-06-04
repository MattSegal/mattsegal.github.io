/*
  Automata - Draws a bunch of cellular automata to an HTML5 canvas
  Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
*/
'use strict'

const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const MAX_SCALE = 3
const MIN_CELL_LENGTH = 2 // px
const MIN_LOOP_DELAY = 15 // ms


// Initialise rendering
const main = () => {
  const initialRule = ruleFactory(0)
  runAutomata(initialRule, 2, true)
    .then(loopRandomAutomata)
}


// Draw random automata at random scales forever
const loopRandomAutomata = () => {
  const ruleIdx = Math.floor(Math.random() * rules.length)
  const scale = Math.ceil(Math.random() * MAX_SCALE)
  const startMiddle = Math.random() < 0.5
  const rule = ruleFactory(ruleIdx)
  runAutomata(rule, scale, startMiddle)
    .then(loopRandomAutomata)
}


// Draws the given automata to the screen, row-by-row
const runAutomata = (rule, scale, startMiddle) => new Promise((resolve) => {
  const canvas = document.getElementById('canvas')
  // Adjust canvas to window size
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  const resize = () => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize, false);
  const ctx = canvas.getContext('2d')

  const CELL_LENGTH = MIN_CELL_LENGTH * scale  
  const LOOP_DELAY = MIN_LOOP_DELAY * scale
  const NUM_ROWS = Math.ceil(canvas.height / CELL_LENGTH)
  const NUM_COLS = Math.ceil(canvas.width / CELL_LENGTH)

  let renderGrid = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        ctx.fillStyle =  grid[i][j] ? BLACK : WHITE
        ctx.fillRect(
          j * CELL_LENGTH, i * CELL_LENGTH,
          CELL_LENGTH, CELL_LENGTH
        )
      }
    }
  }

  let renderRow = (row, i) => {
    ctx.fillStyle = BLACK
    for (let j = 0; j < row.length; j++) {
        if (row[j]) {
          ctx.fillRect(
            j * CELL_LENGTH, i * CELL_LENGTH,
            CELL_LENGTH, CELL_LENGTH
          )
        }
      }
  }

  // Initialise grid model
  let grid = Array(NUM_ROWS).fill(0).map(row => Array(NUM_COLS).fill(false))
  
  // Seed initial values
  if (startMiddle) {
    grid[grid.length - 1][Math.floor(grid[0].length / 2)] = 1
  } else {
    grid[grid.length - 1][0] = 1
    grid[grid.length - 1][grid[0].length - 1] = 1
  }

  // Clean the screen
  renderGrid(grid)

  // Render the automata, row-by-row, from the bottom up
  let rowIdx = NUM_ROWS - 2
  const id = setInterval(() => {
    // Calculate next row
    grid[rowIdx] = grid[rowIdx]
      .map((val, colIdx) => rule(rowIdx, colIdx, grid))
    renderRow(grid[rowIdx], rowIdx)
    rowIdx--
    if (rowIdx < 0) {
      clearInterval(id)
      setTimeout(resolve, LOOP_DELAY)
    }
  }, LOOP_DELAY)
})


// Rules used to generate cellular automata
const rules = [
  [0, 1, 1, 1, 1, 0, 0, 0],   // Rule 30
  [0, 1, 1, 1, 1, 1, 1, 0],   // Rule 126
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 0, 1, 1, 0],
  [0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 0, 1, 0, 1],
]

// Generate a chosen rule
const ruleFactory = (ruleIdx) => (i,j, grid) => {
  const chosenRule = rules[ruleIdx]
  const mid = grid[i + 1][j]

  const isLeftEdge = j === 0
  const left = isLeftEdge ? 0 : grid[i + 1][j - 1]

  const isRightEdge = j === grid[i + 1].length - 1
  const right = isRightEdge ? 0 : grid[i + 1][j + 1]

  // Convert binary values (left, middle, right) to decimal array index
  const result = 4 * left + 2 * mid + 1 * right 
  return chosenRule[result]
} 


// Run script
main()
