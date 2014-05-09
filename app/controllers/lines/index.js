export default Ember.ArrayController.extend({
  needs: "account",
  account: Ember.computed.alias("controllers.account"),

  loading: false,
  hasNextPage: true,

  actions: {
    loadPage: function() {
      this.loadPage();
    }
  },

  loadPage: function(perPage) {
    // mase sure only one page is loading at a time
    if (this.get('loading')) return;

    var line = this.get('lastObject');
    var pageId = line ? line.get("id") : null;

    var query = {
      limit: perPage || 25,
      pageId: pageId
    };

    this.set('loading', true);

    return this.get('account').get('model').loadLines(query).then(
      $.proxy(function(lines) {
        this.unshiftObjects(lines.content);

        if (lines.content.length === query.perPage) {
          this.setProperties({
            'loading': false,
            'hasNextPage': true
          });

        } else {
          this.setProperties({
            'loading': false,
            'hasNextPage': false
          });
        }
        return lines;
      }, this)
    );
  },
});
