export default Ember.ArrayController.extend({
  loading: true,
  itemController: 'Report',

  loadAll: function(nextPageId) {
    // return if data was already loaded
    if (!this.get('loading')) return;

    var query = {
      limit: 5,
      nextPageId: nextPageId
    };

    this.store.find('report', query).then($.proxy(function(reports) {
      this.addObjects(reports.content);

      if (reports.content.length === query.limit) {
        this.loadAll(this.get('lastObject').get('id'));

      } else {
        this.set('loading', false);
      }
    }, this));
  }
});
