export default Ember.Route.extend({
  beforeModel: function(transition) {
    this.get('credential').logout();
    this.get('credential').update();

    this.transitionTo('login').then(function() {
      document.location.reload(true);
    });
  }
});