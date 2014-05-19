export default Ember.View.extend({
	tagName: 'div',
	classNames: 'panel panel-default journal-entry hover-highlight',

	templateName: 'journal-entry',

	timeAgo: "",
	timeAgoInterval: null,
	isCollapsive: true,

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
		clearInterval(this.get('timeAgoInterval'));
	}
});
