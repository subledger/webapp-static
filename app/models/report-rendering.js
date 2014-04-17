export default DS.Model.extend({
  book:          DS.attr('string'),
  report:        DS.attr('string'),

  progress:      DS.attr(),
  description:   DS.attr('string'),
  effectiveAt:   DS.attr('iso-date'),
  renderedAt:    DS.attr('iso-date'),

  balance:       DS.attr(),
  categories:    DS.attr(),
  warnings:      DS.attr(),
  totalAccounts: DS.attr('number')
});