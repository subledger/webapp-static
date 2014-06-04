export default Ember.Mixin.create({
  pagesLoaded: 0,
  hasOlderPage: true,
  loadingOlderPage: false,
  loadingNewerPage: false,
  loadedPageWas: null,

  loadingPage: function() {
    return this.get('loadingOlderPage') || this.get('loadingNewerPage');
  }.property('loadingOlderPage', 'loadingNewerPage'),

  loadOlderPage: function(modelName, queryExtras) {
    var object = this.get('firstObject');
    var pageId = null;

    if (object !== undefined) {
      pageId = object.get('id');
    }

    return this.loadPage(modelName, pageId, false, queryExtras);
  },

  addNewerObjects: function(result) {
    this.addObjects(result.toArray());
  },

  addOlderObjects: function(result) {
    this.unshiftObjects(result.toArray().reverse());
  },

  loadNewerPage: function(modelName, queryExtras) {
    var object = this.get('lastObject');
    var pageId = null;

    if (object !== undefined) {
      pageId = object.get('id');
    }

    return this.loadPage(modelName, pageId, true, queryExtras);
  },

  loadPage: function(modelName, pageId, newer, queryExtras) {
    if (this.get('loadingPage')) return;

    if (newer) {
      this.set('loadingNewerPage', true);

    } else {
      if (!this.get('hasOlderPage')) return;
      this.set('loadingOlderPage', true);
    }

    // default query
    var query = {
      limit: 25,
      pageId: pageId,
      newer: newer
    };

    // extend it with user provided criterions
    $.extend(query, queryExtras);

    return this.store.find(modelName, query).then($.proxy(function(result) {
      this.beginPropertyChanges();

      if (newer) {
        this.addNewerObjects(result);

      } else {
        this.addOlderObjects(result);
        this.set('hasOlderPage', result.toArray().length === query.limit);
      }

      this.set('loadingNewerPage', false);
      this.set('loadingOlderPage', false);
      this.set('loadedPageWas', newer ? 'newer' : 'older');
      this.incrementProperty('pagesLoaded', 1);

      this.endPropertyChanges();

      return result;
    }, this));
  },

  reset: function(otherPropertiesToReset) {
    this.beginPropertyChanges();

    // reset controller
    this.setProperties({
      pagesLoaded: 0,
      hasOlderPage: true,
      loadingNewerPage: false,
      loadingOlderPage: false,
      loadedPageWas: null
    });

    if (otherPropertiesToReset) {
      this.setProperties(otherPropertiesToReset);
    }

    // clear current entries
    this.clear();

    this.endPropertyChanges(); 
  }
});