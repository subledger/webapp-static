export default Ember.Controller.extend({
  lines: Ember.A(),
  accounts: Ember.A(),
  loadingAccounts: true,
  hasNextAccountsPage: true,
  loadingAccountPage: false,

  actions: {
    addLine: function() {
      var line = this.store.createRecord('line');
      this.get('lines').pushObject(line);
    },

    removeLine: function(lineModel) {
      this.get('lines').removeObject(lineModel);
    },

    post: function(journalEntryData) {
      var journalEntry = this.get('model');

      // clear previous error messages
      journalEntry.get('errors').clear();

      this.get('lines').forEach(function(item, index, enumerable) {
        item.get('errors').clear();
      }, this);

      // remove last line (will re-add if post fails)
      var line = null;
      if (this.get('lines').length > 1) {
        line = this.get('lines').get('lastObject');
        this.get('lines').removeObject(line);
      }

      // set the lines
      journalEntry.set('lines', this.get('lines'));

      journalEntry.save().then(
        $.proxy(function(savedJournalEntry) {
          this.transitionToRoute('journal-entries.new');
        }, this),

        $.proxy(function() {
          if (line) {
            this.get('lines').pushObject(line);
          }
        }, this)
      );
    },

    clear: function() {
      this.set('model', this.store.createRecord('journal-entry'));
      this.get('lines').clear();
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
