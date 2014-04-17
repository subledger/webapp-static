export default Ember.ArrayController.extend({
  needs: "account",
  account: Ember.computed.alias("controllers.account"),

  loading: true,
  hasNextPage: true,
  loadingPage: false,

  keepTrackOfBalance: function() {
    var firstLine = this.get('firstObject');

    if (firstLine !== undefined) {
      this.set('balance', firstLine.get('balance'));
    }
  }.observes('content.@each'),

  loadPage: function(pageId, perPage) {
    var query = {
      limit: perPage || 25,
      pageId: pageId
    };

    return this.get('account').get('model').loadLines(query).then(
      $.proxy(function(lines) {
        this.addObjects(lines.content);

        if (lines.content.length === query.limit) {
          this.set('hasNextPage', true);

        } else {
          this.set('hasNextPage', false);
        }

        this.set('loadingPage', false);
        return lines;

      }, this)
    );
  },

  loadAll: function(pageId, perPage) {
    perPage = perPage || 25;

    return this.loadPage(pageId, perPage).then(
      $.proxy(function(lines) {
        if (lines.content.length === perPage) {
          this.loadAll(this.get('lastObject').get('id'), perPage);

        } else {
          this.set('loading', false);
          return this.get('content');
        }
      }, this)
    );
  }
});
