export default Ember.ObjectController.extend({
  balanceUpdatedAt: null,

  isBalanceCacheExpired: function() {
    return account.get('balanceUpdatedAt') && (account.get('balanceUpdatedAt') - new Date()) > 5000;
  },

  actions: {
    getBalance: function() {
      var account = this.get('model');

      if (this.isBalanceCacheExpired()) {
        account.get('balance').reload();

      } else {
        this.store.find('balance', account.get('id')).then($.proxy(function(balance) {
          account.set('balance', balance);
        }, this));
      }
    }
  }
});