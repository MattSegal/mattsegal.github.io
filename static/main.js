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

	var _portal = __webpack_require__(4);

	var _portal2 = _interopRequireDefault(_portal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Draw random automata at random scales forever
	var loopRandomAutomata = function loopRandomAutomata() {
	  var guess = Math.random();
	  var animation = void 0;
	  if (guess < 0) {
	    animation = _automata2.default.getRandomAutomata();
	  } else if (guess < 0) {
	    animation = new _recursive2.default();
	  } else {
	    animation = new _portal2.default();
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


	var _rules = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WHITE = 'rgb(240, 240, 240)';
	var BLACK = 'rgb(200, 200, 200)';
	var MAX_SCALE = 3;
	var MIN_CELL_LENGTH = 1; // px
	var MIN_LOOP_DELAY = 15; // ms
	var END_DELAY = 3000; // ms


	// Draws the given automata to the screen, row-by-row

	var Automata = function () {
	  function Automata(rule, scale, startMiddle) {
	    _classCallCheck(this, Automata);

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
	    if (startMiddle) {
	      grid[top][Math.floor(grid[0].length / 2)] = 1;
	    } else {
	      grid[top][Math.floor(grid[0].length / 2)] = 1;
	      grid[top][0] = 1;
	      grid[top][grid[0].length - 1] = 1;
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
	      var start = 180;
	      var diff = Math.max(this.middle - i, -start);
	      diff = isTop ? diff : -diff;
	      var colors = [125, 125, 125];

	      if (isTop) {
	        colors[1] += Math.floor(diff / 2 * this.scale);
	        colors[2] += Math.floor(diff / 2 * this.scale);
	      } else {
	        colors[0] += Math.floor(diff / 2 * this.scale);
	        colors[1] -= Math.floor(diff / 2 * this.scale);
	      }
	      return 'rgb(' + colors[0] + ', ' + colors[1] + ', ' + colors[2] + ')';
	    }
	  }], [{
	    key: 'getRandomAutomata',
	    value: function getRandomAutomata() {
	      var ruleIdx = Math.floor(Math.random() * _rules.rules.length);
	      var scale = Math.ceil(Math.random() * MAX_SCALE);
	      var startMiddle = Math.random() < 0.5;
	      var rule = (0, _rules.ruleFactory)(ruleIdx);
	      return new Automata(rule, scale, startMiddle);
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
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WHITE = 'rgb(240, 240, 240)';
	var BLACK = 'rgb(200, 200, 200)';
	var LOOP_DELAY = 50; // ms
	var NUM_ITERS = 3280; // 3**8 / 2 for some reason

	var Sierpinski = function () {
	  function Sierpinski() {
	    _classCallCheck(this, Sierpinski);

	    this.colors = [[255, 20, 160], [200, 20, 200], [160, 20, 230], [125, 20, 255], [20, 0, 255], [255, 0, 255], [20, 20, 20], [60, 255, 60]];

	    var canvas = document.getElementById('canvas');
	    this.setSize(canvas);
	    this.ctx = canvas.getContext('2d');
	    this.queue = [];
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

	    // I decided to hard code some colors after hours of messing around

	  }, {
	    key: 'getColor',
	    value: function getColor(depth) {
	      // depth is 0 to 7
	      var colors = this.colors[depth];
	      return 'rgb(' + colors[0] + ', ' + colors[1] + ', ' + colors[2] + ')';
	    }
	  }]);

	  return Sierpinski;
	}();

	exports.default = Sierpinski;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _triangle = __webpack_require__(5);

	var _triangle2 = _interopRequireDefault(_triangle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LOOP_DELAY = 50; // ms
	var NUM_ITERS = 100; // 3**8 / 2 for some reason
	var MAX_TRIANGLES = 10;

	var Portal = function () {
	  function Portal() {
	    _classCallCheck(this, Portal);

	    var canvas = document.getElementById('canvas');
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    this.ctx = canvas.getContext('2d');
	    this.initX = canvas.width / 2;
	    this.initY = canvas.height / 2;
	    this.triangles = [new _triangle2.default(this.initX, this.initY, 100, 0)];
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

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.triangles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var triangle = _step.value;

	          this.drawTriangle(triangle);
	          triangle.rotate(Math.PI / 6);
	          triangle.grow(1.1);
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

	      if (this.counter > 0 && this.counter % 5 === 0) {
	        this.triangles.push(new _triangle2.default(this.initX, this.initY, 100, 0));
	      }

	      // Kill triangles who are too old to be useful
	      if (this.triangles.length > MAX_TRIANGLES) {
	        this.triangles.shift();
	      }

	      this.counter++;
	      if (this.counter >= NUM_ITERS) {
	        resolve();
	      } else {
	        setTimeout(function () {
	          return _this2.runLoop(resolve);
	        }, LOOP_DELAY);
	      }
	    }
	  }, {
	    key: 'drawTriangle',
	    value: function drawTriangle(triangle) {
	      var points = triangle.getPoints();
	      this.ctx.beginPath();
	      this.ctx.fillStyle = this.getColor(triangle.radius);
	      this.ctx.moveTo(points[0][0], points[0][1]);
	      this.ctx.lineTo(points[1][0], points[1][1]);
	      this.ctx.lineTo(points[2][0], points[2][1]);
	      this.ctx.closePath();
	      this.ctx.fill();
	    }
	  }, {
	    key: 'getColor',
	    value: function getColor(scalar) {
	      var color = Math.floor(scalar % 255);
	      return 'rgb(' + color + ', ' + color + ', ' + color + ')';
	    }
	  }]);

	  return Portal;
	}();

	exports.default = Portal;

/***/ }),
/* 5 */
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

	var Triangle = function () {
	    function Triangle(x, y, radius, angle) {
	        _classCallCheck(this, Triangle);

	        this.x = x;
	        this.y = y;
	        this.radius = radius, this.angle = angle;
	    }

	    // Rotate triangle by angle


	    _createClass(Triangle, [{
	        key: "rotate",
	        value: function rotate(angle) {
	            this.angle += angle % (2 * Math.PI);
	        }

	        // Translate centroid of triangle

	    }, {
	        key: "translate",
	        value: function translate(x, y) {
	            this.x += x;
	            this.y += y;
	        }

	        // Grow the radius by a number

	    }, {
	        key: "grow",
	        value: function grow(factor) {
	            this.radius = this.radius * factor;
	        }

	        // Get triangle points

	    }, {
	        key: "getPoints",
	        value: function getPoints() {
	            return [[this._getX(0), this._getY(0)], [this._getX(1), this._getY(1)], [this._getX(2), this._getY(2)]];
	        }
	    }, {
	        key: "_getY",
	        value: function _getY(pointIdx) {
	            var offset = 2 * pointIdx * Math.PI / 3;
	            return this.y - this.radius * Math.cos(this.angle + offset);
	        }
	    }, {
	        key: "_getX",
	        value: function _getX(pointIdx) {
	            var offset = 2 * pointIdx * Math.PI / 3;
	            return this.x + this.radius * Math.sin(this.angle + offset);
	        }
	    }]);

	    return Triangle;
	}();

	exports.default = Triangle;

/***/ })
/******/ ]);