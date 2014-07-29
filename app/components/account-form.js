import Ember from 'ember';
import MessagesView from 'subledger-app/views/messages';

export default Ember.Component.extend({
  tagName: 'div',

  accountMessagesView: null,

  model: null,
  normalBalance: 'debit',
  onAccountCreated: null,

  init: function() {
    this._super();

    this.set('accountMessagesView', MessagesView.create());

    this.clear();
  },

  didInsertElement: function() {
    var self = this;
    this.$("input[type='radio'][name='normalBalance']").on('change', function() {
      self.get('model').set('normalBalance', this.value);
    });
  },

  actions: {
    create: function() {
      console.log('creating');

      // clear previous error messages
      this.get('model').get('errors').clear();

      this.get('model').save().then(
        $.proxy(function(createdAccount) {
          // add success message
          this.get('accountMessagesView').notifySuccess("Success!", "Account Created", 5000);        

          // clear current account
          this.clear();

          // callback, if any
          if (this.get('onAccountCreated')) {
            this.sendAction(this.get('onAccountCreated'), createdAccount);
          }
        }, this),

        function(a) {
          console.log(a);
        }

      );
    },

    clear: function() {
      this.clear();
    }
  },

  clear: function() {
    this.set('model', this.container.lookup('store:main').createRecord('account', {
      normalBalance: 'debit'
    }));
  }
});