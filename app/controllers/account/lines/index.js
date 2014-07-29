import Ember from 'ember';
import InfiniteScrollController from "subledger-app/mixins/infinite-scroll-controller";

export default Ember.ArrayController.extend(InfiniteScrollController, {
  itemController: 'account/lines/line',

  account: null,

  actions: {
    loadOlderPage: function() {
      this.loadOlderPage('line', { account: this.get('account') });
    },

    loadNewerPage: function() {
      this.loadNewerPage('line', { account: this.get('account') });
    }
  }
});
