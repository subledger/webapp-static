export default Ember.Route.extend({
  model: function() {
    var account = this.modelFor('account');
    var points = Ember.A();

    // start by loading first and last line to get initial chart time frame
    return this.store.find('line', { account: account, operation: 'first_and_last_line' }).then(
      $.proxy(function(lines) {
        lines.every(function(item, index, enumerable) {
          var value = item.get('balance').value;

          points.addObject(Ember.Object.create({
            id: item.get('id'),
            journalEntryId: item.get('journal_entry'),
            accountId: item.get('account'),
            type: value.type,
            amount: parseFloat(value.amount),
            date: item.get('effectiveAt')
          }));

          return true;
        }, this);

        // temporarily remove last object
        var lastPoint = points.popObject();

        // now, get the last N journal entries
        return this.store.find('line', { account: account, pageId: lastPoint.get('id'), limit: 30 }).then(
          $.proxy(function(lines) {
            lines.toArray().reverse().every(function(item, index, enumerable) {
              var value = item.get('balance').value;

              points.addObject(Ember.Object.create({
                id: item.get('id'),
                journalEntryId: item.get('journal_entry'),
                accountId: item.get('account'),
                type: value.type,
                amount: parseFloat(value.amount),
                date: item.get('effectiveAt')
              }));

              return true;
            }, this);

            // add last object back
            points.addObject(lastPoint);

            return points;
          }, this)
        );

      }, this)
    );
  },  

  model2: function() {
    var account = this.modelFor('account');
    var points = Ember.A();

    // start by loading first and last line to get initial chart time frame
    return this.store.find('line', { account: account, operation: 'first_and_last_line' }).then(
      $.proxy(function(lines) {
        lines.every(function(item, index, enumerable) {
          var value = item.get('balance').value;

          points.addObject(Ember.Object.create({
            journalEntry: item.get('id'),
            type: value.type,
            amount: parseFloat(value.amount),
            date: item.get('effectiveAt')
          }));

          return true;
        }, this);

        // now, calculate N intermediate points to get balances
        var firstPoint = points.get('firstObject');
        var lastPoint = points.get('lastObject');

        var pointStart = firstPoint.get('date');
        var pointEnd = lastPoint.get('date');

        var pointInterval = (lastPoint.get('date') - firstPoint.get('date')) / this.get('resolution') - 1;
        pointInterval = pointInterval % 2 > 0 ? parseInt(pointInterval) + 1 : parseInt(pointInterval);

        // temporarily remove last object
        points.popObject();

        // get balances for every intermeidate point
        var promises = Ember.A();

        var createPoint = function(balances) {
          var balance = balances.get('firstObject');
          var value = balance.get('value');

          return Ember.Object.create({
            journalEntry: null,
            type: value.type,
            amount: parseFloat(value.amount),
            date: balance.get('at')
          });
        };

        for (var ms = pointStart.getTime() + pointInterval; ms < pointEnd.getTime() - pointInterval; ms = ms + pointInterval) {
          promises.addObject(this.store.find('balance', { account: account, date: new Date(ms) }).then(createPoint));
        }

        return Ember.RSVP.Promise.all(promises).then(function(intermediatePoints) {
          // add all intermediate points
          points.addObjects(intermediatePoints);

          // add last object back
          points.addObject(lastPoint);

          return points;
        });

      }, this)
    );
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('account', this.modelFor('account'));
  }
});