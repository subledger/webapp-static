import Ember from 'ember';
import InfiniteScrollController from "subledger-app/mixins/infinite-scroll-controller";

export default Ember.ArrayController.extend(InfiniteScrollController, {
  itemController: 'journal-entry/lines/line',

  collapsed: false,
  collapsive: true,
  journalEntry: null,

  init: function() {
    this._super();

    if (!this.get('journalEntry') && this.get('content') && this.get('content').relationship) {
      this.set('journalEntry', this.get('content').relationship.record);
    }
  },

  setJournalEntry: function() {
    if (!this.get('journalEntry') && this.get('content') && this.get('content').relationship) {
      this.set('journalEntry', this.get('content').relationship.record);
    }
  }.observes('content'),

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