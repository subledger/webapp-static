export default Ember.ArrayController.extend({
  needs: "account",
  account: Ember.computed.alias("controllers.account"),

  loading: false,

  keepTrackOfBalance: function() {
    var line = this.get('lastObject');

    if (line !== undefined) {
      this.set('balance', line.get('balance'));
    }

  }.observes('content.@each'),

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
        this.addObjects(lines.content);
        this.set('loading', false);
        return lines;
      }, this)
    );
  },
});
