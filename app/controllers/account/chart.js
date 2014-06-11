export default Ember.ArrayController.extend({
  sortProperties: ['date'],
  account: null,
  resolution: 30,

  actions: {
    loadBalances: function(from, to) {
      var pointInterval = (to - from) / this.get('resolution');
      pointInterval = pointInterval % 2 > 0 ? parseInt(pointInterval) + 1 : parseInt(pointInterval);

      // get balances for every intermeidate point
      var promises = Ember.A();

      var createPoint = function(balances) {
        var balance = balances.get('firstObject');
        var value = balance.get('value');

        return Ember.Object.create({
          id: null,
          journalEntryId: null,
          accountId: this.get('account').get('id'),
          type: value.type,
          amount: parseFloat(value.amount),
          date: balance.get('at')
        });
      };

      for (var ms = from; ms <= to; ms = ms + pointInterval) {
        promises.addObject(
          this.store.find('balance', {
            account: this.get('account'), date: new Date(ms)
          }).then($.proxy(createPoint, this))
        );
      }

      return Ember.RSVP.Promise.all(promises).then(
        $.proxy(function(intermediatePoints) {
          // add all intermediate points
          this.addObjects(intermediatePoints);

          return this.get('content');
        }, this)
      );
    }
  }
});