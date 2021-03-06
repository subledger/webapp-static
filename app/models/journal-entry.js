import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  state:       DS.attr('string'),
  effectiveAt: DS.attr('iso-date'),
  description: DS.attr('string'),
  reference:   DS.attr('string'),
  version:     DS.attr('number'),
  lines:       DS.hasMany('line'),

  totalDebit: function() {
    var total = new BigNumber(0);

    this.get('lines').forEach(function(item) {
      if (item.get('debitAmount')) {
        total = total.plus(item.get('debitAmount'));  
      }      
    }, this);

    return total.toString();

  }.property('lines.@each.debitAmount'),

  totalCredit: function() {
    var total = new BigNumber(0);

    this.get('lines').forEach(function(item) {
      if (item.get('creditAmount')) {
        total = total.plus(item.get('creditAmount'));  
      }      
    }, this);

    return total.toString();

  }.property('lines.@each.creditAmount'),

  totalAmount: function() {
    var total = new BigNumber(0);

    this.get('lines').forEach(function(item) {
      if (item.get('amount')) {
        total = total.plus(item.get('amount'));  
      }      
    }, this);

    return total.toString();

  }.property('lines'),

  isValid: function() {
    var hasErrors = false;
    var urlregex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    if (Ember.isEmpty(this.get('effectiveAt'))) {
      hasErrors = true;
      this.get('errors').add('effectiveAt', 'Must not be blank');
    }

    if (Ember.isEmpty(this.get('description'))) {
      hasErrors = true;
      this.get('errors').add('description', 'Must not be blank');
    }

    if (!Ember.isEmpty(this.get('reference')) && !urlregex.test(this.get('reference'))) {
      hasErrors = true;
      this.get('errors').add('reference', 'Must be valid URI');
    }

    if (this.get('lines').length < 1) {
      hasErrors = true;
      this.get('errors').add('lines', 'You need at least one line');
    }

    var totalCredit = new BigNumber(0);
    var totalDebit = new BigNumber(0);

    var hasLineErrors = false;
    this.get('lines').forEach(function(line) {
      if (Ember.isEmpty(line.get('account'))) {
        hasLineErrors = true;
        line.get('errors').add('account', 'Must not be blank');
      }      

      if (Ember.isEmpty(line.get('description'))) {
        hasLineErrors = true;
        line.get('errors').add('description', 'Must not be blank');
      }

      if (!Ember.isEmpty(line.get('reference')) && !urlregex.test(line.get('reference'))) {
        hasErrors = true;
        line.get('errors').add('reference', 'Must be valid URI');
      }

      if (Ember.isEmpty(line.get('value')) || Ember.isEmpty(line.get('value')['amount'])) {
        hasLineErrors = true;
        line.get('errors').add('value', 'Must not be blank');

      } else {
        if (line.get('value')['type'] === 'credit' && line.get('value')['amount']) {
          totalCredit = totalCredit.plus(line.get('value')['amount']);
          
        } else if (line.get('value')['type'] === 'debit' && line.get('value')['amount']) {
          totalDebit = totalDebit.plus(line.get('value')['amount']);
        }
      }
    }, this);

    if (hasLineErrors) {
      hasErrors = true;
      this.get('errors').add('lines', 'One or more lines have validation errors');
    }

    if (!totalCredit.equals(totalDebit)) {
      hasErrors = true;
      this.get('errors').add('lines', 'Total credit must match total debit');
    }

    return !hasErrors;
  },

  loadLines: function(query) {
    query = $.extend(query, { journalEntry: this });
    return this.store.find('line', query);
  },

  // replaces the account id on the line object by the actual account object
  loadLinesAccounts: function(lines) {
    return new Ember.RSVP.Promise($.proxy(function(resolve) {
      var promises = [];

      lines.every($.proxy(function(line) {
        var account = line.get('account');

        // the second time this code runs, we will already have the object
        if (!Ember.canInvoke(account, 'get')) {

          promises.push(
            this.store.find('account', account).then(function(theAccount) {
              line.set('account', theAccount);
              return theAccount;
            })
          );

        }

        return true;
      }, this));

      new Ember.RSVP.all(promises).then(function() {
        resolve(lines);
      });

    }, this));
  },

  loadLinesWithAccounts: function(query) {
    return this.loadLines(query).then(
      $.proxy(function(lines) {
        return this.loadLinesAccounts(lines);
      }, this)
    );
  }
});
