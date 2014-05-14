export default Ember.View.extend({
  templateName: 'account-item',

  balanceEffect: function() {
    this.$(".balance").hide();
    var balance = this.get('controller').get('model').get('balance');

    if (balance && balance.get('value')) {
      Ember.run.next(this, function() {
        this.$(".balance").fadeOut('fast', function() {
          $(this).fadeIn();
        });
      });
    }
  }.observes('controller.model.balance'),

  click: function(e) {
    var account = this.get('controller').get('model');
    this.get('controller').transitionToRoute('lines.index', account);
  },

  updateBalance: function() {
    this.get('controller').send('getBalance');
  },

  didInsertElement: function() {
    this.updateBalance();
  }
});