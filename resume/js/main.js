// event mediator
var events = {
	events:{},
	on: function(eventName, fn) {
		// add function to eventName listener list
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn)
	},
	off: function(eventName, fn) {
		// remove function to eventName listener list
		if (this.events[eventName]) {
			for (var idx=0;idx<this.events[eventName].length;idx++) {
				if (this.events[eventName][idx] === fn) {
					this.events[eventName].splice(idx,1);
					break;
				}
			};
		}
	},
	emit: function(eventName, data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach(function (fn) {
				fn(data);
			});
		}
	},
};


// page object
var page = {
	create : function(pageId,eventName) { 
		var instance = Object.create(this);
		instance.id = pageId;
		instance.$el = $('#'+pageId);
		instance.isOpen = false;
		events.on(eventName,instance.togglePage.bind(instance))
	},
	togglePage : function(id) {
		if (id === this.id) {
			if (this.isOpen) {return};
			this.isOpen = true;
			this.show()
		} else {
			if (this.isOpen) {
				this.hide()
				this.isOpen = false;
			}
		}
	},
	show : function() {
		$('#btn-'+this.id).addClass('open')
		// show page as a flexbox
		// this should probably be written in CSS and activated with a addClass
		var display = {
			'-webkit-display'	: 'box',
			'-moz-display'		: 'box',
			'-ms-display'		: 'flexbox',
			'-webkit-display'	: 'flex',
			'display'			: 'flex',
		} 
		this.$el.css(display).hide().fadeIn(1000)
	},
	hide : function() {
		this.$el.hide()
		$('#btn-'+this.id).removeClass('open')
	},
}

// sub page object for sub-page navigation
subPage = Object.create(page);
subPage.show = function() {
	$('#btn-'+this.id).addClass('open')
		// DO NOT show page as a flexbox by default
		this.$el.fadeIn(1000)
}

function bindButton(btnId,eventName) {
	$('#btn-'+btnId).on('click', function() {
		events.emit(eventName,btnId);
	});
}


pageList = ['profile','edu','work','skills','projects','contact'];
skillsPageList = ['soft','python','front-end-web-dev','back-end-web-dev','misc']
projectsPageList = ['links','whc','log-reg','sort','poker-bot','python-script',];

// bind nav-buttons
pageList.forEach(function(val) {
	page.create(val,'pageOpened');
	bindButton(val,'pageOpened');
});
skillsPageList.forEach(function(val) {
	subPage.create(val,'skillPageOpened');
	$('#'+val).hide()
	bindButton(val,'skillPageOpened');
});
projectsPageList.forEach(function(val) {
	subPage.create(val,'projectPageOpened');
	$('#'+val).hide()
	bindButton(val,'projectPageOpened');
});
// open default pages
events.emit('pageOpened','profile')
events.emit('skillPageOpened','soft')
events.emit('projectPageOpened','links')