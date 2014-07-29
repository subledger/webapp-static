import DS from 'ember-data';

export default DS.Model.extend({
  at:          DS.attr('iso-date'),
  creditValue: DS.attr(),
  debitValue:  DS.attr(),
  value:       DS.attr()
});