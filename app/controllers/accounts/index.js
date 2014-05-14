export default Ember.ArrayController.extend({
  itemController: 'AccountItem',

  description: "",
  hasNextPage: false,
  loadingPage: false,

  actions: {
    search: function(description) {
      this.set('hasNextPage', false);
      this.get('content').clear();

      if (!Ember.isBlank(this.get('description'))) {
        this.set('hasNextPage', true);

        // search
        this.loadPage(null, this.get('description'));
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
        this.addObjects(accounts.toArray());

        if (accounts.toArray().length === perPage) {
          this.set('hasNextPage', true);

        } else {
          this.set('hasNextPage', false);
        }

        this.set('loadingPage', false);
        return accounts;
      }, this)
    );
  }  
});