export default Ember.View.extend({
  tagName: 'div',
  classNames: ['login-container'],

  decimalPlacesChanged: function() {
    if (this.$(".decimal-places input")) {
      var newDecimalPlaces = this.get('controller').get('decimalPlaces');
      this.$(".decimal-places input").slider('setValue', newDecimalPlaces);
    }
  }.observes('controller.decimalPlaces'),

  actions: {
    removeCredential: function(credential) {
      if (confirm('Remove Credential from History?')) {
        this.get('controller').send('removeCredential', credential);
      }
    }
  },

  didInsertElement: function() {
    this.$(".decimal-places input").slider({
      min: 0,
      max: 8,
      step: 1,
      decimalPlaces: 0,
      value: this.get('controller').get('decimalPlaces'),
      formater: function(value) {
        return 'Decimal Places to display: ' + value;
      }

    }).on('slide', $.proxy(function(e) {
      this.get('controller').send('setDecimalPlaces', e.value);
    }, this));
  }
});