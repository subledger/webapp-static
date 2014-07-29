import DS from 'ember-data';

export default DS.Model.extend({
  state:          DS.attr('string'),
  description:    DS.attr('string'),
  reference:      DS.attr('string'),
  version:        DS.attr('number'),

  // accounts:       DS.hasMany('account'),
  // journalEntries: DS.hasMany('journalEntry')
});
