export default Ember.Controller.extend({
  setCreds: function() {
    var credentials = window.App.get('credentials');

    this.key    = credentials.get('key');
    this.secret = credentials.get('secret');
    this.org    = credentials.get('org');
  },

  actions: {
    login: function() {
      var credentials = window.App.get('credentials');

      // update credential values
      credentials.setProperties({
        key: this.key,
        secret: this.secret,
        org: this.org
      });

      credentials.loadBooks().then(
        $.proxy(function(books) {
          // set first book as current
          credentials.set('book', books.get('firstObject').get('id'));

          // save it
          credentials.save();

          // transition to index
          this.transitionToRoute('index');

        }, this),

        $.proxy(function(reason) {
          console.log(reason);
        }, this)
      );
    }
  }
});
