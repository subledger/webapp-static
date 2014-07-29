import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var account = this.modelFor('account');
    var points = Ember.A();

    // start by loading first and last line to get initial chart time frame
    return this.store.find('line', { account: account, operation: 'first_and_last_line' }).then(
      $.proxy(function(lines) {

        lines.every(function(item) {
          points.addObject(this.lineToPoint(account, item));
          return true;
        }, this);

        // temporarily remove last object
        var lastPoint = points.popObject();

        // now, get the last N journal entries
        return this.store.find('line', { account: account, pageId: lastPoint.get('id'), limit: 30 }).then(
          $.proxy(function(lines) {

            lines.toArray().reverse().every(function(item) {
              points.addObject(this.lineToPoint(account, item));
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
  },

  lineToPoint: function(account, line) {
    var value = line.get('balance').value;
    var amount = parseFloat(value.amount);

    var type = value.type;

    var accountType = account.get('normalBalance');

    if (type !== 'zero' && type !== accountType) {
      amount = amount * -1;
    }

    return Ember.Object.create({
      id: line.get('id'),
      journalEntryId: line.get('journal_entry'),
      accountId: line.get('account'),
      type: type,
      amount: amount,
      date: line.get('effectiveAt')
    });
  }
});