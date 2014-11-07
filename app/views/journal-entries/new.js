import Ember from 'ember';
import MessagesView from 'subledger-app/views/messages';
import NewLinesView from 'subledger-app/views/journal-entries/new-lines';

export default Ember.View.extend({
  tagName: 'div',
  classNames: 'manual-journal-entry content',

  linesView: null,
  messagesView: null,

  effectiveAtInterval: null,

  init: function() {
    this._super();
    this.set('linesView', NewLinesView.create());
    this.set('messagesView', MessagesView.create());
  },

  autobalancer: function() {
    Ember.run.next(this, function() {
      if (this.controller.get('model').get('lines').toArray().length < 2) { return; }

      // at this point, debits and credits already consider the last line
      var debits = this.controller.get('model').get('totalDebit');
      var credits = this.controller.get('model').get('totalCredit');

      // so if it balances, return
      if (debits === credits) { return; }

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

  addLine: function() {
    this.controller.send('addLine');
    var line = this.controller.get('model').get('lines').get('lastObject');
    var journalEntry = this.controller.get('model');
    var accountsDataset = this.get('accountsDataset');

    this.get('linesView').addLine(line, journalEntry, accountsDataset);
  },

  removeLine: function(lineView) {
    if (this.get('linesView').get('childViews').length <= 1) { return; }
    if (lineView === this.get('linesView').get('lastObject')) { return; }

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
    // add success message
    this.get('messagesView').notifySuccess("Success!", "Journal Entry Posted", 5000);

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

    // instantiate and configure suggestion engine
    var accountsDataset = new Bloodhound({
      name: "accountsDataset",
      remote: {
        url: this.get('credential').get('apiUrl'),
        replace: $.proxy(function(url, query) {
          var parts = [
            url,
            '/orgs/',
            this.get('credential').get('org'),
            '/books/',
            this.get('credential').get('book'),
            '/accounts?limit=25&state=active&action=starting&description=',
            query
          ];

          return parts.join('');
        }, this),
        filter: function(response) {
          return $.map(response.active_accounts, function(account) {
            return {
              id: account.id,
              description: Handlebars.Utils.escapeExpression(account.description),
              normalBalance: account.normal_balance
            };
          });
        },
        ajax: {
          cache: false,
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': this.get('credential').get('basicAuthenticationHeader')
          }
        }
      },
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.description);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
    });

    // initialize it
    accountsDataset.initialize();

    // set the suggestion engine
    this.set("accountsDataset", accountsDataset);

    Ember.run.scheduleOnce('afterRender', this, function() {
      // add first line
      this.addLine();  
    });    
  },

  willDestroyElement: function() {
    this.unbindCalendarInterval();
  },

  getEffectiveAt: function() {
    var date = moment(this.$("#effectiveAt").val());
    return date.isValid() ? date.toDate() : null;
  }  
});
