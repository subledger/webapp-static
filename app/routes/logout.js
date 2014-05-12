export default Ember.Route.extend({

  beforeModel: function(transition) {
    this.store.find('credential', 1).then(
      $.proxy(function(credential) {
        // reset credentials
        credential.setProperties({
          key: '',
          secret: '',
          org: '',
          book: ''
        });

        // save it
        credential.save().then(
          $.proxy(function() {
            
            // go to login page
            this.transitionTo('login').then(function() {
              document.location.reload(true);
            });

          }, this)
        );

      }, this),

      $.proxy(function(reason) {
        console.log(reason);
      }, this)
    );
  }

});