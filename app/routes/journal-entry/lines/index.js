import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('journalEntry').get('lines');
  },

  setupController: function(controller, model) {
    controller.reset();

    controller.set('model', model);    
    controller.set('journalEntry', this.modelFor('journalEntry'));

    controller.set('collapsed', true);
    controller.set('collapsive', false);
  }
});