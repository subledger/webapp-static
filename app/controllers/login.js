export default Ember.ObjectController.extend({
  key: null,
  secret: null,
  org: null,

  error: null,

  actions: {
    login: function() {
      this.set('error', null);      
      var credential = this.get('model');

      credential.setProperties({
        key: this.get('key'),
        secret: this.get('secret'),
        org: this.get('org')
      });

      credential.authenticate(this.store).then(
        $.proxy(function() {
          credential.update();

          Ember.run.next(this, function() {
            this.transitionToRoute('journal-entries');
          });        
        }, this),

        $.proxy(function(reason) {
          this.set('error', reason);
        }, this)
      );
    }
  }
});
