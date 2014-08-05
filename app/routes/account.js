import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('account', params.account_id);
  },

  actions: {
    error: function(error) {
      if (error && !error.status) {
        return this.transitionTo('accounts.index');
      }

      return true;
    }
  }
});