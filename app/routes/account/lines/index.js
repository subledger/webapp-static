import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('account').get('lines');
  },

  setupController: function(controller, model) {
    controller.reset();

    controller.set('model', model);
    controller.set('account', this.modelFor('account'));
  }
});