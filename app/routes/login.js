export default Ember.Route.extend({

  beforeModel: function(transition) {
    return this.store.find('credential', 1).then(
      $.proxy(function(credential) {
        window.App.set('credentials', credential);
      }, this),

      $.proxy(function(reason) {
        console.log(reason);
      }, this)
    );
  },	

  model: function() {
    return window.App.get('credentials');
  }

});