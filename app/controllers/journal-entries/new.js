import Ember from 'ember';

export default Ember.Controller.extend({
  hasNextAccountsPage: true,
  loadingAccountPage: false,

  actions: {
    addLine: function() {
      var line = this.store.createRecord('line');
      this.get('model').get('lines').pushObject(line);
    },

    removeLine: function(lineModel) {
      this.get('model').get('lines').removeObject(lineModel);
    },

    toogleZeroLine: function(lineModel) {
      if (lineModel.get('type') !== 'zero') {
        lineModel.set('value', {
          type: 'zero',
          amount: '0.00'
        });
      } else {
        lineModel.set('value', null);
      }
    },

    post: function() {
      // journal entry reference
      var journalEntry = this.get('model');

      // lines reference
      var lines = journalEntry.get('lines');

      // clear previous error messages
      journalEntry.get('errors').clear();

      lines.forEach(function(item) {
        item.get('errors').clear();
      }, this);

      // remove last line, if at least two lines exists (will re-add if post fails)
      var line = lines.toArray().length > 1 ? lines.popObject() : null;

      journalEntry.save().then(
        $.proxy(function() {
          // do nothing
        }, this),

        $.proxy(function() {
          if (line) {
            lines.pushObject(line);
          }
        }, this)
      );
    },

    clear: function() {
      this.set('model', this.store.createRecord('journal-entry'));
    }
  }
});
