import Ember from 'ember';
import Base64 from "subledger-app/utils/Base64";

export default Ember.Object.extend({
  key: null,
  secret: null,
  org: null,

  book: null,
  decimalPlaces: 2,

  books: Ember.A(),
  authenticated: false,

  init: function() {
    this._super();

    if (localStorage !== null) {
      var record = localStorage.getItem("credential");

      if (record !== null) {
        this.setProperties(JSON.parse(record));
      }      
    }
  },

  selectedBook: function(key, value, previousValue) {
    if (arguments.length > 1) {
      if (value !== previousValue) {
        this.set('book', value);
        
        this.update();
        window.location.reload();
      }
    }

    return this.get('book');
  }.property('book'),

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

  update: function() {
    if (!localStorage) { return; }
    
    var json = JSON.stringify({
      key: this.get('key'),
      secret: this.get('secret'),
      org: this.get('org'),
      book: this.get('book'),
      decimalPlaces: this.get('decimalPlaces')
    });

    localStorage.setItem("credential", json);
  },

  authenticate: function(store) {
    return store.find('book').then(
      $.proxy(function(books) {
        this.setProperties({
          books: books,
          book: this.get('book') || books.get('firstObject').get('id'),
          authenticated: true
        });

        return;
      }, this),

      $.proxy(function() {
        this.setProperties({
          books: Ember.A(),
          book: null,
          authenticated: false
        });

        throw new Error("Invalid Credentials");
      }, this)
    );
  },

  logout: function() {
    return this.setProperties({
      key: null,
      secret: null,
      org: null,
      books: Ember.A(),
      book: null,
      decimalPlaces: 2,
      authenticated: false
    });
  }
});