export default Ember.Route.extend({
  beforeModel: function(transition) {
    this.store.find('credential', 1).then(
      $.proxy(function(credential) {
        window.App.set('credentials', credential);

        if (!credential.isPresent()) {
          this.redirectToLogin(transition);
        }
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