export default Ember.Route.extend({
	setupController: function(controller, model) {
		controller.clear();
    controller.setProperties({
      loading: false,
      hasNextPage: true
    });
	}
});