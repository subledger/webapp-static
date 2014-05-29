import InfiniteScrollView from "subledger-app/mixins/infinite-scroll-view";

export default Ember.View.extend(InfiniteScrollView, {
  tagName: 'div',
  classNames: 'index',
  layoutName: 'layouts/header-only',
  headerName: 'journal-entries/index/header',
  contentClasses: 'infinite-scroll',

  onStateChange: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.loadOlderPage();
    });
  }.observes('controller.selectedState')
});
