import InfiniteScrollView from "subledger-app/mixins/infinite-scroll-view";

export default Ember.View.extend(InfiniteScrollView, {
  tagName: 'section',
  classNames: 'lines',
  contentClasses: 'infinite-scroll'
});