export default Ember.ObjectController.extend({
  expanded: false,
  loadingLines: false,
  linesAlreadyLoaded: false,

  init: function() {
    var model = this.get('model');

    if (model && !model.get('lines')) {
      this.get('model').set('lines', Ember.A());
    }

    if (model && !model.get('totalCredit')) {
      this.get('model').set('totalCredit', Ember.Object.create({ amount: 0, type: 'credit' }));
    }

    if (model && !model.get('totalDebit')) {
      this.get('model').set('totalDebit', Ember.Object.create({ amount: 0, type: 'debit' }));
    }
  },

  actions: {
    toggleExpanded: function() {
      if (this.get('expanded')) {
        this.set('expanded', false);

      } else {
        this.set('expanded', true);

        if (!this.get('linesAlreadyLoaded') && !this.get('loadingLines')) {
          this.loadAllLinesPages();
        }
      }
    }
  },

  loadAllLinesPages: function(nextPageId, perPage) {
    perPage = perPage || 25;
    this.set('loadingLines', true);

    var journalEntry = this.get('model');

    var query = {
      limit: perPage,
      pageId: nextPageId
    };

    journalEntry.loadLinesWithAccounts(query).then($.proxy(function(lines) {
      lines.forEach(function(line, index, enumerable) {
        var value = line.get('value');

        if (value.type === 'credit') {
          journalEntry.get('totalCredit').incrementProperty('amount', parseFloat(value.amount));

        } else if (value.type === 'debit') {
          journalEntry.get('totalDebit').incrementProperty('amount', parseFloat(value.amount));
        }
      }, this);

      journalEntry.get('lines').addObjects(lines);

      if (lines.content.length === query.limit) {
        this.loadAllLinesPages(journalEntry.get('lines').get('lastObject').get('id'));

      } else {
        this.set('loadingLines', false);
        this.set('linesAlreadyLoaded', true);
      }

    }, this));
  }
});
