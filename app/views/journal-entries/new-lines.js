import NewLineView from 'subledger-app/views/journal-entries/new-line';

export default Ember.ContainerView.extend({
  tabIndex: 10,

  init: function() {
    this._super();
  },

  addLine: function(model, journalEntry, accountsDataset) {
    var newLineView = NewLineView.create({
      'model': model,
      'journalEntry': journalEntry,
      'accountsDataset': accountsDataset,
      'tabIndex': this.incrementProperty('tabIndex', 1),
    });

    this.pushObject(newLineView);
  },

  reset: function() {
    this.clear();
  }
});
