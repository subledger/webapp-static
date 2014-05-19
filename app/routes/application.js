export default Ember.Route.extend({
  beforeModel: function(transition) {
    if (transition.intent.name === "login") return;

    // get and set credential in shared memory    
    return this.store.find('credential', 1).then(
      $.proxy(function(credential) {

        return window.App.set('credentials', credential).then(          
          $.proxy(function() {

            if (!credential.get('isPresent')) {
              this.transitionTo('login');
            }
          }, this)
        );

      }, this)

      // $.proxy(function(reason) {
      //   console.log(reason);
      // }, this)
    );
  },

  model: function() {
    if (window.App.get('credentials').get('isPresent')) {
      return this.store.find('book').then(function(books) {
        return books.toArray();
      });

    } else {
      return Ember.A();
    }    
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  }
});