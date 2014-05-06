import NewLinesView from 'subledger-app/views/journal-entries/new-lines';

export default Ember.View.extend({
  linesView: NewLinesView.create(),

  init: function() {
    this._super();
  },

  totalDebit: function() {
    var total = 0;

    this.get('linesView').get('childViews').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('debitAmount'));
    }, this);

    return total;

  }.property('linesView.@each.debitAmount'),  

  totalCredit: function() {
    var total = 0;

    this.get('linesView').get('childViews').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('creditAmount'));
    }, this);

    return total;

  }.property('linesView.@each.creditAmount'),

  accountsLoaded: function() {
    console.log("accountsLoaded observed");
    
    if (this.get("controller.loadingAccounts") === false) {
      // get accounts from controller
      var accounts = this.controller.get("accounts");

      // instantiate and configure suggestion engine
      var accountsDataset = new Bloodhound({
        name: "accountsDataset",
        local: $.map(accounts, function(account) {
          return {
            id: account.get("id"),
            description: account.get("description"),
            normalBalance: account.get("normalBalance")
          };
        }),
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d.description);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
      });

      // initialize it
      accountsDataset.initialize();

      // set the suggestion engine
      this.set("accountsDataset", accountsDataset);

      // add first line
      this.addLine();
    }    

  }.observes("controller.loadingAccounts"),


  actions: {
    addLine: function() {
      this.addLine();
    },

    post: function() {
      // get effectiveAt
      var journalEntry = this.get('controller').get('model');      
      journalEntry.set('effectiveAt', this.getEffectiveAt());

      // get account ids and amounts for each line
      this.get('childViews').get('lastObject').get('childViews').forEach(
        function(item, index, enumerable) {
          // get the line
          var line = item.get('model');

          // get amd set the account id
          line.set("account", item.get("accountId"));

          // get the amount
          var value = {
            type: "debit",
            amount: item.get('debitAmount')
          };

          var creditAmount = item.get('creditAmount');
          if (creditAmount) {
            value["type"] = "credit";
            value["amount"] = creditAmount;
          }

          // set the amount
          line.set("value", value);
        }, this
      );

      // call post on controller
      this.controller.send('post');
    }
  },

  didInsertElement: function() {
    // configure datepicker for at
    this.$().find(".effective-at").datetimepicker({
      useCurrent: false
    });
  },

  willDestroyElement: function() {
  },

  addLine: function() {
    this.controller.send('addLine');
    var line = this.controller.get('lines').get('lastObject');
    var journalEntry = this.controller.get('model');
    var accountsDataset = this.get('accountsDataset');

    this.get('childViews').get('lastObject').addLine(line, journalEntry, accountsDataset);
  },

  getEffectiveAt: function() {
    var date = moment(this.$("#effectiveAt").val());
    return date.isValid() ? date.toDate() : null;
  }

});
