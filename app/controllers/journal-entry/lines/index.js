import Ember from 'ember';
import InfiniteScrollController from "subledger-app/mixins/infinite-scroll-controller";

export default Ember.ArrayController.extend(InfiniteScrollController, {
  itemController: 'journal-entry/lines/line',

  collapsed: false,
  collapsive: true,

  journalEntry: function() {
    this.set('journalEntry', this.get('content').relationship.record);
  }.property('content'),

  // overwrite addOlderOjects
  addOlderObjects: function(result) {
    this.addObjects(result.toArray());
  },

  actions: {
    loadOlderPage: function() {
      this.loadOlderPage('line', { journalEntry: this.get('journalEntry') });
    },

    loadNewerPage: function() {
      this.loadNewerPage('line', { journalEntry: this.get('journalEntry') });      
    },

    toggleCollapsed: function() {
      this.toggleProperty('collapsed');
    }
  }
});