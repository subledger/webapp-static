import Ember from 'ember';

export default Ember.ObjectController.extend({
  accountDescription: null,

  actions: {
    loadAccountDescription: function() {
      this.store.find('account', this.get('model').get('account')).then($.proxy(function(account) {
        this.set('accountDescription', account.get('description'));
      }, this));
    }
  }
});