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

	popoverObserver: function() {
		this.createPopover();
	}.observes('controller.expanded'),

	timeAgoISO: function() {
		return this.get('controller').get('model').get('effectiveAt').toISOString();
	}.property('controller.model.effectiveAt'),

	createPopover: function() {
		if (this.get('controller').get('expanded')) {
			this.$(".time-ago").popover('destroy');

		} else {
			Ember.run.scheduleOnce('afterRender', this, function() {
				this.$(".time-ago").popover({
					trigger: 'click',
					placement: 'right',
					content: this.get('timeAgoISO'),
					container: this.$()
				});

				this.$(".time-ago").on('click', $.proxy(function(e) {
					e.preventDefault();
					e.stopPropagation();
				}, this));
			});
		}		
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

		// time ago ISO popover
		this.createPopover();

		// dismiss popover on scroll
		this.$().parents('.content').on('scroll', $.proxy(function() {
			if (this.$(".time-ago") !== undefined) {
				this.$(".time-ago").popover('hide');
			}
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
