export default Ember.View.extend({
	loaderRunning: false,
	loaderInterval: null,

	loaderStopper: function() {
		if (!this.get('controller').get('hasNextPage')) {
			this.stopLoader();
		}
	}.observes('controller.hasNextPage'),

	startLoader: function() {
		if (this.get('loaderRunning')) return;

		var interval = setInterval($.proxy(function() {
			this.loadPage();
		}, this), 500);

		this.set('loaderRunning', true);
		this.set('loaderInterval', interval);
	},

	stopLoader: function() {
		var interval = this.get('loaderInterval');
		clearInterval(interval);

		this.set('loaderRunning', false);
		this.set('loaderInterval', null);
	},

	loadPage: function() {
		if (this.$("#accountLinesLoader").visible()) {
			this.controller.send("loadPage");
		}
	},

	didInsertElement: function() {
		if (this.controller.get("content").length === 0) {
			this.loadPage();	
		}
		
		this.startLoader();
	},

	willDestroyElement: function() {
		this.stopLoader();
	}
});