export default Ember.View.extend({
  loadingFirstPage: true,

  initialPagesLoader: function() {
    if (!this.get('loadingFirstPage')) return;

    Ember.run.once($.proxy(function() {
      this.loadNextPage();
    }, this));
  }.observes('controller.content.@each'),

  loadNextPage: function() {
    if ($(".loading-more")[0] !== undefined && $(".loading-more").visible()) {
      this.get('controller').send('nextPage');
    }
  },

  didInsertElement: function() {
    $(".main-content").on('scroll', $.proxy(function() {
      this.set('loadingFirstPage', false);
      this.loadNextPage();
    }, this));
  },

  willDestroyElement: function() {
    $(".main-content").off('scroll');
  }
});
