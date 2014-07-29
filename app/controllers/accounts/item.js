import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    getBalance: function() {
      var account = this.get('model');

      if (account.get('balance')) {
        account.get('balance').reload();

      } else {
        this.store.find('balance', account.get('id')).then($.proxy(function(balance) {
          account.set('balance', balance);
        }, this));
      }
    }
  }
});