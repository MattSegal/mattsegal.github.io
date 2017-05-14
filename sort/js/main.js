// RUN THE APP
Controller.init()

// HELPER FUNCTIONS
function $removeElement(el) {
	el.parentNode.removeChild(el)
}
function $removeElementById(id) {
	var el = document.getElementById(id)
	el.parentNode.removeChild(el)
}
function $removeElementsByClass(className) {
	var elements = document.getElementsByClassName(className)
	var len = elements.length
	for (var idx = 0;idx<len;idx++) {
		elements[0].parentNode.removeChild(elements[0])
	}
}

function $timer(time,fn) {
	return new Promise((resolve) => { // dont use reject
		setTimeout(()=>{
			fn()
			resolve()
		},time)
	})
}

// 	with $timer we can chain timers forever without callback hell
//
// 		$timer(time,()=>{
// 			// do stuff
// 		}).then(()=>{
// 			return $timer(time,()=>{
// 				// do more stuff
// 			})
// 		}).then(()=>{
// 			return $timer(time,()=>{
// 				// do even more stuff
// 			})
// 		})




