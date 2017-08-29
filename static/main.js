/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _automata = __webpack_require__(1);

	var _automata2 = _interopRequireDefault(_automata);

	var _recursive = __webpack_require__(3);

	var _recursive2 = _interopRequireDefault(_recursive);

	var _portal = __webpack_require__(5);

	var _portal2 = _interopRequireDefault(_portal);

	var _colors = __webpack_require__(4);

	var _colors2 = _interopRequireDefault(_colors);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var lastChoice = void 0;

	// Draw random automata at random scales forever
	var loopRandomAutomata = function loopRandomAutomata() {
	  var choice = Math.random();
	  var animation = void 0;
	  if (choice < 0 && lastChoice !== _portal2.default) {
	    animation = new _portal2.default();
	    lastChoice = _portal2.default;
	  } else if (choice < 0 && lastChoice !== _recursive2.default) {
	    animation = new _recursive2.default();
	    lastChoice = _recursive2.default;
	  } else {
	    animation = _automata2.default.getRandomAutomata();
	    lastChoice = _automata2.default;
	  }
	  animation.run().then(loopRandomAutomata);
	};

	// Run script
	loopRandomAutomata();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Automata - Draws a bunch of cellular automata to an HTML5 canvas
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


	var _colors = __webpack_require__(4);

	var _colors2 = _interopRequireDefault(_colors);

	var _rules = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WHITE = 'rgb(240, 240, 240)';
	var BLACK = 'rgb(200, 200, 200)';
	var MAX_SCALE = 4;
	var MIN_CELL_LENGTH = 1; // px
	var MIN_LOOP_DELAY = 15; // ms
	var END_DELAY = 3000; // ms


	// Draws the given automata to the screen, row-by-row

	var Automata = function () {
	  function Automata(rule, scale, seed) {
	    _classCallCheck(this, Automata);

	    this.color = 2 * Math.PI * Math.random();
	    this.scale = scale;
	    this.rule = rule;
	    var canvas = document.getElementById('canvas');
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    this.ctx = canvas.getContext('2d');

	    this.loop_delay = MIN_LOOP_DELAY * scale;
	    this.cell_length = MIN_CELL_LENGTH * scale;
	    var num_rows = 2 * Math.ceil(canvas.height / (2 * this.cell_length));
	    var num_cols = 2 * Math.ceil(canvas.width / (2 * this.cell_length));
	    this.middle = Math.floor(num_rows / 2); // row indices
	    var top = this.middle;
	    var bot = this.middle;

	    // Initialise grid model - fill the top half with white, bottom half black
	    var grid = Array(num_rows).fill(0).map(function (row, rowIdx) {
	      return rowIdx > bot ? Array(num_cols).fill(0) : Array(num_cols).fill(0);
	    });

	    // Seed initial values at the start
	    if (seed < 0.33) {
	      grid[top][Math.floor(grid[0].length / 2)] = 1;
	    } else if (seed < 0.66) {
	      grid[top][Math.floor(grid[0].length / 2)] = 1;
	      grid[top][0] = 1;
	      grid[top][grid[0].length - 1] = 1;
	    } else {
	      for (var i = 0; i < 4; i++) {
	        grid[top][Math.floor(Math.random() * grid[0].length)] = 1;
	      }
	    }
	    this.grid = grid;
	    this.top = top;
	    this.bot = bot;
	  }

	  _createClass(Automata, [{
	    key: 'resize',
	    value: function resize() {
	      // todo - just cancel the animation
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      var _this = this;

	      return new Promise(function (resolve) {
	        var top = _this.top;
	        var bot = _this.bot;
	        // Clean the screen by rendering the initial grid
	        _this.renderInit();
	        _this.renderRow(_this.grid[top], top, true);
	        top--;
	        bot++;

	        // Render the automata, row-by-row, from the middle out
	        var intervalId = setInterval(function () {
	          // Calculate next rows
	          _this.grid[top] = _this.grid[top].map(function (val, colIdx) {
	            return _this.rule(top, colIdx, _this.grid);
	          });
	          var inverse = _this.grid[top].map(function (val, colIdx) {
	            return 1 - val;
	          });
	          inverse.reverse();
	          _this.grid[bot] = inverse;

	          // Draw the updated grid rows
	          _this.renderRow(_this.grid[top], top, true);
	          _this.renderRow(_this.grid[bot], bot, false);
	          top--;
	          bot++;

	          if (top === 0) {
	            clearInterval(intervalId);
	            setTimeout(resolve, END_DELAY);
	          }
	        }, _this.loop_delay);

	        // Cancel on resizes
	        window.addEventListener('resize', function () {
	          clearInterval(intervalId);
	          resolve();
	        }, false);
	      });
	    }

	    // Draw the whole grid to the screen

	  }, {
	    key: 'renderInit',
	    value: function renderInit() {
	      var c = this.cell_length;
	      this.ctx.fillStyle = WHITE;
	      for (var i = 0; i < this.grid.length; i++) {
	        for (var j = 0; j < this.grid[i].length; j++) {
	          this.ctx.fillRect(j * c, i * c, c, c);
	        }
	      }
	    }
	  }, {
	    key: 'renderRow',
	    value: function renderRow(row, i, isTop) {
	      var c = this.cell_length;
	      for (var j = 0; j < row.length; j++) {
	        if (isTop === !!this.grid[i][j]) {
	          this.ctx.fillStyle = this.getColor(i, isTop);
	          this.ctx.fillRect(j * c, i * c, c, c);
	        }
	      }
	    }
	  }, {
	    key: 'getColor',
	    value: function getColor(i, isTop) {
	      var colorWheel = new _colors2.default(this.color, 1, 1);
	      var distance = Math.abs((this.middle - i) / this.middle);
	      colorWheel.val = 1 - distance + Math.random() * distance;
	      var angle = this.color + 2 * distance + 0.5 * Math.PI * Math.random();
	      colorWheel.rotate(angle);
	      return colorWheel.asCSS();
	    }
	  }], [{
	    key: 'getRandomAutomata',
	    value: function getRandomAutomata() {
	      var ruleIdx = Math.floor(Math.random() * _rules.rules.length);
	      var scale = 2; //Math.ceil(Math.random() * MAX_SCALE)
	      var seed = Math.random();
	      var rule = (0, _rules.ruleFactory)(ruleIdx);
	      return new Automata(rule, scale, seed);
	    }
	  }]);

	  return Automata;
	}();

	exports.default = Automata;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	// Rules used to generate cellular automata
	var rules = [[0, 1, 1, 1, 1, 0, 0, 0], // Rule 30
	[0, 1, 1, 1, 1, 1, 1, 0], // Rule 126
	[0, 0, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 0, 1, 1, 0], [0, 1, 1, 0, 1, 0, 1, 0], [1, 0, 1, 0, 0, 1, 0, 1]];

	// Generate a chosen rule
	// Given a co-ordinate in a grid, calculate the value of the point
	var ruleFactory = function ruleFactory(ruleIdx) {
	  return function (i, j, grid) {
	    var chosenRule = rules[ruleIdx];

	    var mid = grid[i + 1][j];

	    var isLeftEdge = j === 0;
	    var left = isLeftEdge ? 0 : grid[i + 1][j - 1];

	    var isRightEdge = j === grid[i + 1].length - 1;
	    var right = isRightEdge ? 0 : grid[i + 1][j + 1];

	    // Convert binary values (left, middle, right) to decimal array index
	    var result = 4 * left + 2 * mid + 1 * right;
	    return chosenRule[result];
	  };
	};

	module.exports = {
	  ruleFactory: ruleFactory,
	  rules: rules
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _colors = __webpack_require__(4);

	var _colors2 = _interopRequireDefault(_colors);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WHITE = 'rgb(240, 240, 240)';
	var BLACK = 'rgb(200, 200, 200)';
	var LOOP_DELAY = 50; // ms
	var NUM_ITERS = 3280; // 3**8 / 2 for some reason

	var Sierpinski = function () {
	  function Sierpinski() {
	    _classCallCheck(this, Sierpinski);

	    var canvas = document.getElementById('canvas');
	    this.setSize(canvas);
	    this.ctx = canvas.getContext('2d');
	    this.queue = [];
	    this.initColor = 2 * Math.PI * Math.random();
	    // Push starting shape onto stack
	    this.queue.push({
	      x: this.initX, y: this.initY,
	      width: this.width,
	      height: this.height,
	      depth: 0
	    });
	  }

	  _createClass(Sierpinski, [{
	    key: 'setSize',
	    value: function setSize(canvas) {
	      canvas.width = window.innerWidth;
	      canvas.height = window.innerHeight;

	      var heightToWidth = 1 / Math.tan(Math.PI / 5);
	      var sizeByWidth = 0.95 * window.innerWidth;
	      var sizeByHeight = 0.95 * window.innerHeight * heightToWidth;
	      var size = Math.min(sizeByWidth, sizeByHeight);
	      this.width = size;
	      this.height = size / heightToWidth;

	      // x and y reference triangle's bottom left corner
	      this.initX = canvas.width / 2 - this.width / 2;
	      this.initY = this.height + canvas.height / 2 - this.height / 2;
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      var _this = this;

	      this.counter = 0;
	      return new Promise(function (resolve) {
	        return _this.runLoop(resolve);
	      });
	    }
	  }, {
	    key: 'runLoop',
	    value: function runLoop(resolve) {
	      var _this2 = this;

	      var triangle = this.queue.shift();
	      this.drawTriangle(triangle);
	      this.pushChildren(triangle);
	      this.counter++;
	      if (this.counter >= NUM_ITERS) {
	        resolve();
	      } else {
	        setTimeout(function () {
	          return _this2.runLoop(resolve);
	        }, LOOP_DELAY / triangle.depth);
	      }
	    }
	  }, {
	    key: 'pushChildren',
	    value: function pushChildren(triangle) {
	      // Bottom left triangle
	      this.queue.push({
	        x: triangle.x,
	        y: triangle.y,
	        width: triangle.width / 2,
	        height: triangle.height / 2,
	        depth: triangle.depth + 1
	      });
	      // Bottom right triangle
	      this.queue.push({
	        x: triangle.x + triangle.width / 2,
	        y: triangle.y,
	        width: triangle.width / 2,
	        height: triangle.height / 2,
	        depth: triangle.depth + 1
	      });
	      // Top triangle
	      this.queue.push({
	        x: triangle.x + triangle.width / 4,
	        y: triangle.y - triangle.height / 2,
	        width: triangle.width / 2,
	        height: triangle.height / 2,
	        depth: triangle.depth + 1
	      });
	    }
	  }, {
	    key: 'drawTriangle',
	    value: function drawTriangle(triangle) {
	      this.ctx.beginPath();
	      this.ctx.fillStyle = this.getColor(triangle.depth);
	      this.ctx.moveTo(triangle.x, triangle.y);
	      this.ctx.lineTo(triangle.x + triangle.width, triangle.y);
	      this.ctx.lineTo(triangle.x + triangle.width / 2, triangle.y - triangle.height);
	      this.ctx.closePath();
	      this.ctx.fill();
	    }
	  }, {
	    key: 'getColor',
	    value: function getColor(depth) {
	      // depth is 0 to 7
	      this.colorWheel = new _colors2.default(this.initColor, 1, 1);
	      var angle = (Math.pow(depth, 1.4) + depth) * (Math.PI / 10);
	      this.colorWheel.rotate(angle);
	      this.colorWheel.sat = 0.5 + depth / (7 * 2);
	      return this.colorWheel.asCSS();
	    }
	  }]);

	  return Sierpinski;
	}();

	exports.default = Sierpinski;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	The ColorWheel allows us to work with colors using
	Hue/Saturation/Value (HSV)  and then convert it to 
	Red/Green/Blue (RGB) for rendering

	HSV: 0 ≤ H < 2PI, 0 ≤ S ≤ 1 and 0 ≤ V ≤ 1:
	RGB: 0 ≤ R, G, B ≤ 255
	*/

	var ColorWheel = function () {
	  function ColorWheel(hue, sat, val) {
	    _classCallCheck(this, ColorWheel);

	    this.huePrimeLookup = function (x, c) {
	      return [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x], [0, 0, 0]];
	    };

	    this.hue = hue;
	    this.sat = sat;
	    this.val = val;
	  }

	  // Rotate hue in radians


	  _createClass(ColorWheel, [{
	    key: "rotate",
	    value: function rotate(angle) {
	      this.hue = (2 * Math.PI + this.hue + angle) % (2 * Math.PI);
	    }

	    // Converts HSV to CSS compatible string

	  }, {
	    key: "asCSS",
	    value: function asCSS() {
	      var _asRGB = this.asRGB(),
	          _asRGB2 = _slicedToArray(_asRGB, 3),
	          red = _asRGB2[0],
	          green = _asRGB2[1],
	          blue = _asRGB2[2];

	      return "rgb(" + red + ", " + green + ", " + blue + ")";
	    }

	    // Converts HSV to RGB

	  }, {
	    key: "asRGB",
	    value: function asRGB() {
	      // #1 - calculate inscrutable intermediate values
	      var h = this.hue / (Math.PI / 3);
	      var c = this.val * this.sat;
	      var x = c * (1 - Math.abs(h % 2 - 1));
	      var o = this.val - c;

	      // #2 - smash them together
	      var idx = Math.floor(h);
	      return this.huePrimeLookup(x, c)[idx].map(function (color) {
	        return color + o;
	      }).map(function (color) {
	        return Math.round(255 * color);
	      });
	    }
	  }]);

	  return ColorWheel;
	}();

	exports.default = ColorWheel;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _triangle = __webpack_require__(6);

	var _triangle2 = _interopRequireDefault(_triangle);

	var _colors = __webpack_require__(4);

	var _colors2 = _interopRequireDefault(_colors);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RPS = 1 / 60; // rotations per second
	var LOOP_DELAY = 30; // ms per timestep
	var BIRTH_RATE = 10; // timesteps per triangle
	var GROWTH_RATE = 1; // percent growth per timestep
	var NUM_ITERS = 800;
	var MAX_TRIANGLES = 50;
	var INIT_SIZE = 20;
	var INIT_COUNT = 18;
	var INIT_ROTATION = RPS * (LOOP_DELAY / 1000) * (2 * Math.PI);

	var Portal = function () {
	  function Portal() {
	    _classCallCheck(this, Portal);

	    this.periodic = function (value, max) {
	      return Math.abs(value % (2 * max) - max);
	    };

	    var canvas = document.getElementById('canvas');
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    this.ctx = canvas.getContext('2d');
	    this.initX = canvas.width / 2;
	    this.initY = canvas.height / 2;
	    this.rotation = INIT_ROTATION;
	    this.triangles = [new _triangle2.default(this.initX, this.initY, INIT_SIZE, 0)];

	    var initColor = 2 * Math.PI * Math.random();
	    this.colorWheel = new _colors2.default(initColor, 1, 1);
	  }

	  _createClass(Portal, [{
	    key: 'run',
	    value: function run() {
	      var _this = this;

	      this.counter = 0;
	      return new Promise(function (resolve) {
	        return _this.runLoop(resolve);
	      });
	    }
	  }, {
	    key: 'runLoop',
	    value: function runLoop(resolve) {
	      var _this2 = this;

	      var preRender = this.triangles.length < INIT_COUNT;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.triangles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var triangle = _step.value;

	          if (!preRender) {
	            this.drawShape(triangle);
	          }
	          triangle.rotate(this.rotation);
	          triangle.grow(1 + GROWTH_RATE / 100);
	        }

	        // Add new baby triangles
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      if (this.counter > 0 && this.counter % BIRTH_RATE === 0) {
	        this.triangles.push(new _triangle2.default(this.initX, this.initY, INIT_SIZE, 0));
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
	        this.finish(resolve);
	      } else if (preRender) {
	        this.runLoop(resolve);
	      } else {
	        setTimeout(function () {
	          return _this2.runLoop(resolve);
	        }, LOOP_DELAY);
	      }
	    }
	  }, {
	    key: 'finish',
	    value: function finish(resolve) {
	      var _this3 = this;

	      this.counter++;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.triangles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var triangle = _step2.value;

	          this.drawShape(triangle);
	          triangle.rotate(this.rotation);
	          triangle.grow(1 + GROWTH_RATE / 100);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      if (this.counter % 4 == 0) {
	        this.triangles.pop();
	        if (this.triangles.length < 20) {
	          return resolve();
	        }
	      }
	      setTimeout(function () {
	        return _this3.finish(resolve);
	      }, LOOP_DELAY);
	    }
	  }, {
	    key: 'drawShape',
	    value: function drawShape(shape) {
	      var points = shape.getPoints();
	      this.ctx.beginPath();
	      this.ctx.fillStyle = this.getColor(shape.radius);
	      this.ctx.moveTo(points[0][0], points[0][1]);
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = points.slice(1)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var point = _step3.value;

	          this.ctx.lineTo(point[0], point[1]);
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      this.ctx.closePath();
	      this.ctx.fill();
	    }
	  }, {
	    key: 'getColor',
	    value: function getColor(scalar) {
	      this.colorWheel.val = this.periodic(scalar / 1200, 1);
	      this.colorWheel.sat = this.periodic(1 - scalar / 800, 1);
	      return this.colorWheel.asCSS();
	    }
	  }]);

	  return Portal;
	}();

	exports.default = Portal;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _radialshape = __webpack_require__(7);

	var _radialshape2 = _interopRequireDefault(_radialshape);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Triangle = function (_RadialShape) {
	    _inherits(Triangle, _RadialShape);

	    function Triangle() {
	        _classCallCheck(this, Triangle);

	        return _possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).apply(this, arguments));
	    }

	    _createClass(Triangle, [{
	        key: 'getPoints',


	        // Get triangle points
	        value: function getPoints() {
	            return [[this._getX(0), this._getY(0)], [this._getX(1), this._getY(1)], [this._getX(2), this._getY(2)]];
	        }
	    }, {
	        key: '_getY',
	        value: function _getY(pointIdx) {
	            var offset = 2 * pointIdx * Math.PI / 3;
	            return this.y - this.radius * Math.cos(this.angle + offset);
	        }
	    }, {
	        key: '_getX',
	        value: function _getX(pointIdx) {
	            var offset = 2 * pointIdx * Math.PI / 3;
	            return this.x + this.radius * Math.sin(this.angle + offset);
	        }
	    }]);

	    return Triangle;
	}(_radialshape2.default);

	exports.default = Triangle;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	Vertical angle is 0
	Counter-clockwise is +ve
	The centroid of the triangle is (x, y)
	*/

	var RadialShape = function () {
	    function RadialShape(x, y, radius, angle) {
	        _classCallCheck(this, RadialShape);

	        this.x = x;
	        this.y = y;
	        this.radius = radius, this.angle = angle;
	    }

	    // Rotate shape by angle


	    _createClass(RadialShape, [{
	        key: "rotate",
	        value: function rotate(angle) {
	            this.angle += angle % (2 * Math.PI);
	        }

	        // Translate centroid of shape

	    }, {
	        key: "translate",
	        value: function translate(x, y) {
	            this.x += x;
	            this.y += y;
	        }

	        // Grow the radius by a factor

	    }, {
	        key: "grow",
	        value: function grow(factor) {
	            this.radius = this.radius * factor;
	        }

	        // Get shape points

	    }, {
	        key: "getPoints",
	        value: function getPoints() {
	            return [];
	        }
	    }]);

	    return RadialShape;
	}();

	exports.default = RadialShape;

/***/ })
/******/ ]);