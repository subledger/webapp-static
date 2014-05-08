import NewLinesView from 'subledger-app/views/journal-entries/new-lines';

export default Ember.View.extend({
  linesView: null,

  effectiveAtInterval: null,

  init: function() {
    this._super();
    this.set('linesView', NewLinesView.create());
  },

  totalDebit: function() {
    var total = 0;

    this.get('linesView').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('model').get('debitAmount'));
    }, this);

    return total;

  }.property('linesView.@each.debitAmount'),

  totalCredit: function() {
    var total = 0;

    this.get('linesView').forEach(function(item, index, enumerable) {
      total += accounting.unformat(item.get('model').get('creditAmount'));
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

  addLine: function() {
    this.controller.send('addLine');
    var line = this.controller.get('lines').get('lastObject');
    var journalEntry = this.controller.get('model');
    var accountsDataset = this.get('accountsDataset');

    this.get('linesView').addLine(line, journalEntry, accountsDataset);
  },

  removeLine: function(lineView) {
    if (this.get('linesView').get('childViews').length <= 1) return;
    if (lineView === this.get('linesView').get('lastObject')) return;

    this.get('linesView').removeObject(lineView);
    this.controller.send('removeLine', lineView.get('model'));
  },

  getEffectiveAt: function() {
    var date = moment(this.$("#effectiveAt").val());
    return date.isValid() ? date.toDate() : null;
  },  

  actions: {
    addLine: function() {
      this.addLine();
    },

    post: function() {
      // get effectiveAt
      var journalEntry = this.get('controller').get('model');      
      journalEntry.set('effectiveAt', this.getEffectiveAt());

      // call post on controller
      this.controller.send('post');
    },

    clear: function() {
      this.get('linesView').reset();
      this.controller.send('clear');
      this.$().find(".effective-at").data("DateTimePicker").setDate(new Date());
      this.addLine();
    }
  },

  didInsertElement: function() {
    // configure datepicker for at
    this.$().find(".effective-at").datetimepicker({
      useCurrent: true,
      defaultDate: new Date()

    }).on('dp.show', $.proxy(function() {
      clearInterval(this.get('effectiveAtInterval'));
    }, this));

    var intervalHandler = setInterval($.proxy(function() {
      this.$().find(".effective-at").data("DateTimePicker").setDate(new Date());
    }, this), 1000);

    this.set('effectiveAtInterval', intervalHandler);
  },

  willDestroyElement: function() {
    clearInterval(this.get('effectiveAtInterval'));
  }

});
