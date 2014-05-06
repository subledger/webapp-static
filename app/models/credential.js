export default DS.Model.extend({
  //key:      'YXMqSdnlcYbQNERUnjduS2',
  //secret:   'FxVZxeTAyJPJSzqBPSgI9C',
  //org:      'DpowLDKa18fmX54JypV62A',
  //book:     '9fMrnCbshsOQ3C56jVcZQS',

  key:      DS.attr('string'),
  secret:   DS.attr('string'),
  org:      DS.attr('string'),
  book:     DS.attr('string'),

  allBooks: function() {
    if (this.isPresent()) {
      return this.loadBooks();
    } else {
      return Ember.A();
    }
  }.property('key', 'secret', 'org'),

  isPresent: function() {
    return !Ember.isEmpty(this.get('key'))    &&
           !Ember.isEmpty(this.get('secret')) &&
           !Ember.isEmpty(this.get('org'));
  },

  loadBooks: function() {
    return this.store.findAll('book');
  }
});
