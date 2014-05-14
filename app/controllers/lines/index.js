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

  loadPage: function(limit) {
    // mase sure only one page is loading at a time, and only when necessary
    if (this.get('loading') || !this.get('hasNextPage')) return;

    var line = this.get('firstObject');
    var pageId = line ? line.get("id") : null;

    var query = {
      limit: limit || 25,
      pageId: pageId
    };

    this.set('loading', true);

    return this.get('account').get('model').loadLines(query).then(
      $.proxy(function(lines) {
        this.unshiftObjects(lines.toArray());

        if (lines.toArray().length === query.limit) {
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
