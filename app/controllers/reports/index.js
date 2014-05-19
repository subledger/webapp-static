export default Ember.ArrayController.extend({
  itemController: 'reports.Item',

  description: "",
  hasNextPage: false,
  loadingPage: false,
  searchHandler: null,

  actions: {
    search: function(description) {
      // cancel preivous search
      Ember.run.cancel(this.get('searchHandler'));

      this.set('hasNextPage', false);
      this.clear();

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

    return this.store.find('report', query).then(
      $.proxy(function(reports) {
        this.addObjects(reports.toArray());

        if (reports.toArray().length === perPage) {
          this.set('hasNextPage', true);

        } else {
          this.set('hasNextPage', false);
        }

        this.set('loadingPage', false);
        return reports;
      }, this)
    );
  }  
});