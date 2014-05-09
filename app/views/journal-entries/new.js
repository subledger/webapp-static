import NewLinesView from 'subledger-app/views/journal-entries/new-lines';

export default Ember.View.extend({
  linesView: null,

  effectiveAtInterval: null,

  init: function() {
    this._super();
    this.set('linesView', NewLinesView.create());
  },

  autobalancer: function() {
    Ember.run.next(this, function() {
      if (this.controller.get('model').get('lines').toArray().length < 2) return;

      // at this point, debits and credits already consider the last line
      var debits = this.controller.get('model').get('totalDebit');
      var credits = this.controller.get('model').get('totalCredit');

      // so if it balances, return
      if (debits === credits) return;

      // get last line
      var lastLineModel = this.controller.get('model').get('lines').get('lastObject');
      var lastLineDebitAmount = accounting.unformat(lastLineModel.get('debitAmount'));
      var lastLineCreditAmount = accounting.unformat(lastLineModel.get('creditAmount'));

      // always subtract last line values from totals
      debits -= lastLineDebitAmount;
      credits -= lastLineCreditAmount;

      if (debits > credits) {
        lastLineModel.set('creditAmount', accounting.formatMoney(debits - credits, ""));

      } else {
        lastLineModel.set('debitAmount', accounting.formatMoney(credits - debits, ""));
      }
    });
  }.observes('controller.model.totalCredit'),

  accountsLoaded: function() {
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
    var line = this.controller.get('model').get('lines').get('lastObject');
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

  clear: function() {
    // remove lines
    this.get('linesView').reset();

    // reset controler
    this.controller.send('clear');

    // bind post handlers to new model
    this.bindJournalEntryStatesHandlers();
    this.bindCalendarInterval();

    // add a new initial line
    this.addLine();
  },

  postSuccessHandler: function() {
    $.growl.notice({
      title: "",
      message: "Journal Entry Posted Successfully!",
      duration: 5000
    });

    // clear, to allow entering a new journal entry
    this.clear();

    this.$(".journal-entry-description").focus();
  },

  postErrorHandler: function() {
  },

  bindJournalEntryStatesHandlers: function() {
    // configure post outcome handlers
    this.controller.get('model')
      .on('becameInvalid', $.proxy(this.postErrorHandler, this))
      .on('becameError', $.proxy(this.postErrorHandler, this))
      .on('didCreate', $.proxy(this.postSuccessHandler, this));
  },

  bindCalendarInterval: function() {
    if (!this.get('effectiveAtInterval')) {
      // configure effectiveAt interval
      var intervalHandler = setInterval($.proxy(function() {
        this.$().find(".effective-at").data("DateTimePicker").setDate(new Date());
      }, this), 1000);

      this.set('effectiveAtInterval', intervalHandler);
    }
  },

  unbindCalendarInterval: function() {
    clearInterval(this.get('effectiveAtInterval'));
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
      this.clear();
    }
  },

  didInsertElement: function() {
    // configure datepicker for at
    this.$().find(".effective-at").datetimepicker({
      useCurrent: true,
      defaultDate: new Date()

    }).on('dp.show', $.proxy(function() {
      this.unbindCalendarInterval();
    }, this));

    this.bindCalendarInterval();
    this.bindJournalEntryStatesHandlers();
  },

  willDestroyElement: function() {
    this.unbindCalendarInterval();
  },

  getEffectiveAt: function() {
    var date = moment(this.$("#effectiveAt").val());
    return date.isValid() ? date.toDate() : null;
  }  
});
