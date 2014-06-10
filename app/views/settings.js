export default Ember.View.extend({
  tagName: 'div',
  classNames: 'settings',

  submit: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },

  didInsertElement: function() {
    this.$(".decimal-places input").slider({
      min: 0,
      max: 12,
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