export default Ember.View.extend({
	loader: function() {
		Ember.run.next(this, function() {
			this.loadPage();
		});		
	}.observes('controller.@each'),

	loadPage: function() {
		this.controller.send("loadPage");
	},

	didInsertElement: function() {
		this.loadPage();
	},

	willDestroyElement: function() {
	}
});