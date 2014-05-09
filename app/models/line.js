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

  amount: function() {
    return this.get('value') ? this.get('value')['amount'] : null;
  }.property('value'),

  type: function() {
    return this.get('value') ? this.get('value')['type'] : null;
  }.property('type'),

  debitAmount: function(key, value, previousValue) {
    if (arguments.length > 1) {
      if (value && value !== '0.00') {
        this.set('value', {
          type: 'debit',
          amount: value
        });
      } else if (((value && value === '0.00') || !value) && previousValue) {
        this.set('value', null);
      }
    }

    var val = this.get('value');

    if (val && val['type'] === 'debit') {
      return val['amount'];
    }

    return null;
  }.property('value'),

  creditAmount: function(key, value, previousValue) {
    if (arguments.length > 1) {
      if (value && value !== '0.00') {
        this.set('value', {
          type: 'credit',
          amount: value
        });
      } else if (((value && value === '0.00') || !value) && previousValue) {
        this.set('value', null);
      }
    }

    var val = this.get('value');

    if (val && val['type'] === 'credit') {
      return val['amount'];
    }

    return null;
  }.property('value')
});
