import Ember from 'ember';
import InfiniteScrollView from "subledger-app/mixins/infinite-scroll-view";

export default Ember.View.extend(InfiniteScrollView, {
  tagName: 'article',
  classNames: 'journal-entry',
  classNameBindings: ['collapsed', 'listItem'],

  layoutName: 'layouts/panel-with-header-and-body-table',
  templateName: 'journal-entry/lines/index',

  headerTemplateName: 'journal-entry/lines/header',
  bodyTemplateName: 'journal-entry/lines/body',

  collapsed: Ember.computed.alias('controller.collapsed'),
  collapsive: Ember.computed.alias('controller.collapsive'),

  initialAction: function() {
    if (!this.get('listItem')) {
      if (this.get('controller').toArray().length === 0) {
        this.loadOlderPage();
      } else {
        this.scrollToBottom();
      }
    }
  }.on('didInsertElement'),  

  listItem: function() {
    return this.get('controller').get('parentController') !== null;
  }.property(),

  headerClasses: function() {
    return this.get('collapsed') ? 'header' : 'header hidden';
  }.property('collapsed'),

  bodyClasses: function() {
    return 'body';
  }.property('collapsed'),

  tableClasses: function() {
    return this.get('collapsed') ? 'table' : 'table hidden';
  }.property('collapsed'),

  collpasedObserver: function() {
    if (this.get('collapsed') && this.get('listItem')) {
      if (this.get('controller').toArray().length === 0) {
        this.loadOlderPage();
      }
    }
  }.observes('collapsed'),

  didInsertElement: function() {
    if (this.get('collapsive')) {
      // handle click to toggle collapsed state
      this.$('.header, .body').on("click", $.proxy(function(e) {
        e.preventDefault();
        this.get('controller').send('toggleCollapsed');
      }, this));
    }
  }
});