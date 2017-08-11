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

	var _automata = __webpack_require__(2);

	var _automata2 = _interopRequireDefault(_automata);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Draw random automata at random scales forever
	var loopRandomAutomata = function loopRandomAutomata() {
	  var automata = _automata2.default.getRandomAutomata();
	  automata.run().then(loopRandomAutomata);
	};

	// Run script
	loopRandomAutomata();

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Automata - Draws a bunch of cellular automata to an HTML5 canvas
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Inspired by http://blog.stephenwolfram.com/2017/06/oh-my-gosh-its-covered-in-rule-30s/
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


	var _rules = __webpack_require__(1);

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

	    this.rule = rule;
	    var canvas = document.getElementById('canvas');
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    this.ctx = canvas.getContext('2d');

	    this.loop_delay = MIN_LOOP_DELAY * scale;
	    this.cell_length = MIN_CELL_LENGTH * scale;
	    var num_rows = 2 * Math.ceil(canvas.height / (2 * this.cell_length));
	    var num_cols = 2 * Math.ceil(canvas.width / (2 * this.cell_length));
	    var top = Math.floor(num_rows / 2); // row indices
	    var bot = top;

	    // Initialise grid model - fill the top half with white, bottom half black
	    var grid = Array(num_rows).fill(0).map(function (row, rowIdx) {
	      return rowIdx > bot ? Array(num_cols).fill(1) : Array(num_cols).fill(0);
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
	        _this.renderGrid();
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
	          _this.renderRow(_this.grid[top], top);
	          _this.renderRow(_this.grid[bot], bot);
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
	  }, {
	    key: 'renderGrid',
	    value: function renderGrid() {
	      for (var i = 0; i < this.grid.length; i++) {
	        for (var j = 0; j < this.grid[i].length; j++) {
	          this.drawCell(i, j);
	        }
	      }
	    }
	  }, {
	    key: 'renderRow',
	    value: function renderRow(row, i) {
	      for (var j = 0; j < row.length; j++) {
	        this.drawCell(i, j);
	      }
	    }
	  }, {
	    key: 'drawCell',
	    value: function drawCell(i, j) {
	      var c = this.cell_length;
	      this.ctx.fillStyle = this.grid[i][j] ? BLACK : WHITE;
	      this.ctx.fillRect(j * c, i * c, c, c);
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

/***/ })
/******/ ]);