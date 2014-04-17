import AuthenticatedRoute from "subledger-app/routes/authenticated";
import notFoundHandler from 'subledger-app/utils/not-found-handler';

export default AuthenticatedRoute.extend({
  model: function(params) {
    return this.store.find('journalEntry', params.id).then(function(journalEntry) {
      journalEntry.set('lines', Ember.A());
      journalEntry.set('totalCredit', Ember.Object.create({ amount: 0, type: 'credit' }));
      journalEntry.set('totalDebit', Ember.Object.create({ amount: 0, type: 'debit' }));

      return journalEntry;
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('expanded', true);

    if (!controller.get('linesAlreadyLoaded') && !controller.get('loadingLines')) {
      controller.loadAllLinesPages();
    }
  }
});