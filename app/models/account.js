export default DS.Model.extend({
  book:          DS.attr(),
  state:         DS.attr('string'),
  description:   DS.attr('string'),
  reference:     DS.attr('string'),
  normalBalance: DS.attr('string'),
  balance:       DS.attr(),
  lines:         DS.hasMany('line'),
  version:       DS.attr('number')
});