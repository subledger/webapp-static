import InfiniteScrollController from "subledger-app/mixins/infinite-scroll-controller";

export default Ember.ArrayController.extend(InfiniteScrollController, {
  itemController: 'journal-entry/lines/line',

  collapsed: false,
  collapsive: true,
  journalEntry: null,

  init: function() {
    this._super();

    if (this.get('journalEntry') === null) {
      this.set('journalEntry', this.get('content').owner);
    }
  },

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