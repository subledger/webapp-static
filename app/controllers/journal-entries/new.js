export default Ember.Controller.extend({
  accounts: Ember.A(),
  loadingAccounts: true,
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
          console.log(e);
          
          if (line) {
            this.get('model').get('lines').pushObject(line);
          }
        }, this)
      );
    },

    clear: function() {
      this.set('model', this.store.createRecord('journal-entry'));
    }
  },

  loadAccountsPage: function(pageId, perPage) {
    perPage = perPage || 25;

    var query = {
      limit: perPage,
      pageId: pageId
    };

    return this.store.find('account', query).then(
      $.proxy(function(accounts) {
        this.get('accounts').addObjects(accounts.content);

        if (accounts.content.length === perPage) {
          this.set('hasNextAccountsPage', true);

        } else {
          this.set('hasNextAccountsPage', false);
        }

        this.set('loadingAccountsPage', false);
        return accounts;
      }, this)
    );
  },

  loadAllAccounts: function(pageId, perPage) {
    perPage = perPage || 25;
    console.log('Loading accounts...');

    return this.loadAccountsPage(pageId, perPage).then(
      $.proxy(function(accounts) {
        console.log("Loaded " + accounts.content.length + " accounts so far");
        
        if (accounts.content.length === perPage) {
          this.loadAllAccounts(this.get('accounts').get('lastObject').get('id'), perPage);

        } else {
          console.log("Total of " + accounts.content.length + " accounts loaded");
          this.set('loadingAccounts', false);

          return this.get('accounts');
        }
      }, this)
    );
  }
});
