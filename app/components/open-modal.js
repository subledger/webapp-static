import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['btn'],
  attributeBindings: ['type', 'style'],

  type: 'button',

  click: function() {
    $(this.get('modal-selector')).trigger('open');
  }
});