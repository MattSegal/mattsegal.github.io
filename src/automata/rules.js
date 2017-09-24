// Rules used to generate cellular automata
const rules = [
  [0, 1, 1, 1, 1, 0, 0, 0],   // Rule 30
  [0, 1, 1, 1, 1, 1, 1, 0],   // Rule 126
  [0, 0, 1, 1, 1, 1, 0, 0],
  // [0, 1, 1, 1, 0, 1, 1, 0],
  // [0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 0, 1, 0, 1],  // Cool space pyramid thing
]

// Generate a chosen rule
// Given a co-ordinate in a grid, calculate the value of the point
const ruleFactory = (ruleIdx) => (i, j, grid) => {
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

module.exports = {
  ruleFactory,
  rules
}