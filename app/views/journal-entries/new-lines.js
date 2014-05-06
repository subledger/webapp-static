import NewLineView from 'subledger-app/views/journal-entries/new-line';

export default Ember.ContainerView.extend({
  tabIndex: 10,

  init: function() {
    this._super();
  },

  addLine: function(model, journalEntry, accountsDataset) {
    var newLineView = NewLineView.create();

    newLineView.set('model', model);
    newLineView.set('journalEntry', journalEntry);
    newLineView.set('accountsDataset', accountsDataset);

    newLineView.set('tabIndex1', this.incrementProperty('tabIndex', 1));
    newLineView.set('tabIndex2', this.incrementProperty('tabIndex', 1));

    this.pushObject(newLineView);
  }
});
