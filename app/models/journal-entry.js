export default DS.Model.extend({
  state:       DS.attr('string'),
  effectiveAt: DS.attr('iso-date'),
  description: DS.attr('string'),
  reference:   DS.attr('string'),
  version:     DS.attr('number'),
  lines:       DS.hasMany('line'),

  totalDebit: function() {
    var total = 0;

    this.get('lines').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('debitAmount'));
    }, this);

    return total;

  }.property('lines.@each.debitAmount'),

  totalCredit: function() {
    var total = 0;

    this.get('lines').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('creditAmount'));
    }, this);

    return total;

  }.property('lines.@each.creditAmount'),

  totalAmount: function() {
    var total = 0;

    this.get('lines').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('amount'));
    }, this);

    return total;

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

    if (Ember.isEmpty(this.get('reference'))) {
      hasErrors = true;
      this.get('errors').add('reference', 'Must not be blank');

    } else {
      if (!urlregex.test(this.get('reference'))) {
        hasErrors = true;
        this.get('errors').add('reference', 'Must be valid URI');
      }
    }

    if (this.get('lines').length < 1) {
      hasErrors = true;
      this.get('errors').add('lines', 'You need at least one line');
    }

    var totalCredit = 0;
    var totalDebit = 0;

    var hasLineErrors = false;
    this.get('lines').forEach(function(line, index, enumerable) {
      if (Ember.isEmpty(line.get('account'))) {
        hasLineErrors = true;
        line.get('errors').add('account', 'Must not be blank');
      }      

      if (Ember.isEmpty(line.get('description'))) {
        hasLineErrors = true;
        line.get('errors').add('description', 'Must not be blank');
      }

      if (Ember.isEmpty(line.get('reference'))) {
        hasLineErrors = true;
        line.get('errors').add('reference', 'Must not be blank');
      } else {
        if (!urlregex.test(line.get('reference'))) {
          hasErrors = true;
          line.get('errors').add('reference', 'Must be valid URI');
        }        
      }

      if (Ember.isEmpty(line.get('value')) || Ember.isEmpty(line.get('value')['amount'])) {
        hasLineErrors = true;
        line.get('errors').add('value', 'Must not be blank');

      } else {
        if (line.get('value')['type'] === 'credit') {
          totalCredit += accounting.unformat(line.get('value')['amount']);
          
        } else if (line.get('value')['type'] === 'debit') {
          totalDebit += accounting.unformat(line.get('value')['amount']);
        }
      }
    }, this);

    if (hasLineErrors) {
      hasErrors = true;
      this.get('errors').add('lines', 'One or more lines have validation errors');
    }

    if (totalCredit !== totalDebit) {
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
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var promises = [];

      lines.every($.proxy(function(line, index, enumerable) {
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

      new Ember.RSVP.all(promises).then(function(accounts) {
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
