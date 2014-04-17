export default DS.Model.extend({
  account:      DS.attr(),
  journalEntry: DS.attr(),
  state:        DS.attr('string'),
  effectiveAt:  DS.attr('iso-date'),
  description:  DS.attr('string'),
  reference:    DS.attr('string'),
  order:        DS.attr('number'),
  version:      DS.attr('number'),

  value:        DS.attr(),
  balance:      DS.attr()
});
