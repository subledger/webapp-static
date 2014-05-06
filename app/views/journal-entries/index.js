export default Ember.View.extend({
  loadingFirstPage: true,

  initialPagesLoader: function() {
    if (!this.get('loadingFirstPage')) return;

    Ember.run.once($.proxy(function() {
      this.loadNextPage();
    }, this));

  }.observes('controller.content.@each').on("init"),

  loadNextPage: function() {
    if ($(".loading-more")[0] !== undefined && $(".loading-more").visible()) {
      this.get('controller').send('nextPage');
    }
  },

  didInsertElement: function() {
    $(".app-main-content").on('scroll', $.proxy(function() {
      this.set('loadingFirstPage', false);
      this.loadNextPage();
    }, this));
  },

  willDestroyElement: function() {
    $(".app-main-content").off('scroll');
  }
});
