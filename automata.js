/*
  Automata - Draws a bunch of cellular automata to an HTML5 canvas
  Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
*/
'use strict'

const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(200, 200, 200)'
const MAX_SCALE = 3
const MIN_CELL_LENGTH = 1 // px
const MIN_LOOP_DELAY = 20 // ms


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

  // Render the whole grid
  const renderGrid = (grid) => {
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

  // Render just one row of the grid
  const renderRow = (row, i) => {
    for (let j = 0; j < row.length; j++) {
      ctx.fillStyle = row[j] ? BLACK : WHITE
      ctx.fillRect(
        j * CELL_LENGTH, i * CELL_LENGTH,
        CELL_LENGTH, CELL_LENGTH
      )
    }
  }


  // Figure out the starting rows (in the centre)
  let startRowBot
  let startRowTop
  if (NUM_ROWS % 2 === 0) {
    // Even number of rows, pick the 2 middle rows
    // Eg 6 rows, pick row idx 2, 3
    startRowBot = NUM_ROWS / 2
    startRowTop = startRowBot - 1
  } else {
    // Odd number of rows - pick the middle one
    // eg. 5 rows, pick row idx 2
    startRowTop = Math.floor(NUM_ROWS / 2)
    startRowBot = startRowTop
  }

  // Initialise grid model
  // fill the top half with white, bottom half black
  let grid = Array(NUM_ROWS).fill(0)
    .map((row, rowIdx) => rowIdx > startRowBot
      ? Array(NUM_COLS).fill(1)
      : Array(NUM_COLS).fill(0)
    )

  // Seed initial values at the start
  if (startMiddle) {
    grid[startRowTop][Math.floor(grid[0].length / 2)] = 1
  } else {
    grid[startRowTop][Math.floor(grid[0].length / 2)] = 1
    grid[startRowTop][0] = 1
    grid[startRowTop][grid[0].length - 1] = 1
  }

  // Clean the screen by rendering the initial grid
  renderGrid(grid)

  // Render the automata, row-by-row, from the middle out
  let topRowIdx = startRowTop - 1
  let botRowIdx = startRowBot + 1
  const id = setInterval(() => {
    // Calculate next rows
    grid[topRowIdx] = grid[topRowIdx].map((val, colIdx) => rule(topRowIdx, colIdx, grid, true))
    let inverse = grid[topRowIdx].map((val, colIdx) =>  1 - val)
    inverse.reverse()
    grid[botRowIdx] = inverse

    // Draw the updated grid rows
    renderRow(grid[topRowIdx], topRowIdx)
    renderRow(grid[botRowIdx], botRowIdx)
    topRowIdx--
    botRowIdx++

    if (topRowIdx === 0) {
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
const ruleFactory = (ruleIdx) => (i,j, grid, isIncreasing) => {
  const chosenRule = rules[ruleIdx]
  const inc = isIncreasing ? 1 : -1

  const mid = grid[i + inc][j]

  const isLeftEdge = j === 0
  const left = isLeftEdge ? 0 : grid[i + inc][j - 1]

  const isRightEdge = j === grid[i + inc].length - 1
  const right = isRightEdge ? 0 : grid[i + inc][j + 1]

  // Convert binary values (left, middle, right) to decimal array index
  const result = 4 * left + 2 * mid + 1 * right 
  return chosenRule[result]
} 


// Run script
main()
