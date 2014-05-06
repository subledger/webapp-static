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

    post: function(journalEntryData) {
      var journalEntry = this.get('model');

      // set the lines
      journalEntry.set('lines', this.get('lines'));

      journalEntry.save().then(
        $.proxy(function(savedJournalEntry) {
          alert('Journal Entry Posted Successfully');
          this.transitionTo('journal-entries.index');
        }, this),

        $.proxy(function() {
        }, this)
      );
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
