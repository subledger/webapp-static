import Ember from 'ember';

export default Ember.Route.extend({
  books: Ember.A(),
  authenticated: false,

  beforeModel: function(transition) {
    if (transition.intent.name === "login") { return; }

    if (!this.get('credential').get('isPresent')) {
      this.transitionTo('login');
      return;         
    }

    return this.get('credential').authenticate(this.store);
  }
});