export default Ember.ObjectController.extend({
  actions: {
    login: function() {
      var credentials = this.get('model');

      this.store.find('book').then($.proxy(function(books) {
        // get first book
        var firstBook = books.get('firstObject');

        if (firstBook) {
          credentials.set('book', firstBook.get('id'));

        } else {
          // TODO handle creds with no books
        }

        credentials.save().then($.proxy(function() {
          this.controllerFor('application').clear();
          this.controllerFor('application').addObjects(books);

          this.transitionToRoute('index');
        }, this));
        
      }, this));      
    }
  }
});
