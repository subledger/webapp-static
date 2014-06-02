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

    post: function(journalEntryData) {
      var journalEntry = this.get('model');

      // clear previous error messages
      journalEntry.get('errors').clear();

      this.get('model').get('lines').forEach(function(item, index, enumerable) {
        item.get('errors').clear();
      }, this);

      // remove last line (will re-add if post fails)
      var line = null;
      if (this.get('model').get('lines').toArray().length > 1) {
        line = this.get('model').get('lines').get('lastObject');
        this.get('model').get('lines').removeObject(line);
      }

      journalEntry.save().then(
        $.proxy(function(savedJournalEntry) {
        }, this),

        $.proxy(function(e) {
          if (line) {
            this.get('model').get('lines').pushObject(line);
          }
        }, this)
      );
    },

    clear: function() {
      this.set('model', this.store.createRecord('journal-entry'));
    }
  }
});
