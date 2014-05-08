export default Ember.View.extend({
  tagName: 'div',
  classNames: 'line',  
  templateName: 'journal-entries/new-line',

  accountDescription: null,

  debitAmount: function(key, value, previousValue) {
    if (arguments.length > 1) {
      this.get('model').set('debitAmount', value);
    }

    return this.get('model').get('debitAmount');
  }.property('model.debitAmount'),

  creditAmount: function(key, value, previousValue) {
    if (arguments.length > 1) {
      this.get('model').set('creditAmount', value);
    }

    return this.get('model').get('creditAmount');
  }.property('model.creditAmount'),

  addNewLineObserver: function() {
    var parentView = this.get('parentView');

    if (parentView.get('lastObject') === this) {
      // add new line
      this.get('parentView').get('parentView').addLine();

      // enable delete button on this view
      this.$(".remove").removeAttr('disabled');
    }   

  }.observes('accountDescription'),

  synchInputWithRecordField: function($input, record, field) {
    var self = this;

    var observer = function() {
      self.get('model').set(field, record.get(field));
    };

    // initially, call the observer function once, and bind it
    observer();
    record.addObserver(field, self, observer);

    // now handle change events on the input field
    $input.on('keydown', function(e) {
      // discard keystrokes that didn't change the actual input value
      if (e.keyCode !== 32 && e.keyCode >= 9 && e.keyCode <= 45) return;

      if (record.hasObserverFor(field)) {
        // remove existing observer
        record.removeObserver(field, self, observer);

        // remove muted class
        $input.removeClass("synch");
      }

    }).on('change', function() {
      // if input content was deleted
      if (Ember.isEmpty($input.val())) {
        // copy back from record
        self.get('model').set(field, record.get(field));

        // add muted class
        $input.addClass('synch');

        // rebind observer
        record.addObserver(field, self, observer);
      }
    });
  },

  actions: {
    removeLine: function() {
      this.$(".removeAction").addClass("hidden");
      this.$(".removeConfirmation").removeClass("hidden");
    },

    confirmRemoveLine: function() {
      this.get('parentView').get('parentView').removeLine(this);
    },

    cancelRemoveLine: function() {
      this.$(".removeConfirmation").addClass("hidden");
      this.$(".removeAction").removeClass("hidden");      
    }
  },

  didInsertElement: function() {
    var self = this;

    // mask money fields
    this.$().find(".currency").maskMoney({
      allowNegative: false
    });

    // accounts typeahead
    var accountsDataset = this.get('accountsDataset');

    this.$().find(".account").typeahead({
      hint: true,
      highlight: true,
      minLength: 1

    }, {
      name: 'accountsTypeahead',
      displayKey: 'description',
      source: accountsDataset.ttAdapter()

    }).on("blur", function(e) {
      // clear the account fields if a suggestion was not used
      if (self.get("accountDescription") !== $(this).typeahead('val')) {
        $(this).typeahead('val', '');
        self.get("model").set("account", null);
        self.set("accountDescription", null);

        self.$(".debit, .credit").removeClass("sameNormalBalanceType invertedNormalBalanceType");
        self.$(".debit input, .credit input").val("").attr("disabled", "disabled");
      }
      
    }).on("typeahead:selected", function(e, suggestion, datasetName) {
      // save selected suggestion
      self.get("model").set("account", suggestion.id);
      self.set("accountDescription", suggestion.description);
      self.$(".debit input, .credit input").removeAttr("disabled");

      if (suggestion.normalBalance === 'debit') {
        self.$(".debit").removeClass("invertedNormalBalanceType").addClass("sameNormalBalanceType");
        self.$(".credit").removeClass("sameNormalBalanceType").addClass("invertedNormalBalanceType");

        self.$(".debit input").focus();

      } else {
        self.$(".debit").removeClass("sameNormalBalanceType").addClass("invertedNormalBalanceType");
        self.$(".credit").removeClass("invertedNormalBalanceType").addClass("sameNormalBalanceType");

        self.$(".credit input").focus();
      }
    });

    // synch values from journal entry inputs to line inputs
    this.synchInputWithRecordField(this.$(".description"), this.get('journalEntry'), 'description');
    this.synchInputWithRecordField(this.$(".reference"), this.get('journalEntry'), 'reference'); 
  },
});
