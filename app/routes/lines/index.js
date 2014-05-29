export default Ember.Route.extend({
  model: function() {
    return Ember.A();
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('account', this.modelFor('account'));
    controller.reset();
  }
});