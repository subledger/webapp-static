export default Ember.Route.extend({
  model: function() {
    return this.get('credential');
  }
});