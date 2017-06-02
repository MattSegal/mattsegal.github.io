const rules = [
  [false, false, false, true, true, true, true, false], // Rule 30
  [false, true, true, true, true, true, true, false], // Rule 126
  [false, false, true, true, true, true, false, false],
  [true, true, false, false, false, true, true, false],
  [false, false, true, false, true, true, false, true],
  [false, true, true, false, true, true, true, false],
  [false, true, false, true, false, true, true, false],
  [true, false, true, false, false, true, false, true],
]


const getRule = (ruleIdx) => {
  return (i,j, grid) => {
    const left  = grid[i - 1][j - 1]
    const mid   = grid[i - 1][j]
    const right = grid[i - 1][j + 1]
    if (left && mid && right) return rules[ruleIdx][0]
    if (left && mid && !right) return rules[ruleIdx][1]
    if (left && !mid && right) return rules[ruleIdx][2]
    if (left && !mid && !right) return rules[ruleIdx][3]
    if (!left && mid && right) return rules[ruleIdx][4]
    if (!left && mid && !right) return rules[ruleIdx][5]
    if (!left && !mid && right) return rules[ruleIdx][6]
    if (!left && !mid && !right) return rules[ruleIdx][7]
  } 
}


const runAutomata = (scale, rule) => new Promise((resolve) => {
  let canvas = document.getElementById('canvas')
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  let ctx = canvas.getContext('2d')
  let CELL_HEIGHT = Math.round(5 * scale) 
  let CELL_WIDTH = Math.round(5 * scale)
  let NUM_ROWS = Math.ceil(canvas.height / CELL_HEIGHT)
  let NUM_COLS = Math.ceil(canvas.width / CELL_WIDTH)

  let renderGrid = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        ctx.fillStyle =  grid[i][j] ? 'rgb(200, 200, 200)' : 'rgb(240, 240, 240)'
        ctx.fillRect(
          j * CELL_WIDTH, i * CELL_HEIGHT,
          (j + 1) * CELL_WIDTH, (i +1) * CELL_HEIGHT
        )
      }
    }
  }

  let grid = Array(NUM_ROWS).fill(0)
    .map(x => Array(NUM_COLS).fill(false))

  grid[0][Math.floor(grid[0].length / 2)] = true

  let rowIdx = 1
  let id = setInterval(() => {
    grid[rowIdx] = grid[rowIdx].map((val, colIdx) => 
      rule(rowIdx, colIdx, grid)
    )
    renderGrid(grid)
    rowIdx++
    if (rowIdx == NUM_ROWS) {
      clearInterval(id)
      resolve()
    }
  }, 50 * scale)
})

const loopRandomAutomata = () => {
  const randomRuleIdx = Math.floor(Math.random()*rules.length)
  const randomRule = getRule(randomRuleIdx)
  const randomScale = Math.ceil(Math.random()*2)
  runAutomata(randomScale, randomRule)
  .then(() => loopRandomAutomata())
}

let initialRule = getRule(0)
runAutomata(2, initialRule)
.then(() => loopRandomAutomata())
