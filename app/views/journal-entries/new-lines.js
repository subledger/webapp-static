import NewLineView from 'subledger-app/views/journal-entries/new-line';

export default Ember.ContainerView.extend({
  init: function() {
    this._super();
    this.addLine();
  },

  addLine: function() {
    this.pushObject(NewLineView.create());
  }
});