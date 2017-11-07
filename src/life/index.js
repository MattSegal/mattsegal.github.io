/*
* Game of life simulator
*
* Game occupies a grid with co-ordinates (0, 0) in top left
*
*
*/
const WHITE = 'rgb(240, 240, 240)'
const BLACK = 'rgb(150, 150, 150)'
const LOOP_DELAY = 60  // ms
const CELL_LENGTH = 15  // px

export default class GameOfLife {
  constructor(token) {
    this.token = token

    // Setup canvas
    const canvas = document.getElementById('canvas')
    this.ctx = canvas.getContext('2d')

    // Set dimensions
    this.width = window.innerWidth
    this.height = window.innerHeight
    canvas.width  = this.width
    canvas.height = this.height

    // Build grid
    this.numRows = Math.ceil(this.height /CELL_LENGTH)
    this.numCols = Math.ceil(this.width / CELL_LENGTH)
    this.grid = Array(this.numRows).fill(0)
      .map(row => Array(this.numCols).fill(Math.round(Math.random())))

    this.mouseCells = []

    // Settle the grid a bit
    for (let i = 0; i < 50; i++) {
      this.progressGame()
    }

    document.onmousemove = this.handleMouseMove
  }

  static run(token) {
    // Start the game
    const game = new GameOfLife(token)
    return new Promise((resolve, reject) => game.runLoop(resolve, reject))
  }


  runLoop(resolve, reject) {
    // Confirm and bail if token is cancelled
    if (this.token.isCancelling()) {
      this.token.finishCancel()
      reject('Game of life animation cancelled by token')
      return
    }
    this.renderGrid()
    this.progressGame()
    setTimeout(() => this.runLoop(resolve, reject), LOOP_DELAY)
  }

  handleMouseMove = (e) => {
    // Record mouse moves
    this.mouseCells.push([
      Math.floor(e.clientY / CELL_LENGTH),
      Math.floor(e.clientX / CELL_LENGTH)
    ])
  }

  progressGame() {
    // Progress the game according to the GOL rules
    const nextGrid = Array(this.numRows).fill(0).map(row => Array(this.numCols).fill(0))
    for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++) {
      for (let colIdx = 0; colIdx < this.grid[rowIdx].length; colIdx++) {
        const numNeighbours = this.countNeighbours(rowIdx, colIdx)
        const liveCellSurvives = this.grid[rowIdx][colIdx] === 1 && (numNeighbours === 2 || numNeighbours === 3)
        const deadCellLives = this.grid[rowIdx][colIdx] === 0 && numNeighbours === 3
        if (liveCellSurvives || deadCellLives) {
          nextGrid[rowIdx][colIdx] = 1
        }
      }
    }

    // Add new cells created by mouse movement
    const numCells = this.mouseCells.length
    for (let count = 0; count < numCells; count++) {
      const cell = this.mouseCells.shift()
      nextGrid[cell[0]][cell[1]] = 1
    }
    this.grid = nextGrid
  }

  countNeighbours(rowIdx, colIdx) {
    // Counts the number of living neighbors for a cell
    let numNeighbours = 0
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          (rowIdx + i) > -1 && (colIdx + j) > -1 && 
          (rowIdx + i) < this.numRows && (colIdx + j) < this.numCols && 
          !(i === 0 && j === 0)
        ) {
          numNeighbours += this.grid[rowIdx + i][colIdx + j]
        }
      }      
    }
    return numNeighbours
  }

  renderGrid() {
    // Render every grid element
    for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++) {
      for (let colIdx = 0; colIdx < this.grid[rowIdx].length; colIdx++) {
        this.ctx.fillStyle = this.grid[rowIdx][colIdx] ? BLACK : WHITE
        this.ctx.fillRect(
          colIdx * CELL_LENGTH, 
          rowIdx * CELL_LENGTH,
          CELL_LENGTH,
          CELL_LENGTH
        )
      }
    }
  }

}