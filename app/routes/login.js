export default Ember.Route.extend({
  model: function() {
    return this.get('credential');
  },

  setupController: function(controller, model) {
    controller.set('model', model);

    controller.set('key', model.get('key'));
    controller.set('secret', model.get('secret'));
    controller.set('org', model.get('org'));
  }
});