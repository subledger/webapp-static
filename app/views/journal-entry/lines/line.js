import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'tr',
  templateName: 'journal-entry/lines/line',

  didInsertElement: function() {
    this.get('controller').send('loadAccountDescription');
  }
});