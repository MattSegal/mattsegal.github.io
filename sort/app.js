/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  HIDE_SELECTION_GRID: 'HIDE_SELECTION_GRID',
  SHOW_SELECTION_GRID: 'SHOW_SELECTION_GRID',
  DRAW_SELECTION_GRID: 'DRAW_SELECTION_GRID',

  HIDE_CONTROL_PANEL: 'HIDE_CONTROL_PANEL',
  SHOW_CONTROL_PANEL: 'SHOW_CONTROL_PANEL',
  DRAW_CONTROL_PANEL: 'DRAW_CONTROL_PANEL',

  DRAW_BAR_CHART: 'DRAW_BAR_CHART',
  DRAW_BAR_SWAP: 'DRAW_BAR_SWAP',
  DRAW_BAR_HEIGHT: 'DRAW_BAR_HEIGHT',
  DRAW_BAR_SECTION: 'DRAW_BAR_SECTION',
  DRAW_COMPARE: 'DRAW_COMPARE',

  UPDATE_BAR_HEIGHT: 'UPDATE_BAR_HEIGHT',
  UPDATE_SORT_METHOD: 'UPDATE_SORT_METHOD',

  SORT_ARRAY: 'SORT_ARRAY',
  SHUFFLE_ARRAY: 'SHUFFLE_ARRAY',
  REVERSE_ARRAY: 'REVERSE_ARRAY',

  INCREMENT_BARS: 'INCREMENT_BARS',
  DECREMENT_BARS: 'DECREMENT_BARS',
  INCREMENT_MAX_VALUE: 'INCREMENT_MAX_VALUE',
  DECREMENT_MAX_VALUE: 'DECREMENT_MAX_VALUE',
  INCREMENT_DELAY: 'INCREMENT_DELAY',
  DECREMENT_DELAY: 'DECREMENT_DELAY'
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bubbleSort = __webpack_require__(11);

var _bubbleSort2 = _interopRequireDefault(_bubbleSort);

var _cocktailSort = __webpack_require__(12);

var _cocktailSort2 = _interopRequireDefault(_cocktailSort);

var _insertionSort = __webpack_require__(13);

var _insertionSort2 = _interopRequireDefault(_insertionSort);

var _mergeSort = __webpack_require__(14);

var _mergeSort2 = _interopRequireDefault(_mergeSort);

var _constants = __webpack_require__(3);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// other sort possibilities
// selection sort
// quicksort!
// shell sort
// stooge sort

module.exports = {
  array: [],
  arrayLength: _constants2.default.INITIAL_BARS,
  maxValue: _constants2.default.INITIAL_VAL,
  sortDelay: _constants2.default.INITIAL_DELAY,
  sortMethod: 'mergeSort',
  isSorting: false,

  swap: function swap(i, j) {
    var temp = this.array[j];
    this.array[j] = this.array[i];
    this.array[i] = temp;
  },

  randomArray: function randomArray() {
    var _this = this;

    this.array = Array(this.arrayLength).fill(0).map(function () {
      return Math.ceil(_this.maxValue * Math.random());
    });
  },

  updateArray: function updateArray(array) {
    this.array = array;
  },

  reverseArray: function reverseArray() {
    this.array = this.array.sort(function (a, b) {
      return a - b;
    }).reverse();
  },

  runSort: function runSort(compare, swap, update) {
    // pass in array by value
    var arrayCopy = this.array.slice();
    switch (this.sortMethod) {
      case 'bubbleSort':
        (0, _bubbleSort2.default)(arrayCopy)(compare, swap);
        break;
      case 'insertionSort':
        (0, _insertionSort2.default)(arrayCopy)(compare, swap);
        break;
      case 'cocktailSort':
        (0, _cocktailSort2.default)(arrayCopy)(compare, swap);
        break;
      case 'mergeSort':
        (0, _mergeSort2.default)(arrayCopy)(compare, update);
        break;
    }
  },

  isSorted: function isSorted() {
    for (var idx = 0; idx < this.array.length; idx++) {
      if (this.array[idx] > this.array[idx + 1]) {
        return false;
      }
    }
    return true;
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Observer
module.exports = {
  events: {},

  addEvent: function addEvent(eventName, fn) {
    // add function to listener list for event
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },

  removeEvent: function removeEvent(eventName, fn) {
    // remove function from listener list for event
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(function (e) {
      return e != fn;
    });
  },

  emitEvent: function emitEvent(eventName, data) {
    var isData = typeof data !== "undefined";
    console.info('Observing ' + eventName + (isData ? ' (' + data + ')' : ''));
    if (!this.events[eventName]) return;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.events[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var func = _step.value;

        isData ? func.apply(undefined, _toConsumableArray(data)) : func();
      }
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
  }

};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  CHART_HEIGHT: 450, // pixels

  // Number of bars in chart
  INITIAL_BARS: 60,
  MAX_BARS: 100,
  MIN_BARS: 10,
  BARS_INCREMENT: 10,

  // Max value of each bar
  INITIAL_VAL: 100,
  MAX_VAL: 200,
  MIN_VAL: 10,
  VAL_INCREMENT: 10,

  // Sorting render delay (ms)
  INITIAL_DELAY: 100,
  MAX_DELAY: 300,
  MIN_DELAY: 40,
  DELAY_INCREMENT: 20
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _constants = __webpack_require__(3);

var _constants2 = _interopRequireDefault(_constants);

var _observer = __webpack_require__(2);

var _observer2 = _interopRequireDefault(_observer);

var _actions = __webpack_require__(0);

var _actions2 = _interopRequireDefault(_actions);

var _model = __webpack_require__(1);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// chartView
module.exports = {
  init: function init() {
    this.chartEl = document.getElementById('chart');
    this.prevI = null; // For rendering comparisons
    this.prevJ = null; // "   "          "
    this.prev = null; // For rendering swaps only
    _observer2.default.addEvent(_actions2.default.DRAW_BAR_CHART, this.renderArray.bind(this));
    _observer2.default.addEvent(_actions2.default.DRAW_BAR_SWAP, this.renderSwap.bind(this));
    _observer2.default.addEvent(_actions2.default.DRAW_BAR_HEIGHT, this.renderHeight.bind(this));
    _observer2.default.addEvent(_actions2.default.DRAW_COMPARE, this.renderCompare.bind(this));
    _observer2.default.addEvent(_actions2.default.DRAW_BAR_SECTION, this.renderSection.bind(this));
  },

  renderArray: function renderArray() {
    // Clear existing bars
    var elements = document.getElementsByClassName('bar');
    var numElements = elements.length;
    for (var idx = 0; idx < numElements; idx++) {
      // elements shrinks as children are deleted
      this.chartEl.removeChild(elements[0]);
    }

    // Render all bars
    var barStyleClass = this._getBarStyle(_model2.default.array.length);
    for (var _idx = 0; _idx < _model2.default.array.length; _idx++) {
      var barHTML = '<div id="' + _idx + '" class="bar ' + barStyleClass + '"></div>';
      this.chartEl.insertAdjacentHTML('beforeend', barHTML);
      var barEl = document.getElementById(_idx);
      barEl.style.height = this._getBarHeight(_idx) + 'px';
    }
  },

  renderSection: function renderSection(start, length) {
    for (var i = start; i < start + length; i++) {
      this.renderHeight(i);
    }
  },

  renderHeight: function renderHeight(idx) {
    var bar = document.getElementById(idx);
    bar.style.height = this._getBarHeight(idx) + 'px';
  },

  renderSwap: function renderSwap(i, j) {
    var barI = document.getElementById(i);
    var barJ = document.getElementById(j);
    var heightI = barI.style.height;
    barI.style.height = barJ.style.height;
    barJ.style.height = heightI;

    // If we are rendering comparisons,
    // then we want to show swap
    if (this.prevI || this.prevJ) this.renderCompare(j, i);
    // Otherwise we should just highlight element j 
    else {
        document.getElementById(i).classList.add('i');
        if (this.prev !== null && this.prev !== i) document.getElementById(this.prev).classList.remove('i');
        this.prev = i;
      }
  },

  renderCompare: function renderCompare(i, j) {
    var barI = document.getElementById(i);
    var barJ = document.getElementById(j);

    // Update bar 'i'
    if (i !== this.prevI) {
      barI.classList.add('i');
      if (i === this.prevJ) {
        barI.classList.remove('j');
      }
      if (this.prevI !== null) {
        document.getElementById(this.prevI).classList.remove('i');
      }
    }

    // Update bar 'j'
    if (j !== this.prevJ) {
      barJ.classList.add('j');
      if (j === this.prevI) {
        barJ.classList.remove('i');
      }
      if (this.prevJ !== null) {
        document.getElementById(this.prevJ).classList.remove('j');
      }
    }

    this.prevI = i;
    this.prevJ = j;
  },

  _getBarHeight: function _getBarHeight(idx) {
    return _constants2.default.CHART_HEIGHT * (_model2.default.array[idx] / _model2.default.maxValue);
  },

  _getBarStyle: function _getBarStyle(length) {
    if (length < 30) {
      return 'thin-bar';
    } else if (length >= 60) {
      return 'fatter-bar';
    } else if (length >= 40) {
      return 'fat-bar';
    } else {
      // 40 > length >= 30
      return 'mid-bar';
    }
  },

  // unused
  toggleBarActive: function toggleBarActive(idx) {
    var activeColor = "rgb(255, 102, 102)";
    var defaultColor = "rgb(119, 119, 119)";
    var el = document.getElementById(idx);
    if (el.style.backgroundColor === activeColor) {
      el.style.backgroundColor = defaultColor;
    } else {
      el.style.backgroundColor = activeColor;
    }
  },

  // unused
  toggleBarMoved: function toggleBarMoved(idx) {
    var activeColor = "rgb(73, 238, 127)";
    var defaultColor = "rgb(119, 119, 119)";
    var el = document.getElementById(idx);
    if (el.style.backgroundColor === activeColor) {
      el.style.backgroundColor = defaultColor;
    } else {
      el.style.backgroundColor = activeColor;
    }
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _observer = __webpack_require__(2);

var _observer2 = _interopRequireDefault(_observer);

var _actions = __webpack_require__(0);

var _actions2 = _interopRequireDefault(_actions);

var _model = __webpack_require__(1);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//controlPanelView
module.exports = {

  init: function init() {
    var _this = this;

    // cache the DOM
    this.controlPanel = document.getElementById('control-panel');
    this.headerTag = document.getElementsByTagName('header')[0];
    this.sortRadios = document.getElementsByName('sort-method');
    this.barNumberDisplay = document.getElementById('bar-num');
    this.valueNumberDisplay = document.getElementById('value-num');
    this.speedNumberDisplay = document.getElementById('speed-num');

    // bind events
    var getEl = function getEl(id) {
      return document.getElementById(id);
    };
    getEl('sortBtn').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.SORT_ARRAY);
    });
    getEl('randomBtn').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.SHUFFLE_ARRAY);
    });
    getEl('reverseBtn').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.REVERSE_ARRAY);
    });
    var sortRadioDiv = document.getElementsByClassName('sort-method-options')[0];
    sortRadioDiv.addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.UPDATE_SORT_METHOD, [_this.getSortMethod()]);
    });
    getEl('more-bars').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.INCREMENT_BARS);
    });
    getEl('less-bars').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.DECREMENT_BARS);
    });
    getEl('more-value').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.INCREMENT_MAX_VALUE);
    });
    getEl('less-value').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.DECREMENT_MAX_VALUE);
    });
    getEl('more-speed').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.INCREMENT_DELAY);
    });
    getEl('less-speed').addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.DECREMENT_DELAY);
    });

    // register events
    _observer2.default.addEvent(_actions2.default.HIDE_CONTROL_PANEL, this.hideButtons.bind(this));
    _observer2.default.addEvent(_actions2.default.SHOW_CONTROL_PANEL, this.showButtons.bind(this));
    _observer2.default.addEvent(_actions2.default.DRAW_CONTROL_PANEL, this.render.bind(this));
  },

  hideButtons: function hideButtons() {
    this.controlPanel.style.display = 'none';
    this.headerTag.style.opacity = 0;
  },

  showButtons: function showButtons() {
    this.controlPanel.style.display = 'flex';
    this.headerTag.style.opacity = 1;
  },

  render: function render() {
    this.barNumberDisplay.innerHTML = _model2.default.arrayLength;
    this.valueNumberDisplay.innerHTML = _model2.default.maxValue;
    this.speedNumberDisplay.innerHTML = _model2.default.sortDelay;
  },

  getSortMethod: function getSortMethod() {
    for (var i = 0; i < this.sortRadios.length; i++) {
      if (this.sortRadios[i].checked) {
        return this.sortRadios[i].value;
      }
    }
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _observer = __webpack_require__(2);

var _observer2 = _interopRequireDefault(_observer);

var _actions = __webpack_require__(0);

var _actions2 = _interopRequireDefault(_actions);

var _model = __webpack_require__(1);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {

  init: function init() {
    this.gridElelement = document.getElementsByClassName('chart-grid')[0];
    _observer2.default.addEvent(_actions2.default.HIDE_SELECTION_GRID, this.hide.bind(this));
    _observer2.default.addEvent(_actions2.default.SHOW_SELECTION_GRID, this.show.bind(this));
    _observer2.default.addEvent(_actions2.default.DRAW_SELECTION_GRID, this.render.bind(this));
  },

  hide: function hide() {
    this.gridElelement.style.display = 'none';
  },

  show: function show() {
    this.gridElelement.style.display = 'flex';
  },

  render: function render() {
    this._clear();
    var colEl;
    for (var col = 0; col < _model2.default.arrayLength; col++) {
      colEl = this._renderColumn(col);
      for (var row = 0; row < _model2.default.maxValue; row++) {
        this._renderRow(colEl, row, col);
      }
    }
  },

  _clear: function _clear() {
    var elList = this.gridElelement.children;
    var len = elList.length;
    for (var idx = len - 1; idx >= 0; idx--) {
      this.gridElelement.removeChild(elList[idx]);
    }
  },

  _renderColumn: function _renderColumn(col) {
    var columnHTML = '<div id="col' + col + '" class="col"></div>';
    this.gridElelement.insertAdjacentHTML('beforeend', columnHTML);
    return document.getElementById('col' + col);
  },

  _renderRow: function _renderRow(parentColumn, row, col) {
    var rowHTML = '<div id="' + row + '-' + col + '" class="row"></div>';
    parentColumn.insertAdjacentHTML('beforeend', rowHTML);
    document.getElementById(row + '-' + col).addEventListener('click', function () {
      return _observer2.default.emitEvent(_actions2.default.UPDATE_BAR_HEIGHT, [row, col]);
    });
  }

};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(16)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.sass", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _style = __webpack_require__(7);

var _style2 = _interopRequireDefault(_style);

var _constants = __webpack_require__(3);

var _constants2 = _interopRequireDefault(_constants);

var _model = __webpack_require__(1);

var _model2 = _interopRequireDefault(_model);

var _observer = __webpack_require__(2);

var _observer2 = _interopRequireDefault(_observer);

var _actions = __webpack_require__(0);

var _actions2 = _interopRequireDefault(_actions);

var _selectionGridView = __webpack_require__(6);

var _selectionGridView2 = _interopRequireDefault(_selectionGridView);

var _controlPanelView = __webpack_require__(5);

var _controlPanelView2 = _interopRequireDefault(_controlPanelView);

var _chartView = __webpack_require__(4);

var _chartView2 = _interopRequireDefault(_chartView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// When in doubt, redraw *everything*
var refreshScreen = function refreshScreen() {
  _model2.default.randomArray();
  _observer2.default.emitEvent(_actions2.default.DRAW_SELECTION_GRID);
  _observer2.default.emitEvent(_actions2.default.DRAW_CONTROL_PANEL);
  _observer2.default.emitEvent(_actions2.default.DRAW_BAR_CHART);
};

// Kick off array sorting event loop on user click
_observer2.default.addEvent(_actions2.default.SORT_ARRAY, function () {
  if (_model2.default.isSorted()) return;
  _model2.default.isSorting = true;
  _observer2.default.emitEvent(_actions2.default.HIDE_CONTROL_PANEL);
  _observer2.default.emitEvent(_actions2.default.HIDE_SELECTION_GRID);

  // Build up and in-memory list of actions to replay for the user
  var actions = [];
  var compare = function compare(i, j) {
    return actions.push({ type: 'COMPARE', i: i, j: j });
  };
  var swap = function swap(i, j) {
    return actions.push({ type: 'SWAP', i: i, j: j });
  };
  var update = function update(arr, start) {
    return actions.push({ type: 'UPDATE', arr: arr, start: start });
  };

  _model2.default.runSort(compare, swap, update);

  // Loop over sort actions and render for user
  var idx = 0;
  var id = setInterval(function () {
    var action = actions[idx];

    // Replay action
    if (action.type === 'COMPARE') {
      _observer2.default.emitEvent(_actions2.default.DRAW_COMPARE, [action.i, action.j]);
    } else if (action.type === 'SWAP') {
      _model2.default.swap(action.i, action.j);
      _observer2.default.emitEvent(_actions2.default.DRAW_BAR_SWAP, [action.i, action.j]);
    }

    // Don't wait for updates
    if (action.type === 'UPDATE') {
      for (var i = 0; i < action.arr.length; i++) {
        _model2.default.array[action.start + i] = action.arr[i];
      }
      _observer2.default.emitEvent(_actions2.default.DRAW_BAR_SECTION, [action.start, action.arr.length]);
    }

    idx += 1;
    if (idx === actions.length) {
      clearInterval(id);
      _model2.default.isSorting = false;
      _observer2.default.emitEvent(_actions2.default.SHOW_CONTROL_PANEL);
      _observer2.default.emitEvent(_actions2.default.SHOW_SELECTION_GRID);
    }
  }, _model2.default.sortDelay);
});

// Update bar height when user clicks the grid
_observer2.default.addEvent(_actions2.default.UPDATE_BAR_HEIGHT, function (rowIdx, colIdx) {
  var newValue = rowIdx + 1;
  _model2.default.array[colIdx] = newValue;
  _observer2.default.emitEvent(_actions2.default.DRAW_BAR_HEIGHT, [colIdx]);
});

// Update sort method on user radio-button click
_observer2.default.addEvent(_actions2.default.UPDATE_SORT_METHOD, function (method) {
  // FIXME: This fires twice for some reason
  _model2.default.sortMethod = method;
});

// Shuffle bar chart on user button click
_observer2.default.addEvent(_actions2.default.SHUFFLE_ARRAY, function () {
  _model2.default.randomArray();
  _observer2.default.emitEvent(_actions2.default.DRAW_BAR_CHART);
});

// Reverse sort bar chart on user button click
_observer2.default.addEvent(_actions2.default.REVERSE_ARRAY, function () {
  _model2.default.reverseArray();
  _observer2.default.emitEvent(_actions2.default.DRAW_BAR_CHART);
});

// Increase number of bars in chart on user click
_observer2.default.addEvent(_actions2.default.INCREMENT_BARS, function () {
  if (_model2.default.arrayLength >= _constants2.default.MAX_BARS) return;
  _model2.default.arrayLength += _constants2.default.BARS_INCREMENT;
  refreshScreen();
});

// Decrease number of bars in chart on user click
_observer2.default.addEvent(_actions2.default.DECREMENT_BARS, function () {
  if (_model2.default.arrayLength <= _constants2.default.MIN_BARS) return;
  _model2.default.arrayLength -= _constants2.default.BARS_INCREMENT;
  refreshScreen();
});

// Increase maximum possible bar value on user click
_observer2.default.addEvent(_actions2.default.INCREMENT_MAX_VALUE, function () {
  if (_model2.default.maxValue >= _constants2.default.MAX_VAL) return;
  _model2.default.maxValue += _constants2.default.VAL_INCREMENT;
  refreshScreen();
});

// Decrease maximum possible bar value on user click
_observer2.default.addEvent(_actions2.default.DECREMENT_MAX_VALUE, function () {
  if (_model2.default.maxValue <= _constants2.default.MIN_VAL) return;
  _model2.default.maxValue -= _constants2.default.VAL_INCREMENT;
  refreshScreen();
});

// Increase timing delay on user click
_observer2.default.addEvent(_actions2.default.INCREMENT_DELAY, function () {
  if (_model2.default.sortDelay >= _constants2.default.MAX_DELAY) return;
  _model2.default.sortDelay += _constants2.default.DELAY_INCREMENT;
  _observer2.default.emitEvent(_actions2.default.DRAW_CONTROL_PANEL);
});

// Decrease timing delay on user click
_observer2.default.addEvent(_actions2.default.DECREMENT_DELAY, function () {
  if (_model2.default.sortDelay <= _constants2.default.MIN_DELAY) return;
  _model2.default.sortDelay -= _constants2.default.DELAY_INCREMENT;
  _observer2.default.emitEvent(_actions2.default.DRAW_CONTROL_PANEL);
});

// Initialise views
_selectionGridView2.default.init();
_controlPanelView2.default.init();
_chartView2.default.init();
refreshScreen();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bubbleSort = function bubbleSort(array) {
  return function (compare, swap) {
    var temp = void 0;
    for (var end = array.length - 1; end > 0; end--) {
      for (var idx = 0; idx < end; idx++) {
        compare(idx, idx + 1);
        if (array[idx] > array[idx + 1]) {
          swap(idx, idx + 1);
          temp = array[idx];
          array[idx] = array[idx + 1];
          array[idx + 1] = temp;
        }
      }
    }
  };
};

module.exports = bubbleSort;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cocktailSort = function cocktailSort(array) {
  return function (compare, swap) {
    var end = array.length - 1;
    var swapped = true;
    var idx = void 0,
        temp = void 0;
    while (swapped) {
      swapped = false;

      // Scan from start to end
      for (idx = 0; idx < end; idx++) {
        compare(idx, idx + 1);
        if (array[idx] > array[idx + 1]) {
          temp = array[idx];
          array[idx] = array[idx + 1];
          array[idx + 1] = temp;
          swapped = true;
          swap(idx, idx + 1);
        }
      }

      // If no swaps were done, then the array is sorted
      if (!swapped) break;

      // Otherwise, scan from end back to start
      for (idx = end; idx > 0; idx--) {
        compare(idx, idx - 1);
        if (array[idx] < array[idx - 1]) {
          temp = array[idx];
          array[idx] = array[idx - 1];
          array[idx - 1] = temp;
          swap(idx, idx - 1);
        }
      }
    }
  };
};

module.exports = cocktailSort;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var insertionSort = function insertionSort(array) {
    return function (compare, swap) {
        // Don't render compares - too weird to visualise
        var i = void 0,
            j = void 0,
            temp = void 0,
            key = void 0;
        for (j = 1; j < array.length; j++) {
            key = array[j];
            i = j - 1;
            while (i >= 0 && array[i] > key) {
                compare(i + 1, i);
                temp = array[i + 1];
                array[i + 1] = array[i];
                array[i] = temp;
                swap(i + 1, i);
                i--;
            }
        }
    };
};

module.exports = insertionSort;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mergeSort = function mergeSort(arr) {
    return function (compare, update) {
        if (arr.length <= 1) return arr;

        // Initialise absolute index tracking
        arr.start = arr.start || 0;
        arr.end = arr.end || arr.length;

        // Split array roughly in half
        var splitIdx = arr.length % 2 === 0 ? arr.length / 2 : (arr.length + 1) / 2;

        var A = arr.slice(0, splitIdx);
        A.start = arr.start;
        A.end = arr.start + splitIdx;

        var B = arr.slice(splitIdx);
        B.start = arr.start + splitIdx;
        B.end = arr.end;

        var ASorted = mergeSort(A)(compare, update);
        var BSorted = mergeSort(B)(compare, update);
        return merge(ASorted, BSorted)(compare, update);
    };
};

var merge = function merge(A, B) {
    return function (compare, update) {
        var C = Array(A.length + B.length);
        C.start = A.start;
        C.end = B.end;

        var idxA = 0;
        var idxB = 0;

        for (var idxC = 0; idxC < C.length; idxC++) {
            compare(C.start + idxC, C.start + A.length - 1 + idxB);
            if (idxA === A.length) {
                // We've exhausted A, use the rest of B
                C[idxC] = B[idxB];
                idxB++;
            } else if (idxB === B.length) {
                // We've exhausted B, use the rest of A
                C[idxC] = A[idxA];
                idxA++;
            } else if (A[idxA] < B[idxB]) {
                // A is smaller, select A
                C[idxC] = A[idxA];
                idxA++;
            } else {
                // B is smaller, select B
                C[idxC] = B[idxB];
                idxB++;
                update(buildSection(A, B, C, idxA, idxB, idxC), C.start);
            }
        }
        return C;
    };
};

var buildSection = function buildSection(A, B, C, idxA, idxB, idxC) {
    return C.slice(0, idxC + 1).concat(A.slice(idxA)).concat(B.slice(idxB));
};

module.exports = mergeSort;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(undefined);
// imports


// module
exports.push([module.i, "html, body {\n  margin: 0;\n  padding: 0; }\n\nbody {\n  background-color: #ddd;\n  font-family: 'Open Sans', sans-serif; }\n\nheader {\n  background-color: #ddd;\n  width: 600px;\n  border-radius: 5px;\n  height: 50px;\n  margin: 10px auto 0 auto;\n  text-align: center;\n  line-height: 50px;\n  font-family: \"Signika\";\n  font-size: 30px;\n  color: #444; }\n\n@media (max-height: 760px) {\n  header {\n    height: 15px;\n    margin: 5px auto 0 auto;\n    line-height: 15px;\n    font-size: 15px; } }\n\n#chart {\n  background-color: #ddd;\n  width: 600px;\n  height: 450px;\n  margin: 10px auto 0 auto;\n  position: relative;\n  display: flex;\n  justify-content: space-around;\n  align-items: flex-end; }\n\n.chart-grid {\n  position: absolute;\n  top: 0px;\n  box-sizing: border-box;\n  width: 600px;\n  height: 450px;\n  cursor: pointer;\n  display: flex; }\n  .chart-grid .col {\n    box-sizing: border-box;\n    height: 450px;\n    width: 100%;\n    display: flex;\n    flex-direction: column-reverse; }\n  .chart-grid .row {\n    z-index: 2;\n    box-sizing: border-box;\n    height: 100%;\n    width: 100%;\n    border-radius: 5px; }\n    .chart-grid .row:hover {\n      border: 4px solid #ff6464; }\n\n.bar {\n  width: 100%;\n  height: 200px;\n  box-sizing: border-box;\n  background-color: #777;\n  border-radius: 5px 5px 0 0; }\n  .bar.i {\n    background-color: #e77; }\n  .bar.j {\n    background-color: #7e7; }\n  .bar.i.j {\n    background-color: #e77; }\n  .bar.thin-bar {\n    margin: 0 2px;\n    border: 2px solid #fff; }\n  .bar.mid-bar {\n    margin: 0 1px;\n    border: 2px solid #fff; }\n  .bar.fat-bar {\n    margin: 0 0px;\n    border: 2px solid #fff; }\n  .bar.fatter-bar {\n    margin: 0 0px;\n    border: 1px solid #fff; }\n\n.control-panel {\n  width: 600px;\n  height: 235px;\n  border-radius: 5px;\n  background-color: #ddd;\n  box-sizing: border-box;\n  display: flex;\n  margin: 10px auto 0 auto;\n  padding: 10px;\n  -webkit-user-select: none;\n  /* Chrome/Safari */\n  -moz-user-select: none;\n  /* Firefox */\n  -ms-user-select: none;\n  /* IE10+ */ }\n  .control-panel .controls {\n    width: 100%; }\n  .control-panel .sort-method-options {\n    width: 100%;\n    display: flex;\n    flex-direction: column; }\n\n.input, button, .method-title, .radio-input, .selector {\n  height: 30px;\n  font-size: 20px;\n  font: 20px normal 'Open Sans';\n  margin-bottom: 5px; }\n\n.button-color, button, .selector .incrementor {\n  background: #e0e0e0;\n  background-image: linear-gradient(#f0f0f0, #e0e0e0); }\n  .button-color:hover, button:hover, .selector .incrementor:hover {\n    background: #c8c8c8;\n    background-image: linear-gradient(#f0f0f0, #c8c8c8); }\n\nbutton {\n  width: calc(100% / 3 - 7px);\n  border-radius: 5px;\n  margin: 0 5px 10px 0;\n  cursor: pointer;\n  box-shadow: 1px 1px 2px 1px #888;\n  border: none;\n  font-size: 15px; }\n  button:nth-child(3) {\n    margin-right: 0; }\n\n.method-title {\n  margin-left: 20%;\n  border-bottom: 2px solid #888;\n  box-sizing: border-box;\n  width: 160px; }\n\n.method-title, label {\n  font-size: 15px; }\n\n.radio-input {\n  margin-left: 20%;\n  width: 150px;\n  height: 20px; }\n\ninput[type=radio] {\n  display: none; }\n\ninput[type=radio] + label > span {\n  display: inline-block;\n  width: 0.8em;\n  height: 0.8em;\n  float: right;\n  margin: 0.25em 0 0.25em 0;\n  vertical-align: bottom;\n  border-radius: 0.25em;\n  background: #e0e0e0;\n  background-image: linear-gradient(#f0f0f0, #e0e0e0);\n  box-shadow: 1px 1px 2px 1px #888; }\n\ninput[type=radio]:checked + label > span > span {\n  display: block;\n  width: 0.5em;\n  height: 0.5em;\n  margin: 0.15em auto;\n  border-radius: 0.15em;\n  background-image: linear-gradient(#e67864, #e63232); }\n\n.selector {\n  display: flex;\n  justify-content: space-between; }\n  .selector .selector-title {\n    width: 200px;\n    font-size: 15px; }\n  .selector .incrementor {\n    margin-left: 0.5em;\n    width: 1em;\n    height: 1em;\n    border-radius: 0.25em;\n    box-shadow: 1px 1px 2px 1px #888;\n    cursor: pointer; }\n  .selector .more:before, .selector .less:before {\n    display: block;\n    line-height: 1em;\n    text-align: center; }\n  .selector .more:before {\n    content: '+'; }\n  .selector .less:before {\n    content: '-'; }\n  .selector .display-num {\n    float: right;\n    width: 50px;\n    text-align: right;\n    font-size: 15px; }\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);

	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ })
/******/ ]);