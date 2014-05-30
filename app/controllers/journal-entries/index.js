import InfiniteScrollController from "subledger-app/mixins/infinite-scroll-controller";

export default Ember.ArrayController.extend(InfiniteScrollController, {
  //itemController: 'journal-entry/lines/index',

  selectedState: "POSTED",
  states: ["POSTED", "POSTING"],

  actions: {
    loadOlderPage: function() {
      this.loadOlderPage('journalEntry', {
        state: this.get('selectedState')
      });
    },

    loadNewerPage: function() {
      this.loadNewerPage('journalEntry', {
        state: this.get('selectedState')
      });
    },

    changeState: function(newState) {
      this.reset({
        selectedState: newState
      });
    }
  }
});
