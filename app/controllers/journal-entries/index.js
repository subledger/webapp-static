export default Ember.ArrayController.extend({
  itemController: 'JournalEntry',

  hasNextPage: true,
  loadingPage: false,

  actions: {
    nextPage: function(defer) {
      if (this.get('loadingPage') === true) return;

      var object = this.get('firstObject');
      var nextPageId = null;

      this.set('loadingPage', true);

      if (object !== undefined) {
        nextPageId = object.get('id');
      }

      this.loadPage(nextPageId).then(function() {
        defer.resolve();
      });
    }
  },

  loadPage: function(pageId, perPage) {
    perPage = perPage || 25;

    var query = {
      limit: perPage,
      pageId: pageId
    };

    return this.store.find('journalEntry', query).then(
      $.proxy(function(journalEntries) {
        this.unshiftObjects(journalEntries.content);

        if (journalEntries.content.length === perPage) {
          this.set('hasNextPage', true);

        } else {
          this.set('hasNextPage', false);
        }

        this.set('loadingPage', false);
        return journalEntries;
      }, this)
    );
  }
});
