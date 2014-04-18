export default Ember.Controller.extend({
  accounts: Ember.A(),
  loadingAccounts: true,
  hasNextAccountsPage: true,
  loadingAccountPage: false,

  actions: {
    post: function(journalEntryData) {
      var journalEntry = this.store.createRecord(
        'journal-entry',
        journalEntryData
      );

      journalEntry.save().then(
        $.proxy(function(savedJournalEntry) {
          alert('Journal Entry Posted Successfully');
        }, this),

        $.proxy(function(e) {
          alert('Something Went Wrong');
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
    console.log('here');

    return this.loadAccountsPage(pageId, perPage).then(
      $.proxy(function(accounts) {
        if (accounts.content.length === perPage) {
          this.loadAllAccounts(this.get('accounts').get('lastObject').get('id'), perPage);

        } else {
          this.set('loadingAccounts', false);
          return this.get('accounts').get('content');
        }
      }, this)
    );
  }
});
