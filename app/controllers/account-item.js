export default Ember.ObjectController.extend({
  actions: {
    getBalance: function() {
      var account = this.get('model');

      if (!account.get('balance')) {
        this.store.find('balance', account.get('id')).then($.proxy(function(balance) {
          account.set('balance', balance);
        }, this));
      }
    }
  }
});