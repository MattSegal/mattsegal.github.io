

var controlPanelView = (function(notifyCtrl) {
	// cache the DOM
	var controlPanel = document.getElementById('control-panel')
	var headerTag = document.getElementsByTagName('header')[0] 
	var sortBtn = document.getElementById('sortBtn')
	var randomBtn = document.getElementById('randomBtn')
	var reverseBtn = document.getElementById('reverseBtn')
	var sortRadios =  document.getElementsByName('sort-method')
	var sortRadioDiv = document.getElementsByClassName('sort-method-options')[0]
	// increment bars
	var moreBarsBtn = document.getElementById('more-bars') 
	var lessBarsBtn = document.getElementById('less-bars') 
	var barNumDisplay = document.getElementById('bar-num') 
	// increment max value
	var moreValBtn = document.getElementById('more-value') 
	var lessValBtn = document.getElementById('less-value') 
	var valNumDisplay = document.getElementById('value-num') 
	// increment speed
	var moreSpeedBtn = document.getElementById('more-speed') 
	var lessSpeedBtn = document.getElementById('less-speed') 
	var speedNumDisplay = document.getElementById('speed-num') 

	// bind events
	sortBtn.addEventListener('click',notifyCtrl.sort)
	randomBtn.addEventListener('click',notifyCtrl.random)
	reverseBtn.addEventListener('click',notifyCtrl.reverse)
	// bars
	moreBarsBtn.addEventListener('click',notifyCtrl.moreBar)
	lessBarsBtn.addEventListener('click',notifyCtrl.lessBar)
	// val
	moreValBtn.addEventListener('click',notifyCtrl.moreVal)
	lessValBtn.addEventListener('click',notifyCtrl.lessVal)
	// speed
	moreSpeedBtn.addEventListener('click',notifyCtrl.moreSpeed)
	lessSpeedBtn.addEventListener('click',notifyCtrl.lessSpeed)

	function hideButtons() {
		controlPanel.style.display = 'none'
		headerTag.style.opacity = 0
	}
	function showButtons() {
		controlPanel.style.display = 'flex'
		headerTag.style.opacity = 1
	}
	function renderBarNum(num) {
		barNumDisplay.innerHTML = num
	}
	function renderValNum(num) {
		valNumDisplay.innerHTML = num
	}
	function renderSpeedNum(num) {
		speedNumDisplay.innerHTML = num
	}
	function getSortMethod() {
		for (var i = 0;i<sortRadios.length;i++) {
			if (sortRadios[i].checked) {
				return sortRadios[i].value
			}
		}
	}
	return {
		hideButtons : hideButtons,
		showButtons : showButtons,
		renderBarNum : renderBarNum,
		renderValNum : renderValNum,
		renderSpeedNum : renderSpeedNum,
		getSortMethod : getSortMethod,
	}
})(ctrlPanelAPI)

var chartGridView = {
	gridEl : document.getElementsByClassName('chart-grid')[0],
	hide : function() {
		this.gridEl.style.display = 'none'
	},
	show : function() {
		this.gridEl.style.display = 'flex'
	},
	renderGrid : function(numEl,maxVal,notifyCtrlRowClick) {
		var colEl
		for (var col = 0;col<numEl;col++) {
			colEl = this.renderCol(col)
			for (var row = 0;row<maxVal;row++) { 
				this.renderRow(colEl,row,col,notifyCtrlRowClick)
			}
		}
	},
	renderCol : function(col) {
		var colHTML = '<div id="col'+col+'" class="col"></div>'
		this.gridEl.insertAdjacentHTML('beforeend',colHTML)
		return document.getElementById('col'+col)
	},
	renderRow : function(colEl,row,col,notifyCtrlRowClick) {
		var rowHTML = '<div id="row'+row+'-col'+col+'" class="row"></div>'
		colEl.insertAdjacentHTML('beforeend',rowHTML)
		var rowEl = document.getElementById('row'+row+'-col'+col)
		rowEl.addEventListener('click',()=>{
			notifyCtrlRowClick(row,col)
		})
	},
	clearGrid : function() {
		var elList = this.gridEl.children
		var len = elList.length
		for(var idx=len-1;idx>=0;idx--) {
			// console.log(idx)
			// console.log(elList)
			this.gridEl.removeChild(elList[idx])
		}
		// console.log(elList.length)
	}
}

var chartView = {
	chartEl : document.getElementsByClassName('chart')[0],
	barStyleClass : 'thin-bar',
	chartHeight : null,
	readChartHeight: function() {
		// Reads the current height of the chart from the page for the rendering of chart elements
		if (!this.chartHeight) { 
			this.chartHeight = parseInt(getComputedStyle(this.chartEl).height.slice(0,-2)) 
		}
	},
	setBarHeight : function(el,val,maxVal) {
		//take number or DOM element as input for 'el'
		if (typeof el === 'number') { 
			el = document.getElementById(el)
		}
		this.readChartHeight()
		var elHeight = this.chartHeight * (val / maxVal)
		elHeight = elHeight.toString()
		el.style.height = elHeight+"px"
	},
	setBarOrder : function(el,order) {
		el.style.order = order
	},
	toggleBarActive : function(idx) {
		var activeColor = "rgb(255, 102, 102)"
		var defaultColor = "rgb(119, 119, 119)"
		var el = document.getElementById(idx)
		if (el.style.backgroundColor === activeColor) {
			el.style.backgroundColor = defaultColor
		} else {
			el.style.backgroundColor = activeColor
		}	
	},
	toggleBarMoved : function(idx) {
		var activeColor = "rgb(73, 238, 127)"
		var defaultColor = "rgb(119, 119, 119)"
		var el = document.getElementById(idx)
		if (el.style.backgroundColor === activeColor) {
			el.style.backgroundColor = defaultColor
		} else {
			el.style.backgroundColor = activeColor
		}	
	},
	renderArray : function(array,maxVal) {
		this.clearBars()
		// set bar style
		if (array.length < 30) {
			this.barStyleClass = 'thin-bar'
		} else if (array.length >= 60) {
			this.barStyleClass = 'fatter-bar'
		} else if (array.length >= 40) {
			this.barStyleClass = 'fat-bar'
		} else if (array.length >= 30) {
			this.barStyleClass = 'mid-bar'
		} 
		// render bars
		array.forEach((val,idx)=>{
			this.renderBar(idx,idx,val,maxVal)
		})
	},
	renderBar : function(name,order,val,maxVal) {
		// potential for misuse
		var barHTML = '<div id="'+name+'" class="bar '+this.barStyleClass+'"></div>'
		this.chartEl.insertAdjacentHTML('beforeend',barHTML)
		var barEl = document.getElementById(name)
		this.setBarHeight(barEl,val,maxVal)
		this.setBarOrder(barEl,order)
	},
	clearBars : function() {
		$removeElementsByClass('bar')
	},
}

