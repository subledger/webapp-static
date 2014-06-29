export default DS.Model.extend({
  book:          DS.attr(),
  state:         DS.attr('string'),
  description:   DS.attr('string'),
  reference:     DS.attr('string'),
  normalBalance: DS.attr('string'),
  balance:       DS.attr(),
  lines:         DS.hasMany('line'),
  version:       DS.attr('number'),

  isValid: function() {
    var hasErrors = false;
    var urlregex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    if (Ember.isEmpty(this.get('description'))) {
      hasErrors = true;
      this.get('errors').add('description', 'Must not be blank');
    }

    if (!Ember.isEmpty(this.get('reference')) && !urlregex.test(this.get('reference'))) {
      hasErrors = true;
      this.get('errors').add('reference', 'Must be valid URI');
    }

    if (Ember.isEmpty(this.get('normalBalance')) || !['credit', 'debit'].contains(this.get('normalBalance')))  {
      hasErrors = true;
      this.get('errors').add('normalBalance', 'Must not be blank');
    }

    return !hasErrors;
  }
});