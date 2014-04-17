export default Ember.View.extend({
  templateName: 'journal-entry',

  didInsertElement: function() {
    this.$().on("click", ".clickable", $.proxy(function(e) {
      e.preventDefault();
      this.get('controller').send('toggleExpanded');
    }, this));
  }
});
