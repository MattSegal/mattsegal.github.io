import Triangle from "./triangle";
import ColorWheel from "colors";

const RPS = 1 / 60; // rotations per second
const LOOP_DELAY = 30; // ms per timestep
const BIRTH_RATE = 10; // timesteps per triangle
const GROWTH_RATE = 1; // percent growth per timestep
const NUM_ITERS = 800;
const MAX_TRIANGLES = 50;
const INIT_SIZE = 20;
const INIT_COUNT = 18;
const INIT_ROTATION = RPS * (LOOP_DELAY / 1000) * (2 * Math.PI);

export default class Portal {
  constructor(token) {
    this.token = token;
    const canvas = document.getElementById("canvas");
    const size = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    canvas.width = size;
    canvas.height = size;
    canvas.style.left = `calc(50% - ${size / 2}px)`;
    this.ctx = canvas.getContext("2d");
    this.initX = canvas.width / 2;
    this.initY = canvas.height / 2;
    this.rotation = INIT_ROTATION;
    this.triangles = [new Triangle(this.initX, this.initY, INIT_SIZE, 0)];

    const initColor = 2 * Math.PI * Math.random();
    this.colorWheel = new ColorWheel(initColor, 1, 1);
    this.counter = 0;
  }

  static run(token) {
    const portal = new Portal(token);
    return new Promise((resolve, reject) => portal.runLoop(resolve, reject));
  }

  runLoop(resolve, reject) {
    // Confirm and bail if token is cancelled
    if (this.token.isCancelling()) {
      this.token.finishCancel();
      reject("Portal animation cancelled by token");
      return;
    }

    const preRender = this.triangles.length < INIT_COUNT;
    for (let triangle of this.triangles) {
      if (!preRender) {
        this.drawShape(triangle);
      }
      triangle.rotate(this.rotation);
      triangle.grow(1 + GROWTH_RATE / 100);
    }

    // Add new baby triangles
    if (this.counter > 0 && this.counter % BIRTH_RATE === 0) {
      this.triangles.push(new Triangle(this.initX, this.initY, INIT_SIZE, 0));
    }

    // Kill triangles who are too old to be useful
    if (this.triangles.length > MAX_TRIANGLES) {
      this.triangles.shift();
    }

    // Change colors
    this.colorWheel.rotate(this.counter / 50000);

    // Speed up rotation
    if (this.counter % 100 === 0) {
      this.rotation += INIT_ROTATION / 2;
    }

    this.counter++;
    if (this.counter >= NUM_ITERS) {
      this.finish(resolve, reject);
    } else if (preRender) {
      this.runLoop(resolve, reject);
    } else {
      setTimeout(() => this.runLoop(resolve, reject), LOOP_DELAY);
    }
  }

  finish(resolve, reject) {
    // Confirm and bail if token is cancelled
    if (this.token.isCancelling()) {
      this.token.finishCancel();
      reject("Portal animation cancelled by token");
      return;
    }

    this.counter++;
    for (let triangle of this.triangles) {
      this.drawShape(triangle);
      triangle.rotate(this.rotation);
      triangle.grow(1 + GROWTH_RATE / 100);
    }

    if (this.counter % 4 == 0) {
      this.triangles.pop();
      if (this.triangles.length < 20) {
        return resolve();
      }
    }
    setTimeout(() => this.finish(resolve, reject), LOOP_DELAY);
  }

  drawShape(shape) {
    const points = shape.getPoints();
    this.ctx.beginPath();
    this.ctx.fillStyle = this.getColor(shape.radius);
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let point of points.slice(1)) {
      this.ctx.lineTo(point[0], point[1]);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  getColor(scalar) {
    this.colorWheel.val = this.periodic(scalar / 1200, 1);
    this.colorWheel.sat = this.periodic(1 - scalar / 800, 1);
    return this.colorWheel.asCSS();
  }

  periodic = (value, max) => Math.abs((value % (2 * max)) - max);
}
