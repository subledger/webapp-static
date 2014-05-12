export default Ember.View.extend({
	templateName: 'journal-entry',

	timeAgo: "",
	timeAgoInterval: null,

	init: function() {
		this._super();
	},

	calculateTimeAgo: function() {
		this.set('timeAgo', moment(this.get('controller').get('model').get('effectiveAt')).fromNow());
	},

	didInsertElement: function() {
		// expand handler
		this.$().on("click", ".clickable", $.proxy(function(e) {
			e.preventDefault();
			this.get('controller').send('toggleExpanded');
		}, this));

		// calculate initial time ago
		this.calculateTimeAgo();

		// interval to update time ago
		var interval = setInterval($.proxy(this.calculateTimeAgo, this), 10000);
		this.set('timeAgoInterval', interval);
	},

	willDestroyElement: function() {
		clearTimeout(this.get('timeAgoInterval'));
	}
});
