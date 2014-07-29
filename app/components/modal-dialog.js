import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['modal', 'fade'],

  didInsertElement: function() {
    this.$().on("open", $.proxy(function() {
      this.$().modal();
    }, this));
  }
});