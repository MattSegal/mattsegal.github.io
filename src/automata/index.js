/*
  Automata - Draws a bunch of cellular automata to an HTML5 canvas
  Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
*/
import ColorWheel from "colors";
import { ruleFactory, rules } from "./rules";

const WHITE = "rgb(240, 240, 240)";
const BLACK = "rgb(120, 120, 120)";
const MAX_SCALE = 4;
const MIN_CELL_LENGTH = 1; // px
const MIN_LOOP_DELAY = 12; // ms
const END_DELAY = 4000; // ms

// Draws the given automata to the screen, row-by-row
export default class Automata {
  constructor(rule, scale, seed, token) {
    this.token = token;
    this.color = 2 * Math.PI * Math.random();
    this.scale = scale;
    this.rule = rule;
    const canvas = document.getElementById("canvas");
    const size = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    canvas.width = size;
    canvas.height = size;
    canvas.style.left = `calc(50% - ${size / 2}px)`;
    this.ctx = canvas.getContext("2d");

    this.loop_delay = MIN_LOOP_DELAY * scale;
    this.cell_length = MIN_CELL_LENGTH * scale;
    const num_rows = 2 * Math.ceil(canvas.height / (2 * this.cell_length));
    const num_cols = 2 * Math.ceil(canvas.width / (2 * this.cell_length));
    this.middle = Math.floor(num_rows / 2); // row indices
    let top = this.middle;
    let bot = this.middle;

    // Initialise grid model
    const grid = Array(num_rows)
      .fill(0)
      .map((row) => Array(num_cols).fill(0));

    // Seed initial values at the start
    if (seed < 0.33) {
      grid[top][Math.floor(grid[0].length / 2)] = 1;
    } else if (seed < 0.66) {
      grid[top][Math.floor(grid[0].length / 2)] = 1;
      grid[top][0] = 1;
      grid[top][grid[0].length - 1] = 1;
    } else {
      for (let i = 0; i < 4; i++) {
        grid[top][Math.floor(Math.random() * grid[0].length)] = 1;
      }
    }
    this.grid = grid;
    this.top = top;
    this.bot = bot;
  }

  static run(token) {
    const ruleIdx = Math.floor(Math.random() * rules.length);
    const scale = 2; //Math.ceil(Math.random() * MAX_SCALE)
    const seed = Math.random();
    const rule = ruleFactory(ruleIdx);
    const automata = new Automata(rule, scale, seed, token);
    return new Promise((resolve, reject) => automata.runLoop(resolve, reject));
  }

  runLoop(resolve, reject) {
    let top = this.top;
    let bot = this.bot;

    // Clean the screen by rendering the initial grid
    this.renderInit();
    this.renderRow(this.grid[top], top, true);
    top--;
    bot++;

    // Render the automata, row-by-row, from the middle out
    const intervalId = setInterval(() => {
      // Confirm and bail if token is cancelled
      if (this.token.isCancelling()) {
        clearInterval(intervalId);
        this.token.finishCancel();
        reject("Automata animation cancelled by token");
        return;
      }

      // Calculate next rows
      this.grid[top] = this.grid[top].map((val, colIdx) =>
        this.rule(top, colIdx, this.grid)
      );
      let inverse = this.grid[top].map((val, colIdx) => 1 - val);
      inverse.reverse();
      this.grid[bot] = inverse;

      // Draw the updated grid rows
      this.renderRow(this.grid[top], top, true);
      this.renderRow(this.grid[bot], bot, false);
      top--;
      bot++;

      if (top === 0) {
        clearInterval(intervalId);
        this.waitTime = END_DELAY;
        this.finishLoop(resolve, reject);
      }
    }, this.loop_delay);

    // Cancel on resizes
    window.addEventListener(
      "resize",
      () => {
        clearInterval(intervalId);
        resolve();
      },
      false
    );
  }

  finishLoop(resolve, reject) {
    // Confirm and bail if token is cancelled
    if (this.token.isCancelling()) {
      this.token.finishCancel();
      reject("Automata animation cancelled by token");
      return;
    }

    this.waitTime -= 100;
    if (this.waitTime <= 0) {
      resolve();
    } else {
      setTimeout(() => this.finishLoop(resolve, reject), 100);
    }
  }

  // Draw the whole grid to the screen
  renderInit() {
    const c = this.cell_length;
    this.ctx.fillStyle = WHITE;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.ctx.fillRect(j * c, i * c, c, c);
      }
    }
  }

  renderRow(row, i, isTop) {
    const c = this.cell_length;
    for (let j = 0; j < row.length; j++) {
      if (isTop === !!this.grid[i][j]) {
        this.ctx.fillStyle = this.getColor(i, isTop);
        this.ctx.fillRect(j * c, i * c, c, c);
      }
    }
  }

  getColor(i, isTop) {
    if (!isTop) {
      return BLACK;
    }
    const colorWheel = new ColorWheel(this.color, 0.5, 0.8);
    const distance = Math.abs((this.middle - i) / this.middle);
    const angle = this.color + 2 * distance;
    colorWheel.rotate(angle);
    return colorWheel.asCSS();
  }
}
