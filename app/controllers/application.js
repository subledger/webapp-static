export default Ember.ArrayController.extend({
  book: function(key, value, previousValue) {
    var credentials = window.App.get('credentials');

    if (arguments.length > 1) {
      if (value !== previousValue) {
        credentials.set('book', value);
        
        credentials.save().then(function() {
          window.location.reload();
        });
      }
    }

    return credentials.get('book');
  }.property('book')
});