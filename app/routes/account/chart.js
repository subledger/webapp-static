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

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('account', this.modelFor('account'));
  }
});