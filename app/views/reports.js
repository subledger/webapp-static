export default Ember.View.extend({

  didInsertElement: function() {
    this.get('controller').loadAll();
  }

});
