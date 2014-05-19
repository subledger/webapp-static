export default Ember.Route.extend({
  model: function() {
    return window.App.get('credentials');
  }
});