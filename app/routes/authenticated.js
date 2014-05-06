export default Ember.Route.extend({
  beforeModel: function(transition) {
    // get and set credential in shared memory
    return this.store.find('credential', 1).then(
      $.proxy(function(credential) {

        console.log(credential);

        return window.App.set('credentials', credential).then(          
          $.proxy(function() {

            if (!credential.isPresent()) {
              this.redirectToLogin(transition);
            }

          }, this)

        );

      }, this),

      $.proxy(function(reason) {
        console.log(reason);
      }, this)
    );
  },

  redirectToLogin: function(transition) {
    this.transitionTo('login');
  },

  actions: {
    error: function(reason, transition) {
      if (reason.status === 401) {
        this.redirectToLogin(transition);

      } else {
        alert('Something went wrong');
        console.log(reason);
      }
    }
  }
});