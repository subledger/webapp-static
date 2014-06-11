import InfiniteScrollView from "subledger-app/mixins/infinite-scroll-view";

export default Ember.View.extend(InfiniteScrollView, {
  tagName: 'section',
  classNames: 'account-lines',

  layoutName: 'layouts/panel-with-header-and-table',
  headerTemplateName: 'account/lines/header',
  bodyClassNames: 'lines',
  bodyContentClassNames: 'infinite-scroll'
});