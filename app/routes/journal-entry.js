import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('journalEntry', params.id);
  },

  actions: {
    error: function(error) {
      console.error(error);

      if (error && !error.status) {
        return this.transitionTo('journal-entries.index');
      }

      return true;
    }
  }
});