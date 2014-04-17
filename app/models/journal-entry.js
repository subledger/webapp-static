export default DS.Model.extend({
  state:       DS.attr('string'),
  effectiveAt: DS.attr('iso-date'),
  description: DS.attr('string'),
  reference:   DS.attr('string'),
  version:     DS.attr('number'),
  lines:       DS.attr(),

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
