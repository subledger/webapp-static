import NewLinesView from 'subledger-app/views/journal-entries/new-lines';

export default Ember.View.extend({
  linesView: NewLinesView,

  description: "",
  reference: "",

  init: function() {
    this._super();
  },

  actions: {
    addLine: function() {
      this.get('childViews').get('lastObject').addLine();
    },

    post: function() {
      // TODO validation

      // create journal entry object
      var journalEntryData = {};
      journalEntryData["effectiveAt"] = this.getEffectiveAt().toDate();
      journalEntryData["description"] = this.get('description');
      journalEntryData["reference"] = this.get('reference');

      // create lines
      var lines = [];

      this.get('childViews').get('lastObject').get('childViews').forEach(
        function(item, index, enumerable) {
          var line = {};
          line["account"] = item.get('accountId');
          line["description"] = item.get('description');
          line["reference"] = item.get('reference');

          var value = {
            type: "debit",
            amount: item.get('debitAmount')
          };

          var creditAmount = item.get('creditAmount');
          if (creditAmount) {
            value["type"] = "credit";
            value["amount"] = creditAmount;
          }

          line["value"] = value;

          // add too lines
          lines.push(line);
        }, this
      );

      // set lines on journal entry
      journalEntryData["lines"] = lines;

      // call post on controller
      this.controller.send('post', journalEntryData);
    }
  },

  didInsertElement: function() {
    // configure datepicker for at
    this.$().find(".effective-at").datetimepicker({});
  },

  willDestroyElement: function() {
  },

  getEffectiveAt: function() {
    return this.$().find(".effective-at").data('DateTimePicker').getDate();
  }

});
