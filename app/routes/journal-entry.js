export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('journalEntry', params.id).then(function(journalEntry) {
      journalEntry.set('totalCredit', Ember.Object.create({ amount: 0, type: 'credit' }));
      journalEntry.set('totalDebit', Ember.Object.create({ amount: 0, type: 'debit' }));

      return journalEntry;
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('collapsive', false);
    controller.set('collapsed', true);
    controller.set('linesAlreadyLoaded', false);

    controller.loadAllLinesPages();
  }
});