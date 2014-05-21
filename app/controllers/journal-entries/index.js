export default Ember.ArrayController.extend({
  itemController: 'JournalEntry',

  hasNextPage: true,
  loadingPage: false,
  loadingNewerPage: false,
  states: ["POSTED", "POSTING"],
  selectedState: "POSTED",
  loadedPageWasNewer: null,

  actions: {
    nextPage: function(defer) {
      if (this.get('loadingPage')) return;
      if (!this.get('hasNextPage')) return;

      var object = this.get('firstObject');
      var nextPageId = null;

      this.set('loadingPage', true);

      if (object !== undefined) {
        nextPageId = object.get('id');
      }

      this.loadPage(nextPageId, false).then(function() {
        if (defer) {
          defer.resolve();  
        }        
      });
    },

    getNewEntries: function() {
      var object = this.get('lastObject');
      var nextPageId = null;

      if (object !== undefined) {
        nextPageId = object.get('id');
      }

      this.set('loadingNewerPage', true);

      this.loadPage(nextPageId);
    },

    changeState: function(newState) {
      Ember.run.begin();

      // reset controller
      this.setProperties({
        hasNextPage: true,
        loadingPage: false,
        loadingNewerPage: false,
        selectedState: newState,
        loadedPageWasNewer: null
      });

      // clear current entries
      this.clear();

      Ember.run.end();
    }
  },

  loadPage: function(pageId, newer, perPage) {
    perPage = perPage || 25;
    newer = newer === false ? false : true;

    var query = {
      limit: perPage,
      pageId: pageId,
      newer: newer,
      state: this.get('selectedState')
    };

    return this.store.find('journalEntry', query).then(
      $.proxy(function(journalEntries) {
        Ember.run.begin();

        if (newer) {
          this.addObjects(journalEntries.toArray());

        } else {
          this.unshiftObjects(journalEntries.toArray().reverse());
        }

        if (journalEntries.toArray().length === perPage) {
          this.setProperties({
            'hasNextPage': true,
            'loadingPage': false,
            'loadingNewerPage': false,
            'loadedPageWasNewer': newer 
          });

        } else {
          this.setProperties({
            'hasNextPage': false,
            'loadingPage': false,
            'loadingNewerPage': false,
            'loadedPageWasNewer': newer
          });
        }

        Ember.run.end();

        return journalEntries;
      }, this)
    );
  }
});
