export default DS.Model.extend({
  key:      DS.attr('string'),
  secret:   DS.attr('string'),
  org:      DS.attr('string'),
  book:     DS.attr('string'),

  isPresent: function() {
    return !Ember.isEmpty(this.get('key'))    &&
           !Ember.isEmpty(this.get('secret')) &&
           !Ember.isEmpty(this.get('org'));
  }.property('key', 'secret', 'org')
});