import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    setDecimalPlaces: function(newDecimalPlaces) {
      this.get('model').set('decimalPlaces', newDecimalPlaces);
    }
  }
});