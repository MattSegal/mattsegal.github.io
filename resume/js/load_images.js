// when bg image loaded, swap out full image
window.onload = function loadSharpImages() {
	// Quit early if older browser (e.g. IE 8).
	if (!('addEventListener' in window)) return

	// load background
	var img = new Image();
	var bgSrc = "{{ url_for('dev_resume.static',filename='img/bg.jpg') }}"
	var div = document.getElementsByTagName("body")[0]
	img.onload = function() {
		div.className = 'bg-loaded'
	}
	img.src = bgSrc

	// load headshot image
	img2 = new Image();
	var hsSrc = "{{url_for('dev_resume.static',filename='img/headshot.jpg')}}"
	var div2 = document.getElementsByClassName("headshot-image")[0]
	var div3 = document.getElementById("headshot-panel")
	img2.onload = function() {
		div3.className += ' headshot-panel-loaded'
		div2.className += ' headshot-loaded'
	}
	img2.src = hsSrc
};