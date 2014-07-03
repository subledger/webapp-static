export default Ember.Object.extend({
  desc: null,

  key: null,
  secret: null,
  org: null,
  decimalPlaces: 2,

  lastUsed: null,

  init: function() {
    this._super();
  },

  toJSON: function() {
    if (!window.localStorage) return;

    return JSON.stringify({
      desc: this.get('desc'),
      key: this.get('key'),
      secret: this.get('secret'),
      org: this.get('org'),
      decimalPlaces: this.get('decimalPlaces'),
      lastUsed: this.get('lastUsed')
    });
  }

});