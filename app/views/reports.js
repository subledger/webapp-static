export default Ember.View.extend({
  templateName: 'reports',

  didInsertElement: function() {
    this.get('controller').loadAll();
  },

});
