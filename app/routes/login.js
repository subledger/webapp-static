export default Ember.Route.extend({
  model: function() {
    return window.App.get('credentials');
  },

  setupController: function(controller, context) {
    controller.setCreds();
  }
});