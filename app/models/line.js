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
  balance:      DS.attr(),

  debitAmount: function(key, value, previousValue) {
    if (arguments.length > 1 && value && value !== '0.00') {
      this.set('value', {
        type: 'debit',
        amount: value
      });
    }

    var val = this.get('value');

    if (val && val['type'] === 'debit') {
      return val['amount'];
    }

    return null;
  }.property('value'),

  creditAmount: function(key, value, previousValue) {
    if (arguments.length > 1 && value && value !== '0.00') {
      this.set('value', {
        type: 'credit',
        amount: value
      });
    }

    var val = this.get('value');

    if (val && val['type'] === 'credit') {
      return val['amount'];
    }

    return null;
  }.property('value')
});
