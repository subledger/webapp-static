import Base64 from "subledger-app/utils/Base64";

export default DS.Model.extend({
  key:      DS.attr('string'),
  secret:   DS.attr('string'),
  org:      DS.attr('string'),
  book:     DS.attr('string'),

  isPresent: function() {
    return !Ember.isEmpty(this.get('key'))    &&
           !Ember.isEmpty(this.get('secret')) &&
           !Ember.isEmpty(this.get('org'));
  }.property('key', 'secret', 'org'),

  apiUrl: function() {
    return new Subledger().url;
  }.property(),

  basicAuthenticationHeader: function() {
    var token = this.get('key') + ':' + this.get('secret');
    var hash = new Base64().encode(token);
    return 'Basic ' + hash;

  }.property('key', 'secret'),
});