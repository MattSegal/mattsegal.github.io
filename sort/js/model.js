
var Model = {
	// array data
	array : [],
	arrayReset : [],
	// array meta info
	arrayLength : 30, // set bar margin to less if you do more than 30 or so
	maxValue : 30,
	// sort data
	sortMethod : '',
	sortSpeed : 20, // ms
	// app state 
	isSorting : false,
	clearArray : function() {
		this.array = Array(this.arrayLength).fill(0) 
	},
	randomArray : function() {
		this.array = Array(this.arrayLength)
			.fill(0)
			.map(()=>Math.ceil(this.maxValue*Math.random()))
	},
	reverseArray : function() {
		this.array = Array(this.arrayLength)
			.fill(0)
			.map(()=>Math.ceil(this.maxValue*Math.random()))
		this.array = mergeSort(this.array).reverse()
	},
	sortMethods : {
		bubbleSort : bubbleSort,
		insertionSort : insertionSort,
		selectionSort : selectionSort,
		cocktailSort : cocktailSort,
		mergeSort : mergeSortGen,
	},
	getSortMethod : function() {
		return this.sortMethods[this.sortMethod](this.array)
	},
	isSorted : function() {
		var len = Model.array.length
		for (var idx = 0;idx<len;idx++) {
			if (Model.array[idx] > Model.array[idx+1]) {
				return false
			}
		}
		return true
	}
}

// other sort possibilities
// quicksort!
// shell sort
// stooge sort


function testSort(sortGen,arr) {
	Model.array = arr
	console.log('TEST SORT')
	var array = arr.slice() // lame!
	var sortMove = sortGen(arr.slice())
	var move = sortMove.next()
	var temp, i, j
	while (!move.done) {
		console.log('ITER')
		i = move.value.idx
		j = move.value.targetIdx
		temp = array[i]
		array[i] = array[j]
		array[j] = temp
		console.log(Model.array)
		move = sortMove.next()
	}
	console.log('END TEST')
	// console.log(array)
	console.log(Model.array)

}

function* bubbleSort(array) {
	var len = array.length
	var temp
	for (var end = len-1;end>0;end--) {
		for (var idx = 0;idx<end;idx++) {
			if (array[idx] > array[idx+1]) {
				// swap
				var temp = array[idx]
				array[idx] = array[idx+1]
				array[idx+1] = temp
				// update array
				Model.array = array
				// yield swap
				yield {idx : idx ,targetIdx : idx+1}
			}
		}
	}
}

function* insertionSort(array) {
	var i,j
	var temp
	for (j = 0;j<array.length;j++) {
		key = array[j]
		i = j - 1
		while( i >= 0 && array[i] > key) {
			temp = array[i+1]
			array[i+1] = array[i]
			array[i] = temp
			// update Model + Controller
			Model.array = array
			yield {idx : i+1 ,targetIdx : i}
			i--
		} 
	}
}

function* selectionSort(array) {
	var len = array.length
	var swap
	for (var i = 0;i<len;i++) {
		// find the smallest element of array
		idx = i // index of smallest element
		smallestEl = array[i]
		for(var j=i;j<len;j++) {
			if (array[j] < smallestEl) {
				// if some number further along is smaller
				smallestEl = array[j]
				idx = j
				yield {idx : i ,targetIdx : idx}
			}
		}
		// swap element at i with smallest element found
		swap = array[i]
		array[i] = smallestEl
		array[idx] = swap
		// update Model + Controller
		Model.array = array
		yield {idx : i ,targetIdx : idx}
	}
}

function* cocktailSort(array) {
	var swapped = true // init for while
	var idx,swap
	var end = array.length-1
	// debug
	var oldArr
	while (swapped) {
		swapped = false
		for (idx=0;idx<end;idx++) { // start to end
			if (array[idx] > array[idx+1]) { // out of order
				swap = array[idx]
				array[idx] = array[idx+1] 
				array[idx+1] = swap
				swapped = true
				// update Model + Controller
				Model.array = array
				yield {idx : idx ,targetIdx : idx+1}
			}
		}
		if (!swapped) break // if no swaps then sorted
		for (idx=end;idx>=0;idx--) { // end to start
			if (array[idx] > array[idx+1]) { // out of order
				swap = array[idx]
				array[idx] = array[idx+1] 
				array[idx+1] = swap
				swapped = true
				// update Model + Controller
				Model.array = array
				yield {idx : idx+1,targetIdx : idx}
			}
		}
	}
	return array
}

function* mergeSortGen(array) {
	var split, firstArr, secondArr, 
		firstSorted, secondSorted, mergedArr
	var len = array.length
	if (len <= 1) return array
	// set range
	array.start = array.start || 0
	array.end = array.end || len
	// split arrays
	split = (len%2 === 0) ? len/2 : (len+1)/2

	firstArr 		= array.slice(0,split)
	firstArr.start 	= array.start
	firstArr.end 	= array.start + split

	secondArr 		= array.slice(split)
	secondArr.start = array.start + split
	secondArr.end 	= array.end
	
	// divide
	firstSorted = yield* mergeSortGen(firstArr)
	secondSorted = yield* mergeSortGen(secondArr)
	// merge
	mergedArr = yield* mergeGen(firstSorted,secondSorted)
	return mergedArr
}

function* mergeGen(A,B) {
	// swap so A comes before B
	if (A.start > B.start) { var swap=B; B=A; A=swap } 
	var lenA = A.length
	var lenB = B.length
	var lenC = lenA + lenB
	var idxA = 0
	var idxB = 0
	var C = []
	C.start = A.start
	C.end = B.end
	for (var idxC=0;idxC<lenC;idxC++) {
		if (idxA === lenA) {
			C[idxC] = B[idxB]
			idxB++
			mergeGenModelUpdate(A,B,C,idxA,idxB)
			yield {idx : B.start,targetIdx : C.start+idxC}
			B.start++
			A.start++
		} else if (idxB === lenB) {
			C[idxC] = A[idxA]
			idxA++
			mergeGenModelUpdate(A,B,C,idxA,idxB)
			yield {idx : A.start,targetIdx : C.start+idxC}
			A.start++
		} else if (A[idxA] < B[idxB]) {
			C[idxC] = A[idxA]
			idxA++
			mergeGenModelUpdate(A,B,C,idxA,idxB)
			yield {idx : A.start,targetIdx : C.start+idxC}
			A.start++
		} else {
			C[idxC] = B[idxB]
			idxB++
			mergeGenModelUpdate(A,B,C,idxA,idxB)
			yield {idx : B.start,targetIdx : C.start+idxC}
			B.start++
			A.start++
		}
	}
	return C
}

function mergeGenModelUpdate(A,B,C,idxA,idxB) {
	Model.array = Model.array.slice(0,C.start)
				.concat(C)
				.concat(A.slice(idxA))
				.concat(B.slice(idxB))
				.concat(Model.array.slice(C.end))
}


function mergeSort(array) { // this gets used don't delete
	var len = array.length
	if (len <= 1) return array
	var split = (len%2 === 0) ? len/2 : (len+1)/2
	var sortedStart = mergeSort(array.slice(0,split)) 
	var sortedEnd = mergeSort(array.slice(split))
	return merge(sortedStart,sortedEnd)
}

function merge(A,B) {
	var lenA = A.length
	var lenB = B.length
	var lenC = lenA + lenB
	var	C = []
	var idxA = 0
	var idxB = 0
	for (var idxC=0;idxC<lenC;idxC++) {
		if (idxA === lenA) {
			C[idxC] = B[idxB]
			idxB++
		} else if (idxB === lenB) {
			C[idxC] = A[idxA]
			idxA++
		} else if (A[idxA] < B[idxB]) {
			C[idxC] = A[idxA]
	    	idxA++
		} else {
			C[idxC] = B[idxB]
			idxB++
		}
	}
	return C
}
