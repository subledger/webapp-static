import JournalEntriesController from "subledger-app/controllers/journal-entries";

export default JournalEntriesController.extend({
  itemController: 'JournalEntry',

  hasNextPage: true,
  loadingPage: false,

  actions: {
    nextPage: function() {
      if (this.get('loadingPage') === true) return;

      var lastObject = this.get('lastObject');
      var nextPageId = null;

      this.set('loadingPage', true);

      if (lastObject !== undefined) {
        nextPageId = this.get('lastObject').get('id');
      }

      this.loadPage(nextPageId);
    }
  },

  loadPage: function(pageId, perPage) {
    perPage = perPage || 25;

    var query = {
      order: "desc",
      limit: perPage,
      pageId: pageId
    };

    return this.store.find('journalEntry', query).then(
      $.proxy(function(journalEntries) {
        this.addObjects(journalEntries.content);

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
