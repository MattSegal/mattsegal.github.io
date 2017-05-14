var MAX_BARS = 100
var MIN_BARS = 10
var BARS_INC = 5
var MAX_VAL = 60
var MIN_VAL = 5
var VAL_INC = 5
var MAX_DELAY = 120
var MIN_DELAY = 0
var DELAY_INC = 10

var Controller = {
	init : function() {
		chartGridView.renderGrid(Model.arrayLength,Model.maxValue,this.setChart)
		controlPanelView.renderBarNum(Model.arrayLength)
		controlPanelView.renderValNum(Model.maxValue)
		controlPanelView.renderSpeedNum(Model.sortSpeed)
		this.setArrayRandom()
	},

	enterSortMode : function() {
		console.log('enter sort mode')
		Model.isSorting = true
		controlPanelView.hideButtons()
		Model.sortMethod = controlPanelView.getSortMethod()
		chartGridView.hide()
	},
	exitSortMode : function() {
		console.log('exit sort mode')
		Model.isSorting = false
		controlPanelView.showButtons()
		chartGridView.show()
	},
	setArrayRandom : function() {
		if (Model.isSorting) return
		Model.randomArray()
		chartView.renderArray(Model.array,Model.maxValue)
	},
	setArrayReverse : function() {
		if (Model.isSorting) return
		Model.reverseArray()
		chartView.renderArray(Model.array,Model.maxValue)
	},
	setMoreBar : function() {
		if (Model.arrayLength >= MAX_BARS) return
		Model.arrayLength+=BARS_INC
		controlPanelView.renderBarNum(Model.arrayLength)
		this.reDrawChart()
	},
	setLessBar : function() {
		if (Model.arrayLength <= MIN_BARS) return
		Model.arrayLength-=BARS_INC
		controlPanelView.renderBarNum(Model.arrayLength)
		this.reDrawChart()
	},
	setMoreVal : function() {
		if (Model.maxValue >= MAX_VAL) return
		Model.maxValue+=VAL_INC
		controlPanelView.renderValNum(Model.maxValue)
		this.reDrawChart()
	},
	setLessVal : function() {
		if (Model.maxValue <= MIN_VAL) return
		Model.maxValue-=VAL_INC
		controlPanelView.renderValNum(Model.maxValue)
		this.reDrawChart()
	},
	setMoreSpeed : function() {
		if (Model.sortSpeed >= MAX_DELAY) return
		Model.sortSpeed+=DELAY_INC
		controlPanelView.renderSpeedNum(Model.sortSpeed)
	},
	setLessSpeed : function() {
		if (Model.sortSpeed <= MIN_DELAY) return
		Model.sortSpeed-=DELAY_INC
		controlPanelView.renderSpeedNum(Model.sortSpeed)
	},
	reDrawChart : function() {
		chartGridView.clearGrid()
		this.setArrayRandom()
		chartGridView.renderGrid(Model.arrayLength,Model.maxValue,this.setChart)
	},
	setChart : function(row,col) {
		if (Model.isSorting) return
		var val = row + 1
		Model.array[col] = val
		chartView.setBarHeight(col,val,Model.maxValue)
	},
	sort : function() {
		if (Model.isSorting || Model.isSorted()) return
		this.enterSortMode()
		sortMove = Model.getSortMethod()
		this.sortLoop(sortMove)
	},
	sortLoop : function(sortMove) {
		var move = sortMove.next()
		if (move.done) {
			this.exitSortMode()
			return
		}
		chartView.toggleBarActive(move.value.idx)
		$timer(Model.sortSpeed,()=>{
			chartView.renderArray(Model.array,Model.maxValue)
			chartView.toggleBarActive(move.value.targetIdx) //moved
		}).then(()=>{
			return $timer(Model.sortSpeed,()=>{
				chartView.toggleBarActive(move.value.targetIdx) // moved
 				this.sortLoop(sortMove)
			})
		})
	},
	
}

var ctrlPanelAPI = {
		sort : Controller.sort.bind(Controller),
		random : Controller.setArrayRandom.bind(Controller),
		reverse : Controller.setArrayReverse.bind(Controller),
		moreBar : Controller.setMoreBar.bind(Controller),
		lessBar : Controller.setLessBar.bind(Controller),
		moreVal : Controller.setMoreVal.bind(Controller),
		lessVal : Controller.setLessVal.bind(Controller),
		moreSpeed : Controller.setMoreSpeed.bind(Controller),
		lessSpeed : Controller.setLessSpeed.bind(Controller),
}
