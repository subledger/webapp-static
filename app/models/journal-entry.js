export default DS.Model.extend({
  state:       DS.attr('string'),
  effectiveAt: DS.attr('iso-date'),
  description: DS.attr('string'),
  reference:   DS.attr('string'),
  version:     DS.attr('number'),
  lines:       DS.attr(),

  isValid: function() {
    var hasErrors = false;

    if (Ember.isEmpty(this.get('effectiveAt'))) {
      hasErrors = true;
      this.get('errors').add('effectiveAt', 'Must not be blank');
    }    

    if (Ember.isEmpty(this.get('description'))) {
      hasErrors = true;
      this.get('errors').add('description', 'Must no be blank');
    }

    if (Ember.isEmpty(this.get('reference'))) {
      hasErrors = true;
      this.get('errors').add('reference', 'Must not be blank');
    }

    this.get('lines').forEach(function(line, index, enumerable) {
      if (Ember.isEmpty(line.get('account'))) {
        hasErrors = true;
        line.get('errors').add('account', 'Must not be blank');
      }      

      if (Ember.isEmpty(line.get('description'))) {
        hasErrors = true;
        line.get('errors').add('description', 'Must not be blank');
      }

      if (Ember.isEmpty(line.get('reference'))) {
        hasErrors = true;
        line.get('errors').add('reference', 'Must not be blank');
      }

      if (Ember.isEmpty(line.get('value')) || Ember.isEmpty(line.get('value')['amount'])) {
        hasErrors = true;
        line.get('errors').add('value', 'Must not be blank');
      }      

    }, this);

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
