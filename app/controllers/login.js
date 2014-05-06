export default Ember.ObjectController.extend({
  actions: {
    login: function() {
      var credentials = this.get('model');
      credentials.set('book', '');

      // save it
      credentials.save().then(
        $.proxy(function() {

          // load books
          credentials.loadBooks().then(
            $.proxy(function(books) {

              // set first book as current
              credentials.set('book', books.get('firstObject').get('id'));

              // save it
              credentials.save().then(
                $.proxy(function() {

                  // transition to index
                  this.transitionToRoute('index');

                }, this)
              );
            }, this),

            $.proxy(function(reason) {
              console.log(reason);
            }, this)
          );
        }, this)
      );
    }
  }
});
