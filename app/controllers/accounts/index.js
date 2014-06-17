export default Ember.ArrayController.extend({
  itemController: 'accounts/item',

  description: "",
  hasNextPage: false,
  loadingPage: false,
  searchHandler: null,
  pagesLoaded: 0,

  hasResults: function() {
    if (this.get('pagesLoaded') === 0) return true;
    return this.toArray().length > 0;
  }.property('pagesLoaded'),

  actions: {
    search: function(description) {
      this.reset();

      if (!Ember.isBlank(this.get('description'))) {
        this.set('hasNextPage', true);

        // search
        var handler = Ember.run.later(this, function() {
          this.loadPage(null, this.get('description'));
        }, 500);

        // save search handler
        this.set('searchHandler', handler);
      }
    },

    nextPage: function(defer) {
      if (this.get('loadingPage') === true) return;

      var object = this.get('lastObject');
      var nextPageId = null;

      this.set('loadingPage', true);

      if (object !== undefined) {
        nextPageId = object.get('id');
      }

      // get next page
      this.loadPage(nextPageId).then(function() {
        defer.resolve();
      });
    }    
  },

  loadPage: function(pageId, description, perPage) {
    perPage = perPage || 25;

    var query = {
      limit: perPage,
      pageId: pageId,
      description: description
    };

    return this.store.find('account', query).then(
      $.proxy(function(accounts) {
        this.beginPropertyChanges();

        this.incrementProperty('pagesLoaded', 1);
        this.addObjects(accounts.toArray());

        if (accounts.toArray().length === perPage) {
          this.set('hasNextPage', true);

        } else {
          this.set('hasNextPage', false);
        }

        this.set('loadingPage', false);
        this.endPropertyChanges();

        return accounts;
      }, this)
    );
  },

  reset: function() {
    // cancel preivous search
    Ember.run.cancel(this.get('searchHandler'));

    this.setProperties({
      'hasNextPage': false,
      'pagesLoaded': 0
    });

    this.clear();
  }
});